
'use client';

import { createContext, useContext, useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async (email: string) => {
    // Basit demo giriş
    setUser({ email });
    setProfile({ full_name: 'Demo Kullanıcı', role: 'student' });
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  };

  const value = {
    user,
    profile,
    loading,
    signInWithEmail,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
