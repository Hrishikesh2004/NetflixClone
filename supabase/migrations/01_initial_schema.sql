-- ============================================================
-- CineFlix Supabase Database Schema
-- Production-Ready with Row Level Security (RLS) & Triggers
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. WATCHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist" 
  ON public.watchlists FOR ALL USING (auth.uid() = user_id);

-- 3. WATCHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.watchlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE NOT NULL,
  content_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  vote_average NUMERIC(3, 1) DEFAULT 0.0,
  release_date TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(watchlist_id, content_id, content_type)
);

ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their watchlist items" 
  ON public.watchlist_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists 
      WHERE public.watchlists.id = public.watchlist_items.watchlist_id 
      AND public.watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their watchlist items" 
  ON public.watchlist_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.watchlists 
      WHERE public.watchlists.id = public.watchlist_items.watchlist_id 
      AND public.watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their watchlist items" 
  ON public.watchlist_items FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists 
      WHERE public.watchlists.id = public.watchlist_items.watchlist_id 
      AND public.watchlists.user_id = auth.uid()
    )
  );

-- Indexes for watchlist performance
CREATE INDEX IF NOT EXISTS idx_watchlist_items_lookup 
  ON public.watchlist_items(watchlist_id, content_id, content_type);

-- 4. WATCH HISTORY TABLE (Continue Watching)
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  progress_seconds INTEGER DEFAULT 0 NOT NULL,
  duration_seconds INTEGER DEFAULT 0 NOT NULL,
  episode_title TEXT,
  season_number INTEGER,
  episode_number INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, content_id, content_type)
);

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watch history" 
  ON public.watch_history FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watch_history_user_updated 
  ON public.watch_history(user_id, updated_at DESC);

-- 5. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_genres INTEGER[] DEFAULT '{}',
  autoplay_previews BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences" 
  ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- 6. AUTOMATIC TRIGGER FOR NEW USERS
-- Whenever a user signs up through Supabase Auth, automatically create profile & watchlist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80')
  );

  INSERT INTO public.watchlists (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
