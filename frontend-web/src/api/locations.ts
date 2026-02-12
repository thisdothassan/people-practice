import { apiRequest } from "./client";
import type { ApiResponse, Location } from "./types";

export async function getLocations(): Promise<Location[]> {
  const res = await apiRequest<ApiResponse<Location[]>>("/api/locations");
  return res.data;
}

export async function createLocation(data: {
  name: string;
  code: string;
  country: string;
}): Promise<Location> {
  const res = await apiRequest<ApiResponse<Location>>("/api/locations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}
