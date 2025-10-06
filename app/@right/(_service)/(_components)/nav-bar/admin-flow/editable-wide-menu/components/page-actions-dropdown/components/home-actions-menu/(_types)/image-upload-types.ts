// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types.ts

/**
 * Comments in English: Type definitions and constants for image upload system
 * Supports dynamic file extensions for all image types
 */

import type { ImageFormat, RegularImageType, AllImageTypes } from "@/config/appConfig";

// ============================================
// RE-EXPORT TYPES FROM appConfig
// ============================================

export type { ImageFormat, RegularImageType, AllImageTypes };

/**
 * Comments in English: Image type for the upload system
 * This includes "logo" which is handled by separate endpoint
 */
export type ImageType = AllImageTypes;

// ============================================
// UPLOAD STATUS AND ERROR CODES
// ============================================

export enum ImageUploadStatus {
  SUCCESS = "success",
  ERROR = "error",
  VALIDATION_ERROR = "validation_error",
  PARTIAL_SUCCESS = "partial_success", // Saved locally but GitHub failed
}

export enum ImageUploadErrorCode {
  NO_FILE_PROVIDED = "NO_FILE_PROVIDED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_IMAGE_DIMENSIONS = "INVALID_IMAGE_DIMENSIONS",
  FILESYSTEM_ERROR = "FILESYSTEM_ERROR",
  GITHUB_ERROR = "GITHUB_ERROR",
  GITHUB_CONFIG_MISSING = "GITHUB_CONFIG_MISSING",
  NETWORK_ERROR = "NETWORK_ERROR",
  ICON_GENERATION_FAILED = "ICON_GENERATION_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// ============================================
// IMAGE TYPE CONFIGURATION
// ============================================

/**
 * Comments in English: Base names for each image type (without extension)
 * Used to construct dynamic paths with actual file extensions
 */
export const IMAGE_TYPE_NAMES: Record<ImageType, string> = {
  logo: "logo",
  ogImage: "og-image",
  "loading-dark": "loading-dark",
  "loading-light": "loading-light",
  "notFound-dark": "not-found-dark",
  "notFound-light": "not-found-light",
  "error500-dark": "error500-dark",
  "error500-light": "error500-light",
  "homePage-dark": "homepage-dark",
  "homePage-light": "homepage-light",
  "chatbot-dark": "chatbot-dark",
  "chatbot-light": "chatbot-light",
};

/**
 * Comments in English: Directory where all app-config images are stored
 */
export const IMAGE_UPLOAD_DIR = "app-config-images";

/**
 * Comments in English: Allowed file extensions for each image type
 * Determines what formats user can upload via file picker
 */
export const ALLOWED_EXTENSIONS: Record<ImageType, string[]> = {
  // Logo and OG image - raster formats preferred
  logo: [".png", ".jpg", ".jpeg", ".webp"],
  ogImage: [".png", ".jpg", ".jpeg", ".webp"],
  
  // Illustrations - both vector and raster
  "loading-dark": [".svg", ".png", ".webp"],
  "loading-light": [".svg", ".png", ".webp"],
  "notFound-dark": [".svg", ".png", ".webp"],
  "notFound-light": [".svg", ".png", ".webp"],
  "error500-dark": [".svg", ".png", ".webp"],
  "error500-light": [".svg", ".png", ".webp"],
  "homePage-dark": [".svg", ".png", ".webp"],
  "homePage-light": [".svg", ".png", ".webp"],
  "chatbot-dark": [".svg", ".png", ".webp"],
  "chatbot-light": [".svg", ".png", ".webp"],
};

/**
 * Comments in English: Allowed MIME types for validation
 */
export const ALLOWED_MIME_TYPES: Record<ImageType, string[]> = {
  logo: ["image/png", "image/jpeg", "image/webp"],
  ogImage: ["image/png", "image/jpeg", "image/webp"],
  "loading-dark": ["image/svg+xml", "image/png", "image/webp"],
  "loading-light": ["image/svg+xml", "image/png", "image/webp"],
  "notFound-dark": ["image/svg+xml", "image/png", "image/webp"],
  "notFound-light": ["image/svg+xml", "image/png", "image/webp"],
  "error500-dark": ["image/svg+xml", "image/png", "image/webp"],
  "error500-light": ["image/svg+xml", "image/png", "image/webp"],
  "homePage-dark": ["image/svg+xml", "image/png", "image/webp"],
  "homePage-light": ["image/svg+xml", "image/png", "image/webp"],
  "chatbot-dark": ["image/svg+xml", "image/png", "image/webp"],
  "chatbot-light": ["image/svg+xml", "image/png", "image/webp"],
};

/**
 * Comments in English: Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Comments in English: Minimum dimensions for logo (for icon generation)
 */
export const LOGO_MIN_DIMENSIONS = {
  width: 512,
  height: 512,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Comments in English: Construct dynamic image path with actual extension
 * @param imageType - Type of image
 * @param extension - File extension WITHOUT dot (e.g., "png", "svg")
 * @returns Full relative path (e.g., "app-config-images/logo.png")
 */
export function getImagePath(imageType: ImageType, extension: string): string {
  const baseName = IMAGE_TYPE_NAMES[imageType];
  return `${IMAGE_UPLOAD_DIR}/${baseName}.${extension}`;
}

/**
 * Comments in English: Get base filename without extension
 * @param imageType - Type of image
 * @returns Base filename (e.g., "logo", "og-image")
 */
export function getImageBaseName(imageType: ImageType): string {
  return IMAGE_TYPE_NAMES[imageType];
}

/**
 * Comments in English: Extract extension from filename
 * @param filename - Full filename (e.g., "image.png")
 * @returns Extension without dot (e.g., "png") or empty string
 */
export function extractExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Comments in English: Validate if extension is allowed for image type
 * @param imageType - Type of image
 * @param extension - File extension WITH or WITHOUT dot
 * @returns true if extension is allowed
 */
export function isExtensionAllowed(imageType: ImageType, extension: string): boolean {
  const normalizedExt = extension.startsWith(".") ? extension : `.${extension}`;
  return ALLOWED_EXTENSIONS[imageType].includes(normalizedExt);
}

/**
 * Comments in English: Validate if MIME type is allowed for image type
 * @param imageType - Type of image
 * @param mimeType - File MIME type (e.g., "image/png")
 * @returns true if MIME type is allowed
 */
export function isMimeTypeAllowed(imageType: ImageType, mimeType: string): boolean {
  return ALLOWED_MIME_TYPES[imageType].includes(mimeType);
}

/**
 * Comments in English: Convert extension to ImageFormat type
 * @param extension - File extension without dot
 * @returns ImageFormat type or "png" as default
 */
export function extensionToFormat(extension: string): ImageFormat {
  const normalized = extension.toLowerCase();
  
  // Map common variations
  if (normalized === "jpg") return "jpeg";
  if (normalized === "jpeg") return "jpeg";
  if (normalized === "png") return "png";
  if (normalized === "svg") return "svg";
  if (normalized === "webp") return "webp";
  if (normalized === "avif") return "avif";
  if (normalized === "gif") return "gif";
  
  // Default to png if unknown
  return "png";
}

// ============================================
// RESPONSE INTERFACES
// ============================================

/**
 * Comments in English: Base response for regular image upload
 * Contains information about upload success/failure and uploaded file details
 */
export interface ImageUploadResponse {
  // Status fields
  status: ImageUploadStatus;
  message: string;
  error?: string;
  errorCode?: ImageUploadErrorCode;
  
  // Success data - file information with dynamic extension
  uploadedPath?: string;         // Full path with actual extension: "/app-config-images/og-image.jpg"
  fileExtension?: string;        // Extension without dot: "jpg", "png", "svg"
  format?: ImageFormat;          // Normalized format type: "jpeg", "png", "svg"
  
  // Environment and metadata
  environment?: "development" | "production";
  imageType?: RegularImageType | "logo";
  
  // Optional metadata
  fileSize?: number;             // File size in bytes
  dimensions?: {                 // Image dimensions if available
    width: number;
    height: number;
  };
  
  // GitHub specific (production only)
  githubCommitSha?: string;      // SHA of the commit if pushed to GitHub
  githubCommitUrl?: string;      // URL to the commit on GitHub
  githubBranch?: string;         // Branch name where file was uploaded
}

/**
 * Comments in English: Response for logo upload with icon generation
 * Extends base response with information about generated icons
 */
export interface ImageUploadWithIconsResponse extends ImageUploadResponse {
  // Generated icon paths
  generatedIcons?: {
    favicon?: string;            // Path to favicon.ico
    icon32?: string;             // Path to 32x32 icon
    icon48?: string;             // Path to 48x48 icon
    icon192?: string;            // Path to 192x192 icon (Android)
    icon512?: string;            // Path to 512x512 icon (Android)
    appleTouch?: string;         // Path to apple-touch-icon
  };
  
  // Logo-specific metadata
  logoPath?: string;             // Path to main logo file
  iconGenerationTime?: number;   // Time taken to generate icons in ms
}

/**
 * Comments in English: Validation result interface
 * Used internally for file validation before upload
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ImageUploadErrorCode;
  details?: {
    actualExtension?: string;
    actualMimeType?: string;
    actualSize?: number;
    maxSize?: number;
  };
}
