"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Film, Tv, Trash2, Play } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { getImageUrl } from "@/lib/tmdb";
import { MediaType } from "@/types";

export default function MyListPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const filteredItems = watchlist.filter((item) => {
    if (filter === "all") return true;
    return item.content_type === filter;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-[75vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-[#E50914] mb-1">
            <Bookmark className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved Content</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Your personalized queue of movies, blockbusters, and binge-worthy television series.
          </p>
        </div>

        {/* Filter Tabs */}
        {watchlist.length > 0 && (
          <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded transition-colors ${
                filter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              onClick={() => setFilter("movie")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded transition-colors ${
                filter === "movie" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setFilter("tv")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded transition-colors ${
                filter === "tv" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Shows</span>
            </button>
          </div>
        )}
      </div>

      {/* Watchlist Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const detailsHref = item.content_type === "movie" ? `/movie/${item.content_id}` : `/tv/${item.content_id}`;
            const watchHref = `/watch?id=${item.content_id}&type=${item.content_type}`;
            const posterUrl = getImageUrl(item.poster_path || item.backdrop_path, "w500");

            return (
              <div
                key={`${item.content_id}-${item.content_type}`}
                className="relative group rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <Link href={detailsHref} className="block relative aspect-[2/3] w-full overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>

                <div className="p-3 bg-zinc-900/90 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
                      <span className="uppercase text-[10px] font-semibold text-[#E50914]">
                        {item.content_type}
                      </span>
                      {item.vote_average > 0 && (
                        <span>★ {item.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-800/80">
                    <Link
                      href={watchHref}
                      className="text-xs font-semibold text-white hover:text-[#E50914] transition-colors flex items-center space-x-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </Link>

                    <button
                      onClick={() => removeFromWatchlist(item.content_id, item.content_type as MediaType)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4 bg-zinc-900/40 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-[#E50914]">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Watchlist is Empty</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Explore movies and TV shows and click "+ Add to My List" to bookmark content you want to watch later.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <Link
              href="/movies"
              className="bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              href="/tv-shows"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-5 py-2.5 rounded-md transition-colors"
            >
              Browse TV Series
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
