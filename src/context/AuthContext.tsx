"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearLocalSession, getLocalSession } from "@/lib/auth";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (active) { setUserState(getLocalSession()); setLoading(false); }
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, []);

  function setUser(newUser: User | null) {
    setUserState(newUser);
    if (newUser) localStorage.setItem("happen-session", JSON.stringify(newUser));
    else clearLocalSession();
  }

  function logout() {
    setUser(null);
    clearLocalSession();
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
