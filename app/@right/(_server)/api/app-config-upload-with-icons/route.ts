// @app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types.ts
// Comments in English: Upload logo and automatically generate all icons using sharp

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  ImageUploadWithIconsResponse,
  ImageUploadStatus,
  ImageUploadErrorCode,
  MAX_FILE_SIZE,
  MIN_LOGO_DIMENSIONS,
  FileValidationResult,
} from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types";

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const ICONS_DIR = path.join(PUBLIC_DIR, "app-config-images", "icons");
const LOGO_PATH = path.join(PUBLIC_DIR, "app-config-images", "logo.png");

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
 * Validate uploaded logo file
 */
async function validateLogoFile(file: File): Promise<FileValidationResult> {
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
  const allowedExts = [".png", ".jpg", ".jpeg"];

  if (!allowedExts.includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file format. Allowed: ${allowedExts.join(", ")}`,
      errorCode: ImageUploadErrorCode.FILE_EXTENSION_NOT_ALLOWED,
    };
  }

  // Check image dimensions
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const metadata = await sharp(buffer).metadata();

    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width < MIN_LOGO_DIMENSIONS.width ||
      metadata.height < MIN_LOGO_DIMENSIONS.height
    ) {
      return {
        isValid: false,
        error: `Logo must be at least ${MIN_LOGO_DIMENSIONS.width}x${MIN_LOGO_DIMENSIONS.height}px for icon generation`,
        errorCode: ImageUploadErrorCode.LOGO_TOO_SMALL,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Failed to process image metadata",
      errorCode: ImageUploadErrorCode.IMAGE_PROCESSING_FAILED,
    };
  }

  return { isValid: true };
}

/**
 * Generate all icon sizes from source logo
 */
async function generateIcons(
  sourceBuffer: Buffer
): Promise<{ [key: string]: string }> {
  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  const iconSizes = [
    { size: 32, name: "icon-32.png" },
    { size: 48, name: "icon-48.png" },
    { size: 192, name: "icon-192.png" },
    { size: 512, name: "icon-512.png" },
    { size: 180, name: "apple-touch-icon.png" },
  ];

  const generatedPaths: { [key: string]: string } = {};

  // Generate PNG icons
  for (const { size, name } of iconSizes) {
    const outputPath = path.join(ICONS_DIR, name);
    await sharp(sourceBuffer)
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .png()
      .toFile(outputPath);

    generatedPaths[name.replace(".png", "").replace("-", "")] =
      `/app-config-images/icons/${name}`;
  }

  // Generate favicon.ico (32x32)
  const faviconPath = path.join(ICONS_DIR, "favicon.ico");
  await sharp(sourceBuffer)
    .resize(32, 32, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toFile(faviconPath);

  generatedPaths["favicon"] = "/app-config-images/icons/favicon.ico";

  return generatedPaths;
}

/**
 * Upload file to GitHub
 */
async function uploadFileToGitHub(
  fileBuffer: Buffer,
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    // Check if file exists to get SHA
    let sha: string | undefined;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NextJS-App",
          },
        }
      );

      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }
    } catch {
      // File doesn't exist, will create new
    }

    const apiPayload = {
      message: commitMessage,
      content: fileBuffer.toString("base64"),
      branch: process.env.GITHUB_BRANCH || "main",
      ...(sha && { sha }),
    };

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`,
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
 * Save logo and icons to GitHub
 */
async function saveToGitHub(
  logoBuffer: Buffer,
  iconBuffers: Map<string, Buffer>
): Promise<ImageUploadWithIconsResponse> {
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

    // Upload logo
    const logoUploaded = await uploadFileToGitHub(
      logoBuffer,
      "public/app-config-images/logo.png",
      `Update logo - ${new Date().toISOString()}`
    );

    if (!logoUploaded) {
      return {
        status: ImageUploadStatus.GITHUB_API_ERROR,
        message: "Failed to upload logo to GitHub",
        errorCode: ImageUploadErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    // Upload icons
    let iconsUploaded = 0;
    for (const [filename, buffer] of iconBuffers.entries()) {
      const uploaded = await uploadFileToGitHub(
        buffer,
        `public/app-config-images/icons/${filename}`,
        `Update icon ${filename} - ${new Date().toISOString()}`
      );
      if (uploaded) iconsUploaded++;
    }

    return {
      status: ImageUploadStatus.SUCCESS,
      message: `Logo and ${iconsUploaded} icons uploaded to GitHub`,
      environment: "production",
      uploadedPath: "/app-config-images/logo.png",
      generatedIcons: {
        favicon: "/app-config-images/icons/favicon.ico",
        icon32: "/app-config-images/icons/icon-32.png",
        icon48: "/app-config-images/icons/icon-48.png",
        icon192: "/app-config-images/icons/icon-192.png",
        icon512: "/app-config-images/icons/icon-512.png",
        appleTouch: "/app-config-images/icons/apple-touch-icon.png",
      },
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
 * POST handler for logo upload with icon generation
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Validate file presence
    if (!file) {
      const errorResponse: ImageUploadWithIconsResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "No file provided",
        error: "File is required in form data",
        errorCode: ImageUploadErrorCode.NO_FILE_PROVIDED,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate logo file
    const validation = await validateLogoFile(file);
    if (!validation.isValid) {
      const errorResponse: ImageUploadWithIconsResponse = {
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
    const logoBuffer = Buffer.from(arrayBuffer);

    // Save logo to filesystem
    const logoDir = path.dirname(LOGO_PATH);
    if (!fs.existsSync(logoDir)) {
      fs.mkdirSync(logoDir, { recursive: true });
    }
    fs.writeFileSync(LOGO_PATH, logoBuffer);

    // Generate icons
    try {
      await generateIcons(logoBuffer);
    } catch (error: any) {
      const errorResponse: ImageUploadWithIconsResponse = {
        status: ImageUploadStatus.FILESYSTEM_ERROR,
        message: "Failed to generate icons",
        error: error.message || "Icon generation failed",
        errorCode: ImageUploadErrorCode.ICON_GENERATION_FAILED,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // In production, upload to GitHub
    if (isProduction()) {
      // Read generated icon files
      const iconBuffers = new Map<string, Buffer>();
      const iconFiles = [
        "favicon.ico",
        "icon-32.png",
        "icon-48.png",
        "icon-192.png",
        "icon-512.png",
        "apple-touch-icon.png",
      ];

      for (const filename of iconFiles) {
        const iconPath = path.join(ICONS_DIR, filename);
        if (fs.existsSync(iconPath)) {
          iconBuffers.set(filename, fs.readFileSync(iconPath));
        }
      }

      const githubResult = await saveToGitHub(logoBuffer, iconBuffers);
      const httpStatus =
        githubResult.status === ImageUploadStatus.SUCCESS ? 200 : 500;
      return NextResponse.json(githubResult, { status: httpStatus });
    }

    // Development: return success
    const successResponse: ImageUploadWithIconsResponse = {
      status: ImageUploadStatus.SUCCESS,
      message: "Logo uploaded and icons generated successfully",
      environment: "development",
      uploadedPath: "/app-config-images/logo.png",
      generatedIcons: {
        favicon: "/app-config-images/icons/favicon.ico",
        icon32: "/app-config-images/icons/icon-32.png",
        icon48: "/app-config-images/icons/icon-48.png",
        icon192: "/app-config-images/icons/icon-192.png",
        icon512: "/app-config-images/icons/icon-512.png",
        appleTouch: "/app-config-images/icons/apple-touch-icon.png",
      },
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: any) {
    const errorResponse: ImageUploadWithIconsResponse = {
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
    message: "Logo upload with icon generation API endpoint",
    environment: isProduction() ? "production" : "development",
    requiredDimensions: MIN_LOGO_DIMENSIONS,
  });
}
