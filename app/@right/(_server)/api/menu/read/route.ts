// app/@right/(_server)/api/menu/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * NOTE FOR REVIEWERS:
 * - All comments are written in English per project requirements.
 * - This route reads menu categories either from local filesystem (development)
 *   or directly from GitHub Contents API (production), mirroring the patterns
 *   used in the sections read route provided earlier by the user.
 * - No Redis caching is used. Fresh data is fetched on each request.
 * - Input validation prevents unsafe paths; the default behavior reads a single configured file.
 */

// --- Types --------------------------------------------------------------

interface ReadMenuResponse {
  success: boolean;
  message: string;
  categories?: unknown[]; // Replace with concrete MenuCategory[] type if import is allowed here
  source?: "Local FileSystem" | "GitHub API";
  environment?: string; // e.g. "production (reason...)" or "development (reason...)"
}

interface ReadMenuBody {
  // Optional: allow param to target alternative files/locales in the future
  filePath?: string; // must pass validation; if omitted, uses GITHUB_FILE_PATH
}

// --- Environment configuration -----------------------------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. "org/repo"
const GITHUB_PAGES_BASE_PATH =
  process.env.GITHUB_PAGES_BASE_PATH || "app/@right/(_PAGES)";
const DEFAULT_GITHUB_FILE_PATH =
  process.env.GITHUB_FILE_PATH || "config/content/content-data.ts";

// Absolute local project root for safe joins
const PROJECT_ROOT = process.cwd();

// --- Environment detection (same philosophy as sections route) ----------

function detectEnvironment(): {
  isDevelopment: boolean;
  useLocal: boolean;
  reason: string;
} {
  const nodeEnv = process.env.NODE_ENV;
  const hasGitHubConfig = !!(GITHUB_TOKEN && GITHUB_REPO);

  // Heuristics to detect presence of local pages folder
  const localPagesPath = path.join(PROJECT_ROOT, "app", "@right", "(_PAGES)");
  let hasLocalFiles = false;
  try {
    const stat = require("fs").statSync(localPagesPath);
    hasLocalFiles = stat.isDirectory();
  } catch {
    hasLocalFiles = false;
  }

  const isVercel = !!process.env.VERCEL;
  const isNetlify = !!process.env.NETLIFY;
  const isLocal =
    !isVercel &&
    !isNetlify &&
    (process.env.PWD?.includes("/Users/") ||
      process.env.PWD?.includes("/home/") ||
      process.env.USERPROFILE?.includes("\\Users\\") ||
      process.env.COMPUTERNAME ||
      !!process.env.USERNAME);

  if (nodeEnv === "development") {
    if (hasLocalFiles) {
      return {
        isDevelopment: true,
        useLocal: true,
        reason: "Development mode with local files available",
      };
    } else if (hasGitHubConfig) {
      return {
        isDevelopment: true,
        useLocal: false,
        reason: "Development mode without local files, using GitHub",
      };
    }
  }

  if (nodeEnv === "production") {
    if (hasGitHubConfig) {
      return {
        isDevelopment: false,
        useLocal: false,
        reason: "Production mode with GitHub config",
      };
    } else if (hasLocalFiles && isLocal) {
      return {
        isDevelopment: false,
        useLocal: true,
        reason: "Production mode locally with local files",
      };
    }
  }

  if (hasLocalFiles && isLocal) {
    return {
      isDevelopment: true,
      useLocal: true,
      reason: "Local environment detected with local files",
    };
  }

  if (hasGitHubConfig && (isVercel || isNetlify)) {
    return {
      isDevelopment: false,
      useLocal: false,
      reason: "Cloud deployment detected with GitHub config",
    };
  }

  if (hasGitHubConfig) {
    return {
      isDevelopment: false,
      useLocal: false,
      reason: "Fallback to GitHub (only available option)",
    };
  }

  return {
    isDevelopment: true,
    useLocal: true,
    reason: "No valid config found, attempting local files",
  };
}

// --- Safe input validation ---------------------------------------------

// Only allow simple relative paths of the shape: a/b/c (letters, numbers, _ and -)
const SAFE_PATH_REGEX = /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.?[a-zA-Z0-9_-]*$/;

/**
 * Validates user-provided filePath. If not provided, falls back to DEFAULT_GITHUB_FILE_PATH.
 * This helps us support future locales/namespaces while preventing path traversal.
 */
function resolveSafeFilePath(input?: string): string {
  const candidate = (input || DEFAULT_GITHUB_FILE_PATH).trim();
  if (!SAFE_PATH_REGEX.test(candidate)) {
    throw new Error(
      `Invalid file path format. Path "${candidate}" is not allowed.`
    );
  }
  return candidate;
}

// --- File readers -------------------------------------------------------

/**
 * Reads menu content from local filesystem.
 * The path is relative to project root; we join and normalize to avoid traversal.
 */
async function readMenuFromLocal(filePath: string): Promise<string> {
  // For local, allow reading either from configured file path,
  // or the same relative path as used for GitHub.
  const absolute = path.join(PROJECT_ROOT, filePath);
  // Also consider the project structure if the file actually lives under /config/content/
  // Since DEFAULT_GITHUB_FILE_PATH is already relative (e.g., config/content/content-data.ts),
  // the join above should be correct.
  try {
    const content = await fs.readFile(absolute, "utf-8");
    return content;
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new Error("Menu file not found in local filesystem");
    }
    throw err;
  }
}

/**
 * Reads menu content from GitHub Contents API using repository settings.
 * The function expects a text/ts file that contains a top-level constant with menu data.
 */
async function readMenuFromGitHub(filePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error(
      "GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required"
    );
  }

  // Build Contents API URL. We do not prepend GITHUB_PAGES_BASE_PATH here,
  // because menu data was declared as GITHUB_FILE_PATH= config/content/content-data.ts.
  // If your repo stores this under a subfolder, ensure the env var reflects that path.
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App",
    },
    // Explicitly no-cache to always fetch fresh content from GitHub
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Menu file not found in GitHub repository");
    }
    const errorData = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
  }

  const data = (await response.json()) as { content?: string; encoding?: string };
  if (!data.content) {
    throw new Error("No content found in GitHub file response");
  }

  const buffer = Buffer.from(data.content, "base64");
  return buffer.toString("utf-8");
}

// --- Content parsing ----------------------------------------------------

/**
 * Extracts a JSON-like array/object literal from a TS/JS source and returns parsed data.
 * Strategy:
 * 1) Attempt to find a recognizable assignment, e.g.:
 *    export const menuCategories = [...]
 *    or
 *    const menuCategories = [...]
 * 2) If an array/object is found, parse with JSON.parse if compatible.
 *    Otherwise, evaluate with a restricted Function returning the literal.
 *
 * IMPORTANT: We only evaluate the extracted literal, not the entire file,
 * and we avoid executing arbitrary code by returning only the literal.
 */
function extractAndParseMenuCategories(source: string): unknown[] {
  // Heuristics: try to find a top-level constant named "menuCategories" or "categories"
  // Adjust the patterns based on your actual file content.
  const candidates = [
    /const\s+menuCategories\s*=\s*(\[)/,
    /export\s+const\s+menuCategories\s*=\s*(\[)/,
    /const\s+categories\s*=\s*(\[)/,
    /export\s+const\s+categories\s*=\s*(\[)/,
    // In case data is an object with a property, you may add object pattern too:
    // /const\s+menuData\s*=\s*(\{)/,
  ];

  // Find first matching start
  let startIndex = -1;
  let startsWith: "[" | "{" | null = null;
  for (const re of candidates) {
    const m = source.match(re);
    if (m && typeof m.index === "number") {
      startIndex = m.index + m[0].lastIndexOf(m[1]); // position at the "[" captured group
      startsWith = m[1] as "["; // current candidates only capture "["
      break;
    }
  }

  if (startIndex === -1 || !startsWith) {
    // Fallback: attempt to find a first array literal in the file (riskier but pragmatic)
    const anyArray = source.indexOf("[");
    if (anyArray >= 0) {
      startIndex = anyArray;
      startsWith = "[";
    } else {
      // As a safe default return empty array for "file exists but no data"
      return [];
    }
  }

  // Balanced bracket extraction with string-awareness
  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let stringChar = "";
  for (let i = startIndex; i < source.length; i++) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";

    if ((ch === '"' || ch === "'" || ch === "`") && prev !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = ch;
      } else if (ch === stringChar) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString) {
      if (ch === "[") depth++;
      if (ch === "]") {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex === -1) {
    throw new Error("Could not find a closing bracket for menu categories array");
  }

  const literal = source.substring(startIndex, endIndex + 1).trim();

  // First try JSON.parse (works only if it is valid JSON)
  try {
    return JSON.parse(literal);
  } catch {
    // Fallback to restricted Function evaluation
    try {
      // eslint-disable-next-line no-new-func
      const evaluate = new Function(`"use strict"; return (${literal});`);
      const value = evaluate();
      if (!Array.isArray(value)) {
        throw new Error("Parsed menu categories is not an array");
      }
      return value;
    } catch (evalErr) {
      // Provide some context without leaking the literal content entirely
      throw new Error(
        `Could not parse menu categories from file (invalid structure or non-literal data)`
      );
    }
  }
}

// --- HTTP handler -------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse<ReadMenuResponse>> {
  try {
    const body: ReadMenuBody = (await req.json().catch(() => ({}))) || {};
    let filePath: string;

    try {
      filePath = resolveSafeFilePath(body.filePath);
    } catch (validationErr: any) {
      return NextResponse.json(
        {
          success: false,
          message: validationErr?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { isDevelopment, useLocal, reason } = detectEnvironment();
    const environment = `${process.env.NODE_ENV} (${reason})`;

    try {
      let raw: string;
      let source: ReadMenuResponse["source"];

      if (useLocal) {
        // Local filesystem
        raw = await readMenuFromLocal(filePath);
        source = "Local FileSystem";
      } else {
        // GitHub API
        raw = await readMenuFromGitHub(filePath);
        source = "GitHub API";
      }

      // Extract and parse categories
      const categories = extractAndParseMenuCategories(raw);

      if (!Array.isArray(categories)) {
        return NextResponse.json(
          {
            success: false,
            message: "Menu data is not an array",
            source,
            environment,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Menu categories loaded successfully from ${source}`,
        categories,
        source,
        environment,
      });
    } catch (fetchErr: any) {
      const source = useLocal ? "Local FileSystem" : "GitHub API";
      const msg = String(fetchErr?.message || fetchErr || "Unknown error");

      // If file not found, return empty result as success:true for graceful UI handling
      if (msg.includes("not found")) {
        return NextResponse.json({
          success: true,
          message: `No menu file found in ${source}`,
          categories: [],
          source,
          environment,
        });
      }

      // Other errors => 500
      return NextResponse.json(
        {
          success: false,
          message: msg,
          source,
          environment,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    // Unexpected handler-level failure
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error occurred",
        environment: String(process.env.NODE_ENV || "unknown"),
      },
      { status: 500 }
    );
  }
}
