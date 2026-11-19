"use client";

import React from "react";
import Link from "next/link";
import { Play, X, Clock } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { getBackdropUrl } from "@/lib/tmdb";

export default function ContinueWatchingRow() {
  const { watchHistory, removeFromHistory } = useWatchlist();

  if (!watchHistory || watchHistory.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-3">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-[#E50914]" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
          Continue Watching
        </h2>
      </div>

      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2">
        {watchHistory.map((item) => {
          const percent =
            item.duration_seconds > 0
              ? (item.progress_seconds / item.duration_seconds) * 100
              : 0;
          const backdrop = getBackdropUrl(item.backdrop_path || item.poster_path, "w780");
          const remainingSecs = Math.max(0, item.duration_seconds - item.progress_seconds);
          const remainingMins = Math.ceil(remainingSecs / 60);

          return (
            <div
              key={`${item.content_id}-${item.content_type}`}
              className="relative flex-none w-[240px] sm:w-[280px] md:w-[320px] group rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-video w-full bg-zinc-950">
                <img
                  src={backdrop}
                  alt={item.title}
                  className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-95 transition-all duration-300"
                />

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => removeFromHistory(item.content_id, item.content_type)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors z-20"
                  title="Remove from Continue Watching"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Resume Play Overlay */}
                <Link
                  href={`/watch?id=${item.content_id}&type=${item.content_type}&t=${item.progress_seconds}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-[#E50914] text-black group-hover:text-white flex items-center justify-center shadow-xl transition-all transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </Link>

                {/* Red progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                  <div
                    className="h-full bg-[#E50914]"
                    style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
                  />
                </div>
              </div>

              {/* Info footer */}
              <div className="p-3 bg-zinc-900 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate">
                    {item.episode_title
                      ? `S${item.season_number || 1} E${item.episode_number || 1}: ${item.episode_title}`
                      : `${remainingMins}m remaining`}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 flex-none">
                  {formatTime(item.progress_seconds)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
