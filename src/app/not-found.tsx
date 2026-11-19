import React from "react";
import Link from "next/link";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914] mb-6 shadow-xl shadow-[#E50914]/20">
        <Film className="w-8 h-8" />
      </div>

      <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-300 mb-3">
        Lost in the Cinematic Cosmos
      </h2>
      <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        The title, page, or streaming reel you requested could not be found or has moved to another theatre.
      </p>

      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#E50914]/30 transition-transform active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/movies"
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-5 py-3 rounded-lg border border-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
