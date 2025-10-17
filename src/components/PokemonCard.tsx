import { useState } from 'react';
import { Heart, Plus, Info } from 'lucide-react';
import { PokemonCard as PokemonCardType } from '../lib/supabase';

interface PokemonCardProps {
  card: PokemonCardType;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToCollection?: () => void;
  onViewDetails?: () => void;
}

export function PokemonCard({
  card,
  isFavorite = false,
  onToggleFavorite,
  onAddToCollection,
  onViewDetails,
}: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const typeColors: { [key: string]: string } = {
    Grass: 'bg-green-500',
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Lightning: 'bg-yellow-500',
    Psychic: 'bg-purple-500',
    Fighting: 'bg-orange-600',
    Darkness: 'bg-gray-800',
    Metal: 'bg-gray-500',
    Fairy: 'bg-pink-500',
    Dragon: 'bg-indigo-600',
    Colorless: 'bg-gray-400',
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[5/7] bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={card.images.large}
          alt={card.name}
          className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full shadow-lg transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          {onAddToCollection && (
            <button
              onClick={onAddToCollection}
              className="p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              title="Add to collection"
            >
              <Plus size={18} />
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:bg-gray-700 hover:text-white transition-all"
              title="View details"
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{card.name}</h3>
          {card.hp && (
            <span className="text-lg font-bold text-red-600 ml-2">{card.hp} HP</span>
          )}
        </div>

        {card.types && card.types.length > 0 && (
          <div className="flex gap-2 mb-3">
            {card.types.map((type) => (
              <span
                key={type}
                className={`${
                  typeColors[type] || 'bg-gray-400'
                } text-white text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {type}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Set:</span> {card.set.name}
          </p>
          <p>
            <span className="font-semibold">Number:</span> {card.number}/{card.set.printedTotal}
          </p>
          {card.rarity && (
            <p>
              <span className="font-semibold">Rarity:</span> {card.rarity}
            </p>
          )}
          {card.artist && (
            <p className="text-xs">
              <span className="font-semibold">Artist:</span> {card.artist}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
