// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/github-service.ts

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

/**
 * ✅ ИЗМЕНЕНО: Функция теперь принимает один аргумент `payload`.
 */
export async function saveToGitHub(
  payload: PageUploadPayload
): Promise<PageUploadResponse> {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_PAGES_BASE_PATH = process.env.GITHUB_PAGES_BASE_PATH || "app/@right/(_PAGES)";

    if (!GITHUB_TOKEN) {
      return {
        success: false,
        message: "GitHub token is not configured",
        error: "GitHub token is missing in environment variables",
        errorCode: ErrorCode.GITHUB_TOKEN_INVALID,
        environment: "production",
      };
    }

    if (!GITHUB_REPO) {
      return {
        success: false,
        message: "GitHub repository is not configured",
        error: "GitHub repository is missing in environment variables",
        errorCode: ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    // ✅ ИЗМЕНЕНО: Извлекаем href напрямую из payload.
    const { href } = payload;
    
    // ✅ ВАЖНО: `generatePageTsxContent` также должен быть обновлен,
    // чтобы принимать только `payload`.
    const fileContents = generatePageTsxContent(payload);
    const encodedContent = Buffer.from(fileContents).toString("base64");
    
    // ✅ ИЗМЕНЕНО: Строим путь на основе полного href.
    const relativePath = href.startsWith("/") ? href.slice(1) : href;
    const filePath = `${GITHUB_PAGES_BASE_PATH}/${relativePath}/page.tsx`;

    // Логика получения SHA остается без изменений
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let sha: string | undefined;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Логика создания/обновления файла
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ✅ ИЗМЕНЕНО: Используем полный href в сообщении коммита.
          message: `${sha ? 'Update' : 'Create'} page: "${payload.pageMetadata.title || href}" - ${new Date().toISOString()}`,
          content: encodedContent,
          ...(sha && { sha }),
        }),
      }
    );

    if (!updateResponse.ok) {
        // ... (обработка ошибок без изменений)
      const errorData = await updateResponse.json().catch(() => ({}));
      return {
        success: false,
        message: "Failed to update page on GitHub",
        error: `GitHub API returned ${updateResponse.status}: ${errorData.message || "Unknown error"}`,
        errorCode: updateResponse.status === 401
          ? ErrorCode.GITHUB_TOKEN_INVALID
          : ErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
        details: JSON.stringify(errorData),
      };
    }

    return {
      success: true,
      message: `Successfully created/updated page "${payload.pageMetadata.title || 'Untitled'}" on GitHub`,
      filePath: filePath,
      environment: "production",
    };
  } catch (error: any) {
    // ... (обработка ошибок без изменений)
    return {
      success: false,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: ErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

// Экспорты остаются без изменений
export type { PageUploadResponse };
export { ErrorCode };
