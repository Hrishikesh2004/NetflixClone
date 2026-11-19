"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Eye, EyeOff, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password || !username) {
      setErrorMessage("Please complete all registration fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20 select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#141414] to-black opacity-90 z-0" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-15 filter blur-sm scale-105 z-0" />

      <div className="relative z-10 w-full max-w-md bg-black/85 border border-zinc-800 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-9 h-9 bg-[#E50914] rounded-lg flex items-center justify-center shadow-lg shadow-[#E50914]/40">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-3xl font-black tracking-wider text-[#E50914]">
              CINE<span className="text-white">FLIX</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-zinc-400">
            Join CineFlix to enjoy unlimited streaming queues, 4K video, and recommendations.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 text-xs p-3 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-none mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cinelover99"
                required
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#f40612] text-white font-bold text-sm py-3 rounded-lg shadow-lg shadow-[#E50914]/30 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
