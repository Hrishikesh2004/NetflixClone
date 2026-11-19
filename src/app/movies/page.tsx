import React from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { getMoviesByGenre, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb";
import { MOVIE_GENRES } from "@/lib/mockData";

interface MoviesPageProps {
  searchParams: Promise<{
    genre?: string;
    sort?: string;
    page?: string;
    category?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const currentGenreId = params.genre ? parseInt(params.genre, 10) : undefined;
  const currentSort = params.sort || "popularity.desc";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const currentCategory = params.category || "all";

  let moviesData;
  if (currentCategory === "top-rated") {
    moviesData = await getTopRatedMovies(currentPage);
  } else if (currentCategory === "upcoming") {
    moviesData = await getUpcomingMovies(currentPage);
  } else {
    moviesData = await getMoviesByGenre(currentGenreId, currentPage, currentSort);
  }

  const { results: movies, total_pages } = moviesData;
  const totalPages = Math.min(total_pages, 50); // limit max navigable pages

  const sortOptions = [
    { label: "Most Popular", value: "popularity.desc" },
    { label: "Highest Rated", value: "vote_average.desc" },
    { label: "Release Date: Newest", value: "primary_release_date.desc" },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Movies Catalog
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Discover thousands of blockbuster features, indie cinema, and curated cinematic gems.
          </p>
        </div>

        {/* Quick Category Tabs */}
        <div className="flex items-center space-x-2 text-xs font-semibold overflow-x-auto no-scrollbar pb-1">
          <Link
            href="/movies"
            className={`px-3 py-1.5 rounded-full transition-colors flex-none ${
              !currentGenreId && currentCategory === "all"
                ? "bg-[#E50914] text-white"
                : "bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            All Movies
          </Link>
          <Link
            href="/movies?category=top-rated"
            className={`px-3 py-1.5 rounded-full transition-colors flex-none ${
              currentCategory === "top-rated"
                ? "bg-[#E50914] text-white"
                : "bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            Top Rated
          </Link>
          <Link
            href="/movies?category=upcoming"
            className={`px-3 py-1.5 rounded-full transition-colors flex-none ${
              currentCategory === "upcoming"
                ? "bg-[#E50914] text-white"
                : "bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            Upcoming
          </Link>
        </div>
      </div>

      {/* Genre Filter Pills & Sorting */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Genres:
          </span>
          {MOVIE_GENRES.map((genre) => {
            const isSelected = currentGenreId === genre.id;
            return (
              <Link
                key={genre.id}
                href={`/movies?genre=${genre.id}&sort=${currentSort}`}
                className={`text-xs px-3 py-1 rounded-md transition-all ${
                  isSelected
                    ? "bg-[#E50914] text-white font-bold shadow-md shadow-[#E50914]/30"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {genre.name}
              </Link>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2 text-xs flex-none self-end lg:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 font-medium">Sort:</span>
          <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 rounded-md p-1">
            {sortOptions.map((opt) => (
              <Link
                key={opt.value}
                href={`/movies?${currentGenreId ? `genre=${currentGenreId}&` : ""}${
                  currentCategory !== "all" ? `category=${currentCategory}&` : ""
                }sort=${opt.value}`}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  currentSort === opt.value
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="w-full flex justify-center">
              <MovieCard item={movie} mediaType="movie" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-base">No movies found matching the selected criteria.</p>
          <Link
            href="/movies"
            className="inline-block mt-4 bg-[#E50914] text-white text-xs font-semibold px-4 py-2 rounded"
          >
            Reset Filters
          </Link>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-8 border-t border-zinc-800/80">
          <Link
            href={`/movies?page=${Math.max(1, currentPage - 1)}${
              currentGenreId ? `&genre=${currentGenreId}` : ""
            }&sort=${currentSort}`}
            className={`flex items-center space-x-1 px-4 py-2 rounded border border-zinc-800 bg-zinc-900 text-sm font-medium transition-colors ${
              currentPage <= 1
                ? "opacity-50 pointer-events-none text-zinc-600"
                : "text-zinc-300 hover:text-white hover:border-zinc-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Link>

          <span className="text-sm font-mono text-zinc-400">
            Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
          </span>

          <Link
            href={`/movies?page=${Math.min(totalPages, currentPage + 1)}${
              currentGenreId ? `&genre=${currentGenreId}` : ""
            }&sort=${currentSort}`}
            className={`flex items-center space-x-1 px-4 py-2 rounded border border-zinc-800 bg-zinc-900 text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? "opacity-50 pointer-events-none text-zinc-600"
                : "text-zinc-300 hover:text-white hover:border-zinc-700"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
