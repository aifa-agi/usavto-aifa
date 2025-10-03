// app/@right/(_server)/api/menu/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Simplified environment split:
 * - development: read from local filesystem
 * - production: read from GitHub (if configured), otherwise fallback to local
 *
 * Notes:
 * - All comments are in English.
 * - No Redis, no complex heuristics.
 * - Minimal, safe handling of paths: local reads are confined to project root.
 */

// -------------------- Types --------------------

interface ReadMenuResponse {
  success: boolean;
  message: string;
  categories?: unknown[];
  source?: "Local FileSystem" | "GitHub API";
  environment?: string; // "development" | "production"
}

interface ReadMenuBody {
  filePath?: string; // optional override; defaults to GITHUB_FILE_PATH
}

// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // "owner/repo"
const DEFAULT_GITHUB_FILE_PATH =
  process.env.GITHUB_FILE_PATH || "config/content/content-data.ts";

const PROJECT_ROOT = process.cwd();

// -------------------- Helpers --------------------

function getEnvMode(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Resolve a safe relative path for reading locally.
 * - Always treat the file as relative to the project root.
 * - Prevent path traversal by normalizing and ensuring it stays within root.
 */
function resolveLocalAbsolutePath(relPath: string): string {
  const safeRel = relPath.startsWith("/") ? relPath.slice(1) : relPath;
  const abs = path.join(PROJECT_ROOT, safeRel);
  const normalized = path.normalize(abs);
  if (!normalized.startsWith(PROJECT_ROOT)) {
    throw new Error("Unsafe path");
  }
  return normalized;
}

async function readMenuFromLocal(filePath: string): Promise<string> {
  const absolute = resolveLocalAbsolutePath(filePath);
  try {
    return await fs.readFile(absolute, "utf-8");
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new Error("Menu file not found in local filesystem");
    }
    throw err;
  }
}

async function readMenuFromGitHub(filePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub config missing");
  }
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Menu file not found in GitHub repository");
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${text}`);
  }
  const json = (await res.json()) as { content?: string; encoding?: string };
  if (!json.content) throw new Error("No content found in GitHub file response");
  return Buffer.from(json.content, "base64").toString("utf-8");
}

/**
 * Extract array literal assigned to menuCategories/categories and parse it.
 * Correctly handles escaped quotes using prev !== "\\"
 */
function extractAndParseMenuCategories(source: string): unknown[] {
  const patterns = [
    /export\s+const\s+menuCategories\s*=\s*(\[)/,
    /const\s+menuCategories\s*=\s*(\[)/,
    /export\s+const\s+categories\s*=\s*(\[)/,
    /const\s+categories\s*=\s*(\[)/,
  ];

  let startIndex = -1;
  for (const re of patterns) {
    const m = source.match(re);
    if (m && typeof m.index === "number") {
      startIndex = m.index + m[0].lastIndexOf(m[1]);
      break;
    }
  }

  if (startIndex === -1) {
    const any = source.indexOf("[");
    if (any >= 0) startIndex = any;
    else return [];
  }

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
      else if (ch === "]") {
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

  try {
    return JSON.parse(literal);
  } catch {
    try {
      // eslint-disable-next-line no-new-func
      const evaluate = new Function(`"use strict"; return (${literal});`);
      const value = evaluate();
      if (!Array.isArray(value)) throw new Error("Parsed menu categories is not an array");
      return value;
    } catch {
      throw new Error("Could not parse menu categories from file");
    }
  }
}

// -------------------- HTTP handler --------------------

export async function POST(req: NextRequest): Promise<NextResponse<ReadMenuResponse>> {
  console.log("menu/read")
  const environment = getEnvMode();
  let filePath: string = DEFAULT_GITHUB_FILE_PATH;

  // Accept optional override but keep it simple; no regex validation
  try {
    const body = (await req.json().catch(() => ({}))) as ReadMenuBody;
    if (body?.filePath && typeof body.filePath === "string" && body.filePath.trim()) {
      filePath = body.filePath.trim();
    }
  } catch {
    // ignore body parse errors; use default file path
  }

  try {
    let raw = "";
    let source: ReadMenuResponse["source"];

    if (environment === "production") {
      // In production prefer GitHub if configured; otherwise fallback to local
      if (GITHUB_TOKEN && GITHUB_REPO) {
        raw = await readMenuFromGitHub(filePath);
        source = "GitHub API";
      } else {
        raw = await readMenuFromLocal(filePath);
        source = "Local FileSystem";
      }
    } else {
      // development: local filesystem
      raw = await readMenuFromLocal(filePath);
      source = "Local FileSystem";
    }

    const categories = extractAndParseMenuCategories(raw);
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, message: "Menu data is not an array", source, environment },
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
  } catch (e: any) {
    const msg = String(e?.message || e || "Unknown error");
    // If file not found, return success:true with empty categories for graceful UI
    if (msg.includes("not found")) {
      return NextResponse.json({
        success: true,
        message: `No menu file found`,
        categories: [],
        source: environment === "production" ? (GITHUB_TOKEN && GITHUB_REPO ? "GitHub API" : "Local FileSystem") : "Local FileSystem",
        environment,
      });
    }
    return NextResponse.json(
      {
        success: false,
        message: msg,
        source: environment === "production" ? (GITHUB_TOKEN && GITHUB_REPO ? "GitHub API" : "Local FileSystem") : "Local FileSystem",
        environment,
      },
      { status: 500 }
    );
  }
}
