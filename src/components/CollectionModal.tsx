import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, PokemonCard } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CollectionModalProps {
  card: PokemonCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CollectionModal({ card, isOpen, onClose }: CollectionModalProps) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadCollections();
    }
  }, [isOpen, user]);

  const loadCollections = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCollections(data);
    }
  };

  const handleAdd = async () => {
    if (!user || !card || !selectedCollection) return;

    setLoading(true);
    setMessage('');

    try {
      const { data: existing } = await supabase
        .from('collection_cards')
        .select('*')
        .eq('collection_id', selectedCollection)
        .eq('card_id', card.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('collection_cards')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('collection_cards')
          .insert({
            collection_id: selectedCollection,
            card_id: card.id,
            card_data: card,
            quantity,
          });

        if (error) throw error;
      }

      setMessage('Card added successfully!');
      setTimeout(() => {
        onClose();
        setMessage('');
        setSelectedCollection('');
        setQuantity(1);
      }, 1500);
    } catch (error) {
      setMessage('Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add to Collection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <img
            src={card.images.small}
            alt={card.name}
            className="w-32 h-auto mx-auto rounded-lg shadow-lg"
          />
          <p className="text-center mt-3 font-semibold text-gray-800">{card.name}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Collection
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a collection...</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!selectedCollection || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add to Collection'}
          </button>
        </div>
      </div>
    </div>
  );
}
