# API Documentation

## Pokemon TCG API Integration

This document describes how the application integrates with the Pokemon TCG API v2.

## Base URL
```
https://api.pokemontcg.io/v2
```

## Authentication
No API key required for basic usage. Rate limits are generous for development.

## Endpoints

### 1. Search Cards
**Endpoint:** `GET /cards`

**Description:** Search and filter Pokemon cards with various parameters.

**Query Parameters:**
- `q` - Search query using Lucene-like syntax
- `page` - Page number (default: 1)
- `pageSize` - Results per page (default: 20, max: 250)
- `orderBy` - Sort field (e.g., `name`, `hp`, `set.releaseDate`)

**Search Query Syntax:**
```
name:Pikachu                    # Search by name
types:Fire                      # Filter by type
types:(Fire OR Water)           # Multiple types
rarity:"Rare Holo"              # Filter by rarity
hp:[100 TO *]                   # HP range
set.id:base1                    # Specific set
supertype:Pokémon               # Card supertype
subtypes:EX                     # Card subtype
```

**Example Request:**
```typescript
const response = await fetch(
  'https://api.pokemontcg.io/v2/cards?q=name:Charizard types:Fire&page=1&pageSize=20'
);
const data = await response.json();
```

**Response:**
```json
{
  "data": [
    {
      "id": "base1-4",
      "name": "Charizard",
      "supertype": "Pokémon",
      "subtypes": ["Stage 2"],
      "hp": "120",
      "types": ["Fire"],
      "evolvesFrom": "Charmeleon",
      "attacks": [...],
      "weaknesses": [...],
      "images": {
        "small": "https://images.pokemontcg.io/base1/4.png",
        "large": "https://images.pokemontcg.io/base1/4_hires.png"
      },
      "set": {...}
    }
  ],
  "page": 1,
  "pageSize": 20,
  "count": 20,
  "totalCount": 156
}
```

### 2. Get Card by ID
**Endpoint:** `GET /cards/:id`

**Description:** Fetch a specific card by its unique ID.

**Example Request:**
```typescript
const response = await fetch('https://api.pokemontcg.io/v2/cards/base1-4');
const data = await response.json();
```

**Response:**
```json
{
  "data": {
    "id": "base1-4",
    "name": "Charizard",
    ...
  }
}
```

### 3. Get All Sets
**Endpoint:** `GET /sets`

**Description:** Retrieve all Pokemon TCG sets.

**Example Request:**
```typescript
const response = await fetch('https://api.pokemontcg.io/v2/sets');
const data = await response.json();
```

**Response:**
```json
{
  "data": [
    {
      "id": "base1",
      "name": "Base Set",
      "series": "Base",
      "printedTotal": 102,
      "total": 102,
      "legalities": {...},
      "releaseDate": "1999/01/09",
      "updatedAt": "2020/08/14 09:35:00",
      "images": {
        "symbol": "https://images.pokemontcg.io/base1/symbol.png",
        "logo": "https://images.pokemontcg.io/base1/logo.png"
      }
    }
  ]
}
```

### 4. Get Types
**Endpoint:** `GET /types`

**Description:** Get all Pokemon card types.

**Example Request:**
```typescript
const response = await fetch('https://api.pokemontcg.io/v2/types');
const data = await response.json();
```

**Response:**
```json
{
  "data": [
    "Colorless",
    "Darkness",
    "Dragon",
    "Fairy",
    "Fighting",
    "Fire",
    "Grass",
    "Lightning",
    "Metal",
    "Psychic",
    "Water"
  ]
}
```

### 5. Get Rarities
**Endpoint:** `GET /rarities`

**Description:** Get all card rarity values.

**Example Request:**
```typescript
const response = await fetch('https://api.pokemontcg.io/v2/rarities');
const data = await response.json();
```

**Response:**
```json
{
  "data": [
    "Common",
    "Uncommon",
    "Rare",
    "Rare Holo",
    "Rare Holo EX",
    "Rare Holo GX",
    "Rare Holo V",
    "Rare Holo VMAX",
    ...
  ]
}
```

### 6. Get Subtypes
**Endpoint:** `GET /subtypes`

**Description:** Get all card subtypes.

**Example Request:**
```typescript
const response = await fetch('https://api.pokemontcg.io/v2/subtypes');
const data = await response.json();
```

**Response:**
```json
{
  "data": [
    "Basic",
    "Stage 1",
    "Stage 2",
    "EX",
    "GX",
    "V",
    "VMAX",
    "BREAK",
    "Mega",
    ...
  ]
}
```

## Application API Service

### pokemonApi Service

Located in `src/services/pokemonApi.ts`, this service wraps the Pokemon TCG API.

#### searchCards()
```typescript
interface SearchParams {
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

const result = await pokemonApi.searchCards({
  query: 'Pikachu',
  types: ['Electric'],
  page: 1,
  pageSize: 20
});
```

#### getCardById()
```typescript
const card = await pokemonApi.getCardById('base1-25');
```

#### getSets()
```typescript
const sets = await pokemonApi.getSets();
// Returns array of all sets
```

#### getTypes()
```typescript
const types = await pokemonApi.getTypes();
// Returns array: ['Fire', 'Water', 'Grass', ...]
```

#### getRarities()
```typescript
const rarities = await pokemonApi.getRarities();
// Returns array of all rarities
```

#### getSubtypes()
```typescript
const subtypes = await pokemonApi.getSubtypes();
// Returns array of all subtypes
```

## Card Object Structure

### Full Card Schema
```typescript
interface PokemonCard {
  id: string;                    // Unique card ID
  name: string;                  // Card name
  supertype: string;             // Pokémon, Trainer, or Energy
  subtypes?: string[];           // Basic, Stage 1, EX, etc.
  hp?: string;                   // Hit points
  types?: string[];              // Fire, Water, etc.
  evolvesFrom?: string;          // Previous evolution

  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;

  attacks?: Array<{
    name: string;
    cost: string[];              // Energy cost
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }>;

  weaknesses?: Array<{
    type: string;
    value: string;
  }>;

  resistances?: Array<{
    type: string;
    value: string;
  }>;

  retreatCost?: string[];
  convertedRetreatCost?: number;

  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };

  number: string;                // Card number in set
  artist?: string;               // Card artist
  rarity?: string;               // Card rarity
  flavorText?: string;           // Flavor text
  nationalPokedexNumbers?: number[];

  images: {
    small: string;               // Small image URL
    large: string;               // Large image URL
  };

  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      [key: string]: {
        low: number;
        mid: number;
        high: number;
        market: number;
      };
    };
  };
}
```

## Rate Limits

- **Default**: 1000 requests per hour
- **Authenticated**: 20,000 requests per hour (requires API key)

To add an API key:
```typescript
const headers = {
  'X-Api-Key': 'your-api-key-here'
};
```

## Error Handling

### Common Error Responses

**404 Not Found**
```json
{
  "error": "Card not found"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid query parameter"
}
```

**429 Too Many Requests**
```json
{
  "error": "Rate limit exceeded"
}
```

### Error Handling in Application
```typescript
try {
  const result = await pokemonApi.searchCards({ query: 'Pikachu' });
  // Handle success
} catch (error) {
  if (error.message.includes('404')) {
    // Handle not found
  } else if (error.message.includes('429')) {
    // Handle rate limit
  } else {
    // Handle generic error
  }
}
```

## Best Practices

1. **Caching**: Cache API responses to reduce requests
2. **Pagination**: Use appropriate page sizes (20-50 recommended)
3. **Error Handling**: Always handle potential errors
4. **Loading States**: Show loading indicators during API calls
5. **Debouncing**: Debounce search inputs to reduce API calls
6. **Query Optimization**: Use specific queries to reduce response size

## Advanced Search Examples

### Find all Charizard cards
```
q=name:Charizard
```

### Find Fire-type cards with 100+ HP
```
q=types:Fire hp:[100 TO *]
```

### Find Rare Holo cards from Base Set
```
q=set.id:base1 rarity:"Rare Holo"
```

### Find Stage 2 Pokemon
```
q=supertype:Pokémon subtypes:"Stage 2"
```

### Find cards by artist
```
q=artist:"Ken Sugimori"
```

## Resources

- [Official API Documentation](https://docs.pokemontcg.io/)
- [API GitHub Repository](https://github.com/PokemonTCG)
- [Community Discord](https://discord.gg/dpsTCvg)
