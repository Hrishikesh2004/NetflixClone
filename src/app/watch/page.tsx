import React from "react";
import VideoPlayer from "@/components/player/VideoPlayer";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";
import { PLAYABLE_REGISTRY, MOCK_MOVIES } from "@/lib/mockData";
import { MediaItem } from "@/types";

interface WatchPageProps {
  searchParams: Promise<{
    id?: string;
    type?: string;
    season?: string;
    episode?: string;
    t?: string;
  }>;
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const params = await searchParams;
  const contentId = params.id ? parseInt(params.id, 10) : 88801;
  const contentType = params.type === "tv" ? "tv" : "movie";
  const initialTime = params.t ? parseInt(params.t, 10) : 0;

  let media: MediaItem | null = null;
  if (contentType === "tv") {
    media = await getTVDetails(contentId);
  } else {
    media = await getMovieDetails(contentId);
  }

  if (!media) {
    media = MOCK_MOVIES[0];
  }

  // Check if authorized playable video stream exists in registry
  const playable = PLAYABLE_REGISTRY[contentId] || null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <VideoPlayer
        media={media}
        playable={playable}
        initialTime={initialTime}
      />
    </div>
  );
}
