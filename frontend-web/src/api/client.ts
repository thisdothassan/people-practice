import type { ApiError } from "./types";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

let tokenGetter: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(response.statusText || "Request failed");
  }

  if (!response.ok) {
    const err = data as ApiError;
    throw new Error(err.message || response.statusText || "Request failed");
  }

  return data as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = tokenGetter?.() ?? null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    onUnauthorized?.();
    const err = new Error("Unauthorized") as Error & { status: number };
    err.status = 401;
    throw err;
  }

  if (response.status === 403) {
    const err = new Error(
      "You do not have permission to access this resource.",
    ) as Error & { status: number };
    err.status = 403;
    throw err;
  }

  return handleResponse<T>(response);
}
