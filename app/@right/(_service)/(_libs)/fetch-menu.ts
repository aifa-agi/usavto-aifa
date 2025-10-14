// @/app/(_service)/(_libs)/fetch-menu.ts

import { MenuCategory } from "../(_types)/menu-types";

/**
 * GitHub API rate limit information
 * Provides visibility into API usage for admin users
 */
export interface RateLimitInfo {
  remaining: number;        // Remaining requests in current window
  total: number;            // Total requests allowed per window
  used: number;             // Requests used in current window
  resetAt: string;          // ISO 8601 timestamp when limit resets
  percentUsed: number;      // Percentage of limit consumed (0-100)
  willResetIn: string;      // Human-readable time until reset
}

/**
 * Extended response type that matches server response structure
 * Includes rate limit tracking for GitHub API calls
 */
export interface FetchMenuResponse {
  status: "ok" | "error";
  categories?: MenuCategory[];
  error?: string;
  source?: "Local FileSystem" | "GitHub API";
  environment?: "development" | "production";
  serverMessage?: string;
  rateLimitInfo?: RateLimitInfo;     // Present when source is GitHub API
  userRole?: string;                 // User's role (for debugging)
  isPrivileged?: boolean;            // Whether user has privileged access
}

/**
 * Fetch menu categories from API with full error and rate limit tracking
 * 
 * Flow:
 * 1. POST request to /api/menu
 * 2. Server determines data source based on user role
 * 3. If GitHub API used, includes rate limit info in response
 * 4. Transform server response to client format
 * 
 * @returns {Promise<FetchMenuResponse>} Response with categories and metadata
 */
export async function fetchMenuCategories(): Promise<FetchMenuResponse> {
  try {
    const res = await fetch("/api/menu", {
      method: "POST",
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
        rateLimitInfo: data.rateLimitInfo,  // Include rate limit even on error
        userRole: data.userRole,
        isPrivileged: data.isPrivileged,
      };
    }

    // Successful response with source and rate limit tracking
    return {
      status: "ok",
      categories: data.categories || [],
      source: data.source,
      environment: data.environment,
      serverMessage: data.message,
      rateLimitInfo: data.rateLimitInfo,  // Present when GitHub API used
      userRole: data.userRole,
      isPrivileged: data.isPrivileged,
    };
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
