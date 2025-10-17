import { PokemonApiResponse } from '../lib/supabase';

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  types?: string[];
  subtypes?: string[];
  supertype?: string;
  rarity?: string[];
  set?: string;
  hp?: string;
}

export const pokemonApi = {
  async searchCards(params: SearchParams): Promise<PokemonApiResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append('page', String(params.page || 1));
    queryParams.append('pageSize', String(params.pageSize || 20));

    const searchQueries: string[] = [];

    if (params.query) {
      searchQueries.push(`name:${params.query}*`);
    }

    if (params.types && params.types.length > 0) {
      searchQueries.push(`types:${params.types.join(' OR ')}`);
    }

    if (params.subtypes && params.subtypes.length > 0) {
      searchQueries.push(`subtypes:${params.subtypes.join(' OR ')}`);
    }

    if (params.supertype) {
      searchQueries.push(`supertype:${params.supertype}`);
    }

    if (params.rarity && params.rarity.length > 0) {
      searchQueries.push(`rarity:${params.rarity.map(r => `"${r}"`).join(' OR ')}`);
    }

    if (params.set) {
      searchQueries.push(`set.id:${params.set}`);
    }

    if (params.hp) {
      searchQueries.push(`hp:[${params.hp} TO *]`);
    }

    if (searchQueries.length > 0) {
      queryParams.append('q', searchQueries.join(' '));
    }

    const url = `${API_BASE_URL}/cards?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon cards');
    }

    return response.json();
  },

  async getCardById(id: string) {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch card details');
    }

    const data = await response.json();
    return data.data;
  },

  async getSets() {
    const response = await fetch(`${API_BASE_URL}/sets`);

    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }

    const data = await response.json();
    return data.data;
  },

  async getTypes() {
    const response = await fetch(`${API_BASE_URL}/types`);

    if (!response.ok) {
      throw new Error('Failed to fetch types');
    }

    const data = await response.json();
    return data.data;
  },

  async getRarities() {
    const response = await fetch(`${API_BASE_URL}/rarities`);

    if (!response.ok) {
      throw new Error('Failed to fetch rarities');
    }

    const data = await response.json();
    return data.data;
  },

  async getSubtypes() {
    const response = await fetch(`${API_BASE_URL}/subtypes`);

    if (!response.ok) {
      throw new Error('Failed to fetch subtypes');
    }

    const data = await response.json();
    return data.data;
  }
};
