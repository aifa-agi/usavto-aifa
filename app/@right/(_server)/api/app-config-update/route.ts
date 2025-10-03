// @/app/@right/(_server)/api/app-config-update/route.ts
// Comments in English: Read AppConfig from filesystem or GitHub

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { AppConfigReadResponse, AppConfigUpdateData } from "@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_types)/api-response-types";


// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // "owner/repo"
const DEFAULT_CONFIG_FILE_PATH = "config/appConfig.ts";

const PROJECT_ROOT = process.cwd();

// -------------------- Helpers --------------------

function getEnvMode(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Resolve safe path relative to project root
 * Prevent path traversal attacks
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

async function readConfigFromLocal(filePath: string): Promise<string> {
  const absolute = resolveLocalAbsolutePath(filePath);
  try {
    return await fs.readFile(absolute, "utf-8");
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new Error("AppConfig file not found in local filesystem");
    }
    throw err;
  }
}

async function readConfigFromGitHub(filePath: string): Promise<string> {
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
    if (res.status === 404)
      throw new Error("AppConfig file not found in GitHub repository");
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${text}`);
  }
  const json = (await res.json()) as { content?: string; encoding?: string };
  if (!json.content)
    throw new Error("No content found in GitHub file response");
  return Buffer.from(json.content, "base64").toString("utf-8");
}

/**
 * Extract field value from TypeScript source
 * Handles both simple strings and template literals
 */
function extractFieldValue(source: string, fieldName: string): string {
  // Match patterns like: name: "value", name: 'value', name: `value`
  const patterns = [
    new RegExp(`${fieldName}\\s*:\\s*"([^"]*)"`, ""),
    new RegExp(`${fieldName}\\s*:\\s*'([^']*)'`, ""),
    new RegExp(`${fieldName}\\s*:\\s*\`([^\`]*)\``, ""),
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return "";
}

/**
 * Extract const variable value
 * For site_url extraction
 */
function extractConstValue(source: string, constName: string): string {
  const pattern = new RegExp(`const\\s+${constName}\\s*=\\s*"([^"]*)"`, "");
  const match = source.match(pattern);
  return match && match[1] ? match[1] : "";
}

/**
 * Parse AppConfig fields from TypeScript source
 */
function parseAppConfigFields(source: string): AppConfigUpdateData {
  const siteUrl = extractConstValue(source, "site_url");

  return {
    name: extractFieldValue(source, "name"),
    short_name: extractFieldValue(source, "short_name"),
    description: extractFieldValue(source, "description"),
    lang: extractFieldValue(source, "lang"),
    logo: extractFieldValue(source, "logo"),
    chatBrand: extractFieldValue(source, "chatBrand"),
    siteUrl: siteUrl,
  };
}

// -------------------- HTTP handler --------------------

export async function GET(
  req: NextRequest
): Promise<NextResponse<AppConfigReadResponse>> {
  console.log("app-config-update/read");
  const environment = getEnvMode();
  const filePath = DEFAULT_CONFIG_FILE_PATH;

  try {
    let raw = "";
    let source: AppConfigReadResponse["source"];

    if (environment === "production") {
      // Production: prefer GitHub if configured, fallback to local
      if (GITHUB_TOKEN && GITHUB_REPO) {
        raw = await readConfigFromGitHub(filePath);
        source = "GitHub API";
      } else {
        raw = await readConfigFromLocal(filePath);
        source = "Local FileSystem";
      }
    } else {
      // Development: local filesystem
      raw = await readConfigFromLocal(filePath);
      source = "Local FileSystem";
    }

    const config = parseAppConfigFields(raw);

    return NextResponse.json({
      success: true,
      message: `AppConfig loaded successfully from ${source}`,
      config,
      source,
      environment,
    });
  } catch (e: any) {
    const msg = String(e?.message || e || "Unknown error");
    
    if (msg.includes("not found")) {
      return NextResponse.json({
        success: false,
        message: "AppConfig file not found",
        source:
          environment === "production"
            ? GITHUB_TOKEN && GITHUB_REPO
              ? "GitHub API"
              : "Local FileSystem"
            : "Local FileSystem",
        environment,
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        message: msg,
        source:
          environment === "production"
            ? GITHUB_TOKEN && GITHUB_REPO
              ? "GitHub API"
              : "Local FileSystem"
            : "Local FileSystem",
        environment,
      },
      { status: 500 }
    );
  }
}
