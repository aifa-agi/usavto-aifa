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
// FILE SYSTEM OPERATIONS (DEV ONLY)
// ============================================

/**
 * Comments in English: Delete all old files with same base name but different extensions
 * ⚠️ DEV ONLY - Not called in production
 */
function deleteOldFilesFromFilesystem(imageType: RegularImageType): void {
  try {
    const baseName = getImageBaseName(imageType);
    const dirPath = path.join(PUBLIC_DIR, IMAGE_UPLOAD_DIR);

    if (!fs.existsSync(dirPath)) {
      console.log("[deleteOldFilesFromFilesystem] Directory does not exist, skipping");
      return;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fileWithoutExt = file.split(".")[0];
      if (fileWithoutExt === baseName) {
        const fullPath = path.join(dirPath, file);
        console.log(`[deleteOldFilesFromFilesystem] Removing: ${file}`);
        fs.unlinkSync(fullPath);
      }
    });

    console.log("[deleteOldFilesFromFilesystem] Cleanup completed");
  } catch (error: any) {
    console.error(`[deleteOldFilesFromFilesystem] Error:`, error);
    throw error;
  }
}

/**
 * Comments in English: Save file to local filesystem with dynamic extension
 * ⚠️ DEV ONLY - Returns error in production
 */
async function saveToFileSystem(
  fileBuffer: Buffer,
  imageType: RegularImageType,
  extension: string
): Promise<ImageUploadResponse> {
  try {
    console.log("[saveToFileSystem] Starting local save...");

    // Delete old files first
    deleteOldFilesFromFilesystem(imageType);

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

    console.log("[saveToFileSystem] File saved successfully");

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
// APPCONFIG.TS UPDATE (LOCAL FILESYSTEM ONLY)
// ============================================

/**
 * Comments in English: Update image metadata in appConfig.ts TypeScript file
 * ⚠️ DEV ONLY - Updates local file in development
 */
async function updateAppConfigTSLocal(
  imageType: RegularImageType,
  path: string,
  format: ImageFormat,
  uploadedAt: string
): Promise<void> {
  try {
    console.log("[updateAppConfigTSLocal] Updating local config:", {
      imageType,
      path,
      format,
    });

    let content = fs.readFileSync(APP_CONFIG_TS_PATH, "utf-8");

    const newEntry = `    "${imageType}": {
      path: "${path}",
      format: "${format}",
      uploadedAt: "${uploadedAt}",
    },`;

    const pattern = new RegExp(
      `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
      "gs"
    );

    const entryExists = pattern.test(content);
    pattern.lastIndex = 0;

    if (entryExists) {
      console.log(`[updateAppConfigTSLocal] Replacing existing entry for ${imageType}`);

      content = content.replace(pattern, (match) => {
        console.log(`[updateAppConfigTSLocal] Replacing:`, match.trim());
        return `\n${newEntry}`;
      });

      // Remove duplicates
      let duplicatePattern = new RegExp(
        `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
        "gs"
      );

      const matches = content.match(duplicatePattern);
      if (matches && matches.length > 1) {
        console.warn(`[updateAppConfigTSLocal] Found ${matches.length} duplicates, removing extras`);

        let replacementCount = 0;
        duplicatePattern.lastIndex = 0;

        content = content.replace(duplicatePattern, (match) => {
          replacementCount++;
          if (replacementCount === 1) {
            return match;
          }
          console.log(`[updateAppConfigTSLocal] Removing duplicate #${replacementCount}`);
          return "";
        });
      }
    } else {
      console.log(`[updateAppConfigTSLocal] Adding new entry for ${imageType}`);

      const imagesPattern = /(images:\s*\{)([\s\S]*?)(\n\s*\},?\s*\n)/;
      const match = content.match(imagesPattern);

      if (match) {
        const beforeImages = match[1];
        const imagesContent = match[2];
        const afterImages = match[3];

        content = content.replace(
          imagesPattern,
          `${beforeImages}${imagesContent}\n${newEntry}${afterImages}`
        );
      } else {
        console.error("[updateAppConfigTSLocal] Could not find images object");
      }
    }

    // Cleanup
    content = content.replace(/,\s*,/g, ",");
    content = content.replace(/,(\s*\n\s*)\},(\s*\n\s*)\/\/ Logo field/g, "$1},$2// Logo field");

    // Update timestamp
    const timestamp = new Date().toISOString();
    content = content.replace(/\/\/ Last updated:.*$/m, `// Last updated: ${timestamp}`);

    fs.writeFileSync(APP_CONFIG_TS_PATH, content, "utf-8");

    console.log("[updateAppConfigTSLocal] Config updated successfully");
  } catch (error: any) {
    console.error("[updateAppConfigTSLocal] Error:", error);
    // Don't throw - config update shouldn't block upload
  }
}

// ============================================
// GITHUB OPERATIONS (PRODUCTION ONLY)
// ============================================

/**
 * Comments in English: Get current file SHA from GitHub
 * Required for updating or deleting files
 */
async function getFileFromGitHub(
  relativePath: string
): Promise<{ sha: string; content: string } | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    console.log("[getFileFromGitHub] Fetching:", relativePath);

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-App",
        },
      }
    );

    if (response.status === 404) {
      console.log("[getFileFromGitHub] File not found (404)");
      return null;
    }

    if (!response.ok) {
      console.error("[getFileFromGitHub] API error:", response.status, response.statusText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    console.log("[getFileFromGitHub] File found, SHA:", data.sha);

    return {
      sha: data.sha,
      content: Buffer.from(data.content, "base64").toString("utf-8"),
    };
  } catch (error: any) {
    console.error("[getFileFromGitHub] Error:", error);
    throw error;
  }
}

/**
 * Comments in English: Delete file from GitHub by uploading null content
 * GitHub API требует SHA файла для удаления
 */
async function deleteFileFromGitHub(
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    console.log("[deleteFileFromGitHub] Attempting to delete:", relativePath);

    // Get current file SHA
    const currentFile = await getFileFromGitHub(relativePath);

    if (!currentFile) {
      console.log("[deleteFileFromGitHub] File does not exist, skipping deletion");
      return true;
    }

    console.log("[deleteFileFromGitHub] Deleting file with SHA:", currentFile.sha);

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "NextJS-App",
        },
        body: JSON.stringify({
          message: commitMessage,
          sha: currentFile.sha,
          branch: process.env.GITHUB_BRANCH || "main",
        }),
      }
    );

    if (response.ok) {
      console.log("[deleteFileFromGitHub] File deleted successfully");
      return true;
    }

    console.error("[deleteFileFromGitHub] Delete failed:", response.status, response.statusText);
    return false;
  } catch (error: any) {
    console.error("[deleteFileFromGitHub] Error:", error);
    return false;
  }
}

/**
 * Comments in English: Delete all old files with different extensions from GitHub
 * ⚠️ PRODUCTION ONLY - Deletes files via GitHub API
 */
async function deleteOldFilesFromGitHub(
  imageType: RegularImageType,
  currentExtension: string
): Promise<void> {
  try {
    const baseName = getImageBaseName(imageType);
    const possibleExtensions = ["png", "jpg", "jpeg", "webp", "svg"];

    console.log("[deleteOldFilesFromGitHub] Checking for old files:", baseName);

    for (const ext of possibleExtensions) {
      // Skip current extension
      if (ext === currentExtension) {
        continue;
      }

      const relativePath = `public/${IMAGE_UPLOAD_DIR}/${baseName}.${ext}`;

      console.log(`[deleteOldFilesFromGitHub] Checking: ${relativePath}`);

      const deleted = await deleteFileFromGitHub(
        relativePath,
        `Delete old ${imageType} file (${ext}) - ${new Date().toISOString()}`
      );

      if (deleted) {
        console.log(`[deleteOldFilesFromGitHub] Deleted: ${relativePath}`);
      }
    }

    console.log("[deleteOldFilesFromGitHub] Cleanup completed");
  } catch (error: any) {
    console.error("[deleteOldFilesFromGitHub] Error:", error);
    // Don't throw - old file deletion shouldn't block new upload
  }
}

/**
 * Comments in English: Upload or update file on GitHub
 */
async function uploadFileToGitHub(
  fileBuffer: Buffer,
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    console.log("[uploadFileToGitHub] Uploading:", relativePath);

    // Check if file exists and get SHA
    let sha: string | undefined;
    const currentFile = await getFileFromGitHub(`public/${relativePath}`);

    if (currentFile) {
      sha = currentFile.sha;
      console.log("[uploadFileToGitHub] File exists, updating with SHA:", sha);
    } else {
      console.log("[uploadFileToGitHub] File does not exist, creating new");
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

    if (response.ok) {
      console.log("[uploadFileToGitHub] Upload successful");
      return true;
    }

    console.error("[uploadFileToGitHub] Upload failed:", response.status, response.statusText);
    const errorData = await response.json().catch(() => ({}));
    console.error("[uploadFileToGitHub] Error details:", errorData);

    return false;
  } catch (error: any) {
    console.error("[uploadFileToGitHub] Error:", error);
    return false;
  }
}

/**
 * Comments in English: Update appConfig.ts on GitHub
 * ⚠️ PRODUCTION ONLY - Updates config via GitHub API
 */
async function updateAppConfigTSGitHub(
  imageType: RegularImageType,
  imagePath: string,
  format: ImageFormat,
  uploadedAt: string
): Promise<boolean> {
  try {
    console.log("[updateAppConfigTSGitHub] Updating config on GitHub:", { imageType, imagePath, format });

    // Get current appConfig.ts content
    const currentFile = await getFileFromGitHub("config/appConfig.ts");

    if (!currentFile) {
      console.error("[updateAppConfigTSGitHub] appConfig.ts not found on GitHub");
      return false;
    }

    let content = currentFile.content;

    const newEntry = `    "${imageType}": {
      path: "${imagePath}",
      format: "${format}",
      uploadedAt: "${uploadedAt}",
    },`;

    const pattern = new RegExp(
      `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
      "gs"
    );

    const entryExists = pattern.test(content);
    pattern.lastIndex = 0;

    if (entryExists) {
      console.log(`[updateAppConfigTSGitHub] Replacing existing entry for ${imageType}`);

      content = content.replace(pattern, () => `\n${newEntry}`);

      // Remove duplicates
      let duplicatePattern = new RegExp(
        `\\s*["']?${imageType}["']?\\s*:\\s*\\{[^}]*\\}\\s*,?\\s*`,
        "gs"
      );

      const matches = content.match(duplicatePattern);
      if (matches && matches.length > 1) {
        console.warn(`[updateAppConfigTSGitHub] Found ${matches.length} duplicates, removing`);

        let count = 0;
        duplicatePattern.lastIndex = 0;

        content = content.replace(duplicatePattern, (match) => {
          count++;
          return count === 1 ? match : "";
        });
      }
    } else {
      console.log(`[updateAppConfigTSGitHub] Adding new entry for ${imageType}`);

      const imagesPattern = /(images:\s*\{)([\s\S]*?)(\n\s*\},?\s*\n)/;
      const match = content.match(imagesPattern);

      if (match) {
        const beforeImages = match[1];
        const imagesContent = match[2];
        const afterImages = match[3];

        content = content.replace(
          imagesPattern,
          `${beforeImages}${imagesContent}\n${newEntry}${afterImages}`
        );
      }
    }

    // Cleanup
    content = content.replace(/,\s*,/g, ",");

    // Update timestamp
    const timestamp = new Date().toISOString();
    content = content.replace(/\/\/ Last updated:.*$/m, `// Last updated: ${timestamp}`);

    // Upload updated config
    const uploaded = await uploadFileToGitHub(
      Buffer.from(content, "utf-8"),
      "../config/appConfig.ts",
      `Update ${imageType} metadata in appConfig - ${timestamp}`
    );

    if (uploaded) {
      console.log("[updateAppConfigTSGitHub] Config updated successfully on GitHub");
      return true;
    }

    console.error("[updateAppConfigTSGitHub] Failed to upload updated config");
    return false;
  } catch (error: any) {
    console.error("[updateAppConfigTSGitHub] Error:", error);
    return false;
  }
}

/**
 * Comments in English: Save file to GitHub with extension change support
 * ⚠️ PRODUCTION ONLY - Manages complete upload workflow via GitHub API
 */
async function saveToGitHub(
  fileBuffer: Buffer,
  imageType: RegularImageType,
  extension: string
): Promise<ImageUploadResponse> {
  try {
    console.log("[saveToGitHub] Starting GitHub upload workflow...");

    // Validate GitHub config
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

    console.log("[saveToGitHub] Step 1: Deleting old files with different extensions...");
    await deleteOldFilesFromGitHub(imageType, extension);

    console.log("[saveToGitHub] Step 2: Uploading new file...");
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

    console.log("[saveToGitHub] Step 3: Updating appConfig.ts on GitHub...");
    const configUpdated = await updateAppConfigTSGitHub(
      imageType,
      `/${relativePath}`,
      extensionToFormat(extension),
      new Date().toISOString()
    );

    if (!configUpdated) {
      console.warn("[saveToGitHub] Config update failed, but image was uploaded");
    }

    console.log("[saveToGitHub] Upload workflow completed successfully");

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
 * ✅ CRITICAL CHANGE: Environment-based routing BEFORE any fs operations
 */
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/app-config-upload ===");
    console.log("[POST] Environment:", process.env.NODE_ENV);
    console.log("[POST] Is production:", isProduction());

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("imageType") as string | null;

    // Validation
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

    const validImageTypes = Object.keys(IMAGE_TYPE_NAMES).filter((t) => t !== "logo");
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

    // ✅ CRITICAL FIX: Environment-based routing BEFORE any filesystem operations
    if (isProduction()) {
      console.log("[POST] PRODUCTION MODE: Using GitHub API only");

      const githubResult = await saveToGitHub(
        fileBuffer,
        imageType as RegularImageType,
        extension
      );

      const httpStatus = githubResult.status === ImageUploadStatus.SUCCESS ? 200 : 500;
      return NextResponse.json(githubResult, { status: httpStatus });
    }

    // ✅ DEVELOPMENT MODE: Use local filesystem
    console.log("[POST] DEVELOPMENT MODE: Using local filesystem");

    const localResult = await saveToFileSystem(
      fileBuffer,
      imageType as RegularImageType,
      extension
    );

    if (localResult.status !== ImageUploadStatus.SUCCESS) {
      return NextResponse.json(localResult, { status: 500 });
    }

    // Update local appConfig.ts
    await updateAppConfigTSLocal(
      imageType as RegularImageType,
      localResult.uploadedPath!,
      localResult.format!,
      new Date().toISOString()
    );

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
    supportedTypes: Object.keys(IMAGE_TYPE_NAMES).filter((t) => t !== "logo"),
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    configFile: "config/appConfig.ts",
    githubConfigured: validateGitHubConfig().isValid,
  });
}
