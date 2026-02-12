// Shared types for API responses

export interface User {
  id: number;
  email: string;
  role: "customer" | "admin";
  type?: "super" | "location" | "product";
  scopes?: string[] | number[];
}

export interface Customer {
  id: number;
  email: string;
  location_id?: number;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  customer_id?: number;
  customer?: Customer;
  location_id?: number;
  location?: Location;
  status?: string;
  total?: number;
  [key: string]: unknown;
}

export interface Manager {
  id: number;
  email: string;
  type?: string;
  scopes?: string[] | number[];
  [key: string]: unknown;
}

export interface Location {
  id: number;
  name?: string;
  code?: string;
  country?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}
