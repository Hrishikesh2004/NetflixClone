"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, Film, X } from "lucide-react";
import { MediaItem } from "@/types";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieDetailActionsProps {
  movie: MediaItem;
  trailerKey?: string;
  isPlayable: boolean;
}

export default function MovieDetailActions({
  movie,
  trailerKey,
  isPlayable,
}: MovieDetailActionsProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const inList = isInWatchlist(movie.id, "movie");
  const title = movie.title || "Movie";

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist({
        content_id: movie.id,
        content_type: "movie",
        title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average || 8.0,
        release_date: movie.release_date,
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {/* Play Button */}
        <Link
          href={`/watch?id=${movie.id}&type=movie`}
          className="flex items-center space-x-2 bg-[#E50914] hover:bg-[#f40612] text-white px-6 py-3 rounded-md font-bold text-sm sm:text-base shadow-lg shadow-[#E50914]/40 transition-transform active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isPlayable ? "Play Feature Film" : "Play Preview & Trailer"}</span>
        </Link>

        {/* Watch Trailer Modal Trigger (if available) */}
        {trailerKey && (
          <button
            onClick={() => setTrailerModalOpen(true)}
            className="flex items-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-white backdrop-blur-md px-5 py-3 rounded-md font-semibold text-sm sm:text-base border border-zinc-700 transition-colors"
          >
            <Film className="w-5 h-5 text-zinc-400" />
            <span>Watch Trailer</span>
          </button>
        )}

        {/* Add/Remove My List */}
        <button
          onClick={handleWatchlistToggle}
          className={`flex items-center space-x-2 px-5 py-3 rounded-md font-semibold text-sm sm:text-base border transition-all ${
            inList
              ? "bg-zinc-900 border-emerald-500 text-emerald-400"
              : "bg-black/50 border-zinc-600 text-white hover:border-white"
          }`}
        >
          {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{inList ? "In My List" : "Add to My List"}</span>
        </button>
      </div>

      {/* Trailer Modal */}
      {trailerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
            <button
              onClick={() => setTrailerModalOpen(false)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
