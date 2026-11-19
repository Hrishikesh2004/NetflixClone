"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Info, Plus, Check, Star, Volume2, VolumeX, Sparkles } from "lucide-react";
import { MediaItem } from "@/types";
import { getBackdropUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface HeroBannerProps {
  item: MediaItem;
}

export default function HeroBanner({ item }: HeroBannerProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [muted, setMuted] = useState(true);

  if (!item) return null;

  const title = item.title || item.name || "Featured Title";
  const releaseYear = (item.release_date || item.first_air_date || "").substring(0, 4) || "2024";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "8.5";
  const isMovie = item.media_type === "movie" || !item.first_air_date;
  const contentType = isMovie ? "movie" : "tv";
  const inList = isInWatchlist(item.id, contentType);

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(item.id, contentType);
    } else {
      addToWatchlist({
        content_id: item.id,
        content_type: contentType,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average || 8.0,
        release_date: item.release_date || item.first_air_date,
      });
    }
  };

  const backdropUrl = getBackdropUrl(item.backdrop_path);

  return (
    <div className="relative w-full h-[70vh] sm:h-[82vh] lg:h-[90vh] overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-[0.85] scale-105 transform animate-fade-in"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl pt-24 sm:pt-28 space-y-4">
          {/* Badge & Meta */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium">
            <span className="flex items-center space-x-1 bg-[#E50914] text-white px-2.5 py-0.5 rounded-sm font-bold tracking-wide uppercase text-[11px]">
              <Sparkles className="w-3 h-3 mr-1" />
              CineFlix Spotlight
            </span>
            <span className="flex items-center text-amber-400 font-semibold bg-black/40 px-2 py-0.5 rounded border border-zinc-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              {rating}
            </span>
            <span className="text-zinc-300 font-mono">{releaseYear}</span>
            <span className="border border-zinc-600 px-1.5 py-0.2 rounded text-[11px] text-zinc-300 uppercase">
              Ultra HD 4K
            </span>
            <span className="border border-zinc-700 px-1.5 py-0.2 rounded text-[11px] text-zinc-400">
              5.1 Spatial Audio
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-xl drop-shadow">
            {item.overview || "Stream this critically acclaimed cinematic presentation exclusively on CineFlix with full audio-visual fidelity."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <Link
              href={`/watch?id=${item.id}&type=${contentType}`}
              className="flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 sm:py-3 rounded-md font-bold text-sm sm:text-base transition-transform transform active:scale-95 shadow-xl hover:shadow-white/20"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>Play Now</span>
            </Link>

            {/* More Info */}
            <Link
              href={isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
              className="flex items-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-white backdrop-blur-md px-5 py-2.5 sm:py-3 rounded-md font-semibold text-sm sm:text-base border border-zinc-600/40 transition-transform active:scale-95"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Link>

            {/* Add to Watchlist */}
            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center justify-center p-3 rounded-full border transition-all ${
                inList
                  ? "bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/40"
                  : "bg-black/50 border-zinc-500 text-zinc-200 hover:border-white hover:text-white"
              }`}
              title={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Bottom Audio / Rating Pill */}
      <div className="absolute right-4 sm:right-10 bottom-16 sm:bottom-20 hidden md:flex items-center space-x-3">
        <button
          onClick={() => setMuted(!muted)}
          className="p-2.5 rounded-full border border-zinc-600/70 bg-black/40 backdrop-blur-sm text-zinc-300 hover:text-white hover:border-white transition-colors"
          title={muted ? "Unmute preview" : "Mute preview"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <span className="border-l-2 border-zinc-400 pl-3 py-0.5 text-xs text-zinc-300 font-bold tracking-wider uppercase bg-black/40 px-2.5 rounded-r">
          PG-13 / 16+
        </span>
      </div>
    </div>
  );
}
