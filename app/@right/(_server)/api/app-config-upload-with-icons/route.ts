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

/**
 * Comments in English: Async delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// LOGO VALIDATION
// ============================================

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
// ICON GENERATION (IN-MEMORY)
// ============================================

/**
 * Comments in English: Generate all icons in memory
 * Returns buffers for all generated icons
 */
async function generateIconsInMemory(
  logoBuffer: Buffer
): Promise<{
  logo: Buffer;
  icons: Record<string, Buffer>;
  favicon: Buffer;
}> {
  console.log("[generateIconsInMemory] Starting icon generation in memory...");

  const icons: Record<string, Buffer> = {};

  // Generate PNG icons
  for (const { size, filename } of ICON_SIZES) {
    try {
      console.log(`[generateIconsInMemory] Generating ${filename} (${size}x${size})...`);

      const iconBuffer = await sharp(logoBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

      icons[filename] = iconBuffer;
      console.log(`[generateIconsInMemory] ✓ Generated ${filename}: ${iconBuffer.length} bytes`);
    } catch (error: any) {
      console.error(`[generateIconsInMemory] Error generating ${filename}:`, error);
      throw new Error(`Failed to generate ${filename}: ${error.message}`);
    }
  }

  // Generate favicon.ico (32x32 PNG)
  console.log("[generateIconsInMemory] Generating favicon.ico...");
  const faviconBuffer = await sharp(logoBuffer)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  console.log(`[generateIconsInMemory] ✓ Generated favicon.ico: ${faviconBuffer.length} bytes`);

  console.log("[generateIconsInMemory] All icons generated successfully in memory");

  return {
    logo: logoBuffer,
    icons,
    favicon: faviconBuffer,
  };
}

// ============================================
// FILESYSTEM OPERATIONS (DEV ONLY)
// ============================================

/**
 * Comments in English: Delete all old logo files and icons
 * ⚠️ DEV ONLY - Not called in production
 */
async function deleteOldLogoAndIconsFromFilesystem(): Promise<void> {
  console.log("[deleteOldLogoAndIconsFromFilesystem] Starting cleanup...");

  try {
    // Delete old logo files
    if (fs.existsSync(LOGO_DIR)) {
      const logoFiles = fs.readdirSync(LOGO_DIR);
      for (const file of logoFiles) {
        if (file.startsWith("logo.")) {
          const fullPath = path.join(LOGO_DIR, file);
          console.log(`[deleteOldLogoAndIconsFromFilesystem] Removing: ${file}`);
          fs.unlinkSync(fullPath);
        }
      }
    }

    // Delete all old icons
    if (fs.existsSync(ICONS_DIR)) {
      const iconFiles = fs.readdirSync(ICONS_DIR);
      for (const file of iconFiles) {
        const fullPath = path.join(ICONS_DIR, file);
        console.log(`[deleteOldLogoAndIconsFromFilesystem] Removing: ${file}`);
        fs.unlinkSync(fullPath);
      }
    }

    // Delete old favicon.ico
    const faviconPath = path.join(PUBLIC_DIR, "favicon.ico");
    if (fs.existsSync(faviconPath)) {
      console.log("[deleteOldLogoAndIconsFromFilesystem] Removing favicon.ico");
      fs.unlinkSync(faviconPath);
    }

    console.log("[deleteOldLogoAndIconsFromFilesystem] Cleanup completed");
  } catch (error: any) {
    console.error("[deleteOldLogoAndIconsFromFilesystem] Error:", error);
    throw error;
  }
}

/**
 * Comments in English: Save all files to local filesystem
 * ⚠️ DEV ONLY
 */
async function saveAllFilesToFilesystem(
  extension: string,
  generatedFiles: {
    logo: Buffer;
    icons: Record<string, Buffer>;
    favicon: Buffer;
  }
): Promise<{
  logoPath: string;
  iconPaths: Record<string, string>;
  faviconPath: string;
}> {
  console.log("[saveAllFilesToFilesystem] Saving files to filesystem...");

  // Delete old files first
  await deleteOldLogoAndIconsFromFilesystem();

  // Ensure directories exist
  if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
  }
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // Save logo
  const logoRelativePath = `app-config-images/logo.${extension}`;
  const logoFullPath = path.join(PUBLIC_DIR, logoRelativePath);
  fs.writeFileSync(logoFullPath, generatedFiles.logo);
  console.log(`[saveAllFilesToFilesystem] ✓ Saved logo: ${logoRelativePath}`);

  // Save icons
  const iconPaths: Record<string, string> = {};
  for (const [filename, buffer] of Object.entries(generatedFiles.icons)) {
    const iconPath = path.join(ICONS_DIR, filename);
    fs.writeFileSync(iconPath, buffer);
    const relativePath = `/app-config-images/icons/${filename}`;
    iconPaths[filename] = relativePath;
    console.log(`[saveAllFilesToFilesystem] ✓ Saved icon: ${filename}`);
  }

  // Save favicon
  const faviconPath = path.join(PUBLIC_DIR, "favicon.ico");
  fs.writeFileSync(faviconPath, generatedFiles.favicon);
  console.log("[saveAllFilesToFilesystem] ✓ Saved favicon.ico");

  return {
    logoPath: `/${logoRelativePath}`,
    iconPaths,
    faviconPath: "/favicon.ico",
  };
}

/**
 * Comments in English: Update appConfig.ts locally
 * ⚠️ DEV ONLY
 */
async function updateAppConfigTSLocal(
  logoPath: string,
  logoFormat: string,
  iconPaths: Record<string, string>,
  faviconPath: string
): Promise<void> {
  try {
    console.log("[updateAppConfigTSLocal] Updating local config...");

    let content = fs.readFileSync(APP_CONFIG_TS_PATH, "utf-8");
    const timestamp = new Date().toISOString();

    // Update logo
    content = content.replace(/logo:\s*"[^"]*"/, `logo: "${logoPath}"`);
    content = content.replace(/logoFormat:\s*"[^"]*"/, `logoFormat: "${logoFormat}"`);

    // Update icons
    content = content.replace(/faviconAny:\s*"[^"]*"/, `faviconAny: "${faviconPath}"`);
    content = content.replace(/icon32:\s*"[^"]*"/, `icon32: "${iconPaths["icon-32.png"]}"`);
    content = content.replace(/icon48:\s*"[^"]*"/, `icon48: "${iconPaths["icon-48.png"]}"`);
    content = content.replace(/icon192:\s*"[^"]*"/, `icon192: "${iconPaths["icon-192.png"]}"`);
    content = content.replace(/icon512:\s*"[^"]*"/, `icon512: "${iconPaths["icon-512.png"]}"`);
    content = content.replace(/appleTouch:\s*"[^"]*"/, `appleTouch: "${iconPaths["apple-touch-icon.png"]}"`);

    // Update timestamp
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
 * Comments in English: Get file from GitHub
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
      console.error("[getFileFromGitHub] API error:", response.status);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

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
 * Comments in English: Delete file from GitHub
 */
async function deleteFileFromGitHub(
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    console.log("[deleteFileFromGitHub] Attempting to delete:", relativePath);

    const currentFile = await getFileFromGitHub(relativePath);

    if (!currentFile) {
      console.log("[deleteFileFromGitHub] File does not exist, skipping");
      return true;
    }

    console.log("[deleteFileFromGitHub] Deleting with SHA:", currentFile.sha);

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
      console.log("[deleteFileFromGitHub] Deleted successfully");
      return true;
    }

    console.error("[deleteFileFromGitHub] Delete failed:", response.status);
    return false;
  } catch (error: any) {
    console.error("[deleteFileFromGitHub] Error:", error);
    return false;
  }
}

/**
 * Comments in English: Upload file to GitHub
 */
async function uploadFileToGitHub(
  fileBuffer: Buffer,
  relativePath: string,
  commitMessage: string
): Promise<boolean> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    console.log("[uploadFileToGitHub] Uploading:", relativePath);

    let sha: string | undefined;
    const currentFile = await getFileFromGitHub(`public/${relativePath}`);

    if (currentFile) {
      sha = currentFile.sha;
      console.log("[uploadFileToGitHub] File exists, updating with SHA:", sha);
    } else {
      console.log("[uploadFileToGitHub] Creating new file");
    }

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
        body: JSON.stringify({
          message: commitMessage,
          content: fileBuffer.toString("base64"),
          branch: process.env.GITHUB_BRANCH || "main",
          ...(sha && { sha }),
        }),
      }
    );

    if (response.ok) {
      console.log("[uploadFileToGitHub] Upload successful");
      return true;
    }

    console.error("[uploadFileToGitHub] Upload failed:", response.status);
    const errorData = await response.json().catch(() => ({}));
    console.error("[uploadFileToGitHub] Error details:", errorData);

    return false;
  } catch (error: any) {
    console.error("[uploadFileToGitHub] Error:", error);
    return false;
  }
}

/**
 * Comments in English: Delete all old logo and icon files from GitHub
 * ⚠️ PRODUCTION ONLY
 */
async function deleteOldLogoAndIconsFromGitHub(
  currentExtension: string
): Promise<void> {
  console.log("[deleteOldLogoAndIconsFromGitHub] Starting GitHub cleanup...");

  const timestamp = new Date().toISOString();

  try {
    // Delete old logo files with different extensions
    const logoExtensions = ["png", "jpg", "jpeg", "webp"];
    for (const ext of logoExtensions) {
      if (ext === currentExtension) continue;

      const logoPath = `public/app-config-images/logo.${ext}`;
      await deleteFileFromGitHub(logoPath, `Delete old logo.${ext} - ${timestamp}`);
    }

    // Delete old icons
    const iconFilenames = [
      "icon-32.png",
      "icon-48.png",
      "icon-192.png",
      "icon-512.png",
      "apple-touch-icon.png",
    ];

    for (const filename of iconFilenames) {
      const iconPath = `public/app-config-images/icons/${filename}`;
      await deleteFileFromGitHub(iconPath, `Delete old ${filename} - ${timestamp}`);
    }

    // Delete old favicon
    await deleteFileFromGitHub("public/favicon.ico", `Delete old favicon.ico - ${timestamp}`);

    console.log("[deleteOldLogoAndIconsFromGitHub] Cleanup completed");
  } catch (error: any) {
    console.error("[deleteOldLogoAndIconsFromGitHub] Error:", error);
    // Don't throw - old file deletion shouldn't block new upload
  }
}

/**
 * Comments in English: Upload all files to GitHub
 * ⚠️ PRODUCTION ONLY
 */
async function saveAllFilesToGitHub(
  extension: string,
  generatedFiles: {
    logo: Buffer;
    icons: Record<string, Buffer>;
    favicon: Buffer;
  }
): Promise<{
  logoPath: string;
  iconPaths: Record<string, string>;
  faviconPath: string;
}> {
  console.log("[saveAllFilesToGitHub] Starting GitHub upload workflow...");

  const timestamp = new Date().toISOString();

  // Step 1: Delete old files
  console.log("[saveAllFilesToGitHub] Step 1: Deleting old files...");
  await deleteOldLogoAndIconsFromGitHub(extension);

  // Step 2: Upload logo
  console.log("[saveAllFilesToGitHub] Step 2: Uploading logo...");
  const logoRelativePath = `app-config-images/logo.${extension}`;
  const logoUploaded = await uploadFileToGitHub(
    generatedFiles.logo,
    logoRelativePath,
    `Update logo.${extension} - ${timestamp}`
  );

  if (!logoUploaded) {
    throw new Error("Failed to upload logo to GitHub");
  }

  // Step 3: Upload icons
  console.log("[saveAllFilesToGitHub] Step 3: Uploading icons...");
  const iconPaths: Record<string, string> = {};

  for (const [filename, buffer] of Object.entries(generatedFiles.icons)) {
    const iconRelativePath = `app-config-images/icons/${filename}`;
    const uploaded = await uploadFileToGitHub(
      buffer,
      iconRelativePath,
      `Update ${filename} - ${timestamp}`
    );

    if (!uploaded) {
      console.warn(`[saveAllFilesToGitHub] Failed to upload ${filename}`);
    }

    iconPaths[filename] = `/app-config-images/icons/${filename}`;
  }

  // Step 4: Upload favicon
  console.log("[saveAllFilesToGitHub] Step 4: Uploading favicon...");
  const faviconUploaded = await uploadFileToGitHub(
    generatedFiles.favicon,
    "favicon.ico",
    `Update favicon.ico - ${timestamp}`
  );

  if (!faviconUploaded) {
    console.warn("[saveAllFilesToGitHub] Failed to upload favicon.ico");
  }

  console.log("[saveAllFilesToGitHub] All files uploaded to GitHub");

  return {
    logoPath: `/${logoRelativePath}`,
    iconPaths,
    faviconPath: "/favicon.ico",
  };
}

/**
 * Comments in English: Update appConfig.ts on GitHub
 * ⚠️ PRODUCTION ONLY
 */
async function updateAppConfigTSGitHub(
  logoPath: string,
  logoFormat: string,
  iconPaths: Record<string, string>,
  faviconPath: string
): Promise<boolean> {
  try {
    console.log("[updateAppConfigTSGitHub] Updating config on GitHub...");

    const currentFile = await getFileFromGitHub("config/appConfig.ts");

    if (!currentFile) {
      console.error("[updateAppConfigTSGitHub] appConfig.ts not found");
      return false;
    }

    let content = currentFile.content;
    const timestamp = new Date().toISOString();

    // Update logo
    content = content.replace(/logo:\s*"[^"]*"/, `logo: "${logoPath}"`);
    content = content.replace(/logoFormat:\s*"[^"]*"/, `logoFormat: "${logoFormat}"`);

    // Update icons
    content = content.replace(/faviconAny:\s*"[^"]*"/, `faviconAny: "${faviconPath}"`);
    content = content.replace(/icon32:\s*"[^"]*"/, `icon32: "${iconPaths["icon-32.png"]}"`);
    content = content.replace(/icon48:\s*"[^"]*"/, `icon48: "${iconPaths["icon-48.png"]}"`);
    content = content.replace(/icon192:\s*"[^"]*"/, `icon192: "${iconPaths["icon-192.png"]}"`);
    content = content.replace(/icon512:\s*"[^"]*"/, `icon512: "${iconPaths["icon-512.png"]}"`);
    content = content.replace(/appleTouch:\s*"[^"]*"/, `appleTouch: "${iconPaths["apple-touch-icon.png"]}"`);

    // Update timestamp
    content = content.replace(/\/\/ Last updated:.*$/m, `// Last updated: ${timestamp}`);

    const uploaded = await uploadFileToGitHub(
      Buffer.from(content, "utf-8"),
      "../config/appConfig.ts",
      `Update appConfig with new logo and icons - ${timestamp}`
    );

    if (uploaded) {
      console.log("[updateAppConfigTSGitHub] Config updated successfully");
      return true;
    }

    console.error("[updateAppConfigTSGitHub] Failed to upload config");
    return false;
  } catch (error: any) {
    console.error("[updateAppConfigTSGitHub] Error:", error);
    return false;
  }
}

// ============================================
// HTTP HANDLER
// ============================================

/**
 * Comments in English: POST handler for logo upload with icon generation
 * ✅ CRITICAL: Environment-based routing BEFORE any fs operations
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== POST /api/app-config-upload-with-icons ===");
    console.log("[POST] Environment:", process.env.NODE_ENV);
    console.log("[POST] Is production:", isProduction());

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Validation
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
    console.log("[POST] Validating logo dimensions...");
    const dimensions = await validateLogoDimensions(fileBuffer);

    // Generate all icons in memory (works in both dev and production)
    console.log("[POST] Generating icons in memory...");
    const generatedFiles = await generateIconsInMemory(fileBuffer);

    // ✅ CRITICAL FIX: Environment-based routing
    if (isProduction()) {
      console.log("[POST] PRODUCTION MODE: Using GitHub API");

      // Validate GitHub config
      const { isValid, missingVars } = validateGitHubConfig();
      if (!isValid) {
        return NextResponse.json(
          {
            status: ImageUploadStatus.ERROR,
            message: `Missing GitHub configuration: ${missingVars.join(", ")}`,
            error: `Missing environment variables: ${missingVars.join(", ")}`,
            errorCode: ImageUploadErrorCode.GITHUB_CONFIG_MISSING,
            environment: "production",
          },
          { status: 500 }
        );
      }

      // Upload all files to GitHub
      const { logoPath, iconPaths, faviconPath } = await saveAllFilesToGitHub(
        extension,
        generatedFiles
      );

      // Update appConfig.ts on GitHub
      await updateAppConfigTSGitHub(
        logoPath,
        extensionToFormat(extension),
        iconPaths,
        faviconPath
      );

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log("[POST] ✓ GitHub upload completed successfully");
      console.log(`[POST] Total time: ${totalTime}ms`);

      const response: ImageUploadWithIconsResponse = {
        status: ImageUploadStatus.SUCCESS,
        message: "Logo uploaded and icons generated successfully",
        environment: "production",
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
    }

    // ✅ DEVELOPMENT MODE: Use local filesystem
    console.log("[POST] DEVELOPMENT MODE: Using local filesystem");

    const { logoPath, iconPaths, faviconPath } = await saveAllFilesToFilesystem(
      extension,
      generatedFiles
    );

    // Update local appConfig.ts
    await updateAppConfigTSLocal(
      logoPath,
      extensionToFormat(extension),
      iconPaths,
      faviconPath
    );

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log("[POST] ✓ Local filesystem save completed successfully");
    console.log(`[POST] Total time: ${totalTime}ms`);

    const response: ImageUploadWithIconsResponse = {
      status: ImageUploadStatus.SUCCESS,
      message: "Logo uploaded and icons generated successfully",
      environment: "development",
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
      "favicon.ico (32x32)",
      "icon-32.png (32x32)",
      "icon-48.png (48x48)",
      "icon-192.png (192x192)",
      "icon-512.png (512x512)",
      "apple-touch-icon.png (180x180)",
    ],
    recommendedLogoSize: "512x512px or larger",
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    githubConfigured: validateGitHubConfig().isValid,
  });
}
