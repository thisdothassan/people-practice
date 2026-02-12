import { apiRequest } from "./client";
import type { ApiResponse, Manager } from "./types";

export async function getManagers(): Promise<Manager[]> {
  const res = await apiRequest<ApiResponse<Manager[]>>("/api/managers");
  return res.data;
}

export async function getManager(id: number): Promise<Manager> {
  const res = await apiRequest<ApiResponse<Manager>>(`/api/managers/${id}`);
  return res.data;
}

export interface CreateManagerPayload {
  email: string;
  password: string;
  type: "super" | "location" | "product";
  location_ids?: number[];
  product_ids?: number[];
}

export async function createManager(
  payload: CreateManagerPayload,
): Promise<Manager> {
  const body: CreateManagerPayload = {
    email: payload.email,
    password: payload.password,
    type: payload.type,
  };

  if (payload.type === "location" && payload.location_ids?.length) {
    body.location_ids = payload.location_ids;
  }

  if (payload.type === "product" && payload.product_ids?.length) {
    body.product_ids = payload.product_ids;
  }

  const res = await apiRequest<ApiResponse<Manager>>("/api/managers", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}
