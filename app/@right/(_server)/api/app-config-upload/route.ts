// @/app/@right/(_server)/api/app-config-upload/route.ts
// Comments in English: Upload images to filesystem or GitHub (without icon generation)

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  ImageUploadResponse,
  ImageUploadStatus,
  ImageUploadErrorCode,
  ImageType,
  IMAGE_TYPE_PATHS,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  FileValidationResult,
} from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types";

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

function isProduction() {
  return process.env.NODE_ENV === "production";
}

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

/**
 * Validate uploaded file
 */
function validateFile(
  file: File,
  imageType: ImageType
): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      errorCode: ImageUploadErrorCode.FILE_SIZE_EXCEEDED,
    };
  }

  // Check file extension
  const ext = path.extname(file.name).toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[imageType];

  if (!allowedExts.includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file format. Allowed: ${allowedExts.join(", ")}`,
      errorCode: ImageUploadErrorCode.FILE_EXTENSION_NOT_ALLOWED,
    };
  }

  return { isValid: true };
}

/**
 * Save file to local filesystem
 */
async function saveToFileSystem(
  fileBuffer: Buffer,
  imageType: ImageType
): Promise<ImageUploadResponse> {
  try {
    const relativePath = IMAGE_TYPE_PATHS[imageType];
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, fileBuffer);

    return {
      status: ImageUploadStatus.SUCCESS,
      message: "Image uploaded successfully to local filesystem",
      environment: "development",
      uploadedPath: `/${relativePath}`,
      imageType,
    };
  } catch (error: any) {
    return {
      status: ImageUploadStatus.FILESYSTEM_ERROR,
      message: "Failed to save image to filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ImageUploadErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

/**
 * Get current file from GitHub
 */
async function getCurrentFileFromGitHub(
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${filePath}`,
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
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.type !== "file") {
      throw new Error("GitHub path is not a file");
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      content,
      sha: data.sha,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Save file to GitHub repository
 */
async function saveToGitHub(
  fileBuffer: Buffer,
  imageType: ImageType
): Promise<ImageUploadResponse> {
  try {
    const { isValid, missingVars } = validateGitHubConfig();
    if (!isValid) {
      return {
        status: ImageUploadStatus.GITHUB_API_ERROR,
        message: `Missing GitHub configuration: ${missingVars.join(", ")}`,
        error: `Missing environment variables: ${missingVars.join(", ")}`,
        errorCode: ImageUploadErrorCode.GITHUB_TOKEN_INVALID,
        environment: "production",
      };
    }

    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
    const relativePath = IMAGE_TYPE_PATHS[imageType];

    let currentFile: { content: string; sha: string } | null = null;

    try {
      currentFile = await getCurrentFileFromGitHub(relativePath);
    } catch (error) {
      // File doesn't exist, will create new
    }

    const apiPayload = {
      message: `Update ${imageType} image - ${new Date().toISOString()}`,
      content: fileBuffer.toString("base64"),
      branch: process.env.GITHUB_BRANCH || "main",
      ...(currentFile && { sha: currentFile.sha }),
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: ImageUploadStatus.GITHUB_API_ERROR,
        message: "Failed to upload image to GitHub",
        error: `GitHub API returned ${response.status}: ${errorData.message || "Unknown error"}`,
        errorCode:
          response.status === 401
            ? ImageUploadErrorCode.GITHUB_TOKEN_INVALID
            : ImageUploadErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    return {
      status: ImageUploadStatus.SUCCESS,
      message: "Image uploaded successfully to GitHub",
      environment: "production",
      uploadedPath: `/${relativePath}`,
      imageType,
    };
  } catch (error: any) {
    return {
      status: ImageUploadStatus.GITHUB_API_ERROR,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: ImageUploadErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

/**
 * POST handler for image upload
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("imageType") as ImageType | null;

    // Validate file presence
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

    // Validate image type
    if (!imageType || !IMAGE_TYPE_PATHS[imageType]) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "Invalid image type",
        error: `Image type must be one of: ${Object.keys(IMAGE_TYPE_PATHS).join(", ")}`,
        errorCode: ImageUploadErrorCode.INVALID_IMAGE_TYPE,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file, imageType);
    if (!validation.isValid) {
      const errorResponse: ImageUploadResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: validation.error || "File validation failed",
        error: validation.error,
        errorCode: validation.errorCode,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Save to filesystem (both dev and prod)
    const localResult = await saveToFileSystem(fileBuffer, imageType);

    // In production, also save to GitHub
    if (isProduction()) {
      const githubResult = await saveToGitHub(fileBuffer, imageType);

      if (
        localResult.status === ImageUploadStatus.SUCCESS &&
        githubResult.status !== ImageUploadStatus.SUCCESS
      ) {
        return NextResponse.json({
          status: ImageUploadStatus.SUCCESS,
          message: "Saved locally but GitHub sync failed",
          error: githubResult.error,
          environment: "production",
          uploadedPath: localResult.uploadedPath,
          imageType,
        });
      }

      const httpStatus =
        githubResult.status === ImageUploadStatus.SUCCESS ? 200 : 500;
      return NextResponse.json(githubResult, { status: httpStatus });
    }

    // Development: return local result
    const httpStatus =
      localResult.status === ImageUploadStatus.SUCCESS ? 200 : 500;
    return NextResponse.json(localResult, { status: httpStatus });
  } catch (error: any) {
    const errorResponse: ImageUploadResponse = {
      status: ImageUploadStatus.UNKNOWN_ERROR,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET handler for endpoint info
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Image upload API endpoint",
    environment: isProduction() ? "production" : "development",
    supportedTypes: Object.keys(IMAGE_TYPE_PATHS),
  });
}
