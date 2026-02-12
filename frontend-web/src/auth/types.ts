import type { User } from "../api/types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}
