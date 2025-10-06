// @/app/api/app-config-upload-with-icons/route.ts
// Comments in English: Upload logo and generate icons (favicon.ico + PNG icons)

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  ImageUploadWithIconsResponse,
  ImageUploadStatus,
  ImageUploadErrorCode,
  MAX_FILE_SIZE,
  extensionToFormat,
  extractExtension,
} from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/image-upload-types";

// ============================================
// CONFIGURATION
// ============================================

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const ICONS_DIR = path.join(PUBLIC_DIR, "app-config-images", "icons");
const LOGO_DIR = path.join(PUBLIC_DIR, "app-config-images");
const APP_CONFIG_TS_PATH = path.join(PROJECT_ROOT, "config", "appConfig.ts");

// Comments in English: Icon sizes to generate (all PNG except favicon.ico)
const ICON_SIZES = [
  { size: 32, filename: "icon-32.png" },
  { size: 48, filename: "icon-48.png" },
  { size: 192, filename: "icon-192.png" },
  { size: 512, filename: "icon-512.png" },
  { size: 180, filename: "apple-touch-icon.png" },
] as const;

// Comments in English: Delay in ms to ensure filesystem operations complete
const FS_OPERATION_DELAY = 100;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Comments in English: Check if running in production environment
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Comments in English: Async delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Comments in English: Verify file exists and has size > 0
 */
function verifyFileWritten(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`[verifyFileWritten] File does not exist: ${filePath}`);
      return false;
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.error(`[verifyFileWritten] File is empty: ${filePath}`);
      return false;
    }
    console.log(`[verifyFileWritten] File verified: ${filePath} (${stats.size} bytes)`);
    return true;
  } catch (error: any) {
    console.error(`[verifyFileWritten] Error verifying file ${filePath}:`, error);
    return false;
  }
}

// ============================================
// FILE SYSTEM OPERATIONS
// ============================================

/**
 * Comments in English: Delete all old logo files and icons in one centralized operation
 * This prevents race conditions and ensures clean state before new files
 */
async function deleteOldLogoAndIcons(): Promise<void> {
  console.log("[deleteOldLogoAndIcons] Starting cleanup...");

  try {
    // Step 1: Delete old logo files from app-config-images directory
    if (fs.existsSync(LOGO_DIR)) {
      const logoFiles = fs.readdirSync(LOGO_DIR);
      for (const file of logoFiles) {
        if (file.startsWith("logo.")) {
          const fullPath = path.join(LOGO_DIR, file);
          console.log(`[deleteOldLogoAndIcons] Removing old logo: ${file}`);
          fs.unlinkSync(fullPath);
          await delay(10); // Small delay between deletions
        }
      }
    }

    // Step 2: Delete ALL old icons from icons directory
    if (fs.existsSync(ICONS_DIR)) {
      const iconFiles = fs.readdirSync(ICONS_DIR);
      for (const file of iconFiles) {
        const fullPath = path.join(ICONS_DIR, file);
        console.log(`[deleteOldLogoAndIcons] Removing old icon: ${file}`);
        fs.unlinkSync(fullPath);
        await delay(10); // Small delay between deletions
      }
    }

    // Step 3: Delete old favicon.ico from PUBLIC ROOT only
    const faviconPath = path.join(PUBLIC_DIR, "favicon.ico");
    if (fs.existsSync(faviconPath)) {
      console.log("[deleteOldLogoAndIcons] Removing old favicon.ico from root");
      fs.unlinkSync(faviconPath);
      await delay(10);
    }

    // Step 4: Wait for filesystem to settle
    await delay(FS_OPERATION_DELAY);

    console.log("[deleteOldLogoAndIcons] Cleanup completed successfully");
  } catch (error: any) {
    console.error("[deleteOldLogoAndIcons] Error during cleanup:", error);
    throw error;
  }
}

/**
 * Comments in English: Write file with verification and retry logic
 */
async function writeFileWithRetry(
  filePath: string,
  buffer: Buffer,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[writeFileWithRetry] Attempt ${attempt}/${maxRetries}: ${filePath}`);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        await delay(50);
      }

      // Write file
      fs.writeFileSync(filePath, buffer);
      
      // Wait for write to complete
      await delay(FS_OPERATION_DELAY);

      // Verify write
      if (verifyFileWritten(filePath)) {
        console.log(`[writeFileWithRetry] Success on attempt ${attempt}: ${filePath}`);
        return true;
      }

      console.warn(`[writeFileWithRetry] Verification failed on attempt ${attempt}: ${filePath}`);
      
      // Wait before retry
      if (attempt < maxRetries) {
        await delay(FS_OPERATION_DELAY * attempt);
      }
    } catch (error: any) {
      console.error(`[writeFileWithRetry] Error on attempt ${attempt}:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      await delay(FS_OPERATION_DELAY * attempt);
    }
  }

  return false;
}

// ============================================
// LOGO PROCESSING
// ============================================

/**
 * Comments in English: Save main logo file
 */
async function saveLogoFile(
  fileBuffer: Buffer,
  extension: string
): Promise<string> {
  const relativePath = `app-config-images/logo.${extension}`;
  const fullPath = path.join(PUBLIC_DIR, relativePath);

  console.log("[saveLogoFile] Saving main logo:", { relativePath, fullPath });

  const success = await writeFileWithRetry(fullPath, fileBuffer);
  
  if (!success) {
    throw new Error(`Failed to save logo file after retries: ${relativePath}`);
  }

  return `/${relativePath}`;
}

/**
 * Comments in English: Validate logo dimensions for icon generation
 */
async function validateLogoDimensions(
  fileBuffer: Buffer
): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(fileBuffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Could not determine image dimensions");
    }

    console.log("[validateLogoDimensions] Logo dimensions:", {
      width: metadata.width,
      height: metadata.height,
    });

    // Recommend at least 512x512 for quality icons
    if (metadata.width < 512 || metadata.height < 512) {
      console.warn(
        "[validateLogoDimensions] Logo is smaller than recommended 512x512px"
      );
    }

    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error: any) {
    console.error("[validateLogoDimensions] Error:", error);
    throw new Error(`Failed to read image metadata: ${error.message}`);
  }
}

// ============================================
// ICON GENERATION (SEQUENTIAL)
// ============================================

/**
 * Comments in English: Generate PNG icons sequentially to avoid race conditions
 * Returns paths to all generated icons
 */
async function generatePngIconsSequentially(
  logoBuffer: Buffer
): Promise<Record<string, string>> {
  console.log("[generatePngIconsSequentially] Starting sequential icon generation...");

  const generatedPaths: Record<string, string> = {};

  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
    await delay(50);
  }

  // Generate each icon sequentially with delays
  for (const { size, filename } of ICON_SIZES) {
    try {
      console.log(`[generatePngIconsSequentially] Generating ${filename} (${size}x${size})...`);

      const iconBuffer = await sharp(logoBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

      const iconPath = path.join(ICONS_DIR, filename);
      const success = await writeFileWithRetry(iconPath, iconBuffer);

      if (!success) {
        throw new Error(`Failed to write icon: ${filename}`);
      }

      const relativePath = `/app-config-images/icons/${filename}`;
      generatedPaths[filename] = relativePath;

      console.log(`[generatePngIconsSequentially] ✓ Generated: ${filename}`);

      // Wait between icons to prevent filesystem congestion
      await delay(FS_OPERATION_DELAY);
    } catch (error: any) {
      console.error(`[generatePngIconsSequentially] Error generating ${filename}:`, error);
      throw new Error(`Failed to generate ${filename}: ${error.message}`);
    }
  }

  console.log("[generatePngIconsSequentially] All PNG icons generated successfully");
  return generatedPaths;
}

/**
 * Comments in English: Generate favicon.ico (32x32) in PUBLIC ROOT ONLY
 */
async function generateFaviconIco(logoBuffer: Buffer): Promise<string> {
  console.log("[generateFaviconIco] Generating favicon.ico...");

  try {
    // Generate 32x32 PNG buffer first
    const faviconBuffer = await sharp(logoBuffer)
      .resize(32, 32, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    // Save ONLY to public root
    const faviconPath = path.join(PUBLIC_DIR, "favicon.ico");
    
    console.log("[generateFaviconIco] Saving to PUBLIC ROOT:", faviconPath);
    
    const success = await writeFileWithRetry(faviconPath, faviconBuffer);

    if (!success) {
      throw new Error("Failed to write favicon.ico after retries");
    }

    console.log("[generateFaviconIco] ✓ Favicon.ico created in PUBLIC ROOT");

    return "/favicon.ico";
  } catch (error: any) {
    console.error("[generateFaviconIco] Error:", error);
    throw new Error(`Failed to generate favicon.ico: ${error.message}`);
  }
}

// ============================================
// APPCONFIG UPDATE
// ============================================

/**
 * Comments in English: Update appConfig.ts with new logo and icon paths
 */
async function updateAppConfigTS(
  logoPath: string,
  logoFormat: string,
  iconPaths: Record<string, string>,
  faviconPath: string
): Promise<void> {
  try {
    console.log("[updateAppConfigTS] Updating config file...");

    let content = fs.readFileSync(APP_CONFIG_TS_PATH, "utf-8");
    const timestamp = new Date().toISOString();

    // Update logo path and format
    content = content.replace(
      /logo:\s*"[^"]*"/,
      `logo: "${logoPath}"`
    );

    content = content.replace(
      /logoFormat:\s*"[^"]*"/,
      `logoFormat: "${logoFormat}"`
    );

    // Update icon paths - favicon
    content = content.replace(
      /faviconAny:\s*"[^"]*"/,
      `faviconAny: "${faviconPath}"`
    );

    // Update icon paths - PNG icons
    content = content.replace(
      /icon32:\s*"[^"]*"/,
      `icon32: "${iconPaths["icon-32.png"] || "/app-config-images/icons/icon-32.png"}"`
    );

    content = content.replace(
      /icon48:\s*"[^"]*"/,
      `icon48: "${iconPaths["icon-48.png"] || "/app-config-images/icons/icon-48.png"}"`
    );

    content = content.replace(
      /icon192:\s*"[^"]*"/,
      `icon192: "${iconPaths["icon-192.png"] || "/app-config-images/icons/icon-192.png"}"`
    );

    content = content.replace(
      /icon512:\s*"[^"]*"/,
      `icon512: "${iconPaths["icon-512.png"] || "/app-config-images/icons/icon-512.png"}"`
    );

    content = content.replace(
      /appleTouch:\s*"[^"]*"/,
      `appleTouch: "${iconPaths["apple-touch-icon.png"] || "/app-config-images/icons/apple-touch-icon.png"}"`
    );

    // Update timestamp
    content = content.replace(
      /\/\/ Last updated:.*$/m,
      `// Last updated: ${timestamp}`
    );

    fs.writeFileSync(APP_CONFIG_TS_PATH, content, "utf-8");

    console.log("[updateAppConfigTS] Config file updated successfully");
  } catch (error: any) {
    console.error("[updateAppConfigTS] Error:", error);
    // Don't throw - config update failure shouldn't block upload
  }
}

// ============================================
// HTTP HANDLER
// ============================================

/**
 * Comments in English: POST handler for logo upload with icon generation
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== POST /api/app-config-upload-with-icons ===");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

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

    const extension = extractExtension(file.name);
    if (!extension || !["png", "jpg", "jpeg", "webp"].includes(extension)) {
      const errorResponse: ImageUploadWithIconsResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: "Invalid file type for logo",
        error: "Logo must be PNG, JPG, or WebP",
        errorCode: ImageUploadErrorCode.INVALID_FILE_TYPE,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      const errorResponse: ImageUploadWithIconsResponse = {
        status: ImageUploadStatus.VALIDATION_ERROR,
        message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        errorCode: ImageUploadErrorCode.FILE_TOO_LARGE,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log("[POST] File info:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      extension,
    });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Validate logo dimensions
    const dimensions = await validateLogoDimensions(fileBuffer);

    // STEP 1: Delete all old files first (centralized cleanup)
    console.log("[POST] Step 1: Cleaning up old files...");
    await deleteOldLogoAndIcons();

    // STEP 2: Save main logo file
    console.log("[POST] Step 2: Saving main logo...");
    const logoPath = await saveLogoFile(fileBuffer, extension);

    // STEP 3: Generate PNG icons sequentially
    console.log("[POST] Step 3: Generating PNG icons...");
    const iconPaths = await generatePngIconsSequentially(fileBuffer);

    // STEP 4: Generate favicon.ico in PUBLIC ROOT
    console.log("[POST] Step 4: Generating favicon.ico...");
    const faviconPath = await generateFaviconIco(fileBuffer);

    // STEP 5: Update appConfig.ts
    console.log("[POST] Step 5: Updating appConfig.ts...");
    await updateAppConfigTS(
      logoPath,
      extensionToFormat(extension),
      iconPaths,
      faviconPath
    );

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log("[POST] ✓ All operations completed successfully");
    console.log(`[POST] Total time: ${totalTime}ms`);

    const response: ImageUploadWithIconsResponse = {
      status: ImageUploadStatus.SUCCESS,
      message: "Logo uploaded and icons generated successfully",
      environment: isProduction() ? "production" : "development",
      uploadedPath: logoPath,
      fileExtension: extension,
      format: extensionToFormat(extension),
      imageType: "logo",
      fileSize: file.size,
      dimensions,
      generatedIcons: {
        favicon: faviconPath,
        icon32: iconPaths["icon-32.png"],
        icon48: iconPaths["icon-48.png"],
        icon192: iconPaths["icon-192.png"],
        icon512: iconPaths["icon-512.png"],
        appleTouch: iconPaths["apple-touch-icon.png"],
      },
      iconGenerationTime: totalTime,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("[POST] Unexpected error:", error);

    const errorResponse: ImageUploadWithIconsResponse = {
      status: ImageUploadStatus.ERROR,
      message: "Failed to upload logo and generate icons",
      error: error.message || "Unknown error",
      errorCode: ImageUploadErrorCode.ICON_GENERATION_FAILED,
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
    message: "Logo upload with icon generation API endpoint",
    environment: isProduction() ? "production" : "development",
    generatesIcons: [
      "favicon.ico (32x32) - PUBLIC ROOT ONLY",
      "icon-32.png (32x32)",
      "icon-48.png (48x48)",
      "icon-192.png (192x192)",
      "icon-512.png (512x512)",
      "apple-touch-icon.png (180x180)",
    ],
    recommendedLogoSize: "512x512px or larger",
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
  });
}
