import { apiRequest } from "./client";
import type { ApiResponse, Order } from "./types";

export async function getOrders(): Promise<Order[]> {
  const res = await apiRequest<ApiResponse<Order[]>>("/api/orders");
  return res.data;
}

export async function getOrder(id: number): Promise<Order> {
  const res = await apiRequest<ApiResponse<Order>>(`/api/orders/${id}`);
  return res.data;
}

export async function createOrder(
  data: Record<string, unknown>,
): Promise<Order> {
  const res = await apiRequest<ApiResponse<Order>>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}
