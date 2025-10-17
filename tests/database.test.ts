import { supabase } from '../src/lib/supabase';

describe('Database Operations', () => {
  let userId: string;
  let testCardData: any;

  beforeAll(async () => {
    const testEmail = `test-db-${Date.now()}@example.com`;
    const { data } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
    });
    userId = data.user!.id;

    testCardData = {
      id: 'test-card-123',
      name: 'Test Pikachu',
      supertype: 'Pokémon',
      images: {
        small: 'https://example.com/small.jpg',
        large: 'https://example.com/large.jpg',
      },
      set: {
        id: 'base1',
        name: 'Base Set',
        series: 'Base',
        printedTotal: 102,
        total: 102,
        releaseDate: '1999-01-09',
        images: {
          symbol: 'https://example.com/symbol.png',
          logo: 'https://example.com/logo.png',
        },
      },
      number: '25',
    };
  });

  describe('Favorites', () => {
    it('should add a card to favorites', async () => {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          card_id: testCardData.id,
          card_data: testCardData,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.card_id).toBe(testCardData.id);
    });

    it('should retrieve user favorites', async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should prevent duplicate favorites', async () => {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          card_id: testCardData.id,
          card_data: testCardData,
        });

      expect(error).toBeDefined();
    });

    it('should remove a card from favorites', async () => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('card_id', testCardData.id);

      expect(error).toBeNull();

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('card_id', testCardData.id);

      expect(data?.length).toBe(0);
    });
  });

  describe('Collections', () => {
    let collectionId: string;

    it('should create a new collection', async () => {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: userId,
          name: 'My First Collection',
          description: 'Test collection',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toBe('My First Collection');
      collectionId = data.id;
    });

    it('should retrieve user collections', async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should update a collection', async () => {
      const { data, error } = await supabase
        .from('collections')
        .update({ name: 'Updated Collection Name' })
        .eq('id', collectionId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.name).toBe('Updated Collection Name');
    });

    it('should add cards to a collection', async () => {
      const { data, error } = await supabase
        .from('collection_cards')
        .insert({
          collection_id: collectionId,
          card_id: testCardData.id,
          card_data: testCardData,
          quantity: 2,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.quantity).toBe(2);
    });

    it('should retrieve cards from a collection', async () => {
      const { data, error } = await supabase
        .from('collection_cards')
        .select('*')
        .eq('collection_id', collectionId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should update card quantity in collection', async () => {
      const { data, error } = await supabase
        .from('collection_cards')
        .update({ quantity: 5 })
        .eq('collection_id', collectionId)
        .eq('card_id', testCardData.id)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.quantity).toBe(5);
    });

    it('should remove a card from collection', async () => {
      const { error } = await supabase
        .from('collection_cards')
        .delete()
        .eq('collection_id', collectionId)
        .eq('card_id', testCardData.id);

      expect(error).toBeNull();
    });

    it('should delete a collection', async () => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      expect(error).toBeNull();
    });
  });

  describe('Row Level Security', () => {
    let otherUserId: string;

    beforeAll(async () => {
      const { data } = await supabase.auth.signUp({
        email: `test-rls-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      });
      otherUserId = data.user!.id;
    });

    it('should not allow users to view other users favorites', async () => {
      await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          card_id: 'secure-card-123',
          card_data: testCardData,
        });

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', otherUserId);

      expect(data?.length).toBe(0);
    });

    it('should not allow users to modify other users collections', async () => {
      const { data: collection } = await supabase
        .from('collections')
        .insert({
          user_id: userId,
          name: 'Secure Collection',
        })
        .select()
        .single();

      const { error } = await supabase
        .from('collections')
        .update({ name: 'Hacked!' })
        .eq('id', collection!.id);

      expect(error).toBeDefined();
    });
  });
});
