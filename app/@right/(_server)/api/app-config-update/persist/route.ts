// @/app/@right/(_server)/api/app-config-update/persist/route.ts
// Comments in English: Persist AppConfig to filesystem or GitHub

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AppConfigErrorCode, AppConfigOperationStatus, AppConfigPersistResponse, AppConfigUpdateData } from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/api-response-types";


const DEFAULT_CONFIG_PATH = "config/appConfig.ts";

function getFilePaths() {
  const relativePath = DEFAULT_CONFIG_PATH;
  const localPath = path.resolve(process.cwd(), relativePath);

  return {
    localPath,
    relativePath,
  };
}

const { localPath: CONFIG_PATH, relativePath: GITHUB_RELATIVE_PATH } =
  getFilePaths();

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

async function getCurrentFileFromGitHub(): Promise<{
  content: string;
  sha: string;
} | null> {
  try {
    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_RELATIVE_PATH}`,
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
 * Generate complete AppConfig.ts file content
 * Full template string replacement approach
 */
function generateAppConfigFile(config: AppConfigUpdateData): string {
  const timestamp = new Date().toISOString();
  
  return `// @/config/appConfig.ts
// Comments in English: Single source of truth for SEO/PWA. Everything reads from here.

const site_url = "${config.siteUrl}";

export const appConfig: AppConfig = {
  name: "${config.name}",
  short_name: "${config.short_name}",
  description: "${config.description}",
  url: site_url,
  ogImage: \`\${site_url}/images/usautopro1.jpg\`,

  // Next.js convention via app/manifest.ts
  manifest: "/manifest.webmanifest",

  lang: "${config.lang}",
  mailSupport: "support@aifa.dev",
  illustrations: {
    loading: {
      dark: "/_static/illustrations/idea-launch.svg",
      light: "/_static/illustrations/success.svg",
    },
  },
  startChatIllustration: "${config.logo}",
  logo: "${config.logo}",
  chatBrand: "${config.chatBrand}",

  // Icons set for Metadata API and PWA
  icons: {
    faviconAny: "/favicon.ico",
    icon32: "/icons/icon-32.png",
    icon48: "/icons/icon-48.png",
    icon192: "/android-chrome-192x192.png",
    icon512: "/android-chrome-512x512.png",
    appleTouch: "/apple-touch-icon.png",
  },

  // PWA defaults
  pwa: {
    themeColor: "#ffffff",
    backgroundColor: "#ffffff",
    startUrl: "/",
    display: "standalone",
    scope: "/",
    orientation: "any",
  },

  // SEO and crawling
  seo: {
    indexing: "allow",
    sitemapUrl: \`\${site_url}/sitemap.xml\`,
    disallowPaths: ["/admin", "/auth", "/login", "/register", "/chat", "/api", "/_next"],
    canonicalBase: site_url,
    locales: ["ru"],
    defaultLocale: "ru",
    social: {
      twitter: "@aifa_agi",
      github: "https://github.com/aifa-agi/aifa",
    },
  },

  // Open Graph / Twitter defaults
  og: {
    type: "website",
    locale: "ru_RU",
    siteName: "${config.short_name}",
    imageWidth: 1200,
    imageHeight: 630,
  },

  // Per-page defaults (can be overridden by constructMetadata arguments)
  pageDefaults: {
    titleTemplate: "%s | ${config.short_name}",
    robotsIndex: true,
    robotsFollow: true,
  },

  messages: {
    loading: {
      title: "Загрузка...",
      subtitle: "Пожалуйста, подождите",
    },
  },
};

export type SupportedLang = "ru" | "en" | "es" | "fr" | "de" | "it";

export interface AppConfig {
  name: string;
  short_name: string;
  description: string;
  url: string;
  ogImage: string;
  manifest: string;
  mailSupport: string;
  lang: SupportedLang;
  illustrations: {
    loading: {
      dark: string;
      light: string;
    };
  };
  startChatIllustration: string;
  logo: string;
  chatBrand: string;
  icons: {
    faviconAny?: string;
    icon32?: string;
    icon48?: string;
    icon192: string;
    icon512: string;
    appleTouch?: string;
  };

  pwa: {
    themeColor: string;
    backgroundColor: string;
    startUrl: string;
    display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
    scope?: string;
    orientation?: "any" | "portrait" | "landscape";
  };

  seo: {
    indexing: "allow" | "disallow";
    sitemapUrl?: string;
    disallowPaths?: string[];
    canonicalBase?: string;
    locales?: string[];
    defaultLocale?: string;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      facebook?: string;
    };
  };

  og?: {
    type?: "website" | "article" | "profile" | "video.other";
    locale?: string;
    siteName?: string;
    imageWidth?: number;
    imageHeight?: number;
  };

  pageDefaults?: {
    titleTemplate?: string;
    robotsIndex?: boolean;
    robotsFollow?: boolean;
  };

  messages?: {
    loading?: {
      title?: string;
      subtitle?: string;
    };
  };
}

// Last updated: ${timestamp}
// Generated by: app-config-persist-api
`;
}

async function saveToGitHub(
  config: AppConfigUpdateData
): Promise<AppConfigPersistResponse> {
  try {
    const { isValid, missingVars } = validateGitHubConfig();
    if (!isValid) {
      return {
        status: AppConfigOperationStatus.GITHUB_API_ERROR,
        message: `Missing GitHub configuration: ${missingVars.join(", ")}`,
        error: `Missing environment variables: ${missingVars.join(", ")}`,
        errorCode: AppConfigErrorCode.GITHUB_TOKEN_INVALID,
        environment: "production",
      };
    }

    const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
    const fileContent = generateAppConfigFile(config);

    let currentFile: { content: string; sha: string } | null = null;

    try {
      currentFile = await getCurrentFileFromGitHub();
    } catch (error) {
      // File doesn't exist, will create new
    }

    if (currentFile && currentFile.content === fileContent) {
      return {
        status: AppConfigOperationStatus.SUCCESS,
        message: "GitHub file is already up to date",
        environment: "production",
      };
    }

    const apiPayload = {
      message: `Update AppConfig - ${new Date().toISOString()}`,
      content: Buffer.from(fileContent, "utf-8").toString("base64"),
      branch: process.env.GITHUB_BRANCH || "main",
      ...(currentFile && { sha: currentFile.sha }),
    };

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_RELATIVE_PATH}`,
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
        status: AppConfigOperationStatus.GITHUB_API_ERROR,
        message: "Failed to update file on GitHub",
        error: `GitHub API returned ${response.status}: ${errorData.message || "Unknown error"}`,
        errorCode:
          response.status === 401
            ? AppConfigErrorCode.GITHUB_TOKEN_INVALID
            : AppConfigErrorCode.GITHUB_API_UNAVAILABLE,
        environment: "production",
      };
    }

    return {
      status: AppConfigOperationStatus.SUCCESS,
      message: "Successfully updated AppConfig on GitHub",
      environment: "production",
    };
  } catch (error: any) {
    return {
      status: AppConfigOperationStatus.GITHUB_API_ERROR,
      message: "Network error while connecting to GitHub",
      error: error.message || "Unknown network error",
      errorCode: AppConfigErrorCode.NETWORK_ERROR,
      environment: "production",
    };
  }
}

function saveToFileSystem(
  config: AppConfigUpdateData
): AppConfigPersistResponse {
  try {
    const fileContent = generateAppConfigFile(config);

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let hasChanged = true;
    if (fs.existsSync(CONFIG_PATH)) {
      const currentContent = fs.readFileSync(CONFIG_PATH, "utf-8");
      hasChanged = currentContent !== fileContent;
    }

    if (!hasChanged) {
      return {
        status: AppConfigOperationStatus.SUCCESS,
        message: "Local file is already up to date",
        environment: "development",
      };
    }

    fs.writeFileSync(CONFIG_PATH, fileContent, "utf-8");

    return {
      status: AppConfigOperationStatus.SUCCESS,
      message: "Successfully saved to filesystem",
      environment: "development",
    };
  } catch (error: any) {
    return {
      status: AppConfigOperationStatus.FILESYSTEM_ERROR,
      message: "Failed to save file to local filesystem",
      error: error.message || "Unknown filesystem error",
      errorCode: AppConfigErrorCode.FILE_WRITE_FAILED,
      environment: "development",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = body as AppConfigUpdateData;

    // Validate required fields
    const requiredFields: (keyof AppConfigUpdateData)[] = [
      "name",
      "short_name",
      "description",
      "lang",
      "logo",
      "chatBrand",
      "siteUrl",
    ];

    const missingFields = requiredFields.filter((field) => !config[field]);

    if (missingFields.length > 0) {
      const validationResponse: AppConfigPersistResponse = {
        status: AppConfigOperationStatus.VALIDATION_ERROR,
        message: "Invalid data format",
        error: `Missing required fields: ${missingFields.join(", ")}`,
        errorCode: AppConfigErrorCode.INVALID_DATA_FORMAT,
        environment: isProduction() ? "production" : "development",
      };
      return NextResponse.json(validationResponse, { status: 400 });
    }

    const localResult = saveToFileSystem(config);

    if (isProduction()) {
      const githubResult = await saveToGitHub(config);

      if (
        localResult.status === AppConfigOperationStatus.SUCCESS &&
        githubResult.status !== AppConfigOperationStatus.SUCCESS
      ) {
        return NextResponse.json({
          status: AppConfigOperationStatus.SUCCESS,
          message: "Saved locally but GitHub sync failed",
          error: githubResult.error,
          environment: "production",
        });
      }

      const httpStatus =
        githubResult.status === AppConfigOperationStatus.SUCCESS ? 200 : 500;
      return NextResponse.json(githubResult, { status: httpStatus });
    }

    const httpStatus =
      localResult.status === AppConfigOperationStatus.SUCCESS ? 200 : 500;
    return NextResponse.json(localResult, { status: httpStatus });
  } catch (error: any) {
    const errorResponse: AppConfigPersistResponse = {
      status: AppConfigOperationStatus.UNKNOWN_ERROR,
      message: "An unexpected error occurred",
      error: error.message || "Unknown error",
      environment: isProduction() ? "production" : "development",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      message: "AppConfig persist API endpoint",
      environment: isProduction() ? "production" : "development",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
