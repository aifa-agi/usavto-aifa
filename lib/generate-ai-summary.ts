// @/lib/generate-ai-summary.ts

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { PageMetadataForPrompt } from "@/types/system-prompt-types";

/**
 * System instruction for section-level AI summary generation
 * Optimized for individual content sections with anchor navigation
 */
const SECTION_SUMMARY_SYSTEM_INSTRUCTION = `You are an expert content analyzer specializing in creating concise, semantically rich summaries of web content sections.

Your task:
1. Analyze the provided section content and generate a compressed summary
2. Preserve key information, technical terms, and factual data
3. Maintain semantic structure and logical flow
4. Extract and highlight main topics, subtopics, and key points
5. Keep the summary focused on the specific section (not the entire page)

Output format:
- Write in the same language as the source content
- Use clear, professional language
- Preserve important numbers, dates, and specific terminology
- Focus on actionable information and key insights
- Maximum length: 300-500 tokens

Quality requirements:
- Accuracy: Preserve factual correctness
- Completeness: Cover all main points from the section
- Clarity: Use simple, direct language
- Relevance: Focus only on this section's content

DO NOT include generic conclusions or meta-commentary about the summary itself.`;

/**
 * System instruction for full-page AI summary generation (legacy support)
 * Used when processing entire pages as single units
 */
const PAGE_SUMMARY_SYSTEM_INSTRUCTION = `You are an expert content analyzer specializing in creating concise, semantically rich summaries of web pages.

Your task:
1. Analyze the entire page content and generate a compressed summary
2. Preserve key information, technical terms, and factual data
3. Maintain semantic structure and logical flow
4. Extract main topics, subtopics, and key points
5. Include metadata: intent, taxonomy, target audience

Output format:
- Write in the same language as the source content
- Use clear, professional language
- Include metadata section at the end
- Preserve important numbers, dates, and terminology
- Maximum length: 800-1200 tokens

Quality requirements:
- Accuracy: Preserve factual correctness
- Completeness: Cover all main topics from the page
- Clarity: Use simple, direct language
- Structured: Organize by topics and sections`;

/**
 * Input for generating section-level summary
 */
interface GenerateSectionSummaryInput {
  sectionText: string;
  h2Title: string;
  pageMetadata: PageMetadataForPrompt;
  absoluteUrl: string;
}

/**
 * Input for generating full-page summary (legacy)
 */
interface GeneratePageSummaryInput {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string[];
  sectionsContent: string;
  pageUrl: string;
}

/**
 * Output structure for AI summary generation
 */
interface GenerateSummaryOutput {
  summary: string;
  tokenCount: number;
}

/**
 * Generate AI-powered summary for a single content section
 * Includes automatic reference link appending
 * 
 * @param input - Section content, title, page metadata, and URL
 * @returns Section summary with appended reference link and token count
 */
export async function generateSectionAISummary(
  input: GenerateSectionSummaryInput
): Promise<GenerateSummaryOutput> {
  
  console.log("[Section AI Summary] Starting generation for:", input.h2Title);
  
  const userPrompt = `Generate semantic summary for this content section:

**Section Title (H2):** ${input.h2Title}
**Page Context:** ${input.pageMetadata.title}
**Page Description:** ${input.pageMetadata.description}
**Keywords:** ${input.pageMetadata.keywords.join(", ")}

**Section Content:**
${input.sectionText}

Generate a focused summary for THIS SECTION ONLY. Do not summarize the entire page.`;

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: SECTION_SUMMARY_SYSTEM_INSTRUCTION,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      maxTokens: 800,
      temperature: 0.3,
    });

    // Collect streamed text
    let summaryContent = "";
    for await (const chunk of result.textStream) {
      summaryContent += chunk;
    }

    // Append reference link
    const fullSummary = `${summaryContent.trim()}\n\nMore information: ${input.absoluteUrl}`;

    // Get actual token count from usage
    const usage = await result.usage;
    const actualTokenCount = usage.completionTokens || Math.ceil(fullSummary.length / 4);

    console.log("[Section AI Summary] ✅ Generated:", actualTokenCount, "tokens");
    console.log("[Section AI Summary] Token breakdown:", {
      prompt: usage.promptTokens,
      completion: usage.completionTokens,
      total: usage.totalTokens,
    });

    return {
      summary: fullSummary,
      tokenCount: actualTokenCount,
    };

  } catch (error: any) {
    console.error("[Section AI Summary] Error:", error.message);
    
    const fallbackSummary = `${input.h2Title}

${input.sectionText.slice(0, 500)}...

More information: ${input.absoluteUrl}`;

    return {
      summary: fallbackSummary,
      tokenCount: Math.ceil(fallbackSummary.length / 4),
    };
  }
}

/**
 * Generate AI-powered semantic summary from full page content (LEGACY)
 * Kept for backward compatibility with existing implementations
 * Consider migrating to section-based approach for better granularity
 * 
 * @param input - Page content and metadata
 * @returns Semantic summary with token count
 */
export async function generatePageAISummary(
  input: GeneratePageSummaryInput
): Promise<GenerateSummaryOutput> {
  
  console.log("[Page AI Summary] Starting generation for:", input.pageTitle);
  
  const userPrompt = `Generate semantic summary for this page:

**Title:** ${input.pageTitle}
**Description:** ${input.pageDescription}
**Keywords:** ${input.pageKeywords.join(", ")}
**URL:** ${input.pageUrl}

**Content:**
${input.sectionsContent}

Generate a compressed, semantically rich summary following the instructions. Preserve ALL links and resources. Include metadata.`;

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: PAGE_SUMMARY_SYSTEM_INSTRUCTION,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      maxTokens: 2000,
      temperature: 0.3,
    });

    // Collect streamed text
    let fullSummary = "";
    for await (const chunk of result.textStream) {
      fullSummary += chunk;
    }

    // Get actual token count from usage
    const usage = await result.usage;
    const actualTokenCount = usage.completionTokens || Math.ceil(fullSummary.length / 4);

    console.log("[Page AI Summary] ✅ Generated:", actualTokenCount, "tokens");
    console.log("[Page AI Summary] Token breakdown:", {
      prompt: usage.promptTokens,
      completion: usage.completionTokens,
      total: usage.totalTokens,
    });

    return {
      summary: fullSummary.trim(),
      tokenCount: actualTokenCount,
    };

  } catch (error: any) {
    console.error("[Page AI Summary] Error:", error.message);
    
    const fallbackSummary = `${input.pageTitle}

${input.pageDescription}

URL: ${input.pageUrl}

Metadata:
- Intent: [AI generation failed]
- Taxonomy: [AI generation failed]
- Audience: [AI generation failed]
- Keywords: ${input.pageKeywords.join(", ")}`;

    return {
      summary: fallbackSummary,
      tokenCount: Math.ceil(fallbackSummary.length / 4),
    };
  }
}

/**
 * Extract text content from sections array
 * Processes TipTap JSON structure and extracts plain text
 * 
 * @param sections - Array of page sections with bodyContent
 * @returns Concatenated text content
 */
export function extractTextFromSections(sections: any[]): string {
  if (!sections || sections.length === 0) return "";

  const textParts: string[] = [];

  for (const section of sections) {
    if (!section.bodyContent?.content) continue;

    const sectionText = extractTextFromNode(section.bodyContent);
    if (sectionText) {
      textParts.push(sectionText);
    }
  }

  return textParts.join("\n\n");
}

/**
 * Recursively extract text from TipTap JSON node
 * 
 * @param node - TipTap JSON node
 * @returns Extracted text
 */
function extractTextFromNode(node: any): string {
  if (!node) return "";

  // If node has text property, return it
  if (node.text) return node.text;

  // If node has content array, process recursively
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any) => extractTextFromNode(child)).join(" ");
  }

  return "";
}
