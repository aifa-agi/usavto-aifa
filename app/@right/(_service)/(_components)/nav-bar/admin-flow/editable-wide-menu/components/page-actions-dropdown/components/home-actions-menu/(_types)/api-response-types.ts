// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/api-response-types.ts
// Comments in English: Type definitions for AppConfig API responses

// ==================== AppConfig Update Types ====================

/**
 * Data structure representing editable AppConfig fields
 */
export interface AppConfigUpdateData {
  name: string;
  short_name: string;
  description: string;
  lang: string;
  logo: string;
  chatBrand: string;
  siteUrl: string;
}

/**
 * Response from GET /api/app-config-update
 * Returns current config values from file
 */
export interface AppConfigReadResponse {
  success: boolean;
  message: string;
  config?: AppConfigUpdateData;
  source?: "Local FileSystem" | "GitHub API";
  environment?: "development" | "production";
}

// ==================== AppConfig Persist Types ====================

/**
 * Operation status codes for persist operations
 */
export enum AppConfigOperationStatus {
  SUCCESS = "SUCCESS",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  FILESYSTEM_ERROR = "FILESYSTEM_ERROR",
  GITHUB_API_ERROR = "GITHUB_API_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Error codes for troubleshooting
 */
export enum AppConfigErrorCode {
  INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
  FILE_WRITE_FAILED = "FILE_WRITE_FAILED",
  GITHUB_TOKEN_INVALID = "GITHUB_TOKEN_INVALID",
  GITHUB_API_UNAVAILABLE = "GITHUB_API_UNAVAILABLE",
  NETWORK_ERROR = "NETWORK_ERROR",
}

/**
 * Response from POST /api/app-config-update/persist
 * Returns result of write operation
 */
export interface AppConfigPersistResponse {
  status: AppConfigOperationStatus;
  message: string;
  error?: string;
  errorCode?: AppConfigErrorCode;
  environment: "development" | "production";
}
