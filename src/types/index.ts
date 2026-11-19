export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  popularity?: number;
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  videos?: {
    results: VideoTrailer[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  similar?: {
    results: MediaItem[];
  };
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count?: number;
  poster_path: string | null;
  air_date?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  runtime?: number;
  vote_average?: number;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface WatchlistItem {
  id: string;
  user_id?: string;
  content_id: number;
  content_type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  added_at: string;
}

export interface WatchHistoryItem {
  id: string;
  user_id?: string;
  content_id: number;
  content_type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  progress_seconds: number;
  duration_seconds: number;
  episode_title?: string;
  season_number?: number;
  episode_number?: number;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export interface PlayableContent {
  content_id: number;
  content_type: MediaType;
  title: string;
  overview?: string;
  backdrop_path?: string | null;
  video_url: string;
  is_public_domain: boolean;
  license_note: string;
  trailer_key?: string;
  duration_seconds?: number;
}
