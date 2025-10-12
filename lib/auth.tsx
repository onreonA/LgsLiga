"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing auth...");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log("✅ Session found:", session.user.email);
          setUser(session.user);

          // Fetch profile with timeout
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("❌ Profile fetch error:", profileError);
              // Profile yoksa bile user'ı set et
              setProfile(null);
            } else {
              console.log("✅ Profile loaded:", profileData?.role);
              setProfile(profileData);
            }
          } catch (profileError) {
            console.error("❌ Profile fetch exception:", profileError);
            setProfile(null);
          }
        } else {
          console.log("ℹ️ No session found");
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state changed:", event, session?.user?.email);

      // SIGNED_IN event'inde loading'i kapatma, sadece diğer durumlarda
      if (event !== "SIGNED_IN") {
        setLoading(true);
      }

      if (session?.user) {
        console.log("👤 Setting user:", session.user.email);
        setUser(session.user);

        // Fetch profile
        try {
          console.log("🔍 Fetching profile for:", session.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("❌ Profile fetch error:", profileError);
            setProfile(null);
          } else {
            console.log("✅ Profile loaded:", profileData?.role);
            setProfile(profileData);
          }
        } catch (profileError) {
          console.error("❌ Profile fetch exception:", profileError);
          setProfile(null);
        }
      } else {
        console.log("👤 Clearing user and profile");
        setUser(null);
        setProfile(null);
      }

      // SIGNED_IN event'inde loading'i kapatma
      if (event !== "SIGNED_IN") {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    // This is a placeholder - actual sign in happens elsewhere
    console.log("signInWithEmail called:", email);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  };

  const value = {
    user,
    profile,
    loading,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
