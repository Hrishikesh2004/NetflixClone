# CineFlix 🎬
### Premium Movie & TV Streaming Platform Inspired by Netflix

CineFlix is a production-ready, Netflix-inspired streaming and movie discovery web application. Built with Next.js (App Router), TypeScript, Tailwind CSS, TMDB API, Supabase (Auth & PostgreSQL RLS), and a custom HTML5 video player.

---

## 🌟 Key Features

- **Cinematic Experience**: Dark Netflix-style palette (`#141414`), deep red brand accent (`#E50914`), high-resolution hero banners, smooth hover cards, and interactive horizontal carousels.
- **TMDB Catalog Integration**:
  - Live trending movies, popular series, top-rated cinema, upcoming releases.
  - Multi-genre filtering (Action, Sci-Fi, Comedy, Horror, Romance, etc.).
  - Sorting by popularity, rating, and release date.
  - Full details for movies and TV shows: cast, director, runtime, trailers, and similar titles.
  - TV show seasons and episode guide with stills, runtimes, and overviews.
- **Production HTML5 Video Player**:
  - 12 required player controls: Play/Pause, Scrubber/Seek with buffered bar, Volume slider, Mute/Unmute, Fullscreen toggle, Current timestamp & total duration, Playback speeds (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x), Subtitle closed captions, and keyboard shortcuts (`Space`/`K`, `F`, `M`, `←`/`→`, `↑`/`↓`).
  - Auto-hiding control overlays on mouse inactivity.
  - Authorized public-domain cinema streams (e.g., *Tears of Steel*, *Sintel*, *Big Buck Bunny*, *Elephants Dream*) in full 1080p.
  - Official TMDB studio trailer preview player for commercial features with full legal and streaming rights disclosure.
- **Continue Watching with Resume**:
  - Automatic playback progress tracking every 5 seconds.
  - Visual red completion bars on movie cards.
  - Resume button to jump back into playback from the exact second you left off.
- **Personalized Watchlist (My List)**:
  - Add or remove movies and TV shows with one click (+ / Checkmark).
  - Filter by All, Movies, and TV Shows.
  - Seamless persistence in Supabase PostgreSQL (with automatic localStorage guest fallback).
- **Interactive Multi-Search**:
  - Real-time debounced search for movies, TV series, actors, and genres.
  - Instant filter tabs (All, Movies, TV Shows).
  - Search history tracking with quick access pills and one-click clear.
- **Authentication & Profiles**:
  - Supabase Auth integration (Email/Password registration, sign-in, session persistence).
  - Guest Explore Mode (instant access without mandatory login).
  - Profile customization: choose cinematic avatars, edit username, view streaming statistics.
- **Database Architecture & RLS**:
  - PostgreSQL schema migrations in `supabase/migrations/01_initial_schema.sql`.
  - Comprehensive Row Level Security (RLS) policies protecting user data.
  - Automatic triggers for new profile and default watchlist creation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Video Engine** | Custom HTML5 Video Player & YouTube Trailer Embeds |
| **Movie Metadata** | [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
cineflix/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Cinematic Home Page (Hero, Continue Watching, Rows)
│   │   ├── movies/page.tsx        # Movies Catalog (Genres, Sorting, Pagination)
│   │   ├── tv-shows/page.tsx      # TV Series Catalog (Genres, Sorting)
│   │   ├── search/page.tsx        # Instant Multi-Search Engine & History
│   │   ├── movie/[id]/page.tsx    # Movie Details, Cast, Trailers & Similar Titles
│   │   ├── tv/[id]/page.tsx       # TV Details, Seasons & Episode Selector
│   │   ├── watch/page.tsx         # Dedicated Fullscreen Video Streaming Player
│   │   ├── my-list/page.tsx       # User Watchlist Management
│   │   ├── profile/page.tsx       # Profile, Avatars, Viewing Statistics & History
│   │   ├── login/page.tsx         # Sign In & Guest Explore Mode
│   │   ├── signup/page.tsx        # Account Registration
│   │   ├── not-found.tsx          # Custom 404 Page
│   │   ├── error.tsx              # Application Error Boundary
│   │   └── api/
│   │       ├── tmdb/[...endpoint] # Secure Server-side TMDB Proxy
│   │       ├── watchlist/         # Watchlist API Endpoint
│   │       └── history/           # Watch History API Endpoint
│   ├── components/
│   │   ├── hero/                  # HeroBanner
│   │   ├── movie/                 # MovieCard, ContentRow, ContinueWatchingRow
│   │   ├── navigation/            # Sticky Blur Navbar & Mobile Menu
│   │   ├── layout/                # Footer with TMDB Attribution
│   │   └── player/                # 12-Control HTML5 VideoPlayer
│   ├── context/
│   │   ├── AuthContext.tsx        # Supabase Auth + Guest Mode
│   │   └── WatchlistContext.tsx   # Watchlist & Continue Watching Sync
│   ├── lib/
│   │   ├── tmdb.ts                # TMDB API Client, Caching & Image Helpers
│   │   ├── mockData.ts            # Curated Fallback Catalog & Playable Streams
│   │   └── supabase/              # Supabase Client & Server Helpers
│   └── types/
│       └── index.ts               # Complete TypeScript Definitions
├── supabase/
│   └── migrations/
│       └── 01_initial_schema.sql  # PostgreSQL Tables, RLS Policies & Triggers
├── public/
│   └── images/                    # SVGs & Artwork Placeholders
├── .env.example                   # Complete Environment Variables Reference
├── next.config.ts                 # Next.js Image Domains & Configuration
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/cineflix.git
cd cineflix
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your API credentials (see next section):

```env
# TMDB API (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: CineFlix includes an intelligent fallback catalog. If you run the app before configuring keys, it runs seamlessly in Guest Mode with rich 4K content, working continue-watching, and sample playable streams!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 External Credentials Setup

### A. The Movie Database (TMDB) API
1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings** → **API** (`https://www.themoviedb.org/settings/api`).
3. Click **Create** and select **Developer**.
4. Fill in basic application details (Application Name: `CineFlix`, URL: `http://localhost:3000`).
5. Copy your **API Key (v3 auth)** into `TMDB_API_KEY`.

### B. Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com).
2. Click **New Project** and choose a database password and region.
3. Once created, go to **Project Settings** → **API**:
   - Copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy **anon public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy **service_role** key into `SUPABASE_SERVICE_ROLE_KEY`.
4. Run Database Migrations:
   - Go to the **SQL Editor** in the Supabase Dashboard.
   - Open `supabase/migrations/01_initial_schema.sql` from this repository.
   - Paste the SQL into the editor and click **Run**.
   - This creates all tables (`profiles`, `watchlists`, `watchlist_items`, `watch_history`, `user_preferences`), enables Row Level Security (RLS), and sets up user triggers.

---

## ☁️ Vercel Deployment Instructions

Deploy CineFlix directly to Vercel in 3 simple steps:

### Step 1: Push Repository to GitHub
```bash
git add .
git commit -m "Initial commit: Complete CineFlix streaming platform"
git remote add origin https://github.com/<your-username>/cineflix.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New Project** → **Import Git Repository**.
3. Select your `cineflix` repository.
4. Framework Preset will automatically detect **Next.js**.

### Step 3: Add Environment Variables on Vercel
Under **Environment Variables**, add:
- `TMDB_API_KEY`: Your TMDB API Key.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.
- `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g. `https://cineflix.vercel.app`).

Click **Deploy**! Your application will build and be live worldwide in under 60 seconds.

---

## ⚖️ Legal & Copyright Compliance

CineFlix is designed with rigorous intellectual property compliance:
- **Public Domain & Creative Commons**: Full-length video streaming is provided exclusively for authorized open-source and creative commons films (Blender Foundation 4K cinema: *Tears of Steel*, *Sintel*, *Big Buck Bunny*, *Elephants Dream*, and public domain classics).
- **Studio Previews**: For commercial studio releases, CineFlix displays metadata, cast information, and official studio promotional trailers with clear disclosure indicating that full film streaming is reserved for licensed distributors.
- **TMDB Attribution**: This product uses the TMDB API for metadata and artwork but is not endorsed or certified by TMDB.

---

## 📄 License

MIT License. Designed and engineered for high-performance cinematic web streaming.
