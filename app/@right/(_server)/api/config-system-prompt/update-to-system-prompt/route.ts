// @/app/@right/(_server)/api/config-system-prompt/update-to-system-prompt
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { 
  SystemPromptConfig, 
  SystemPromptEntry, 
  SystemPromptCollection,
  AddToSystemPromptRequest,
  PageMetadataForPrompt,
  TOKEN_LIMIT_EXCEEDED,
  TokenLimitExceededResponse
} from "@/types/system-prompt-types";
import { extractAndGenerateContent } from "@/lib/extract-page-content";
import { calculateTokenUsage, wouldExceedLimit, formatTokenUsage } from "@/lib/token-utils";
import { appConfig } from "@/config/appConfig";
// ✅ НОВОЕ: Импортируем настройки из конфига
import { 
  SYSTEM_PROMPT_MAX_TOKENS, 
  SYSTEM_PROMPT_WARNING_THRESHOLD,
  AI_SUMMARY_SYSTEM_INSTRUCTION 
} from "@/config/prompts/base-system-prompt";

// -------------------- Config --------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const DEFAULT_PROMPT_FILE_PATH = "config/prompts/base-system-prompt.ts";
const PROJECT_ROOT = process.cwd();

// -------------------- Types --------------------

interface AddToSystemPromptResponse {
  success: boolean;
  message?: string;
  data?: SystemPromptConfig;
  environment?: "development" | "production";
  error?: string;
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

// -------------------- Read Current Config --------------------

async function readCurrentConfig(): Promise<SystemPromptConfig> {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/config-system-prompt`;
  
  const response = await fetch(apiUrl, {
    method: "GET",
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to read current config: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error("Failed to parse current config");
  }
  
  return result.data as SystemPromptConfig;
}

// -------------------- Generate Entry from Page Metadata --------------------

async function generateSystemPromptFromPage(
  pageMetadata: PageMetadataForPrompt
): Promise<SystemPromptEntry> {
  console.log("\n" + "=".repeat(70));
  console.log("📄 PAGE METADATA FOR SYSTEM PROMPT GENERATION");
  console.log("=".repeat(70));
  console.log("1️⃣  ID:         ", pageMetadata.id);
  console.log("2️⃣  Title:      ", pageMetadata.title);
  console.log("3️⃣  Description:", pageMetadata.description);
  console.log("4️⃣  Keywords:   ", pageMetadata.keywords);
  console.log("5️⃣  Href:       ", pageMetadata.href);
  console.log("=".repeat(70) + "\n");
  
  console.log("🔍 Extracting content from page file...");
  
  const { content, tokenCount } = await extractAndGenerateContent(pageMetadata);
  
  console.log(`✅ Content generated: ${tokenCount} tokens\n`);
  
  return {
    id: pageMetadata.id,
    title: pageMetadata.title,
    description: pageMetadata.description,
    keywords: pageMetadata.keywords,
    href: pageMetadata.href,
    content,
    tokenCount,
  };
}

// -------------------- Generate Final String --------------------

function generateBusinessKnowledgeBase(config: SystemPromptConfig): string {
  console.log("[Generate String] Formatting BUSINESS_KNOWLEDGE_BASE");
  
  const customPart = config.customInstruction.content;
  
  const knowledgePart = config.knowledgeBase.length > 0
    ? config.knowledgeBase
        .map(entry => {
          const absoluteUrl = `${appConfig.url}${entry.href}`;
          
          return `## ${entry.title}

**URL:** ${absoluteUrl}

${entry.content}

---`;
        })
        .join("\n\n")
    : "No knowledge base entries available yet. Please add pages through the admin panel.";
  
  return `${customPart}

--- Internal Knowledge Base ---

${knowledgePart}`;
}

// -------------------- Generate File Content --------------------

function generateSystemPromptFile(config: SystemPromptConfig): string {
  const timestamp = new Date().toISOString();
  const businessKnowledgeBase = generateBusinessKnowledgeBase(config);
  const formattedKnowledgeBase = JSON.stringify(config.knowledgeBase, null, 2);
  const totalTokens = config.knowledgeBase.reduce((sum, entry) => sum + entry.tokenCount, 0);
  
  // ✅ НОВОЕ: Экранируем AI_SUMMARY_SYSTEM_INSTRUCTION для шаблонной строки
  const escapedAiInstruction = AI_SUMMARY_SYSTEM_INSTRUCTION.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  return `// @/config/prompts/base-system-prompt.ts
// Auto-generated file - Last updated: ${timestamp}

import { SystemPromptCollection } from "@/types/system-prompt-types";
import { appConfig } from "@/config/appConfig";

// ============ SYSTEM PROMPT LIMITS CONFIGURATION ============
export const SYSTEM_PROMPT_MAX_TOKENS = ${SYSTEM_PROMPT_MAX_TOKENS};
export const SYSTEM_PROMPT_WARNING_THRESHOLD = ${SYSTEM_PROMPT_WARNING_THRESHOLD};

// ============ SAMMARY PROMPT CONFIGURATION ============
export const AI_SUMMARY_SYSTEM_INSTRUCTION = \`${escapedAiInstruction}\`;

// ============ CUSTOM BASE INSTRUCTION (highest priority) ============
export const CUSTOM_BASE_INSTRUCTION = \`${config.customInstruction.content}\`;

// ============ DYNAMIC KNOWLEDGE BASE (auto-generated from pages) ============
export const systemPromptData: SystemPromptCollection = ${formattedKnowledgeBase};

// ============ FINAL COMBINED PROMPT ============
export const BUSINESS_KNOWLEDGE_BASE = \`${businessKnowledgeBase}\`;

// ============ METADATA ============
// Total knowledge base entries: ${config.knowledgeBase.length}
// Total tokens: ${totalTokens}
// Last updated: ${timestamp}
`;
}

// -------------------- Write Operations --------------------

async function writeToLocalFileSystem(config: SystemPromptConfig): Promise<void> {
  const filePath = resolveLocalAbsolutePath(DEFAULT_PROMPT_FILE_PATH);
  const fileContent = generateSystemPromptFile(config);
  
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, fileContent, "utf-8");
}

async function writeToGitHub(config: SystemPromptConfig): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing");
  }
  
  const fileContent = generateSystemPromptFile(config);
  
  const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DEFAULT_PROMPT_FILE_PATH}`;
  const getRes = await fetch(getUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App",
    },
  });
  
  let sha: string | undefined;
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  }
  
  const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DEFAULT_PROMPT_FILE_PATH}`;
  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "NextJS-App",
    },
    body: JSON.stringify({
      message: `Update system prompt - ${new Date().toISOString()}`,
      content: Buffer.from(fileContent, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
      ...(sha && { sha }),
    }),
  });
  
  if (!putRes.ok) {
    const errorData = await putRes.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${putRes.status} - ${errorData.message || "Unknown"}`);
  }
}

// -------------------- POST Handler --------------------

export async function POST(
  req: NextRequest
): Promise<NextResponse<AddToSystemPromptResponse | TokenLimitExceededResponse>> {
  const requestId = crypto.randomUUID();
  const environment = getEnvMode();
  
  console.log(`\n${"=".repeat(70)}`);
  console.log(`[${requestId}] 🚀 Update System Prompt Entry`);
  console.log(`${"=".repeat(70)}`);
  
  try {
    const body = await req.json() as AddToSystemPromptRequest;
    const { action, pageMetadata } = body;
    
    console.log(`[${requestId}] 📝 Request action: ${action}`);
    
    if (!action) {
      return NextResponse.json({
        success: false,
        message: "Missing required field: action",
        environment,
      }, { status: 400 });
    }
    
    if (action !== "add" && action !== "remove") {
      return NextResponse.json({
        success: false,
        message: "Invalid action. Must be 'add' or 'remove'",
        environment,
      }, { status: 400 });
    }
    
    if (!pageMetadata || !pageMetadata.id) {
      return NextResponse.json({
        success: false,
        message: "Missing required field: pageMetadata.id",
        environment,
      }, { status: 400 });
    }
    
    console.log(`[${requestId}] 📖 Reading current config...`);
    const currentConfig = await readCurrentConfig();
    console.log(`[${requestId}] ✅ Loaded ${currentConfig.knowledgeBase.length} entries`);
    
    const currentUsage = calculateTokenUsage(currentConfig);
    console.log(`[${requestId}] 📊 Current usage: ${formatTokenUsage(currentUsage.currentTokens)}`);
    
    let updatedKnowledgeBase: SystemPromptCollection;
    
    if (action === "add") {
      console.log(`[${requestId}] ➕ Generating entry for page...`);
      const newEntry = await generateSystemPromptFromPage(pageMetadata);
      console.log(`[${requestId}] ✅ Generated (${newEntry.tokenCount} tokens)`);
      
      const projectedTokens = currentUsage.currentTokens + newEntry.tokenCount;
      
      if (wouldExceedLimit(currentUsage.currentTokens, newEntry.tokenCount)) {
        console.error(`[${requestId}] ❌ TOKEN LIMIT EXCEEDED`);
        console.error(`[${requestId}]    Current:   ${currentUsage.currentTokens.toLocaleString()} tokens`);
        console.error(`[${requestId}]    Attempted: ${newEntry.tokenCount.toLocaleString()} tokens`);
        console.error(`[${requestId}]    Projected: ${projectedTokens.toLocaleString()} tokens`);
        console.error(`[${requestId}]    Limit:     ${currentUsage.maxTokens.toLocaleString()} tokens`);
        console.log(`${"=".repeat(70)}\n`);
        
        return NextResponse.json<TokenLimitExceededResponse>({
          success: false,
          message: "You have reached the limit for pages in system instructions. If you need more information, use vector database integration.",
          error: TOKEN_LIMIT_EXCEEDED,
          tokenUsage: {
            current: currentUsage.currentTokens,
            attempted: newEntry.tokenCount,
            projected: projectedTokens,
            limit: currentUsage.maxTokens,
            code: TOKEN_LIMIT_EXCEEDED,
          },
          environment,
        }, { status: 400 });
      }
      
      console.log(`[${requestId}] ✅ Token limit check passed`);
      console.log(`[${requestId}]    Projected: ${projectedTokens.toLocaleString()} / ${currentUsage.maxTokens.toLocaleString()} tokens`);
      
      const existingIndex = currentConfig.knowledgeBase.findIndex(e => e.id === pageMetadata.id);
      if (existingIndex >= 0) {
        updatedKnowledgeBase = [...currentConfig.knowledgeBase];
        updatedKnowledgeBase[existingIndex] = newEntry;
        console.log(`[${requestId}] 🔄 Updated existing entry`);
      } else {
        updatedKnowledgeBase = [...currentConfig.knowledgeBase, newEntry];
        console.log(`[${requestId}] ➕ Added new entry`);
      }
    } else {
      updatedKnowledgeBase = currentConfig.knowledgeBase.filter(e => e.id !== pageMetadata.id);
      
      if (updatedKnowledgeBase.length === currentConfig.knowledgeBase.length) {
        return NextResponse.json({
          success: false,
          message: `Entry with pageId ${pageMetadata.id} not found`,
          environment,
        }, { status: 404 });
      }
      
      console.log(`[${requestId}] ➖ Removed entry`);
    }
    
    const knowledgeBaseTokens = updatedKnowledgeBase.reduce((sum, e) => sum + e.tokenCount, 0);
    const updatedConfig: SystemPromptConfig = {
      customInstruction: currentConfig.customInstruction,
      knowledgeBase: updatedKnowledgeBase,
      totalTokenCount: currentConfig.customInstruction.tokenCount + knowledgeBaseTokens
    };
    
    console.log(`[${requestId}] 📊 New totals: ${updatedConfig.knowledgeBase.length} entries, ${updatedConfig.totalTokenCount} tokens`);
    
    console.log(`[${requestId}] 💾 Writing to filesystem...`);
    await writeToLocalFileSystem(updatedConfig);
    
    if (environment === "production") {
      console.log(`[${requestId}] 🌐 Syncing to GitHub...`);
      await writeToGitHub(updatedConfig);
    }
    
    console.log(`[${requestId}] 🎉 SUCCESS`);
    console.log(`${"=".repeat(70)}\n`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${action === "add" ? "added" : "removed"} system prompt entry`,
      data: updatedConfig,
      environment,
    });
    
  } catch (e: any) {
    const msg = String(e?.message || e || "Unknown error");
    console.error(`[${requestId}] 💥 ERROR: ${msg}`);
    console.log(`${"=".repeat(70)}\n`);
    
    return NextResponse.json({
      success: false,
      message: "Failed to update system prompt",
      error: msg,
      environment,
    }, { status: 500 });
  }
}
