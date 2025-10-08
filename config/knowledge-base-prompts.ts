// @/config/knowledge-base-prompts.ts

/**
 * System instruction templates for Knowledge Base generation
 * These templates are used to generate AI prompts for internal and external knowledge gathering
 * All templates are in English to save tokens and maintain universality across languages
 */

/**
 * Template for Internal Knowledge Base
 * Placeholders: {title}, {description}, {keywords}
 * 
 * Purpose: Extract relevant information from company's internal knowledge base
 * Expected output: Structured blocks with headers and descriptions for each important section
 */
export const INTERNAL_KNOWLEDGE_PROMPT_TEMPLATE = `You are an AI model with access to the company's knowledge base, and your task is to help me gather a comprehensive set of information that will be useful for creating a page on the topic: {title}. This page will be promoted for the keyword query: {keywords}. Collect all information that exists in the knowledge base and present it in the form of blocks with a header and description for each important section. Provide only the answer that truly has value. The response should not contain any introductory or concluding comments, only clean text.`;

/**
 * Template for External Knowledge Base
 * Placeholders: {title}, {keywords}
 * 
 * Purpose: Research top-ranking external resources for competitive analysis
 * Expected output: Detailed analysis of 3 most significant web resources including:
 * - Page title, Description, Intent, Taxonomy, Attention, Audience
 * - Resource link and short blockquote excerpt
 * - Number of semantic sections
 * - Key summary for each semantic section
 */
export const EXTERNAL_KNOWLEDGE_PROMPT_TEMPLATE = `Conduct a deep and comprehensive study of the three most significant and recent web resources that are promoted in search for the query: {title} or for the keyword: {keywords}. From the obtained research, separately for each resource, I expect to receive information: page title, page Description, intent, taxonomy, attention, audience, resource link and a short excerpt as a blockquote for use on our own resource, the number of semantic sections of the page, key summary for each semantic section of the page. Present the answer in the form of information available for copying, without any introductory or concluding comments.`;

/**
 * Helper function to replace placeholders in templates
 * @param template - The template string with placeholders
 * @param title - Page title
 * @param description - Page description (optional, used only for internal)
 * @param keywords - Array of keywords
 * @returns Formatted prompt string ready for use
 */
export function generatePromptFromTemplate(
  template: string,
  title: string,
  description: string = "",
  keywords: string[] = []
): string {
  // Convert keywords array to comma-separated string
  const keywordsString = keywords.filter(Boolean).join(", ");

  // Replace placeholders
  return template
    .replace("{title}", title || "untitled page")
    .replace("{description}", description || "")
    .replace("{keywords}", keywordsString || "general topic");
}

/**
 * Generate Internal Knowledge Base prompt
 */
export function generateInternalKnowledgePrompt(
  title: string,
  description: string,
  keywords: string[]
): string {
  return generatePromptFromTemplate(
    INTERNAL_KNOWLEDGE_PROMPT_TEMPLATE,
    title,
    description,
    keywords
  );
}

/**
 * Generate External Knowledge Base prompt
 */
export function generateExternalKnowledgePrompt(
  title: string,
  keywords: string[]
): string {
  return generatePromptFromTemplate(
    EXTERNAL_KNOWLEDGE_PROMPT_TEMPLATE,
    title,
    "",
    keywords
  );
}
