// @/app/@right/(_server)/api/config-system-prompt/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SystemPromptConfig, CustomBaseInstruction, SystemPromptCollection } from "@/types/system-prompt-types";

// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
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
 * ✅ Извлекает значение INTERNAL_COMPANY_KB_TOKENS из файла
 * 
 * ВАЖНО: Эта функция ТОЛЬКО читает значение из файла для логирования
 * и информационных целей. Она НЕ должна добавлять это значение к totalTokenCount.
 * 
 * Расчёт общих токенов с internal KB происходит в token-utils.ts
 */
function extractInternalKBTokens(source: string): number {
  // Ищем экспортированную переменную INTERNAL_COMPANY_KB_TOKENS
  const pattern = /export\s+const\s+INTERNAL_COMPANY_KB_TOKENS\s*=\s*(\d+);/;
  const match = source.match(pattern);
  
  if (!match || !match[1]) {
    // Если не найдено, пытаемся найти inline значение из внутреннего кода
    const inlinePattern = /internalKnowledgeTokens\s*=\s*INTERNAL_COMPANY_KNOWLEDGE_BASE_TOKENS\s*\|\|\s*(\d+)/;
    const inlineMatch = source.match(inlinePattern);
    
    if (inlineMatch && inlineMatch[1]) {
      console.log(`[Extract Internal KB] Found inline value: ${inlineMatch[1]}`);
      return parseInt(inlineMatch[1], 10);
    }
    
    // Если internal KB не найден, возвращаем 0 (файл может отсутствовать)
    console.log(`[Extract Internal KB] No internal KB found, returning 0`);
    return 0;
  }
  
  const tokens = parseInt(match[1], 10);
  console.log(`[Extract Internal KB] Found exported value: ${tokens}`);
  return tokens;
}

/**
 * ✅ Парсит конфигурацию системного промпта
 * 
 * КРИТИЧЕСКИ ВАЖНО:
 * - totalTokenCount включает ТОЛЬКО customInstruction + knowledgeBase (динамические страницы)
 * - totalTokenCount НЕ включает INTERNAL_COMPANY_KB_TOKENS
 * - Internal KB токены добавляются отдельно в token-utils.ts при расчётах
 * 
 * Это предотвращает двойной подсчёт internal KB токенов
 */
function parseSystemPromptConfig(source: string): SystemPromptConfig {
  const customInstruction = extractCustomInstruction(source);
  const knowledgeBase = parseSystemPromptData(source);
  
  // ✅ Извлекаем internal KB токены ТОЛЬКО для логирования
  const internalKBTokens = extractInternalKBTokens(source);
  
  // ✅ ВАЖНО: НЕ включаем internalKBTokens в totalTokenCount
  // Потому что token-utils.ts добавит их сам при расчётах
  const knowledgeBaseTokens = knowledgeBase.reduce((sum, entry) => sum + entry.tokenCount, 0);
  const totalTokenCount = customInstruction.tokenCount + knowledgeBaseTokens;
  
  console.log(`[Config Parse] Token breakdown:`);
  console.log(`  - Custom instruction: ${customInstruction.tokenCount}`);
  console.log(`  - Dynamic pages: ${knowledgeBaseTokens}`);
  console.log(`  - Subtotal (without internal KB): ${totalTokenCount}`);
  console.log(`  - Internal company KB (separate): ${internalKBTokens}`);
  console.log(`  - Grand total (will be calculated by token-utils): ${totalTokenCount + internalKBTokens}`);
  
  // ✅ ПРОВЕРКА: убеждаемся, что totalTokenCount не содержит internal KB
  if (totalTokenCount > 20000 && knowledgeBase.length === 0) {
    console.warn(`[Config Parse] ⚠️  WARNING: totalTokenCount suspiciously high (${totalTokenCount}) with 0 dynamic pages!`);
    console.warn(`[Config Parse] ⚠️  This might indicate internal KB was incorrectly added to totalTokenCount`);
  }
  
  return {
    customInstruction,
    knowledgeBase,
    totalTokenCount // ← БЕЗ internal KB
  };
}

// -------------------- HTTP handler --------------------

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
