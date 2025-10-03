// @/app/(_service)/(_libs)/fetch-menu.ts

import { MenuCategory } from "../(_types)/menu-types";

/**
 * Extended response type that matches server response structure
 * Step 1: Define response interface matching server's ReadMenuResponse
 */
export interface FetchMenuResponse {
  status: "ok" | "error";
  categories?: MenuCategory[];
  error?: string;
  source?: "Local FileSystem" | "GitHub API";
  environment?: "development" | "production";
  serverMessage?: string;
}

/**
 * Fetch menu categories from API with full error and source tracking
 * Step 2: Request menu data from server and transform response format
 * Step 3: Preserve source and environment information from server
 * Step 4: Handle both successful and error responses with proper typing
 */
export async function fetchMenuCategories(): Promise<FetchMenuResponse> {
  try {
    const res = await fetch("/api/menu", {
      method: "POST", // Note: server uses POST, not GET
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    // Parse JSON response before checking status
    const data = await res.json();

    // Server returns success:false for errors
    if (!res.ok || !data.success) {
      return {
        status: "error",
        error: data.message || `HTTP ${res.status}: Failed to fetch menu`,
        source: data.source,
        environment: data.environment,
        serverMessage: data.message,
      };
    }

    // Successful response with source tracking
    return {
      status: "ok",
      categories: data.categories || [],
      source: data.source,
      environment: data.environment,
      serverMessage: data.message,
    };
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
