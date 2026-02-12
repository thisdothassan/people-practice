import { apiRequest } from "./client";
import type { ApiResponse, Customer } from "./types";

export async function getCustomers(): Promise<Customer[]> {
  const res = await apiRequest<ApiResponse<Customer[]>>("/api/customers");
  return res.data;
}

export async function getCustomer(id: number): Promise<Customer> {
  const res = await apiRequest<ApiResponse<Customer>>(`/api/customers/${id}`);
  return res.data;
}

export async function createCustomer(
  data: Record<string, unknown>,
): Promise<Customer> {
  const res = await apiRequest<ApiResponse<Customer>>("/api/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateCustomer(
  id: number,
  data: Record<string, unknown>,
): Promise<Customer> {
  const res = await apiRequest<ApiResponse<Customer>>(`/api/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}
