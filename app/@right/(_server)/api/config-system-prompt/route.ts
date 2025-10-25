// @/app/@right/(_server)/api/config-system-prompt/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SystemPromptConfig, CustomBaseInstruction, SystemPromptCollection } from "@/types/system-prompt-types";

// ============ CONFIGURATION ============

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const DEFAULT_PROMPT_FILE_PATH = "config/prompts/base-system-prompt.ts";
const PROJECT_ROOT = process.cwd();

// ============ TYPES ============

interface SystemPromptReadResponse {
  success: boolean;
  message?: string;
  data?: SystemPromptConfig;
  source?: "Local FileSystem" | "GitHub API";
  environment?: "development" | "production";
}

// ============ HELPERS ============

function getEnvMode(): "development" | "production" {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

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

function extractCustomInstruction(source: string): CustomBaseInstruction {
  const pattern = /export\s+const\s+CUSTOM_BASE_INSTRUCTION\s*=\s*`([\s\S]*?)`;/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
    throw new Error("Could not find CUSTOM_BASE_INSTRUCTION in source file");
  }
  
  const content = match[1].trim();
  const tokenCount = Math.ceil(content.length / 4);
  
  return {
    content,
    tokenCount,
    lastUpdated: new Date().toISOString()
  };
}

function parseSystemPromptData(source: string): SystemPromptCollection {
  const pattern = /export\s+const\s+systemPromptData\s*:\s*SystemPromptCollection\s*=\s*(\[[\s\S]*?\]);/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
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
 * Extracts INTERNAL_COMPANY_KB_TOKENS value from file
 * 
 * IMPORTANT: This function ONLY reads the value for logging purposes
 * It does NOT add this value to totalTokenCount
 * Total token calculation with internal KB happens in token-utils.ts
 */
function extractInternalKBTokens(source: string): number {
  // Look for exported INTERNAL_COMPANY_KB_TOKENS variable
  const pattern = /export\s+const\s+INTERNAL_COMPANY_KB_TOKENS\s*=\s*(\d+);/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
    // If not found, try to find inline value from internal code
    const inlinePattern = /internalKnowledgeTokens\s*=\s*INTERNAL_COMPANY_KNOWLEDGE_BASE_TOKENS\s*\|\|\s*(\d+)/;
    const inlineMatch = source.match(inlinePattern);
    
    if (inlineMatch && inlineMatch[1]) {
      console.log(`[Extract Internal KB] Found inline value: ${inlineMatch[1]}`);
      return parseInt(inlineMatch[1], 10);
    }
    
    // If internal KB not found, return 0 (file might be missing)
    console.log(`[Extract Internal KB] No internal KB found, returning 0`);
    return 0;
  }
  
  const tokens = parseInt(match[1], 10);
  console.log(`[Extract Internal KB] Found exported value: ${tokens}`);
  return tokens;
}

/**
 * Parses system prompt configuration from source file
 * 
 * CRITICALLY IMPORTANT:
 * - totalTokenCount includes ONLY customInstruction + knowledgeBase (dynamic pages)
 * - totalTokenCount does NOT include INTERNAL_COMPANY_KB_TOKENS
 * - Internal KB tokens are added separately in token-utils.ts during calculations
 * 
 * This prevents double-counting of internal KB tokens
 */
function parseSystemPromptConfig(source: string): SystemPromptConfig {
  const customInstruction = extractCustomInstruction(source);
  const knowledgeBase = parseSystemPromptData(source);
  
  // Extract internal KB tokens ONLY for logging
  const internalKBTokens = extractInternalKBTokens(source);
  
  // ✅ FIXED: Use totalTokenCount instead of tokenCount
  // Calculate tokens from all sections across all pages
  const knowledgeBaseTokens = knowledgeBase.reduce((sum, entry) => {
    // New structure: entry has totalTokenCount (sum of all section tokens)
    return sum + (entry.totalTokenCount || 0);
  }, 0);
  
  const totalTokenCount = customInstruction.tokenCount + knowledgeBaseTokens;
  
  // Calculate total sections for logging
  const totalSections = knowledgeBase.reduce((sum, entry) => {
    return sum + (entry.sections?.length || 0);
  }, 0);
  
  console.log(`[Config Parse] Token breakdown:`);
  console.log(`  - Custom instruction: ${customInstruction.tokenCount} tokens`);
  console.log(`  - Dynamic pages: ${knowledgeBase.length} pages`);
  console.log(`  - Dynamic sections: ${totalSections} sections`);
  console.log(`  - Dynamic pages tokens: ${knowledgeBaseTokens} tokens`);
  console.log(`  - Subtotal (without internal KB): ${totalTokenCount} tokens`);
  console.log(`  - Internal company KB (separate): ${internalKBTokens} tokens`);
  console.log(`  - Grand total (calculated by token-utils): ${totalTokenCount + internalKBTokens} tokens`);
  
  // Validation check
  if (totalTokenCount > 20000 && knowledgeBase.length === 0) {
    console.warn(`[Config Parse] ⚠️  WARNING: totalTokenCount suspiciously high (${totalTokenCount}) with 0 dynamic pages!`);
    console.warn(`[Config Parse] ⚠️  This might indicate internal KB was incorrectly added to totalTokenCount`);
  }
  
  return {
    customInstruction,
    knowledgeBase,
    totalTokenCount // WITHOUT internal KB
  };
}

// ============ HTTP HANDLER ============

export async function GET(
  req: NextRequest
): Promise<NextResponse<SystemPromptReadResponse>> {
  console.log("[GET] /api/config-system-prompt");
  const environment = getEnvMode();
  const filePath = DEFAULT_PROMPT_FILE_PATH;

  try {
    let raw = "";
    let source: SystemPromptReadResponse["source"];

    if (environment === "production") {
      raw = await readPromptFromGitHub(filePath);
      source = "GitHub API";
    } else {
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
