// @/app/(_service)/(_types)/menu-types.ts

import { PageData } from "./page-types";

/**
 * Menu category structure
 * Represents a top-level navigation category with nested pages
 */
export interface MenuCategory {
  title: string;
  href?: string;
  order?: number;
  pages: PageData[];
}

/**
 * GitHub API rate limit information
 * Exported for reuse across client and server components
 * 
 * Note: This is a duplicate export for convenience.
 * Primary definition is in fetch-menu.ts
 */
export interface RateLimitInfo {
  remaining: number;        // Remaining requests in current window
  total: number;            // Total requests allowed per window (typically 5000)
  used: number;             // Requests used in current window
  resetAt: string;          // ISO 8601 timestamp when limit resets
  percentUsed: number;      // Percentage of limit consumed (0-100)
  willResetIn: string;      // Human-readable: "in 45 minutes" or "in 1-2 hours"
}
