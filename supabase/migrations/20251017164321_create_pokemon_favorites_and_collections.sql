/*
  # Pokemon Card Favorites and Collections Schema

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `user_id` (uuid, foreign key) - References auth.users
      - `card_id` (text) - Pokemon TCG API card ID
      - `card_data` (jsonb) - Complete card data from API
      - `created_at` (timestamptz) - When the card was favorited
    
    - `collections`
      - `id` (uuid, primary key) - Unique identifier for each collection
      - `user_id` (uuid, foreign key) - References auth.users
      - `name` (text) - Collection name
      - `description` (text) - Collection description
      - `is_public` (boolean) - Whether collection is publicly visible
      - `created_at` (timestamptz) - When collection was created
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `collection_cards`
      - `id` (uuid, primary key) - Unique identifier
      - `collection_id` (uuid, foreign key) - References collections
      - `card_id` (text) - Pokemon TCG API card ID
      - `card_data` (jsonb) - Complete card data from API
      - `quantity` (integer) - Number of copies owned
      - `added_at` (timestamptz) - When card was added to collection

  2. Security
    - Enable RLS on all tables
    - Users can only access their own favorites and collections
    - Public collections are viewable by all authenticated users
    - Collection owners have full control over their collections
*/

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

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Collections policies
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections"
  ON collections FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Collection cards policies
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

CREATE POLICY "Users can update cards in own collections"
  ON collection_cards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards from own collections"
  ON collection_cards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_card_id ON favorites(card_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_cards_collection_id ON collection_cards(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_cards_card_id ON collection_cards(card_id);