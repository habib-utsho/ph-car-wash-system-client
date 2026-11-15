import type { TService } from "@/types";
import { API_BASE_URL } from "./config";

// Small helper functions that ask the Express API for services.

// GET calls to the Express API.
// Used from Server Components only (the API URL is not exposed to the browser).

// Returns every service from the backend.
// The backend currently has no branch filter or owner filter, so callers filter.
export async function getServices(query: string): Promise<TService[]> {
  const res = await fetch(`${API_BASE_URL}/services?${query}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Could not load services (status ${res.status}).`);
  }

  const body = await res.json();
  return body.data ?? [];
}

// Returns one service by its id.
// Returns null when the service does not exist.
export async function getServiceById(id: string): Promise<TService | null> {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Could not load the service (status ${res.status}).`);
  }

  const body = await res.json();
  return body.data;
}
