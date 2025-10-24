// @/app/api/config-system-prompt/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SystemPromptConfig, CustomBaseInstruction, SystemPromptCollection } from "@/types/system-prompt-types";

// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // "owner/repo"
const DEFAULT_PROMPT_FILE_PATH = "config/prompts/base-system-prompt.ts";

const PROJECT_ROOT = process.cwd();

// -------------------- Types --------------------

interface SystemPromptReadResponse {
  success: boolean;
  message?: string;
  data?: SystemPromptConfig;
  source?: "Local FileSystem" | "GitHub API";
  environment?: "development" | "production";
}

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

async function readPromptFromLocal(filePath: string): Promise<string> {
  const absolute = resolveLocalAbsolutePath(filePath);
  try {
    return await fs.readFile(absolute, "utf-8");
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new Error("System prompt file not found in local filesystem");
    }
    throw err;
  }
}

async function readPromptFromGitHub(filePath: string): Promise<string> {
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
      throw new Error("System prompt file not found in GitHub repository");
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${text}`);
  }
  const json = (await res.json()) as { content?: string; encoding?: string };
  if (!json.content)
    throw new Error("No content found in GitHub file response");
  return Buffer.from(json.content, "base64").toString("utf-8");
}

/**
 * Extract CUSTOM_BASE_INSTRUCTION string from TypeScript source
 * Handles template literals with backticks
 */
function extractCustomInstruction(source: string): CustomBaseInstruction {
  const pattern = /export\s+const\s+CUSTOM_BASE_INSTRUCTION\s*=\s*`([\s\S]*?)`;/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
    throw new Error("Could not find CUSTOM_BASE_INSTRUCTION in source file");
  }
  
  const content = match[1].trim();
  
  // TODO: Calculate actual token count via AI model
  // For now, rough estimate: ~4 characters per token
  const tokenCount = Math.ceil(content.length / 4);
  
  return {
    content,
    tokenCount,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Parse systemPromptData array from TypeScript source
 * Extracts the JSON array from: export const systemPromptData: SystemPromptCollection = [...]
 */
function parseSystemPromptData(source: string): SystemPromptCollection {
  const pattern = /export\s+const\s+systemPromptData\s*:\s*SystemPromptCollection\s*=\s*(\[[\s\S]*?\]);/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
    // If no data exists yet, return empty array
    return [];
  }
  
  try {
    const jsonStr = match[1];
    return JSON.parse(jsonStr) as SystemPromptCollection;
  } catch (err) {
    throw new Error("Failed to parse systemPromptData array as JSON");
  }
}

/**
 * Parse complete SystemPromptConfig from source file
 */
function parseSystemPromptConfig(source: string): SystemPromptConfig {
  const customInstruction = extractCustomInstruction(source);
  const knowledgeBase = parseSystemPromptData(source);
  
  // Calculate total token count
  const knowledgeBaseTokens = knowledgeBase.reduce((sum, entry) => sum + entry.tokenCount, 0);
  const totalTokenCount = customInstruction.tokenCount + knowledgeBaseTokens;
  
  return {
    customInstruction,
    knowledgeBase,
    totalTokenCount
  };
}

// -------------------- HTTP handler --------------------

export async function GET(
  req: NextRequest
): Promise<NextResponse<SystemPromptReadResponse>> {
  console.log("api/config-system-prompt/read");
  const environment = getEnvMode();
  const filePath = DEFAULT_PROMPT_FILE_PATH;

  try {
    let raw = "";
    let source: SystemPromptReadResponse["source"];

    if (environment === "production") {
      // Production: always read from GitHub
      raw = await readPromptFromGitHub(filePath);
      source = "GitHub API";
    } else {
      // Development: always read from local filesystem
      raw = await readPromptFromLocal(filePath);
      source = "Local FileSystem";
    }

    const data = parseSystemPromptConfig(raw);

    return NextResponse.json({
      success: true,
      message: `System prompt config loaded successfully from ${source}`,
      data,
      source,
      environment,
    });
  } catch (e: any) {
    const msg = String(e?.message || e || "Unknown error");

    if (msg.includes("not found")) {
      return NextResponse.json({
        success: false,
        message: "System prompt file not found",
        source: environment === "production" ? "GitHub API" : "Local FileSystem",
        environment,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: msg,
        source: environment === "production" ? "GitHub API" : "Local FileSystem",
        environment,
      },
      { status: 500 }
    );
  }
}
