import { useState, useEffect, useCallback } from 'react';
import { Heart, BookOpen, LogIn, LogOut, Plus, Zap } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { PokemonCard } from './components/PokemonCard';
import { SearchFilters } from './components/SearchFilters';
import { CardDetailsModal } from './components/CardDetailsModal';
import { CollectionModal } from './components/CollectionModal';
import { pokemonApi } from './services/pokemonApi';
import { supabase, PokemonCard as PokemonCardType } from './lib/supabase';

interface Collection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface Filters {
  query?: string;
  types?: string[];
  rarity?: string[];
  subtypes?: string[];
  set?: string;
  supertype?: string;
  hp?: string;
}

function AppContent() {
  const { user, signOut } = useAuth();
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PokemonCardType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [view, setView] = useState<'search' | 'favorites' | 'collections'>('search');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});

  /** Load initial cards */
  const loadInitialCards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pokemonApi.searchCards({ page: 1, pageSize: 20 });
      setCards(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Load favorite card IDs for current user */
  const loadFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('card_id')
      .eq('user_id', user.id);

    if (data) setFavorites(new Set(data.map(f => f.card_id)));
  }, [user]);

  /** Load collections for current user */
  const loadCollections = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setCollections(data as Collection[]);
  }, [user]);

  /** Load favorite cards (full card data) */
  const loadFavoriteCards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('favorites')
        .select('card_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setCards(data.map(f => f.card_data));
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** Load initial cards on mount */
  useEffect(() => {
    loadInitialCards();
  }, [loadInitialCards]);

  /** Load favorites and collections when user changes */
  useEffect(() => {
    if (user) {
      loadFavorites();
      loadCollections();
    } else {
      setFavorites(new Set());
      setCollections([]);
    }
  }, [user, loadFavorites, loadCollections]);

  /** Handle search */
  const handleSearch = async (filters: Filters) => {
    setLoading(true);
    setCurrentFilters(filters);
    setPage(1);
    try {
      const response = await pokemonApi.searchCards({ ...filters, page: 1, pageSize: 20 });
      setCards(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('Error searching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  /** Load more cards (pagination) */
  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const response = await pokemonApi.searchCards({
        ...currentFilters,
        page: page + 1,
        pageSize: 20
      });
      setCards(prev => [...prev, ...response.data]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading more cards:', err);
    } finally {
      setLoading(false);
    }
  };

  /** Toggle favorite card */
  const toggleFavorite = async (card: PokemonCardType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const isFavorite = favorites.has(card.id);

    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('card_id', card.id);
      setFavorites(prev => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        card_id: card.id,
        card_data: card,
      });
      setFavorites(prev => new Set(prev).add(card.id));
    }
  };

  /** Open modal to add card to collection */
  const handleAddToCollection = (card: PokemonCardType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedCard(card);
    setShowCollectionModal(true);
  };

  /** Open modal to view card details */
  const handleViewDetails = (card: PokemonCardType) => {
    setSelectedCard(card);
    setShowDetailsModal(true);
  };

  /** Create new collection */
  const createCollection = async () => {
    if (!user || !newCollectionName.trim()) return;
    await supabase.from('collections').insert({
      user_id: user.id,
      name: newCollectionName,
    });
    setNewCollectionName('');
    setShowNewCollectionForm(false);
    loadCollections();
  };

  /** Load cards of a specific collection */
  const loadCollectionCards = async (collectionId: string) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('collection_cards')
        .select('card_data, quantity')
        .eq('collection_id', collectionId);

      if (data) setCards(data.map(c => c.card_data));
    } catch (err) {
      console.error('Error loading collection cards:', err);
    } finally {
      setLoading(false);
    }
  };

  /** Switch between search / favorites / collections views */
  useEffect(() => {
    if (view === 'favorites' && user) {
      loadFavoriteCards();
    } else if (view === 'search') {
      loadInitialCards();
    }
  }, [view, user, loadFavoriteCards, loadInitialCards]);

  const hasMore = cards.length < totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* HEADER & NAV */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-500" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              PokéDex TCG
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setView('search')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'search'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Search
            </button>
            {user && (
              <>
                <button
                  onClick={() => setView('favorites')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === 'favorites'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} /> Favorites
                </button>
                <button
                  onClick={() => setView('collections')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === 'collections'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen size={18} /> Collections
                </button>
              </>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                <LogIn size={18} /> Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search view */}
        {view === 'search' && (
          <>
            <SearchFilters onSearch={handleSearch} onReset={loadInitialCards} />

            {loading && cards.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map(card => (
                  <PokemonCard
                    key={card.id}
                    card={card}
                    isFavorite={favorites.has(card.id)}
                    onToggleFavorite={() => toggleFavorite(card)}
                    onAddToCollection={() => handleAddToCollection(card)}
                    onViewDetails={() => handleViewDetails(card)}
                  />
                ))}
              </div>
            )}

            {hasMore && !loading && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {/* Favorites view */}
        {view === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Favorites</h2>
            {!user ? (
              <div className="text-center py-20">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">Sign in to save your favorite cards</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-20">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No favorite cards yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map(card => (
                  <PokemonCard
                    key={card.id}
                    card={card}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(card)}
                    onAddToCollection={() => handleAddToCollection(card)}
                    onViewDetails={() => handleViewDetails(card)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections view */}
        {view === 'collections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Collections</h2>
              {user && (
                <button
                  onClick={() => setShowNewCollectionForm(!showNewCollectionForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Plus size={18} /> New Collection
                </button>
              )}
            </div>

            {showNewCollectionForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Collection</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Collection name..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={createCollection}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCollectionForm(false);
                      setNewCollectionName('');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!user ? (
              <div className="text-center py-20">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">Sign in to create collections</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No collections yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(collection => (
                  <div
                    key={collection.id}
                    onClick={() => loadCollectionCards(collection.id)}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{collection.name}</h3>
                    <p className="text-sm text-gray-600">{collection.description || 'No description'}</p>
                    <p className="text-xs text-gray-500 mt-4">
                      Created {new Date(collection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CardDetailsModal
        card={selectedCard}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCard(null);
        }}
      />
      <CollectionModal
        card={selectedCard}
        isOpen={showCollectionModal}
        onClose={() => {
          setShowCollectionModal(false);
          setSelectedCard(null);
          loadCollections();
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
