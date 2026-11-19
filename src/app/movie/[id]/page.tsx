import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import ContentRow from "@/components/movie/ContentRow";
import { getMovieDetails, getBackdropUrl, getImageUrl } from "@/lib/tmdb";
import { PLAYABLE_REGISTRY } from "@/lib/mockData";
import MovieDetailActions from "./MovieDetailActions";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const title = movie.title || "Movie Details";
  const releaseYear = (movie.release_date || "").substring(0, 4) || "2024";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.2";
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  const director = movie.credits?.crew?.find((c) => c.job === "Director")?.name;
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similarMovies = movie.similar?.results || [];

  const trailer =
    movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    movie.videos?.results?.[0];

  const isPlayable = Boolean(PLAYABLE_REGISTRY[Number(id)]);

  return (
    <div className="relative pb-20">
      {/* Hero Backdrop Section */}
      <div className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden select-none">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-[0.75] scale-105"
        />

        {/* Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-30">
          <Link
            href="/movies"
            className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 hover:text-white bg-black/60 px-3 py-1.5 rounded-full border border-zinc-700 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>

        {/* Movie Header Info Overlay */}
        <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="flex items-center bg-[#E50914] text-white px-2.5 py-0.5 rounded font-bold uppercase text-[11px]">
                Movie
              </span>
              <span className="flex items-center text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-zinc-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {rating}
              </span>
              <span className="flex items-center text-zinc-300 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                {releaseYear}
              </span>
              {movie.runtime && (
                <span className="flex items-center text-zinc-300 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                  <Clock className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 uppercase">
                Ultra HD
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              {title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base italic text-zinc-300 font-serif">
                "{movie.tagline}"
              </p>
            )}

            {/* Client interactive buttons (Play, Add to List, Watch Trailer) */}
            <MovieDetailActions movie={movie} trailerKey={trailer?.key} isPlayable={isPlayable} />
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Left: Poster */}
          <div className="hidden sm:block">
            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Synopsis, Genres, Cast & Crew */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Overview</h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {movie.overview || "No extended synopsis is currently available."}
              </p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/movies?genre=${genre.id}`}
                      className="text-xs px-3 py-1 bg-zinc-800/80 hover:bg-[#E50914] text-zinc-300 hover:text-white rounded-full transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Director */}
            {director && (
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">
                  Director:
                </span>
                <span className="text-sm text-zinc-200 font-medium">{director}</span>
              </div>
            )}

            {/* Top Cast */}
            {cast.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Featured Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {cast.map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-2.5 flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-none">
                        <img
                          src={getImageUrl(actor.profile_path, "w300")}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Titles Row */}
        {similarMovies.length > 0 && (
          <div className="pt-8 border-t border-zinc-800">
            <ContentRow
              title="More Like This"
              items={similarMovies}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}
