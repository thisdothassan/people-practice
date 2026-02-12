import type { User } from "../api/types";

export function isCustomer(user: User | null): boolean {
  return user?.role === "customer";
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role === "admin" && user?.type === "super";
}

export function isScopedAdmin(user: User | null): boolean {
  return (
    user?.role === "admin" &&
    (user?.type === "location" || user?.type === "product")
  );
}

export function canAccessManagers(user: User | null): boolean {
  return isAdmin(user);
}

export function canAccessLocations(user: User | null): boolean {
  return (
    user?.role === "admin" &&
    (user?.type === "super" || user?.type === "location")
  );
}

export function canAccessCustomers(user: User | null): boolean {
  return (
    user?.role === "admin" &&
    (user?.type === "super" || user?.type === "location")
  );
}
