import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Tv, ArrowLeft } from "lucide-react";
import ContentRow from "@/components/movie/ContentRow";
import { getTVDetails, getBackdropUrl, getImageUrl } from "@/lib/tmdb";
import TVDetailClient from "./TVDetailClient";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: TVPageProps) {
  const { id } = await params;
  const show = await getTVDetails(id);

  if (!show) {
    notFound();
  }

  const title = show.name || "TV Series Details";
  const releaseYear = (show.first_air_date || "").substring(0, 4) || "2024";
  const rating = show.vote_average ? show.vote_average.toFixed(1) : "8.4";
  const backdropUrl = getBackdropUrl(show.backdrop_path);
  const posterUrl = getImageUrl(show.poster_path, "w500");

  const cast = show.credits?.cast?.slice(0, 8) || [];
  const similarShows = show.similar?.results || [];
  const trailer =
    show.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    show.videos?.results?.[0];

  return (
    <div className="relative pb-20">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden select-none">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-[0.75] scale-105"
        />

        {/* Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-30">
          <Link
            href="/tv-shows"
            className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 hover:text-white bg-black/60 px-3 py-1.5 rounded-full border border-zinc-700 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to TV Shows</span>
          </Link>
        </div>

        {/* Show Title & Meta Overlay */}
        <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="flex items-center bg-[#E50914] text-white px-2.5 py-0.5 rounded font-bold uppercase text-[11px]">
                TV Series
              </span>
              <span className="flex items-center text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-zinc-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {rating}
              </span>
              <span className="flex items-center text-zinc-300 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                {releaseYear}
              </span>
              {show.number_of_seasons && (
                <span className="flex items-center text-zinc-300 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                  <Tv className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                  {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              {title}
            </h1>

            {show.tagline && (
              <p className="text-sm sm:text-base italic text-zinc-300 font-serif">
                "{show.tagline}"
              </p>
            )}

            {/* Interactive TV Actions (Play, Watchlist, Trailer modal) */}
            <TVDetailClient show={show} trailerKey={trailer?.key} />
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

          {/* Right: Synopsis, Genres, Cast */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Series Overview</h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {show.overview || "No overview available for this series."}
              </p>
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/tv-shows?genre=${genre.id}`}
                      className="text-xs px-3 py-1 bg-zinc-800/80 hover:bg-[#E50914] text-zinc-300 hover:text-white rounded-full transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Cast */}
            {cast.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Leading Cast
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

        {/* Similar TV Shows */}
        {similarShows.length > 0 && (
          <div className="pt-8 border-t border-zinc-800">
            <ContentRow
              title="More Series Like This"
              items={similarShows}
              mediaType="tv"
            />
          </div>
        )}
      </div>
    </div>
  );
}
