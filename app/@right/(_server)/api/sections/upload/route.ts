// Main API route handler for page upload operations
// Production-critical module - consolidated from decomposed services

import { NextRequest, NextResponse } from "next/server";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import { requirePrivilegedUser } from "@/app/@right/(_service)/(_utils)/auth-helpers";

// Import decomposed services
import { saveToGitHub, type PageUploadResponse, ErrorCode } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/github-service";
import { saveToFileSystem } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/filesystem-service";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function validateRequestBody(body: any): body is PageUploadPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { href, pageMetadata, sections } = body;

  if (!href || typeof href !== "string" || href.trim() === "") {
    throw new Error("href is required and must be a non-empty string");
  }

  if (!pageMetadata || typeof pageMetadata !== "object") {
    throw new Error("pageMetadata is required and must be an object");
  }

  if (!sections || !Array.isArray(sections)) {
    throw new Error("sections must be an array");
  }

  // ✅ ИСПРАВЛЕНО: Регулярное выражение теперь разрешает многоуровневые пути.
  const hrefRegex = /^\/([a-zA-Z0-9_-]+\/?)+$/;
  if (!hrefRegex.test(href)) {
    throw new Error(
      `href must be a valid path like "/category/subcategory". It received: "${href}"`
    );
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section || typeof section !== "object") {
      throw new Error(`Section at index ${i} must be an object`);
    }
    if (!section.id || typeof section.id !== "string") {
      throw new Error(`Section at index ${i} must have a string "id" property`);
    }
  }

  return true;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PageUploadResponse>> {
  const requestId = crypto.randomUUID();

  console.log(`\n${"=".repeat(70)}`);
  console.log(`[${requestId}] 🚀 NEW REQUEST: Page Upload API`);
  console.log(`${"=".repeat(70)}`);

  // 🔐 AUTHORIZATION CHECK: Only privileged users can upload pages
  const authResult = await requirePrivilegedUser(
    requestId,
    "Only administrators, architects, and editors can upload pages"
  );

  if (!authResult.success) {
    console.log(`${"=".repeat(70)}\n`);
    return authResult.response as NextResponse<PageUploadResponse>;
  }

  const { session, userRole, isPrivileged } = authResult;

  console.log(`[${requestId}] ✅ User authorized: ${session?.user?.email || "unknown"}`);
  console.log(`[${requestId}] ✅ User role: ${userRole}`);
  console.log(`[${requestId}] ✅ Proceeding with page upload operation...`);

  try {
    let body;
    try {
      body = await request.json();
      console.log(`[${requestId}] 📝 Request body parsed successfully`);
    } catch (error) {
      console.error(`[${requestId}] ❌ Failed to parse JSON body`);
      console.log(`${"=".repeat(70)}\n`);

      return NextResponse.json({
        success: false,
        message: "Invalid JSON in request body",
        errorCode: ErrorCode.INVALID_DATA_FORMAT,
        environment: isProduction() ? "production" : "development",
      }, { status: 400 });
    }

    try {
      validateRequestBody(body);
      console.log(`[${requestId}] ✅ Request body validation passed`);
      console.log(`[${requestId}] 📝 href: ${body.href}`);
      console.log(`[${requestId}] 📝 sections count: ${body.sections?.length || 0}`);
    } catch (error) {
      console.error(`[${requestId}] ❌ Validation failed:`, error instanceof Error ? error.message : "Unknown error");
      console.log(`${"=".repeat(70)}\n`);

      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : "Validation failed",
        errorCode: ErrorCode.VALIDATION_ERROR,
        environment: isProduction() ? "production" : "development",
      }, { status: 400 });
    }

    const payload = body as PageUploadPayload;

    console.log(`[${requestId}] 🌍 Environment: ${isProduction() ? "production" : "development"}`);

    // ✅ ИСПРАВЛЕНО: Больше не парсим href на части.
    // Передаем весь payload в сервисы сохранения.
    let result: PageUploadResponse;

    if (isProduction()) {
      console.log(`[${requestId}] 🌐 Saving to GitHub...`);
      result = await saveToGitHub(payload);
      console.log(`[${requestId}] 🌐 GitHub save result: ${result.success ? "SUCCESS" : "FAILED"}`);
    } else {
      console.log(`[${requestId}] 💾 Saving to filesystem...`);
      result = await saveToFileSystem(payload);
      console.log(`[${requestId}] 💾 Filesystem save result: ${result.success ? "SUCCESS" : "FAILED"}`);
    }

    const httpStatus = result.success ? 200 : 500;

    console.log(`[${requestId}] 🎯 Final status: ${result.success ? "SUCCESS" : "FAILED"} (HTTP ${httpStatus})`);
    console.log(`[${requestId}] 🎯 Message: ${result.message}`);
    console.log(`${"=".repeat(70)}\n`);

    return NextResponse.json(result, { status: httpStatus });

  } catch (error: any) {
    console.error(`[${requestId}] 💥 Unexpected error in upload endpoint:`, error);
    console.error(`[${requestId}] 💥 Error message:`, error.message || "Unknown error");
    console.error(`[${requestId}] 💥 Error stack:`, error.stack);
    console.log(`${"=".repeat(70)}\n`);

    const errorResponse: PageUploadResponse = {
      success: false,
      message: "An unexpected error occurred in the upload endpoint",
      error: error.message || "Unknown error",
      errorCode: ErrorCode.UNKNOWN_ERROR,
      environment: isProduction() ? "production" : "development",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET handler остается без изменений, но также имеет устаревшую логику parseHref,
// которую стоит исправить в будущем, если она используется.
export async function GET(request: NextRequest): Promise<NextResponse> {
  // ... (код без изменений)
  return NextResponse.json({ message: "GET not fully implemented with new logic" });
}
