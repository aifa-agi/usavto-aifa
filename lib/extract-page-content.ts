// @/lib/extract-page-content.ts

import { promises as fs } from "fs";
import path from "path";
import { PageMetadataForPrompt } from "@/types/system-prompt-types";
import { generateAISummary, extractTextFromSections } from "@/lib/generate-ai-summary";
import { appConfig } from "@/config/appConfig";

interface PageContentExtractionResult {
  success: boolean;
  sections?: any[];
  error?: string;
}

interface GeneratedContent {
  content: string;
  tokenCount: number;
}

async function extractPageContent(href: string): Promise<PageContentExtractionResult> {
  try {
    const environment = process.env.NODE_ENV || "development";
    const relativePath = `app/@right/(_PAGES)${href}/page.tsx`;
    const absolutePath = path.join(process.cwd(), relativePath);
    
    console.log(`[Extract Content] Reading file: ${relativePath}`);
    
    let fileContent: string;
    
    if (environment === "production") {
      console.log("[Extract Content] Production mode - GitHub reading not implemented yet");
      return { success: false, error: "GitHub content extraction not implemented yet" };
    } else {
      fileContent = await fs.readFile(absolutePath, "utf-8");
    }
    
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
    console.error("[Extract Content] Error:", err.message);
    return { success: false, error: err.message || "Unknown error" };
  }
}

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
