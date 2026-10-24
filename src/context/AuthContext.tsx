"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { user?: User } | null) => { if (active) setUserState(data?.user ?? null); })
      .catch(() => { if (active) setUserState(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function setUser(newUser: User | null) {
    setUserState(newUser);
  }

  function logout() {
    setUser(null);
    void fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
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
