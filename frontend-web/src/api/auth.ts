import { apiRequest } from "./client";
import type { AuthResponse } from "./types";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  location_id?: number;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const body = {
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    first_name: payload.first_name,
    last_name: payload.last_name,
    location_id: payload.location_id,
  };

  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
