"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, MediaType } from "@/types";
import MovieCard from "./MovieCard";

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  mediaType?: MediaType;
  exploreHref?: string;
  loading?: boolean;
}

export default function ContentRow({
  title,
  items,
  mediaType,
  exploreHref,
  loading = false,
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const updateArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  if (!loading && (!items || items.length === 0)) {
    return null;
  }

  return (
    <div className="relative my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-3 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
          {title}
        </h2>

        {exploreHref && (
          <Link
            href={exploreHref}
            className="text-xs sm:text-sm text-zinc-400 hover:text-[#E50914] font-medium transition-colors flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute -left-3 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all rounded-r-md border-r border-zinc-700/50 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={updateArrows}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] rounded-md bg-zinc-800 animate-shimmer"
                />
              ))
            : items.map((item) => (
                <MovieCard
                  key={`${item.id}-${item.media_type || mediaType || "item"}`}
                  item={item}
                  mediaType={mediaType}
                />
              ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute -right-3 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all rounded-l-md border-l border-zinc-700/50 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
