// @/app/api/app-config-upload/route.ts
// Comments in English: Upload regular images with dynamic file extensions (excluding logo)

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { RegularImageType, ImageFormat } from "@/config/appConfig";
import { 
  ImageUploadResponse, 
  ImageUploadStatus,
  ImageUploadErrorCode,
  IMAGE_UPLOAD_DIR,
  IMAGE_TYPE_NAMES,
  MAX_FILE_SIZE,
  extractExtension,
  getImagePath,
  getImageBaseName,
  isExtensionAllowed,
  isMimeTypeAllowed,
  extensionToFormat,
  ValidationResult,
} from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types";

// ============================================
// CONFIGURATION
// ============================================

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const APP_CONFIG_TS_PATH = path.join(PROJECT_ROOT, "config", "appConfig.ts");

/**
 * Comments in English: Check if running in production environment
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Comments in English: Validate GitHub configuration for production uploads
 */
function validateGitHubConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    { key: "GITHUB_TOKEN", value: process.env.GITHUB_TOKEN },
    { key: "GITHUB_REPO", value: process.env.GITHUB_REPO },
  ];

  const missingVars = requiredVars
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Comments in English: Validate uploaded file
 */
function validateFile(
  file: File,
  imageType: RegularImageType,
  actualExtension: string
): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      errorCode: ImageUploadErrorCode.FILE_TOO_LARGE,
      details: {
        actualSize: file.size,
        maxSize: MAX_FILE_SIZE,
      },
    };
  }

  if (!isExtensionAllowed(imageType, actualExtension)) {
    return {
      valid: false,
      error: `Invalid file extension .${actualExtension} for ${imageType}`,
      errorCode: ImageUploadErrorCode.INVALID_FILE_TYPE,
      details: {
        actualExtension,
      },
    };
  }

  if (!isMimeTypeAllowed(imageType, file.type)) {
    return {
      valid: false,
      error: `Invalid MIME type ${file.type} for ${imageType}`,
      errorCode: ImageUploadErrorCode.INVALID_FILE_TYPE,
      details: {
        actualMimeType: file.type,
      },
    };
  }

  return { valid: true };
}

// ============================================
// FILE SYSTEM OPERATIONS
// ============================================

/**
 * Comments in English: Delete all old files with same base name but different extensions
 */
function deleteOldFiles(imageType: RegularImageType): void {
  try {
    const baseName = getImageBaseName(imageType);
    const dirPath = path.join(PUBLIC_DIR, IMAGE_UPLOAD_DIR);

    if (!fs.existsSync(dirPath)) {
      return;
    }

    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const fileWithoutExt = file.split('.')[0];
      if (fileWithoutExt === baseName) {
        const fullPath = path.join(dirPath, file);
        console.log(`[deleteOldFiles] Removing old file: ${file}`);
        fs.unlinkSync(fullPath);
      }
    });
  } catch (error: any) {
    console.error(`[deleteOldFiles] Error:`, error);
  }
}

/**
 * Comments in English: Save file to local filesystem with dynamic extension
 */
async function saveToFileSystem(
  fileBuffer: Buffer,
  imageType: RegularImageType,
  extension: string
): Promise<ImageUploadResponse> {
  try {
    deleteOldFiles(imageType);

    const relativePath = getImagePath(imageType, extension);
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    const dir = path.dirname(fullPath);

    console.log("[saveToFileSystem] Saving file:", {
      imageType,
      extension,
      relativePath,
      fullPath,
    });

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, fileBuffer);

    return {
      status: ImageUploadStatus.SUCCESS,
      message: "Image uploaded successfully to local filesystem",
      environment: "development",
      uploadedPath: `/${relativePath}`,
      fileExtension: extension,
      format: extensionToFormat(extension),
      imageType,
      fileSize: fileBuffer.length,
    };
  } catch (error: any) {
    console.error("[saveToFileSystem] Error:", error);
    return {
      status: ImageUploadStatus.ERROR,
      message: "Failed to save image to filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ImageUploadErrorCode.FILESYSTEM_ERROR,
      environment: "development",
    };
  }
}

// ============================================
// APPCONFIG.TS UPDATE (TypeScript file)
// ============================================

/**
 * Comments in English: Update image metadata in appConfig.ts TypeScript file
 * Handles keys both with and without quotes (ogImage === "ogImage")
 * Uses improved regex to properly match nested objects and prevent duplicates
 */
async function updateAppConfigTS(
  imageType: RegularImageType,
  path: string,
  format: ImageFormat,
  uploadedAt: string
): Promise<void> {
  try {
    console.log("[updateAppConfigTS] Updating TypeScript config:", {
      imageType,
      path,
      format,
    });

    // Read current appConfig.ts
    let content = fs.readFileSync(APP_CONFIG_TS_PATH, "utf-8");

    // Build the new image metadata entry (always with quotes for consistency)
    const newEntry = `    "${imageType}": {
      path: "${path}",
      format: "${format}",
      uploadedAt: "${uploadedAt}",
    },`;

    // ✅ ИСПРАВЛЕНИЕ: Regex находит ключ С кавычками ИЛИ БЕЗ кавычек
    // Паттерн: optional whitespace + optional quotes + imageType + optional quotes + : + { content } + optional comma
    // Examples that match:
    //   ogImage: { ... },
    //   "ogImage": { ... },
    //   'ogImage': { ... },
    const pattern = new RegExp(
      `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
      "gs"
    );

    // Check if entry exists (with or without quotes)
    const entryExists = pattern.test(content);
    
    // Reset regex lastIndex after .test()
    pattern.lastIndex = 0;

    if (entryExists) {
      // ✅ Replace existing entry (removes old completely before inserting new)
      console.log(`[updateAppConfigTS] Found existing entry for ${imageType} (with or without quotes)`);
      
      content = content.replace(pattern, (match) => {
        console.log(`[updateAppConfigTS] Replacing match:`, match.trim());
        return `\n${newEntry}`;
      });

      // ✅ CRITICAL: Remove ALL duplicate entries in case there are multiple
      // This handles the case where both ogImage and "ogImage" exist
      let duplicatePattern = new RegExp(
        `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
        "gs"
      );
      
      // Count matches
      const matches = content.match(duplicatePattern);
      if (matches && matches.length > 1) {
        console.warn(`[updateAppConfigTS] Found ${matches.length} duplicate entries for ${imageType}, removing extras`);
        
        // Keep only the first one, remove the rest
        let replacementCount = 0;
        duplicatePattern.lastIndex = 0;
        
        content = content.replace(duplicatePattern, (match) => {
          replacementCount++;
          if (replacementCount === 1) {
            return match; // Keep first occurrence
          }
          console.log(`[updateAppConfigTS] Removing duplicate #${replacementCount}:`, match.trim());
          return ''; // Remove subsequent duplicates
        });
      }
    } else {
      // ✅ Add new entry - find the images object and insert before closing brace
      console.log(`[updateAppConfigTS] Adding new entry for ${imageType}`);
      
      // Find the images object
      const imagesPattern = /(images:\s*\{)([\s\S]*?)(\n\s*\},?\s*\n)/;
      
      const match = content.match(imagesPattern);
      if (match) {
        // Insert new entry at the end of images object
        const beforeImages = match[1];
        const imagesContent = match[2];
        const afterImages = match[3];
        
        content = content.replace(
          imagesPattern,
          `${beforeImages}${imagesContent}\n${newEntry}${afterImages}`
        );
      } else {
        console.error("[updateAppConfigTS] Could not find images object in appConfig");
      }
    }

    // ✅ CLEANUP: Final pass to ensure no syntax errors (extra commas, etc.)
    // Remove any double commas
    content = content.replace(/,\s*,/g, ',');
    
    // Remove comma before closing brace in images object
    content = content.replace(/,(\s*\n\s*)\},(\s*\n\s*)\/\/ Logo field/g, '$1},$2// Logo field');

    // Update timestamp comment at the end
    const timestamp = new Date().toISOString();
    content = content.replace(
      /\/\/ Last updated:.*$/m,
      `// Last updated: ${timestamp}`
    );

    // Write back to file
    fs.writeFileSync(APP_CONFIG_TS_PATH, content, "utf-8");

    console.log("[updateAppConfigTS] Success - config file updated");
  } catch (error: any) {
    console.error("[updateAppConfigTS] Error:", error);
    // Don't throw - TS update failure shouldn't block upload
  }
}



// ============================================
// GITHUB OPERATIONS
// ============================================

/**
 * Comments in English: Get current file from GitHub to retrieve SHA
 */
async function getCurrentFileFromGitHub(
  filePath: string
): Promise<{ sha: string } | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-App",
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return { sha: data.sha };
  } catch (error) {
    return null;
  }
}

/**
 * Comments in English: Upload file to GitHub repository
 */
async function uploadFileToGitHub(
  fileBuffer: Buffer,
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    let sha: string | undefined;
    const currentFile = await getCurrentFileFromGitHub(`public/${relativePath}`);
    if (currentFile) {
      sha = currentFile.sha;
    }

    const apiPayload = {
      message: commitMessage,
      content: fileBuffer.toString("base64"),
      branch: process.env.GITHUB_BRANCH || "main",
      ...(sha && { sha }),
    };

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${relativePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "NextJS-App",
        },
        body: JSON.stringify(apiPayload),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Comments in English: Save file to GitHub repository with dynamic extension
 */
async function saveToGitHub(
  fileBuffer: Buffer,
  imageType: RegularImageType,
  extension: string
): Promise<ImageUploadResponse> {
  try {
    const { isValid, missingVars } = validateGitHubConfig();
    if (!isValid) {
      return {
        status: ImageUploadStatus.ERROR,
        message: `Missing GitHub configuration: ${missingVars.join(", ")}`,
        error: `Missing environment variables: ${missingVars.join(", ")}`,
        errorCode: ImageUploadErrorCode.GITHUB_CONFIG_MISSING,
        environment: "production",
      };
    }

    const relativePath = getImagePath(imageType, extension);

    console.log("[saveToGitHub] Uploading:", {
      imageType,
      extension,
      relativePath,
    });

    const uploaded = await uploadFileToGitHub(
      fileBuffer,
      relativePath,
      `Update ${imageType} image (${extension}) - ${new Date().toISOString()}`
    );

    if (!uploaded) {
      return {
        status: ImageUploadStatus.ERROR,
        message: "Failed to upload image to GitHub",
        errorCode: ImageUploadErrorCode.GITHUB_ERROR,
        environment: "production",
      };
    }

    return {
      status: ImageUploadStatus.SUCCESS,
      message: "Image uploaded successfully to GitHub",
      environment: "production",
      uploadedPath: `/${relativePath}`,
      fileExtension: extension,
      format: extensionToFormat(extension),
      imageType,
      fileSize: fileBuffer.length,
    };
  } catch (error: any) {
    console.error("[saveToGitHub] Error:", error);
    return {
      status: ImageUploadStatus.ERROR,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: ImageUploadErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

// ============================================
// HTTP HANDLERS
// ============================================

/**
 * Comments in English: POST handler for regular image upload
 */
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/app-config-upload ===");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("imageType") as string | null;

    if (!file) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "No file provided",
        error: "File is required in form data",
        errorCode: ImageUploadErrorCode.NO_FILE_PROVIDED,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const validImageTypes = Object.keys(IMAGE_TYPE_NAMES).filter(t => t !== "logo");
    if (!imageType || !validImageTypes.includes(imageType)) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "Invalid image type",
        error: `Image type must be one of: ${validImageTypes.join(", ")}`,
        errorCode: ImageUploadErrorCode.INVALID_FILE_TYPE,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const extension = extractExtension(file.name);
    if (!extension) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "File must have an extension",
        error: "Could not determine file extension",
        errorCode: ImageUploadErrorCode.INVALID_FILE_TYPE,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log("[POST] File info:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageType,
      extension,
    });

    const validation = validateFile(file, imageType as RegularImageType, extension);
    if (!validation.valid) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: validation.error || "File validation failed",
        error: validation.error,
        errorCode: validation.errorCode,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Save to filesystem
    const localResult = await saveToFileSystem(
      fileBuffer,
      imageType as RegularImageType,
      extension
    );

    if (localResult.status !== ImageUploadStatus.SUCCESS) {
      return NextResponse.json(localResult, { status: 500 });
    }

    // Update appConfig.ts with new metadata
    await updateAppConfigTS(
      imageType as RegularImageType,
      localResult.uploadedPath!,
      localResult.format!,
      new Date().toISOString()
    );

    // In production, also save to GitHub
    if (isProduction()) {
      const githubResult = await saveToGitHub(
        fileBuffer,
        imageType as RegularImageType,
        extension
      );

      if (githubResult.status !== ImageUploadStatus.SUCCESS) {
        return NextResponse.json(
          {
            ...localResult,
            status: ImageUploadStatus.PARTIAL_SUCCESS,
            message: "Saved locally but GitHub sync failed",
            error: githubResult.error,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(githubResult, { status: 200 });
    }

    return NextResponse.json(localResult, { status: 200 });
  } catch (error: any) {
    console.error("[POST] Unexpected error:", error);
    const errorResponse: ImageUploadResponse = {
      status: ImageUploadStatus.ERROR,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      errorCode: ImageUploadErrorCode.UNKNOWN_ERROR,
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Comments in English: GET handler for endpoint info
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Regular image upload API endpoint (excludes logo)",
    environment: isProduction() ? "production" : "development",
    supportedTypes: Object.keys(IMAGE_TYPE_NAMES).filter(t => t !== "logo"),
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    configFile: "config/appConfig.ts",
  });
}
