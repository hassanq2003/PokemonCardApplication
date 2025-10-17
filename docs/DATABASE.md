# Database Documentation

## Overview

The application uses Supabase (PostgreSQL) for data persistence with Row Level Security (RLS) enabled on all tables.

## Database Schema

### Tables Overview

```
auth.users (Supabase managed)
├── favorites
├── collections
│   └── collection_cards
```

## Table Details

### 1. favorites

Stores user's favorite Pokemon cards.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | FOREIGN KEY → auth.users(id), NOT NULL | Owner of favorite |
| card_id | text | NOT NULL | Pokemon card ID from API |
| card_data | jsonb | NOT NULL | Complete card data |
| created_at | timestamptz | DEFAULT now() | When favorited |

**Indexes:**
- `idx_favorites_user_id` on `user_id`
- `idx_favorites_card_id` on `card_id`

**Constraints:**
- `UNIQUE(user_id, card_id)` - Prevents duplicate favorites

**RLS Policies:**

```sql
-- Users can view own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert own favorites
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

**Example Queries:**

```sql
-- Add favorite
INSERT INTO favorites (user_id, card_id, card_data)
VALUES (
  auth.uid(),
  'base1-25',
  '{"id": "base1-25", "name": "Pikachu", ...}'::jsonb
);

-- Get user favorites
SELECT * FROM favorites
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Remove favorite
DELETE FROM favorites
WHERE user_id = auth.uid() AND card_id = 'base1-25';

-- Check if card is favorited
SELECT EXISTS(
  SELECT 1 FROM favorites
  WHERE user_id = auth.uid() AND card_id = 'base1-25'
);
```

### 2. collections

User-created card collections.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | FOREIGN KEY → auth.users(id), NOT NULL | Collection owner |
| name | text | NOT NULL | Collection name |
| description | text | DEFAULT '' | Optional description |
| is_public | boolean | DEFAULT false | Public visibility |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_collections_user_id` on `user_id`

**RLS Policies:**

```sql
-- Users can view own collections
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view public collections
CREATE POLICY "Users can view public collections"
  ON collections FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can insert own collections
CREATE POLICY "Users can insert own collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update own collections
CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own collections
CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

**Example Queries:**

```sql
-- Create collection
INSERT INTO collections (user_id, name, description)
VALUES (auth.uid(), 'My Rare Cards', 'Collection of rare finds');

-- Get user collections
SELECT * FROM collections
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Get public collections
SELECT * FROM collections
WHERE is_public = true
ORDER BY created_at DESC;

-- Update collection
UPDATE collections
SET name = 'My Ultra Rare Cards',
    description = 'Updated description',
    updated_at = now()
WHERE id = 'collection-uuid' AND user_id = auth.uid();

-- Delete collection (cascades to collection_cards)
DELETE FROM collections
WHERE id = 'collection-uuid' AND user_id = auth.uid();
```

### 3. collection_cards

Cards within collections with quantity tracking.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| collection_id | uuid | FOREIGN KEY → collections(id), NOT NULL | Parent collection |
| card_id | text | NOT NULL | Pokemon card ID from API |
| card_data | jsonb | NOT NULL | Complete card data |
| quantity | integer | DEFAULT 1 | Number of copies |
| added_at | timestamptz | DEFAULT now() | When added |

**Indexes:**
- `idx_collection_cards_collection_id` on `collection_id`
- `idx_collection_cards_card_id` on `card_id`

**Constraints:**
- `UNIQUE(collection_id, card_id)` - One entry per card per collection
- `ON DELETE CASCADE` - Deletes when collection is deleted

**RLS Policies:**

```sql
-- Users can view cards in own collections
CREATE POLICY "Users can view cards in own collections"
  ON collection_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can view cards in public collections
CREATE POLICY "Users can view cards in public collections"
  ON collection_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.is_public = true
    )
  );

-- Users can insert cards to own collections
CREATE POLICY "Users can insert cards to own collections"
  ON collection_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can update cards in own collections
CREATE POLICY "Users can update cards in own collections"
  ON collection_cards FOR UPDATE
  TO authenticated
  USING (...)
  WITH CHECK (...);

-- Users can delete cards from own collections
CREATE POLICY "Users can delete cards from own collections"
  ON collection_cards FOR DELETE
  TO authenticated
  USING (...);
```

**Example Queries:**

```sql
-- Add card to collection
INSERT INTO collection_cards (collection_id, card_id, card_data, quantity)
VALUES (
  'collection-uuid',
  'base1-25',
  '{"id": "base1-25", "name": "Pikachu", ...}'::jsonb,
  3
);

-- Get all cards in collection
SELECT * FROM collection_cards
WHERE collection_id = 'collection-uuid'
ORDER BY added_at DESC;

-- Update card quantity
UPDATE collection_cards
SET quantity = quantity + 1
WHERE collection_id = 'collection-uuid'
  AND card_id = 'base1-25';

-- Remove card from collection
DELETE FROM collection_cards
WHERE collection_id = 'collection-uuid'
  AND card_id = 'base1-25';

-- Get total cards in collection
SELECT SUM(quantity) as total_cards
FROM collection_cards
WHERE collection_id = 'collection-uuid';

-- Check if card exists in collection
SELECT quantity FROM collection_cards
WHERE collection_id = 'collection-uuid'
  AND card_id = 'base1-25';
```

## JSONB Card Data Structure

The `card_data` column stores the complete Pokemon card object:

```json
{
  "id": "base1-25",
  "name": "Pikachu",
  "supertype": "Pokémon",
  "subtypes": ["Basic"],
  "hp": "40",
  "types": ["Lightning"],
  "attacks": [
    {
      "name": "Gnaw",
      "cost": ["Colorless"],
      "damage": "10",
      "text": ""
    }
  ],
  "weaknesses": [
    {
      "type": "Fighting",
      "value": "×2"
    }
  ],
  "set": {
    "id": "base1",
    "name": "Base Set",
    "series": "Base",
    "releaseDate": "1999/01/09"
  },
  "number": "25",
  "artist": "Mitsuhiro Arita",
  "rarity": "Common",
  "images": {
    "small": "https://images.pokemontcg.io/base1/25.png",
    "large": "https://images.pokemontcg.io/base1/25_hires.png"
  }
}
```

## Migrations

### Initial Migration

```sql
-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id text NOT NULL,
  card_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_cards table
CREATE TABLE IF NOT EXISTS collection_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  card_id text NOT NULL,
  card_data jsonb NOT NULL,
  quantity integer DEFAULT 1,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, card_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_card_id ON favorites(card_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collection_cards_collection_id ON collection_cards(collection_id);
CREATE INDEX idx_collection_cards_card_id ON collection_cards(card_id);

-- RLS Policies (see individual table sections above)
```

## TypeScript Types

```typescript
interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          card_data: PokemonCard;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          card_data: PokemonCard;
          created_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      collection_cards: {
        Row: {
          id: string;
          collection_id: string;
          card_id: string;
          card_data: PokemonCard;
          quantity: number;
          added_at: string;
        };
      };
    };
  };
}
```

## Best Practices

1. **Always use RLS**: Never disable Row Level Security
2. **Validate ownership**: Check user_id matches auth.uid()
3. **Use transactions**: For complex operations
4. **Index properly**: Add indexes for frequently queried columns
5. **JSONB queries**: Use operators for efficient JSON querying
6. **Cascade deletes**: Set up proper foreign key constraints
7. **Default values**: Use sensible defaults to avoid null checks

## Common Queries

### Get user's total favorites count
```sql
SELECT COUNT(*) FROM favorites
WHERE user_id = auth.uid();
```

### Get user's total collection cards
```sql
SELECT SUM(cc.quantity) as total
FROM collection_cards cc
JOIN collections c ON c.id = cc.collection_id
WHERE c.user_id = auth.uid();
```

### Find collections containing a specific card
```sql
SELECT c.* FROM collections c
JOIN collection_cards cc ON cc.collection_id = c.id
WHERE cc.card_id = 'base1-25'
  AND c.user_id = auth.uid();
```

### Get most collected cards across all users
```sql
SELECT card_data->>'name' as card_name,
       SUM(quantity) as total_quantity
FROM collection_cards
GROUP BY card_data->>'name'
ORDER BY total_quantity DESC
LIMIT 10;
```

## Maintenance

### Vacuum and Analyze
```sql
VACUUM ANALYZE favorites;
VACUUM ANALYZE collections;
VACUUM ANALYZE collection_cards;
```

### Check Table Sizes
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Backup and Restore

### Export Data
```sql
COPY favorites TO '/path/to/favorites.csv' CSV HEADER;
COPY collections TO '/path/to/collections.csv' CSV HEADER;
COPY collection_cards TO '/path/to/collection_cards.csv' CSV HEADER;
```

### Import Data
```sql
COPY favorites FROM '/path/to/favorites.csv' CSV HEADER;
COPY collections FROM '/path/to/collections.csv' CSV HEADER;
COPY collection_cards FROM '/path/to/collection_cards.csv' CSV HEADER;
```
