"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, LogOut, Menu, X, Bookmark, Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isConfigured } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E50914] rounded-lg flex items-center justify-center shadow-lg shadow-[#E50914]/40 transform group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#E50914] font-sans">
              CINE<span className="text-white">FLIX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Interactive Search Bar */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Titles, people, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-black/80 border border-zinc-700 text-white text-xs sm:text-sm rounded-full pl-9 pr-8 py-1.5 focus:outline-none focus:border-[#E50914] w-48 sm:w-64 transition-all duration-300"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-300 hover:text-white p-1.5 rounded-full hover:bg-zinc-800/50 transition-colors"
                title="Search movies and series"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick link to search page on small mobile */}
          <Link
            href="/search"
            className="md:hidden text-zinc-300 hover:text-white p-1.5"
            title="Browse & Search"
          >
            <span className="sr-only">Search</span>
          </Link>

          {/* Watchlist quick shortcut */}
          <Link
            href="/my-list"
            className="hidden sm:flex text-zinc-300 hover:text-white p-1.5 rounded-full hover:bg-zinc-800/50 transition-colors"
            title="My Watchlist"
          >
            <Bookmark className="w-5 h-5" />
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-[#E50914] transition-all"
            >
              {/* Profile Avatar */}
              <img
                src={
                  user?.avatar_url ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                }
                alt={user?.username || "Profile"}
                className="w-8 h-8 rounded-md object-cover border border-zinc-700"
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-56 bg-[#181818] border border-zinc-800 rounded-lg shadow-2xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-white font-medium truncate">
                    {user?.username || "Guest User"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user?.email || "Guest Session"}
                  </p>
                  {!isConfigured && (
                    <span className="inline-flex items-center text-[10px] bg-zinc-800 text-amber-400 px-1.5 py-0.5 rounded mt-1">
                      Local Guest Mode
                    </span>
                  )}
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>Account & Profile</span>
                </Link>

                <Link
                  href="/my-list"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  <span>My Watchlist</span>
                </Link>

                <div className="border-t border-zinc-800 my-1"></div>

                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                      router.push("/");
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-zinc-800/60 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of CineFlix</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-white bg-[#E50914] hover:bg-[#f40612] rounded mx-2 my-1 justify-center font-medium transition-colors"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-300 hover:text-white p-1.5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-b border-zinc-800 px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search CineFlix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#E50914]"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            Profile & History
          </Link>
        </div>
      )}
    </header>
  );
}
