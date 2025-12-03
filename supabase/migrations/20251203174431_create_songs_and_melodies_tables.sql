/*
  # Create Songs and Melodies Tables

  ## Overview
  This migration creates the database schema for storing songs with their melody data
  for the VerseForge Song Builder application.

  ## New Tables
  
  ### `songs`
  Stores song metadata and structure
  - `id` (uuid, primary key) - Unique song identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users (for future auth implementation)
  - `title` (text) - Song title
  - `genre` (text) - Genre (rock, pop, country, hiphop)
  - `hook` (text) - Main hook/chorus lyric
  - `tempo` (integer) - BPM
  - `key` (text) - Musical key (C, D, E, F, G, A, B with sharps/flats)
  - `structure` (jsonb) - Complete song structure with sections and lyrics
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ### `song_sections`
  Stores individual song sections with melodies
  - `id` (uuid, primary key) - Unique section identifier
  - `song_id` (uuid, foreign key) - Reference to songs table
  - `section_id` (text) - Internal section ID from frontend
  - `section_type` (text) - Type of section (verse, chorus, bridge, etc.)
  - `section_number` (integer) - Section number (e.g., Verse 1, Verse 2)
  - `lyrics` (jsonb) - Array of lyric lines
  - `melody` (jsonb) - Melody notes data
  - `bars` (integer) - Number of bars/measures
  - `order_index` (integer) - Position in song structure
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for sharing (optional based on user preference)
  - Users can only modify their own songs

  ## Indexes
  - Index on user_id for efficient queries
  - Index on song_id for section lookups
  - Index on created_at for sorting

  ## Notes
  - JSONB format allows flexible storage of complex structures
  - Melody data stored as array of note objects with pitch, octave, timing, velocity
  - Structure allows for future expansion (audio files, chord progressions, etc.)
*/

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT '',
  genre text DEFAULT 'pop',
  hook text DEFAULT '',
  tempo integer DEFAULT 105,
  key text DEFAULT 'C',
  structure jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create song_sections table
CREATE TABLE IF NOT EXISTS song_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
  section_id text NOT NULL,
  section_type text NOT NULL,
  section_number integer,
  lyrics jsonb DEFAULT '[]'::jsonb,
  melody jsonb DEFAULT '[]'::jsonb,
  bars integer,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_song_sections_song_id ON song_sections(song_id);
CREATE INDEX IF NOT EXISTS idx_song_sections_order ON song_sections(song_id, order_index);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs table
-- Allow public read for anonymous browsing (can be restricted later)
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert their own songs
CREATE POLICY "Users can insert their own songs"
  ON songs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own songs
CREATE POLICY "Users can update their own songs"
  ON songs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own songs
CREATE POLICY "Users can delete their own songs"
  ON songs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for song_sections table
-- Allow public read for sections belonging to public songs
CREATE POLICY "Song sections are viewable by everyone"
  ON song_sections FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert sections for their songs
CREATE POLICY "Users can insert sections for their songs"
  ON song_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_sections.song_id
      AND songs.user_id = auth.uid()
    )
  );

-- Allow users to update sections for their songs
CREATE POLICY "Users can update sections for their songs"
  ON song_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_sections.song_id
      AND songs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_sections.song_id
      AND songs.user_id = auth.uid()
    )
  );

-- Allow users to delete sections for their songs
CREATE POLICY "Users can delete sections for their songs"
  ON song_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_sections.song_id
      AND songs.user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_song_sections_updated_at ON song_sections;
CREATE TRIGGER update_song_sections_updated_at
  BEFORE UPDATE ON song_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
