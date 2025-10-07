// @/app/api/upload/route.ts
// Comments in English: Upload images to filesystem (dev) or GitHub (production)

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateCuid } from "@/lib/utils/generateCuid";

// ============================================
// CONFIGURATION
// ============================================

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const UPLOAD_DIR = "app-images";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function isProduction(): boolean {
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

function getExtensionFromContentType(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return map[contentType] || "jpg";
}

function isContentTypeAllowed(contentType: string): boolean {
  return ALLOWED_CONTENT_TYPES.includes(contentType);
}

// ============================================
// GITHUB OPERATIONS (PRODUCTION ONLY)
// ============================================

async function getFileFromGitHub(
  relativePath: string
): Promise<{ sha: string } | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

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
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return { sha: data.sha };
  } catch (error: any) {
    console.error("[getFileFromGitHub] Error:", error);
    return null;
  }
}

async function uploadFileToGitHub(
  fileBuffer: Buffer,
  relativePath: string
): Promise<{ success: boolean; url?: string; error?: string }> {
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
          message: `Upload image: ${relativePath} - ${new Date().toISOString()}`,
          content: fileBuffer.toString("base64"),
          branch: process.env.GITHUB_BRANCH || "main",
          ...(sha && { sha }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[uploadFileToGitHub] Failed:", response.status, errorData);
      return {
        success: false,
        error: `GitHub API error: ${response.status}`,
      };
    }

    console.log("[uploadFileToGitHub] Upload successful");

    // ✅ ИСПРАВЛЕНО: Возвращаем относительный путь (одинаковый формат с dev)
    const url = `/${relativePath}`;

    return {
      success: true,
      url, // ✅ "/app-images/abc123.jpg"
    };
  } catch (error: any) {
    console.error("[uploadFileToGitHub] Error:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

// ============================================
// FILESYSTEM OPERATIONS (DEV ONLY)
// ============================================

async function saveToFileSystem(
  fileBuffer: Buffer,
  filename: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const relativePath = `${UPLOAD_DIR}/${filename}`;
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    const dir = path.dirname(fullPath);

    console.log("[saveToFileSystem] Saving:", relativePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, fileBuffer);

    console.log("[saveToFileSystem] File saved successfully");

    return {
      success: true,
      url: `/${relativePath}`, // ✅ "/app-images/abc123.jpg"
    };
  } catch (error: any) {
    console.error("[saveToFileSystem] Error:", error);
    return {
      success: false,
      error: error.message || "Filesystem error",
    };
  }
}

// ============================================
// HTTP HANDLERS
// ============================================

/**
 * Comments in English: POST handler for direct file upload via FormData
 */
export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/upload ===");
    console.log("[POST] Environment:", process.env.NODE_ENV);

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.error("[POST] No file provided in FormData");
      return NextResponse.json(
        {
          error: "No file provided. Use FormData with 'file' field.",
        },
        { status: 400 }
      );
    }

    console.log("[POST] File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate content type
    if (!isContentTypeAllowed(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid content type: ${file.type}. Allowed: ${ALLOWED_CONTENT_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${file.size} bytes) exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Generate unique filename using CUID2
    const extension = getExtensionFromContentType(file.type);
    const cuid = generateCuid();
    const filename = `${cuid}.${extension}`;

    console.log("[POST] Generated filename:", filename);

    // Upload based on environment
    let result: { success: boolean; url?: string; error?: string };

    if (isProduction()) {
      console.log("[POST] PRODUCTION MODE: Uploading to GitHub");

      const { isValid, missingVars } = validateGitHubConfig();
      if (!isValid) {
        return NextResponse.json(
          {
            error: `Missing GitHub configuration: ${missingVars.join(", ")}`,
          },
          { status: 500 }
        );
      }

      result = await uploadFileToGitHub(fileBuffer, `${UPLOAD_DIR}/${filename}`);
    } else {
      console.log("[POST] DEVELOPMENT MODE: Saving to filesystem");
      result = await saveToFileSystem(fileBuffer, filename);
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Upload failed",
        },
        { status: 500 }
      );
    }

    console.log("[POST] Upload successful:", result.url);

    // Return response with file info
    const response = {
      url: result.url, // ✅ "/app-images/abc123.jpg" (одинаково в dev и prod)
      downloadUrl: result.url,
      pathname: filename,
      contentType: file.type,
      contentDisposition: "inline",
      size: fileBuffer.length,
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("[POST] Unexpected error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Comments in English: GET handler for endpoint info
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Image upload API endpoint",
    environment: isProduction() ? "production" : "development",
    uploadDirectory: UPLOAD_DIR,
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    allowedContentTypes: ALLOWED_CONTENT_TYPES,
    githubConfigured: validateGitHubConfig().isValid,
  });
}
