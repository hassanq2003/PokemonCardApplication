import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { pokemonApi } from '../services/pokemonApi';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  onReset: () => void;
}

export function SearchFilters({ onSearch, onReset }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [subtypes, setSubtypes] = useState<string[]>([]);
  const [sets, setSets] = useState<any[]>([]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSupertype, setSelectedSupertype] = useState('');
  const [minHp, setMinHp] = useState('');

  useEffect(() => {
    Promise.all([
      pokemonApi.getTypes(),
      pokemonApi.getRarities(),
      pokemonApi.getSubtypes(),
      pokemonApi.getSets(),
    ]).then(([typesData, raritiesData, subtypesData, setsData]) => {
      setTypes(typesData);
      setRarities(raritiesData);
      setSubtypes(subtypesData);
      setSets(setsData.sort((a: any, b: any) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      ));
    });
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

  const toggleSelection = (value: string, selected: string[], setter: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Supertype</label>
            <select
              value={selectedSupertype}
              onChange={(e) => setSelectedSupertype(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Pokémon">Pokémon</option>
              <option value="Trainer">Trainer</option>
              <option value="Energy">Energy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Min HP</label>
            <input
              type="number"
              value={minHp}
              onChange={(e) => setMinHp(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Set</label>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sets</option>
              {sets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name} ({set.releaseDate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Types</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rarity</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {rarities.slice(0, 10).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => toggleSelection(rarity, selectedRarities, setSelectedRarities)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedRarities.includes(rarity)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Subtypes</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {subtypes.slice(0, 12).map((subtype) => (
                <button
                  key={subtype}
                  onClick={() => toggleSelection(subtype, selectedSubtypes, setSelectedSubtypes)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedSubtypes.includes(subtype)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subtype}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
