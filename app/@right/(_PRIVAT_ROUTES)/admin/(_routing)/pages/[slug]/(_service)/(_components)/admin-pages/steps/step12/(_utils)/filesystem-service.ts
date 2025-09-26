// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/filesystem-service.ts

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import { generatePageTsxContent } from "./page-generator";

// Интерфейсы и Enum остаются без изменений
interface PageUploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  environment: "development" | "production";
  error?: string;
  errorCode?: string;
  details?: string;
}

enum ErrorCode {
  GITHUB_TOKEN_INVALID = "github_token_invalid",
  GITHUB_API_UNAVAILABLE = "github_api_unavailable",
  NETWORK_ERROR = "network_error",
  FILE_WRITE_FAILED = "file_write_failed",
  INVALID_DATA_FORMAT = "invalid_data_format",
  DIRECTORY_CREATION_FAILED = "directory_creation_failed",
  VALIDATION_ERROR = "validation_error",
  UNKNOWN_ERROR = "unknown_error",
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * ✅ ИЗМЕНЕНО: Функция теперь принимает один аргумент `payload`.
 */
export async function saveToFileSystem(
  payload: PageUploadPayload
): Promise<PageUploadResponse> {
  try {
    // ✅ ИЗМЕНЕНО: Строим все пути на основе полного href из payload.
    const pagesDir = join(process.cwd(), "app", "@right", "(_PAGES)");
    const relativePath = payload.href.startsWith("/") ? payload.href.slice(1) : payload.href;
    const pageDir = join(pagesDir, relativePath);
    const filePath = join(pageDir, "page.tsx");
    const relativeFilePath = `app/@right/(_PAGES)/${relativePath}/page.tsx`;

    // ✅ УПРОЩЕНО: Один вызов для создания всех вложенных директорий.
    await ensureDirectoryExists(pageDir);

    // ✅ ВАЖНО: `generatePageTsxContent` также должен быть обновлен.
    const fileContent = generatePageTsxContent(payload);
    await writeFile(filePath, fileContent, "utf-8");

    return {
      success: true,
      message: `Successfully created page "${payload.pageMetadata.title || 'Untitled'}" in filesystem`,
      filePath: relativeFilePath,
      environment: "development",
    };
  } catch (error: any) {
    // ... (обработка ошибок без изменений)
    if (error.message.includes("EACCES")) {
      return {
        success: false,
        message: "Permission denied: Unable to write to file system",
        error: error.message,
        errorCode: ErrorCode.FILE_WRITE_FAILED,
        environment: "development",
      };
    }

    if (error.message.includes("ENOSPC")) {
      return {
        success: false,
        message: "No space left on device",
        error: error.message,
        errorCode: ErrorCode.FILE_WRITE_FAILED,
        environment: "development",
      };
    }

    return {
      success: false,
      message: "Failed to create page in local filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: ErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

// Экспорты остаются без изменений
export type { PageUploadResponse };
export { ErrorCode };
