import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from '../src/components/PokemonCard';
import { PokemonCard as PokemonCardType } from '../src/lib/supabase';

const mockCard: PokemonCardType = {
  id: '001',
  name: 'Bulbasaur',
  supertype: 'Pokémon',
  subtypes: ['Basic'],
  hp: '60',
  types: ['Grass'],
  set: {
    id: 'base1',
    name: 'Base Set',
    series: 'Base',
    printedTotal: 102,
    total: 102,
    releaseDate: '1999/01/09',
    images: {
      symbol: 'https://example.com/symbol.png',
      logo: 'https://example.com/logo.png'
    }
  },
  number: '1',
  artist: 'Mitsuhiro Arita',
  rarity: 'Common',
  images: {
    small: 'https://example.com/bulbasaur-small.png',
    large: 'https://example.com/bulbasaur.png'
  },
  // Optional properties with empty/default values
  abilities: [],
  attacks: [],
  weaknesses: [],
  resistances: [],
  retreatCost: [],
  convertedRetreatCost: 0,
  flavorText: '',
  nationalPokedexNumbers: [],
  tcgplayer: {
    url: '',
    updatedAt: ''
  }
};

describe('PokemonCard Component', () => {
  test('renders card details correctly', () => {
    render(<PokemonCard card={mockCard} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText(/60 HP/)).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Base Set')).toBeInTheDocument();
  });

  test('calls onToggleFavorite when heart button is clicked', () => {
    const mockToggle = jest.fn();
    render(<PokemonCard card={mockCard} onToggleFavorite={mockToggle} />);
    const favoriteBtn = screen.getByTitle('Add to favorites');
    fireEvent.click(favoriteBtn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onAddToCollection when plus button is clicked', () => {
    const mockAdd = jest.fn();
    render(<PokemonCard card={mockCard} onAddToCollection={mockAdd} />);
    const addBtn = screen.getByTitle('Add to collection');
    fireEvent.click(addBtn);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  test('calls onViewDetails when info button is clicked', () => {
    const mockView = jest.fn();
    render(<PokemonCard card={mockCard} onViewDetails={mockView} />);
    const viewBtn = screen.getByTitle('View details');
    fireEvent.click(viewBtn);
    expect(mockView).toHaveBeenCalledTimes(1);
  });
});