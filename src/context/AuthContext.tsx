"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const DEFAULT_GUEST: UserProfile = {
  id: "guest-user-001",
  email: "guest@cineflix.stream",
  username: "Cinephile Guest",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  continueAsGuest: () => {},
  updateProfile: async () => ({}),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Local Guest mode fallback
      setIsConfigured(false);
      const savedUser = localStorage.getItem("cineflix_guest_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(DEFAULT_GUEST);
        }
      } else {
        setUser(DEFAULT_GUEST);
      }
      setLoading(false);
      return;
    }

    setIsConfigured(true);

    // Fetch active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        const savedGuest = localStorage.getItem("cineflix_guest_user");
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch {
            setUser(null);
          }
        }
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        const basicProfile: UserProfile = {
          id: userId,
          email,
          username: email.split("@")[0],
          avatar_url: DEFAULT_GUEST.avatar_url,
          created_at: new Date().toISOString(),
        };
        setUser(basicProfile);
      } else {
        setUser({
          id: data.id,
          email,
          username: data.username || email.split("@")[0],
          avatar_url: data.avatar_url || DEFAULT_GUEST.avatar_url,
          created_at: data.created_at,
        });
      }
    } catch {
      setUser({
        id: userId,
        email,
        username: email.split("@")[0],
        avatar_url: DEFAULT_GUEST.avatar_url,
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Local fallback simulation
      const mockProfile: UserProfile = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        email,
        username: email.split("@")[0],
        avatar_url: DEFAULT_GUEST.avatar_url,
        created_at: new Date().toISOString(),
      };
      setUser(mockProfile);
      localStorage.setItem("cineflix_guest_user", JSON.stringify(mockProfile));
      return {};
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    username?: string
  ): Promise<{ error?: string }> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Local fallback simulation
      const mockProfile: UserProfile = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        email,
        username: username || email.split("@")[0],
        avatar_url: DEFAULT_GUEST.avatar_url,
        created_at: new Date().toISOString(),
      };
      setUser(mockProfile);
      localStorage.setItem("cineflix_guest_user", JSON.stringify(mockProfile));
      return {};
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  };

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("cineflix_guest_user");
    setUser(null);
  };

  const continueAsGuest = () => {
    setUser(DEFAULT_GUEST);
    localStorage.setItem("cineflix_guest_user", JSON.stringify(DEFAULT_GUEST));
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    if (!user) return { error: "No user signed in" };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    const supabase = getSupabaseBrowserClient();
    if (supabase && isConfigured) {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: updates.username,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) return { error: error.message };
    } else {
      localStorage.setItem("cineflix_guest_user", JSON.stringify(updatedUser));
    }

    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
