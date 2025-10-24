// @/lib/extract-page-content.ts

import { promises as fs } from "fs";
import path from "path";
import { PageMetadataForPrompt } from "@/types/system-prompt-types";
import { generateAISummary, extractTextFromSections } from "@/lib/generate-ai-summary";
import { appConfig } from "@/config/appConfig";

// ============ CONFIGURATION ============

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// ============ TYPES ============

interface PageContentExtractionResult {
  success: boolean;
  sections?: any[];
  error?: string;
}

interface GeneratedContent {
  content: string;
  tokenCount: number;
}

// ============ GITHUB INTEGRATION (NEW) ============

/**
 * ✅ NEW: Извлекает содержимое файла из GitHub через REST API
 * 
 * @param relativePath - Относительный путь к файлу в репозитории (например, "app/@right/(_PAGES)/about/page.tsx")
 * @returns Содержимое файла в виде строки
 * @throws Error если файл не найден или произошла ошибка API
 */
async function readFileFromGitHub(relativePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing (GITHUB_TOKEN or GITHUB_REPO)");
  }
  
  // Убираем ведущий слэш если есть
  const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${cleanPath}`;
  
  console.log(`[GitHub Read] 📡 Fetching file from GitHub...`);
  console.log(`[GitHub Read] 🔧 Repository: ${GITHUB_REPO}`);
  console.log(`[GitHub Read] 🔧 Branch: ${GITHUB_BRANCH}`);
  console.log(`[GitHub Read] 🔧 File path: ${cleanPath}`);
  console.log(`[GitHub Read] 🔧 API URL: ${apiUrl}`);
  
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "NextJS-App",
    },
    cache: "no-store",
  });
  
  console.log(`[GitHub Read] 📊 Response status: ${response.status}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`File not found in GitHub repository: ${cleanPath}`);
    }
    
    const errorText = await response.text();
    console.error(`[GitHub Read] ❌ API Error: ${response.status} - ${errorText}`);
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }
  
  const json = (await response.json()) as { 
    content?: string; 
    encoding?: string;
    size?: number;
  };
  
  if (!json.content) {
    throw new Error("No content found in GitHub file response");
  }
  
  if (json.encoding !== "base64") {
    console.warn(`[GitHub Read] ⚠️  Unexpected encoding: ${json.encoding}, expected base64`);
  }
  
  // ✅ Декодируем Base64 контент
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  
  console.log(`[GitHub Read] ✅ Successfully read ${decoded.length} bytes (original size: ${json.size || "unknown"})`);
  
  return decoded;
}

// ============ EXISTING CODE (PRESERVED) ============

/**
 * ✅ EXISTING: Извлекает содержимое страницы из файловой системы (development)
 * или из GitHub (production)
 * 
 * @param href - Путь к странице (например, "/about")
 * @returns Результат извлечения с массивом секций или ошибкой
 */
async function extractPageContent(href: string): Promise<PageContentExtractionResult> {
  try {
    const environment = process.env.NODE_ENV || "development";
    const relativePath = `app/@right/(_PAGES)${href}/page.tsx`;
    
    console.log(`[Extract Content] 🔧 Environment: ${environment}`);
    console.log(`[Extract Content] 📄 Reading file: ${relativePath}`);
    
    let fileContent: string;
    
    if (environment === "production") {
      // ✅ NEW: Используем GitHub API в продакшн
      console.log("[Extract Content] 🌐 Production mode - reading from GitHub");
      fileContent = await readFileFromGitHub(relativePath);
    } else {
      // ✅ PRESERVED: Существующая логика для development
      console.log("[Extract Content] 📁 Development mode - reading from local filesystem");
      const absolutePath = path.join(process.cwd(), relativePath);
      fileContent = await fs.readFile(absolutePath, "utf-8");
    }
     
    // ✅ PRESERVED: Существующая логика парсинга секций
    const sectionsMatch = fileContent.match(/const\s+sections\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!sectionsMatch || !sectionsMatch[1]) {
      console.error("[Extract Content] Could not find sections array in file");
      return { success: false, error: "Sections array not found in page file" };
    }
    
    const sectionsJsonString = sectionsMatch[1];
    const sections = JSON.parse(sectionsJsonString);
    
    console.log(`[Extract Content] ✅ Extracted ${sections.length} sections`);
    
    return { success: true, sections };
    
  } catch (err: any) {
    console.error("[Extract Content] ❌ Error:", err.message);
    return { success: false, error: err.message || "Unknown error" };
  }
}

// ============ EXISTING CODE (PRESERVED) ============

/**
 * ✅ EXISTING: Генерирует резюме контента страницы
 */
export async function generateContentSummary(
  pageMetadata: PageMetadataForPrompt,
  sections?: any[]
): Promise<GeneratedContent> {
  
  if (!sections || sections.length === 0) {
    console.warn("[Generate Content] No sections available, using metadata only");
    
    const fallbackContent = `${pageMetadata.title}

${pageMetadata.description}

URL: ${appConfig.url}${pageMetadata.href}

Keywords: ${pageMetadata.keywords.join(", ")}`;

    return {
      content: fallbackContent,
      tokenCount: Math.ceil(fallbackContent.length / 4),
    };
  }

  // Extract text from sections
  const sectionsText = extractTextFromSections(sections);
  
  console.log(`[Generate Content] Extracted ${sectionsText.length} characters from sections`);

  // Generate AI summary
  const aiResult = await generateAISummary({
    pageTitle: pageMetadata.title,
    pageDescription: pageMetadata.description,
    pageKeywords: pageMetadata.keywords,
    sectionsContent: sectionsText,
    pageUrl: `${appConfig.url}${pageMetadata.href}`,
  });

  return {
    content: aiResult.summary,
    tokenCount: aiResult.tokenCount,
  };
}

/**
 * ✅ EXISTING: Основная функция для извлечения и генерации контента
 */
export async function extractAndGenerateContent(
  pageMetadata: PageMetadataForPrompt
): Promise<GeneratedContent> {
  console.log(`\n[Extract & Generate] Processing page: ${pageMetadata.href}`);
  
  const extractionResult = await extractPageContent(pageMetadata.href);
  
  if (!extractionResult.success) {
    console.warn(`[Extract & Generate] Could not extract sections: ${extractionResult.error}`);
    console.warn(`[Extract & Generate] Using metadata only for content generation`);
  }
  
  const generatedContent = await generateContentSummary(
    pageMetadata,
    extractionResult.sections
  );
  
  console.log(`[Extract & Generate] ✅ Generated content: ${generatedContent.tokenCount} tokens`);
  
  return generatedContent;
}
