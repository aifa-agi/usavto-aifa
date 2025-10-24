// @/lib/generate-ai-summary.ts

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { AI_SUMMARY_SYSTEM_INSTRUCTION } from "@/config/prompts/base-system-prompt";

interface GenerateAISummaryInput {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string[];
  sectionsContent: string; // Extracted text from all sections
  pageUrl: string;
}

interface GenerateAISummaryOutput {
  summary: string;
  tokenCount: number;
}

interface GenerateAISummaryInput {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string[];
  sectionsContent: string;
  pageUrl: string;
}

interface GenerateAISummaryOutput {
  summary: string;
  tokenCount: number;
}

/**
 * Generate AI-powered semantic summary from page content
 * Uses GPT-4o-mini with streaming for efficiency
 * 
 * @param input - Page content and metadata
 * @returns Semantic summary with token count
 */
export async function generateAISummary(
  input: GenerateAISummaryInput
): Promise<GenerateAISummaryOutput> {
  
  console.log("[AI Summary] Starting generation for:", input.pageTitle);
  
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
      system: AI_SUMMARY_SYSTEM_INSTRUCTION,
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

    // ✅ НОВОЕ: Получить реальное количество токенов из usage
    const usage = await result.usage;
    const actualTokenCount = usage.completionTokens || Math.ceil(fullSummary.length / 4);

    console.log("[AI Summary] ✅ Generated:", actualTokenCount, "tokens");
    console.log("[AI Summary] Token breakdown:", {
      prompt: usage.promptTokens,
      completion: usage.completionTokens,
      total: usage.totalTokens,
    });

    return {
      summary: fullSummary.trim(),
      tokenCount: actualTokenCount, // ← РЕАЛЬНЫЕ ТОКЕНЫ
    };

  } catch (error: any) {
    console.error("[AI Summary] Error:", error.message);
    
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
