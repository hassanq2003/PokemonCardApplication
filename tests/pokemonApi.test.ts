import { pokemonApi } from '../src/services/pokemonApi';

describe('Pokemon API Service', () => {
  describe('searchCards', () => {
    it('should fetch cards with default parameters', async () => {
      const result = await pokemonApi.searchCards({ page: 1, pageSize: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should search cards by name', async () => {
      const result = await pokemonApi.searchCards({ query: 'Pikachu', page: 1, pageSize: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].name).toContain('Pikachu');
    });

    it('should filter cards by type', async () => {
      const result = await pokemonApi.searchCards({ types: ['Fire'], page: 1, pageSize: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(card => {
        if (card.types) {
          expect(card.types).toContain('Fire');
        }
      });
    });

    it('should filter cards by multiple types', async () => {
      const result = await pokemonApi.searchCards({
        types: ['Fire', 'Water'],
        page: 1,
        pageSize: 20
      });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should filter cards by rarity', async () => {
      const result = await pokemonApi.searchCards({
        rarity: ['Rare Holo'],
        page: 1,
        pageSize: 10
      });

      expect(result.data).toBeDefined();
      if (result.data.length > 0) {
        expect(result.data[0].rarity).toBeDefined();
      }
    });

    it('should filter cards by supertype', async () => {
      const result = await pokemonApi.searchCards({
        supertype: 'Pokémon',
        page: 1,
        pageSize: 10
      });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(card => {
        expect(card.supertype).toBe('Pokémon');
      });
    });

    it('should filter cards by minimum HP', async () => {
      const result = await pokemonApi.searchCards({
        hp: '100',
        page: 1,
        pageSize: 10
      });

      expect(result.data).toBeDefined();
      if (result.data.length > 0) {
        result.data.forEach(card => {
          if (card.hp) {
            expect(parseInt(card.hp)).toBeGreaterThanOrEqual(100);
          }
        });
      }
    });

    it('should handle pagination correctly', async () => {
      const page1 = await pokemonApi.searchCards({ page: 1, pageSize: 5 });
      const page2 = await pokemonApi.searchCards({ page: 2, pageSize: 5 });

      expect(page1.data).toBeDefined();
      expect(page2.data).toBeDefined();
      expect(page1.data[0].id).not.toBe(page2.data[0].id);
    });
  });

  describe('getCardById', () => {
    it('should fetch a specific card by ID', async () => {
      const searchResult = await pokemonApi.searchCards({ page: 1, pageSize: 1 });
      const cardId = searchResult.data[0].id;

      const card = await pokemonApi.getCardById(cardId);

      expect(card).toBeDefined();
      expect(card.id).toBe(cardId);
      expect(card.name).toBeDefined();
      expect(card.images).toBeDefined();
    });

    it('should throw error for invalid card ID', async () => {
      await expect(pokemonApi.getCardById('invalid-id-123')).rejects.toThrow();
    });
  });

  describe('getSets', () => {
    it('should fetch all Pokemon card sets', async () => {
      const sets = await pokemonApi.getSets();

      expect(sets).toBeDefined();
      expect(Array.isArray(sets)).toBe(true);
      expect(sets.length).toBeGreaterThan(0);
      expect(sets[0]).toHaveProperty('id');
      expect(sets[0]).toHaveProperty('name');
      expect(sets[0]).toHaveProperty('releaseDate');
    });
  });

  describe('getTypes', () => {
    it('should fetch all Pokemon card types', async () => {
      const types = await pokemonApi.getTypes();

      expect(types).toBeDefined();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      expect(types).toContain('Fire');
      expect(types).toContain('Water');
      expect(types).toContain('Grass');
    });
  });

  describe('getRarities', () => {
    it('should fetch all Pokemon card rarities', async () => {
      const rarities = await pokemonApi.getRarities();

      expect(rarities).toBeDefined();
      expect(Array.isArray(rarities)).toBe(true);
      expect(rarities.length).toBeGreaterThan(0);
    });
  });

  describe('getSubtypes', () => {
    it('should fetch all Pokemon card subtypes', async () => {
      const subtypes = await pokemonApi.getSubtypes();

      expect(subtypes).toBeDefined();
      expect(Array.isArray(subtypes)).toBe(true);
      expect(subtypes.length).toBeGreaterThan(0);
    });
  });
});
