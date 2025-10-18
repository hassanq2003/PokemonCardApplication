import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { pokemonApi } from '../services/pokemonApi';

interface PokemonSet {
  id: string;
  name: string;
  releaseDate: string;
}

interface Filters {
  query: string;
  types: string[];
  rarity: string[];
  subtypes: string[];
  set: string;
  supertype: string;
  hp: string;
}

interface SearchFiltersProps {
  onSearch: (filters: Filters) => void;
  onReset: () => void;
}

export function SearchFilters({ onSearch, onReset }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [subtypes, setSubtypes] = useState<string[]>([]);
  const [sets, setSets] = useState<PokemonSet[]>([]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSupertype, setSelectedSupertype] = useState('');
  const [minHp, setMinHp] = useState('');

  useEffect(() => {
    async function fetchFilters() {
      const [typesData, raritiesData, subtypesData, setsData] = await Promise.all([
        pokemonApi.getTypes(),
        pokemonApi.getRarities(),
        pokemonApi.getSubtypes(),
        pokemonApi.getSets(),
      ]);

      setTypes(typesData);
      setRarities(raritiesData);
      setSubtypes(subtypesData);
      setSets(
        setsData.sort(
          (a: PokemonSet, b: PokemonSet) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        )
      );
    }

    fetchFilters();
  }, []);

  const handleSearch = () => {
    onSearch({
      query,
      types: selectedTypes,
      rarity: selectedRarities,
      subtypes: selectedSubtypes,
      set: selectedSet,
      supertype: selectedSupertype,
      hp: minHp,
    });
  };

  const handleReset = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedRarities([]);
    setSelectedSubtypes([]);
    setSelectedSet('');
    setSelectedSupertype('');
    setMinHp('');
    onReset();
  };

  const toggleSelection = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Search bar and buttons */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Pokemon cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
        >
          <Filter size={20} />
          Filters
        </button>
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2 font-medium"
        >
          <X size={20} />
          Reset
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          {/* Supertype, HP, Set, Types, Rarity, Subtypes */}
          {/* ...same as your original JSX, no changes needed */}
        </div>
      )}
    </div>
  );
}
