"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Bookmark,
  Clock,
  Trash2,
  LogOut,
  CheckCircle2,
  Edit2,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { watchlist, watchHistory, clearHistory, removeFromHistory } = useWatchlist();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "Cinephile Guest");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || AVATAR_OPTIONS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      username: username.trim() || user?.username,
      avatar_url: selectedAvatar,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const totalWatchMinutes = watchHistory.reduce(
    (acc, cur) => acc + Math.floor(cur.progress_seconds / 60),
    0
  );

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Profile Card Header */}
      <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <img
                src={selectedAvatar}
                alt="Profile Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#E50914] shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-black" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user?.username || "Guest Cinephile"}
                </h1>
                <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-[#E50914]/40">
                  {user ? "Premium Member" : "Guest Mode"}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{user?.email || "guest@cineflix.stream"}</p>
              <p className="text-xs text-zinc-500">
                Streaming Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-zinc-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : null}

            {user ? (
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-red-950/60 text-red-400 hover:text-red-300 text-xs font-bold px-4 py-2.5 rounded-lg border border-zinc-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-zinc-800 space-y-4 animate-in fade-in duration-200"
          >
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">
                Display Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full sm:w-72 bg-black border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
                Choose Profile Avatar
              </label>
              <div className="flex items-center space-x-3">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedAvatar === av
                        ? "border-[#E50914] scale-105 shadow-md shadow-[#E50914]/40"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av} alt="Avatar Option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="flex items-center space-x-1.5 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-[#E50914]/10 text-[#E50914] flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{watchlist.length}</p>
            <p className="text-xs text-zinc-400">Watchlist Titles</p>
          </div>
        </div>

        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{watchHistory.length}</p>
            <p className="text-xs text-zinc-400">Watched Titles</p>
          </div>
        </div>

        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{totalWatchMinutes}m</p>
            <p className="text-xs text-zinc-400">Streaming Time</p>
          </div>
        </div>
      </div>

      {/* Watch History List */}
      <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg font-bold text-white">Viewing History</h2>
          </div>

          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-zinc-400 hover:text-red-400 flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {watchHistory.length > 0 ? (
          <div className="space-y-3">
            {watchHistory.map((item) => {
              const percent =
                item.duration_seconds > 0
                  ? Math.round((item.progress_seconds / item.duration_seconds) * 100)
                  : 0;

              return (
                <div
                  key={`${item.content_id}-${item.content_type}`}
                  className="bg-black/50 border border-zinc-800/80 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-16 sm:w-20 aspect-video rounded overflow-hidden bg-zinc-800 flex-none">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.backdrop_path || item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-400">
                        Watched {Math.floor(item.progress_seconds / 60)} min ({percent}% completed)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-none">
                    <Link
                      href={`/watch?id=${item.content_id}&type=${item.content_type}&t=${item.progress_seconds}`}
                      className="px-3 py-1.5 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-bold rounded transition-colors"
                    >
                      Resume
                    </Link>
                    <button
                      onClick={() => removeFromHistory(item.content_id, item.content_type)}
                      className="text-zinc-500 hover:text-zinc-300 p-1"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm">
            You haven't watched any titles yet. Start streaming to build your viewing history!
          </div>
        )}
      </div>
    </div>
  );
}
