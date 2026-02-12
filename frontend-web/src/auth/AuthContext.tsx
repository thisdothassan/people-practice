import { createContext } from "react";
import type { AuthContextValue } from "./types";

const STORAGE_KEY = "people-practice-auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function getStoredAuth(): {
  user: AuthContextValue["user"];
  token: string | null;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { user, token } = JSON.parse(raw);
    if (!token || !user) return null;
    return { user, token };
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function storeAuth(user: AuthContextValue["user"], token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}
