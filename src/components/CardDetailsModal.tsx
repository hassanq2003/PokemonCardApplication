import { X } from 'lucide-react';
import { PokemonCard } from '../lib/supabase';

interface CardDetailsModalProps {
  card: PokemonCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardDetailsModal({ card, isOpen, onClose }: CardDetailsModalProps) {
  if (!isOpen || !card) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">{card.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src={card.images.large}
                alt={card.name}
                className="max-w-full h-auto rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  {card.hp && (
                    <p><span className="font-semibold">HP:</span> {card.hp}</p>
                  )}
                  <p><span className="font-semibold">Supertype:</span> {card.supertype}</p>
                  {card.subtypes && (
                    <p><span className="font-semibold">Subtypes:</span> {card.subtypes.join(', ')}</p>
                  )}
                  {card.types && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">Types:</span>
                      {card.types.map((type) => (
                        <span
                          key={type}
                          className={`${typeColors[type] || 'bg-gray-400'} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                  {card.evolvesFrom && (
                    <p><span className="font-semibold">Evolves From:</span> {card.evolvesFrom}</p>
                  )}
                </div>
              </div>

              {card.abilities && card.abilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Abilities</h3>
                  {card.abilities.map((ability, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg mb-2">
                      <p className="font-semibold text-blue-800">{ability.name}</p>
                      <p className="text-xs text-blue-600 mb-1">{ability.type}</p>
                      <p className="text-sm text-gray-700">{ability.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {card.attacks && card.attacks.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Attacks</h3>
                  {card.attacks.map((attack, idx) => (
                    <div key={idx} className="bg-red-50 p-4 rounded-lg mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-red-800">{attack.name}</p>
                        <p className="font-bold text-red-600">{attack.damage}</p>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {attack.cost.map((cost, i) => (
                          <span
                            key={i}
                            className={`${typeColors[cost] || 'bg-gray-400'} text-white text-xs px-2 py-0.5 rounded`}
                          >
                            {cost}
                          </span>
                        ))}
                      </div>
                      {attack.text && (
                        <p className="text-sm text-gray-700">{attack.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(card.weaknesses || card.resistances || card.retreatCost) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Stats</h3>
                  <div className="space-y-2 text-sm">
                    {card.weaknesses && (
                      <div className="flex gap-2 flex-wrap">
                        <span className="font-semibold">Weakness:</span>
                        {card.weaknesses.map((w, i) => (
                          <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {w.type} {w.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {card.resistances && (
                      <div className="flex gap-2 flex-wrap">
                        <span className="font-semibold">Resistance:</span>
                        {card.resistances.map((r, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {r.type} {r.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {card.retreatCost && (
                      <p><span className="font-semibold">Retreat Cost:</span> {card.retreatCost.length}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Set Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Set:</span> {card.set.name}</p>
                  <p><span className="font-semibold">Series:</span> {card.set.series}</p>
                  <p><span className="font-semibold">Number:</span> {card.number}/{card.set.printedTotal}</p>
                  <p><span className="font-semibold">Release Date:</span> {card.set.releaseDate}</p>
                  {card.rarity && (
                    <p><span className="font-semibold">Rarity:</span> {card.rarity}</p>
                  )}
                  {card.artist && (
                    <p><span className="font-semibold">Artist:</span> {card.artist}</p>
                  )}
                </div>
              </div>

              {card.flavorText && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">{card.flavorText}</p>
                </div>
              )}

              {card.tcgplayer?.prices && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Market Prices</h3>
                  <div className="space-y-2">
                    {Object.entries(card.tcgplayer.prices).map(([key, price]) => (
                      <div key={key} className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-800 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {price.low && <p>Low: ${price.low.toFixed(2)}</p>}
                          {price.mid && <p>Mid: ${price.mid.toFixed(2)}</p>}
                          {price.high && <p>High: ${price.high.toFixed(2)}</p>}
                          {price.market && <p>Market: ${price.market.toFixed(2)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
