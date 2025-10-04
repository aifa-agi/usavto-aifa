// @/app/@right/(_service)/(_types)/image-upload-types.ts

// app/@right/(_service)/(_types)/image-upload-types.ts
// Comments in English: Type definitions for image upload API

// ==================== Image Upload Types ====================

/**
 * All supported image types for upload
 * Matches appConfig structure
 */
export type ImageType =
  | "logo"
  | "ogImage"
  | "loading-dark"
  | "loading-light"
  | "notFound-dark"
  | "notFound-light"
  | "error500-dark"
  | "error500-light"
  | "homePage-dark"
  | "homePage-light"
  | "chatbot-dark"
  | "chatbot-light";

/**
 * Mapping of image types to their file paths in public folder
 */
export const IMAGE_TYPE_PATHS: Record<ImageType, string> = {
  "logo": "app-config-images/logo.png",
  "ogImage": "app-config-images/og-image.jpg",
  "loading-dark": "app-config-images/loading-dark.svg",
  "loading-light": "app-config-images/loading-light.svg",
  "notFound-dark": "app-config-images/not-found-dark.svg",
  "notFound-light": "app-config-images/not-found-light.svg",
  "error500-dark": "app-config-images/error500-dark.svg",
  "error500-light": "app-config-images/error500-light.svg",
  "homePage-dark": "app-config-images/homepage-dark.svg",
  "homePage-light": "app-config-images/homepage-light.svg",
  "chatbot-dark": "app-config-images/chatbot-dark.svg",
  "chatbot-light": "app-config-images/chatbot-light.svg",
};

/**
 * Allowed file extensions per image type
 */
export const ALLOWED_EXTENSIONS: Record<ImageType, string[]> = {
  "logo": [".png", ".jpg", ".jpeg"],
  "ogImage": [".jpg", ".jpeg", ".png"],
  "loading-dark": [".svg", ".png"],
  "loading-light": [".svg", ".png"],
  "notFound-dark": [".svg", ".png"],
  "notFound-light": [".svg", ".png"],
  "error500-dark": [".svg", ".png"],
  "error500-light": [".svg", ".png"],
  "homePage-dark": [".svg", ".png"],
  "homePage-light": [".svg", ".png"],
  "chatbot-dark": [".svg", ".png"],
  "chatbot-light": [".svg", ".png"],
};

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Minimum dimensions for logo (required for icon generation)
 */
export const MIN_LOGO_DIMENSIONS = {
  width: 512,
  height: 512,
};

/**
 * Recommended dimensions for OG image
 */
export const RECOMMENDED_OG_DIMENSIONS = {
  width: 1200,
  height: 630,
};

// ==================== API Response Types ====================

/**
 * Operation status codes for image upload
 */
export enum ImageUploadStatus {
  SUCCESS = "SUCCESS",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FORMAT = "INVALID_FORMAT",
  DIMENSIONS_ERROR = "DIMENSIONS_ERROR",
  FILESYSTEM_ERROR = "FILESYSTEM_ERROR",
  GITHUB_API_ERROR = "GITHUB_API_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Error codes for troubleshooting
 */
export enum ImageUploadErrorCode {
  NO_FILE_PROVIDED = "NO_FILE_PROVIDED",
  INVALID_IMAGE_TYPE = "INVALID_IMAGE_TYPE",
  FILE_EXTENSION_NOT_ALLOWED = "FILE_EXTENSION_NOT_ALLOWED",
  FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED",
  LOGO_TOO_SMALL = "LOGO_TOO_SMALL",
  IMAGE_PROCESSING_FAILED = "IMAGE_PROCESSING_FAILED",
  FILE_WRITE_FAILED = "FILE_WRITE_FAILED",
  GITHUB_TOKEN_INVALID = "GITHUB_TOKEN_INVALID",
  GITHUB_API_UNAVAILABLE = "GITHUB_API_UNAVAILABLE",
  ICON_GENERATION_FAILED = "ICON_GENERATION_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
}

/**
 * Response from POST /api/app-config-upload
 * For regular image uploads
 */
export interface ImageUploadResponse {
  status: ImageUploadStatus;
  message: string;
  error?: string;
  errorCode?: ImageUploadErrorCode;
  environment: "development" | "production";
  uploadedPath?: string;
  imageType?: ImageType;
}

/**
 * Response from POST /api/app-config-upload-with-icons
 * For logo upload with automatic icon generation
 */
export interface ImageUploadWithIconsResponse {
  status: ImageUploadStatus;
  message: string;
  error?: string;
  errorCode?: ImageUploadErrorCode;
  environment: "development" | "production";
  uploadedPath?: string;
  generatedIcons?: {
    favicon: string;
    icon32: string;
    icon48: string;
    icon192: string;
    icon512: string;
    appleTouch: string;
  };
}

/**
 * Validation result for uploaded file
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: ImageUploadErrorCode;
}
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