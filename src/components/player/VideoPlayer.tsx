"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  ArrowLeft,
  Subtitles,
  Film,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { MediaItem, MediaType, PlayableContent } from "@/types";
import { useWatchlist } from "@/context/WatchlistContext";

interface VideoPlayerProps {
  media: MediaItem;
  playable?: PlayableContent | null;
  initialTime?: number;
}

export default function VideoPlayer({ media, playable, initialTime = 0 }: VideoPlayerProps) {
  const router = useRouter();
  const { saveProgress } = useWatchlist();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [duration, setDuration] = useState<number>(playable?.duration_seconds || 0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const title = media.title || media.name || "Movie";
  const contentType: MediaType = media.media_type || (media.first_air_date ? "tv" : "movie");

  // Trailer key fallback if not public domain
  const trailerKey =
    playable?.trailer_key ||
    media.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ||
    media.videos?.results?.[0]?.key;

  // Formatting seconds into hh:mm:ss or mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Reset controls hide timer on activity
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3500);
    }
  }, [isPlaying]);

  // Video event handlers
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  }, [duration]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  }, []);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      triggerControls();

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          handlePlayPause();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          handleSkip(-10);
          break;
        case "arrowright":
          e.preventDefault();
          handleSkip(10);
          break;
        case "arrowup":
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.min(1, volume + 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
            setIsMuted(false);
          }
          break;
        case "arrowdown":
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.max(0, volume - 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
            if (nextVol === 0) setIsMuted(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPlaying,
    volume,
    isMuted,
    duration,
    triggerControls,
    handlePlayPause,
    handleSkip,
    toggleFullscreen,
    toggleMute,
  ]);

  // Save progress periodically (every 5 seconds of playback)
  useEffect(() => {
    if (!playable || !isPlaying) return;

    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        saveProgress({
          content_id: media.id,
          content_type: contentType,
          title,
          poster_path: media.poster_path,
          backdrop_path: media.backdrop_path,
          progress_seconds: Math.floor(videoRef.current.currentTime),
          duration_seconds: Math.floor(duration),
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, media, contentType, title, playable, saveProgress]);

  // Initial resume jump
  useEffect(() => {
    if (initialTime > 0 && videoRef.current) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerControls}
      onClick={triggerControls}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. PLAYABLE AUTHORIZED VIDEO STREAM */}
      {playable ? (
        <>
          <video
            ref={videoRef}
            src={playable.video_url}
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                // Calculate buffered
                if (videoRef.current.buffered.length > 0) {
                  const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
                  setBuffered((end / (videoRef.current.duration || 1)) * 100);
                }
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || playable.duration_seconds || 0);
                setIsLoading(false);
                if (initialTime > 0) {
                  videoRef.current.currentTime = initialTime;
                }
                videoRef.current.play().catch(() => setIsPlaying(false));
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full object-contain cursor-pointer"
            onClick={handlePlayPause}
          />

          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-16 h-16 border-4 border-zinc-600 border-t-[#E50914] rounded-full animate-spin" />
            </div>
          )}

          {/* Stream Error Notice */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-[#E50914] mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Video Stream Unavailable</h3>
              <p className="text-sm text-zinc-400 max-w-md mb-6">
                Unable to load this video source at this time. Please check your connection or return to browse other titles.
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold text-sm"
              >
                Go Back
              </button>
            </div>
          )}

          {/* Subtitles Overlay Simulation */}
          {showSubtitles && isPlaying && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-20 text-center max-w-2xl px-4">
              <span className="bg-black/75 text-white font-medium text-base sm:text-xl px-3 py-1 rounded shadow-md">
                [English Audio & Dialogue Captions Active]
              </span>
            </div>
          )}

          {/* Top Control Bar */}
          <div
            className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-40 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-zinc-800 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-white font-bold text-base sm:text-xl drop-shadow line-clamp-1">
                  {title}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="text-emerald-400 font-medium">1080p Ultra HD</span>
                  <span>•</span>
                  <span>{playable.license_note}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full text-xs text-zinc-300 border border-zinc-800">
              <Film className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Full Playable Film</span>
            </div>
          </div>

          {/* Center Play/Pause Large Indicator on Click */}
          {!isPlaying && !isLoading && (
            <div
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-20"
            >
              <div className="w-20 h-20 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Player Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6 pt-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-40 space-y-2 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Scrubber / Progress Bar */}
            <div className="relative group/scrubber py-2 cursor-pointer">
              {/* Buffer Bar */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-700 transition-all duration-300"
                  style={{ width: `${buffered}%` }}
                />
              </div>

              {/* Played Bar */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full overflow-hidden pointer-events-none">
                <div
                  className="h-full bg-[#E50914]"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              {/* Interactive Range Input */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="relative w-full h-1.5 opacity-0 cursor-pointer z-10"
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white pt-1">
              {/* Left: Play, Skips, Volume, Timestamp */}
              <div className="flex items-center space-x-3 sm:space-x-5">
                <button
                  onClick={handlePlayPause}
                  className="hover:text-[#E50914] transition-colors p-1"
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                <button
                  onClick={() => handleSkip(-10)}
                  className="text-zinc-300 hover:text-white transition-colors"
                  title="Rewind 10s (Left Arrow)"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="text-zinc-300 hover:text-white transition-colors"
                  title="Forward 10s (Right Arrow)"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Volume slider */}
                <div className="flex items-center space-x-2 group/vol">
                  <button onClick={toggleMute} className="text-zinc-300 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-red-500" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 h-1 bg-zinc-700 accent-[#E50914] cursor-pointer"
                  />
                </div>

                {/* Timestamp */}
                <div className="text-xs sm:text-sm font-mono text-zinc-300 select-none">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-zinc-500 mx-1">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right: Speed, Subtitles, Fullscreen */}
              <div className="flex items-center space-x-3 sm:space-x-4 relative">
                {/* Speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-xs sm:text-sm font-bold px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title="Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-10 right-0 bg-[#181818] border border-zinc-800 rounded shadow-2xl py-1 w-24 text-center z-50 text-xs">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedSelect(spd)}
                          className={`w-full py-1.5 hover:bg-zinc-700 block transition-colors ${
                            playbackSpeed === spd ? "text-[#E50914] font-bold" : "text-zinc-300"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitles toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`p-1 transition-colors ${
                    showSubtitles ? "text-[#E50914]" : "text-zinc-400 hover:text-white"
                  }`}
                  title="Subtitles / Closed Captions"
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-[#E50914] transition-colors p-1"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 2. LICENSED COMMERCIAL CONTENT - OFFICIAL TRAILER PREVIEW WITH EXPLICIT COPYRIGHT COMPLIANCE NOTICE */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between z-30">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-zinc-800 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-right">
              <h2 className="text-white font-bold text-base sm:text-xl">{title}</h2>
              <span className="text-xs text-amber-400 font-medium">Official Studio Trailer & Preview</span>
            </div>
          </div>

          {/* Main Trailer Player Area */}
          <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-black relative">
            {trailerKey ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                title={`${title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-900">
                <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Streaming Preview Unavailable</h3>
                <p className="text-sm text-zinc-400 max-w-md">
                  No public preview or trailer is currently linked for {title}. Please check back later.
                </p>
              </div>
            )}
          </div>

          {/* Strict Copyright & Transparency Notice */}
          <div className="mt-4 max-w-3xl w-full bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 sm:p-4 text-xs text-zinc-400 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-none mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-0.5">Commercial Streaming Rights Notice</p>
              <p className="leading-relaxed">
                Full-length streaming for this title is subject to commercial distribution agreements. CineFlix operates under strict copyright compliance and streams authorized public-domain titles (e.g.{" "}
                <Link href="/watch?id=88801&type=movie" className="text-[#E50914] underline hover:text-white">
                  Tears of Steel
                </Link>
                ,{" "}
                <Link href="/watch?id=88802&type=movie" className="text-[#E50914] underline hover:text-white">
                  Sintel
                </Link>
                ,{" "}
                <Link href="/watch?id=88803&type=movie" className="text-[#E50914] underline hover:text-white">
                  Big Buck Bunny
                </Link>
                ) and official studio promotional trailers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
