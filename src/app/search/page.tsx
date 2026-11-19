"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Clock, Film, Tv, Sparkles, AlertCircle } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { MediaItem, MediaType } from "@/types";
import { searchMulti } from "@/lib/tmdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Popular search suggestions
  const suggestions = [
    "Tears of Steel",
    "Interstellar",
    "Inception",
    "The Dark Knight",
    "House of the Dragon",
    "Stranger Things",
    "Sci-Fi",
    "Action",
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cineflix_search_history");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Debounce search query input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, router]);

  // Execute search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    searchMulti(debouncedQuery.trim()).then((data) => {
      setResults(data.results || []);
      setLoading(false);

      if (debouncedQuery.trim().length > 1) {
        setRecentSearches((prev) => {
          const filtered = prev.filter((s) => s.toLowerCase() !== debouncedQuery.toLowerCase());
          const updated = [debouncedQuery.trim(), ...filtered].slice(0, 8);
          localStorage.setItem("cineflix_search_history", JSON.stringify(updated));
          return updated;
        });
      }
    });
  }, [debouncedQuery]);

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("cineflix_search_history");
  };

  const filteredResults = results.filter((item) => {
    if (activeTab === "all") return true;
    return item.media_type === activeTab;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Search Input Bar */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by movie title, TV show, genre, or actor..."
            autoFocus
            className="w-full bg-[#181818] border border-zinc-700 hover:border-zinc-500 focus:border-[#E50914] text-white text-base sm:text-lg rounded-xl pl-12 pr-12 py-3.5 sm:py-4 focus:outline-none transition-all shadow-xl"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                router.replace("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Suggestions & Recent Searches */}
        {!debouncedQuery && (
          <div className="space-y-6 pt-4">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Recent Searches
                  </span>
                  <button
                    onClick={clearHistory}
                    className="hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="flex items-center text-xs text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Popular Discoveries
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs px-3.5 py-1.5 rounded-full transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {debouncedQuery && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Search Results for <span className="text-[#E50914] font-semibold">"{debouncedQuery}"</span>
              {!loading && (
                <span className="text-xs text-zinc-500 font-normal ml-2">
                  ({filteredResults.length} titles found)
                </span>
              )}
            </h2>

            <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("movie")}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                  activeTab === "movie" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setActiveTab("tv")}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                  activeTab === "tv" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Tv className="w-3 h-3" />
                <span>TV Shows</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-md bg-zinc-800 animate-shimmer"
                />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredResults.map((item) => (
                <div key={`${item.id}-${item.media_type}`} className="w-full flex justify-center">
                  <MovieCard item={item} mediaType={item.media_type as MediaType} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
              <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Results Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                We couldn't find any titles matching "{debouncedQuery}". Try checking the spelling or searching for a different actor, franchise, or genre.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-[#E50914] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading search engine...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
