// @/lib/extract-page-content.ts

import { promises as fs } from "fs";
import path from "path";
import type { 
  PageMetadataForPrompt, 
  SectionSummary 
} from "@/types/system-prompt-types";
import { 
  generateSectionAISummary,
  extractTextFromSections 
} from "@/lib/generate-ai-summary";
import {
  processSectionAnchorData,
  constructSectionAbsoluteUrl
} from "@/lib/section-anchor-utils";
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

interface GeneratedSectionsContent {
  sections: SectionSummary[];
  totalTokenCount: number;
}

// ============ GITHUB INTEGRATION ============

/**
 * Extracts file content from GitHub via REST API (production environment)
 * 
 * @param relativePath - Relative path to file in repository (e.g., "app/@right/(_PAGES)/about/page.tsx")
 * @returns File content as string
 * @throws Error if file not found or API error occurs
 */
async function readFileFromGitHub(relativePath: string): Promise<string> {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GitHub configuration missing (GITHUB_TOKEN or GITHUB_REPO)");
  }
  
  // Remove leading slash if present
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
  
  // Decode Base64 content
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  
  console.log(`[GitHub Read] ✅ Successfully read ${decoded.length} bytes (original size: ${json.size || "unknown"})`);
  
  return decoded;
}

// ============ PAGE CONTENT EXTRACTION ============

/**
 * Extracts page content from local filesystem (development) or GitHub (production)
 * 
 * @param href - Page path (e.g., "/about")
 * @returns Extraction result with sections array or error
 */
async function extractPageContent(href: string): Promise<PageContentExtractionResult> {
  try {
    const environment = process.env.NODE_ENV || "development";
    const relativePath = `app/@right/(_PAGES)${href}/page.tsx`;
    
    console.log(`[Extract Content] 🔧 Environment: ${environment}`);
    console.log(`[Extract Content] 📄 Reading file: ${relativePath}`);
    
    let fileContent: string;
    
    if (environment === "production") {
      console.log("[Extract Content] 🌐 Production mode - reading from GitHub");
      fileContent = await readFileFromGitHub(relativePath);
    } else {
      console.log("[Extract Content] 📁 Development mode - reading from local filesystem");
      const absolutePath = path.join(process.cwd(), relativePath);
      fileContent = await fs.readFile(absolutePath, "utf-8");
    }
     
    // Parse sections array from file content
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

// ============ SECTION-BASED CONTENT GENERATION ============

/**
 * Generates AI summaries for each section individually with anchor links
 * Replaces single-page summary approach with granular section-level summaries
 * 
 * @param pageMetadata - Page metadata for context
 * @param sections - Array of page sections with bodyContent
 * @returns Array of section summaries with total token count
 */
export async function generateSectionBasedContent(
  pageMetadata: PageMetadataForPrompt,
  sections?: any[]
): Promise<GeneratedSectionsContent> {
  
  if (!sections || sections.length === 0) {
    console.warn("[Generate Sections] No sections available, returning empty array");
    
    return {
      sections: [],
      totalTokenCount: 0,
    };
  }

  console.log(`[Generate Sections] Processing ${sections.length} sections for: ${pageMetadata.title}`);

  const sectionSummaries: SectionSummary[] = [];
  let totalTokens = 0;

  for (let index = 0; index < sections.length; index++) {
    const section = sections[index];
    
    console.log(`[Generate Sections] 📝 Processing section ${index + 1}/${sections.length}`);

    // Step 1: Extract H2 title and generate anchor slug
    const anchorData = processSectionAnchorData(section);
    
    if (!anchorData) {
      console.warn(`[Generate Sections] ⚠️  Section ${index + 1} has no H2 heading, skipping`);
      continue;
    }

    const { h2Title, humanizedPath } = anchorData;

    // Step 2: Build absolute URL with anchor
    const absoluteUrl = constructSectionAbsoluteUrl(
      appConfig.url,
      pageMetadata.href,
      humanizedPath
    );

    // Step 3: Extract text content from this section only
    const sectionText = extractTextFromSections([section]);

    if (!sectionText || sectionText.trim().length === 0) {
      console.warn(`[Generate Sections] ⚠️  Section ${index + 1} has no text content, skipping`);
      continue;
    }

    // Step 4: Generate AI summary for this section
    try {
      const aiResult = await generateSectionAISummary({
        sectionText,
        h2Title,
        pageMetadata,
        absoluteUrl,
      });

      // Step 5: Create section summary object
      const sectionSummary: SectionSummary = {
        sectionId: section.id || `section-${index}`,
        humanizedPath,
        h2Title,
        content: aiResult.summary,
        tokenCount: aiResult.tokenCount,
        absoluteUrl,
      };

      sectionSummaries.push(sectionSummary);
      totalTokens += aiResult.tokenCount;

      console.log(`[Generate Sections] ✅ Section ${index + 1}: "${h2Title}" - ${aiResult.tokenCount} tokens`);

    } catch (error: any) {
      console.error(`[Generate Sections] ❌ Failed to generate summary for section ${index + 1}:`, error.message);
      
      // Create fallback summary
      const fallbackSummary: SectionSummary = {
        sectionId: section.id || `section-${index}`,
        humanizedPath,
        h2Title,
        content: `${h2Title}\n\n${sectionText.slice(0, 300)}...\n\nMore information: ${absoluteUrl}`,
        tokenCount: Math.ceil(sectionText.slice(0, 300).length / 4),
        absoluteUrl,
      };

      sectionSummaries.push(fallbackSummary);
      totalTokens += fallbackSummary.tokenCount;
    }
  }

  console.log(`[Generate Sections] ✅ Generated ${sectionSummaries.length} section summaries`);
  console.log(`[Generate Sections] 📊 Total tokens: ${totalTokens}`);

  return {
    sections: sectionSummaries,
    totalTokenCount: totalTokens,
  };
}

// ============ MAIN EXPORT FUNCTION ============

/**
 * Main function for extracting page content and generating section-based summaries
 * Orchestrates the entire process from file extraction to AI summary generation
 * 
 * @param pageMetadata - Page metadata (title, description, keywords, href)
 * @returns Array of section summaries with total token count
 */
export async function extractAndGenerateSectionContent(
  pageMetadata: PageMetadataForPrompt
): Promise<GeneratedSectionsContent> {
  console.log(`\n[Extract & Generate Sections] 🚀 Processing page: ${pageMetadata.href}`);
  
  // Step 1: Extract sections from page file
  const extractionResult = await extractPageContent(pageMetadata.href);
  
  if (!extractionResult.success) {
    console.warn(`[Extract & Generate Sections] ⚠️  Could not extract sections: ${extractionResult.error}`);
    console.warn(`[Extract & Generate Sections] ⚠️  Returning empty sections array`);
    
    return {
      sections: [],
      totalTokenCount: 0,
    };
  }
  
  // Step 2: Generate section-based summaries
  const generatedContent = await generateSectionBasedContent(
    pageMetadata,
    extractionResult.sections
  );
  
  console.log(`[Extract & Generate Sections] ✅ Complete: ${generatedContent.sections.length} sections, ${generatedContent.totalTokenCount} total tokens`);
  
  return generatedContent;
}
