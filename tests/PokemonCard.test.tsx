import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from '../src/components/PokemonCard';

const mockCard = {
  id: '001',
  name: 'Bulbasaur',
  hp: '60',
  types: ['Grass'],
  set: { name: 'Base Set', printedTotal: 102 },
  number: '1',
  rarity: 'Common',
  artist: 'Mitsuhiro Arita',
  images: { large: 'https://example.com/bulbasaur.png' },
};

describe('PokemonCard Component', () => {
  test('renders card details correctly', () => {
    render(<PokemonCard card={mockCard as any} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText(/60 HP/)).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Base Set')).toBeInTheDocument();
  });

  test('calls onToggleFavorite when heart button is clicked', () => {
    const mockToggle = jest.fn();
    render(<PokemonCard card={mockCard as any} onToggleFavorite={mockToggle} />);
    const favoriteBtn = screen.getByTitle('Add to favorites');
    fireEvent.click(favoriteBtn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onAddToCollection when plus button is clicked', () => {
    const mockAdd = jest.fn();
    render(<PokemonCard card={mockCard as any} onAddToCollection={mockAdd} />);
    const addBtn = screen.getByTitle('Add to collection');
    fireEvent.click(addBtn);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  test('calls onViewDetails when info button is clicked', () => {
    const mockView = jest.fn();
    render(<PokemonCard card={mockCard as any} onViewDetails={mockView} />);
    const viewBtn = screen.getByTitle('View details');
    fireEvent.click(viewBtn);
    expect(mockView).toHaveBeenCalledTimes(1);
  });
});
