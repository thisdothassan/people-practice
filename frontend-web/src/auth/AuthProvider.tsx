import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getStoredAuth, storeAuth, clearStoredAuth } from "./AuthContext";
import { setTokenGetter, setOnUnauthorized } from "../api/client";
import type { AuthContextValue } from "./types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((u: AuthContextValue["user"], t: string) => {
    setUser(u);
    setToken(t);
    storeAuth(u, t);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
  }, []);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      window.location.href = "/login";
    });
  }, [logout]);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
