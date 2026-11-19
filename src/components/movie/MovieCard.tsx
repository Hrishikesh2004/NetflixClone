"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { MediaItem, MediaType } from "@/types";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieCardProps {
  item: MediaItem;
  mediaType?: MediaType;
  progressPercent?: number;
  progressSeconds?: number;
}

export default function MovieCard({
  item,
  mediaType,
  progressPercent,
  progressSeconds,
}: MovieCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isHovered, setIsHovered] = useState(false);

  const title = item.title || item.name || "Untitled";
  const type: MediaType = mediaType || item.media_type || (item.first_air_date ? "tv" : "movie");
  const inList = isInWatchlist(item.id, type);
  const posterUrl = getImageUrl(item.poster_path || item.backdrop_path, "w500");
  const releaseYear = (item.release_date || item.first_air_date || "").substring(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist({
        content_id: item.id,
        content_type: type,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average || 7.5,
        release_date: item.release_date || item.first_air_date,
      });
    }
  };

  const detailsUrl = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  const watchUrl = `/watch?id=${item.id}&type=${type}${
    progressSeconds ? `&t=${progressSeconds}` : ""
  }`;

  return (
    <div
      className="relative flex-none w-[160px] sm:w-[200px] md:w-[240px] group cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={detailsUrl} className="block">
        {/* Card Poster Container */}
        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700 shadow-md group-hover:shadow-2xl transition-all duration-300">
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Continue watching progress bar */}
          {progressPercent !== undefined && progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800 z-20">
              <div
                className="h-full bg-[#E50914] transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          )}

          {/* Top Rating Badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-amber-400 text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center shadow border border-zinc-800/80">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
              {rating}
            </div>
          )}

          {/* Hover Overlay Card Details */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 flex flex-col justify-end transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow">
              {title}
            </h3>

            <div className="flex items-center space-x-2 text-[11px] text-zinc-300 my-1.5">
              {releaseYear && <span>{releaseYear}</span>}
              <span className="border border-zinc-600 px-1 rounded text-[9px] uppercase">
                HD
              </span>
              <span className="text-[#E50914] font-medium uppercase text-[10px]">
                {type}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <Link
                href={watchUrl}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-black shadow-lg transition-transform transform hover:scale-110"
                title="Play content"
              >
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </Link>

              <button
                type="button"
                onClick={handleWatchlistToggle}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  inList
                    ? "bg-[#E50914] border-[#E50914] text-white"
                    : "bg-black/60 border-zinc-400 text-white hover:border-white"
                }`}
                title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              <Link
                href={detailsUrl}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-black/60 border border-zinc-400 hover:border-white text-white flex items-center justify-center transition-colors ml-auto"
                title="More Information"
              >
                <Info className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
