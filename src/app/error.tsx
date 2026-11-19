"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
        Playback Interrupted
      </h1>
      <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while loading this view. You can retry loading or return to the main theatre.
      </p>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => reset()}
          className="flex items-center space-x-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#E50914]/30 transition-transform active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-5 py-3 rounded-lg border border-zinc-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
