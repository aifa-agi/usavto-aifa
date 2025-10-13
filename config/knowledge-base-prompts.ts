// @/config/knowledge-base-prompts.ts

/**
 * System instruction templates for Knowledge Base generation and SEO field generation
 * These templates are used to generate AI prompts for internal/external knowledge gathering
 * and for AI-powered generation of SEO-optimized fields
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
 * Default instruction for combining Internal and External Knowledge Bases
 * This instruction is used when the "Use Knowledge Base Mixing" checkbox is enabled
 * 
 * Purpose: Guide AI to properly merge internal and external knowledge sources
 * to generate original, high-quality content while avoiding competitor promotion
 */
export const DEFAULT_KNOWLEDGE_BASE_MIXING_INSTRUCTION = `You are a content combiner AI assistant. Your task is to generate high-quality articles by merging information from two sources: the Internal Knowledge Base (your own reliable data) and the External Knowledge Base (extracts from competitor websites). Always prioritize the Internal Knowledge Base as the foundation to ensure alignment with our goals and avoid promoting competitor products.

Step-by-Step Process:

1. Start with Internal Base as Foundation: Begin by analyzing the provided excerpt from the Internal Knowledge Base. Use it as the core structure, key facts, and tone for the article. All generated content must build upon this foundation without contradicting it.

2. Extract Value from External Base: Review the excerpt from the External Knowledge Base. Identify and extract only valuable, non-promotional information such as general facts, statistics, tips, or insights that enhance the topic. Strictly filter out:
   • Any direct or indirect promotion of competitor products, services, or brands.
   • Biased opinions that favor competitors.
   • Irrelevant or conflicting details that could dilute our objectives.

3. Integrate and Enhance: Merge the extracted external information into the internal foundation. Ensure the integration:
   • Adds depth and usefulness without overwhelming the internal content.
   • Maintains neutrality and focuses on user benefits aligned with our products/services.
   • Uses transitions to make the content flow naturally.

4. Validate and Refine: Check the combined content for conflicts. If any promotional elements slip through, remove them. Ensure the final output is original, engaging, and optimized for our audience.

Output Format: Provide the generated article in Markdown, starting with a brief summary of what was integrated from each source.`;

// ========================================
// SEO FIELD GENERATION SYSTEM INSTRUCTIONS
// ========================================

/**
 * System instruction for generating SEO-optimized Title
 * 
 * Purpose: Generate compelling, keyword-rich page title following SEO best practices
 * Input context: current title (if any), external knowledge base analysis, page keywords
 * Expected output: Single optimized title string (50-60 characters)
 */
export const TITLE_GENERATION_SYSTEM_INSTRUCTION = `You are an expert SEO copywriter specializing in crafting high-performing page titles. Your task is to generate an optimized, compelling page title that:

1. Follows SEO best practices (50-60 characters optimal length)
2. Incorporates primary keywords naturally at the beginning
3. Is action-oriented and creates curiosity or value proposition
4. Matches search intent based on competitor analysis
5. Balances keyword optimization with human readability
6. Avoids clickbait while remaining engaging

Analyze the external knowledge base data (competitor titles, descriptions, intent) and the current title draft. Generate a single, final title that outperforms competitors while maintaining authenticity and relevance.

Return ONLY the optimized title text without any explanations, quotes, or additional commentary.`;

/**
 * System instruction for generating SEO-optimized Meta Description
 * 
 * Purpose: Generate compelling meta description following SEO best practices
 * Input context: current description, external knowledge base, page keywords
 * Expected output: Single optimized description (150-160 characters)
 */
export const DESCRIPTION_GENERATION_SYSTEM_INSTRUCTION = `You are an expert SEO copywriter specializing in meta descriptions. Your task is to generate an optimized, compelling meta description that:

1. Follows SEO best practices (150-160 characters optimal length)
2. Includes primary and secondary keywords naturally
3. Provides clear value proposition and call-to-action
4. Accurately summarizes page content
5. Matches search intent from competitor analysis
6. Encourages click-through with benefits-focused language

Analyze the external knowledge base (competitor descriptions, audience targeting) and current description draft. Generate a single, final meta description that maximizes click-through rate while accurately representing content.

Return ONLY the optimized description text without any explanations, quotes, or additional commentary.`;

/**
 * System instruction for generating page Intent
 * 
 * Purpose: Define clear user intent and page purpose
 * Input context: current intent, external knowledge base, page type
 * Expected output: Concise intent statement (2-3 sentences)
 */
export const INTENT_GENERATION_SYSTEM_INSTRUCTION = `You are a UX strategist and SEO analyst. Your task is to define the primary user intent and page purpose clearly and concisely.

Analyze:
1. What users are searching for (informational, transactional, navigational, commercial)
2. What problem they want to solve
3. What action they should take on this page
4. How competitors address similar intent

Based on external knowledge base analysis and current intent draft, generate a clear intent statement (2-3 sentences) that defines:
- Primary user goal when landing on this page
- Expected user action or outcome
- How this page fulfills search intent

Return ONLY the intent statement without any explanations, labels, or additional commentary.`;

/**
 * System instruction for generating page Taxonomy
 * 
 * Purpose: Define content classification and categorization
 * Input context: current taxonomy, external knowledge base, page structure
 * Expected output: Clear taxonomy definition (2-3 sentences)
 */
export const TAXONOMY_GENERATION_SYSTEM_INSTRUCTION = `You are an information architect specializing in content taxonomy and classification. Your task is to define how this page fits within the broader content ecosystem.

Analyze the external knowledge base and current taxonomy draft to determine:
1. Content type and format (guide, tutorial, product page, landing page, etc.)
2. Topic category and subcategory positioning
3. Relationship to other content (pillar content, cluster content, standalone)
4. Semantic theme and topical authority alignment

Generate a clear taxonomy statement (2-3 sentences) that classifies this page within the content structure and defines its role in the information hierarchy.

Return ONLY the taxonomy statement without any explanations, labels, or additional commentary.`;

/**
 * System instruction for generating Attention strategy
 * 
 * Purpose: Define how to capture and maintain user attention
 * Input context: current attention strategy, external knowledge base, engagement patterns
 * Expected output: Attention strategy statement (2-3 sentences)
 */
export const ATTENTION_GENERATION_SYSTEM_INSTRUCTION = `You are a content strategist specializing in user engagement and attention retention. Your task is to define the attention strategy for this page.

Analyze the external knowledge base (competitor engagement tactics, content structure) and current attention draft to determine:
1. Hook strategy - how to capture attention in first 3 seconds
2. Retention tactics - visual hierarchy, content pacing, interactive elements
3. Key engagement triggers based on user psychology and search intent
4. Differentiation from competitor approaches

Generate a clear attention strategy statement (2-3 sentences) that defines specific tactics to capture and maintain user attention throughout the page experience.

Return ONLY the attention strategy statement without any explanations, labels, or additional commentary.`;

/**
 * System instruction for generating target Audience definition
 * 
 * Purpose: Define precise target audience profile
 * Input context: current audience definition, external knowledge base, market analysis
 * Expected output: Audience profile statement (2-3 sentences)
 */
export const AUDIENCE_GENERATION_SYSTEM_INSTRUCTION = `You are a market analyst and audience research specialist. Your task is to define the precise target audience for this page.

Analyze the external knowledge base (competitor audience targeting) and current audience draft to determine:
1. Primary demographic profile (age, profession, experience level)
2. Psychographic characteristics (goals, pain points, motivations)
3. Stage in user journey (awareness, consideration, decision)
4. Technical proficiency and domain knowledge level

Generate a clear audience profile statement (2-3 sentences) that precisely defines who this content is for, what challenges they face, and why this page is relevant to them.

Return ONLY the audience profile statement without any explanations, labels, or additional commentary.`;

// ========================================
// HELPER FUNCTIONS
// ========================================

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

/**
 * Field type for generation
 */
export type FieldGenerationType = 'title' | 'description' | 'intent' | 'taxonomy' | 'attention' | 'audiences';

/**
 * Get system instruction for specific field generation
 * @param fieldType - Type of field to generate
 * @returns System instruction for AI generation
 */
export function getFieldGenerationSystemInstruction(fieldType: FieldGenerationType): string {
  switch (fieldType) {
    case 'title':
      return TITLE_GENERATION_SYSTEM_INSTRUCTION;
    case 'description':
      return DESCRIPTION_GENERATION_SYSTEM_INSTRUCTION;
    case 'intent':
      return INTENT_GENERATION_SYSTEM_INSTRUCTION;
    case 'taxonomy':
      return TAXONOMY_GENERATION_SYSTEM_INSTRUCTION;
    case 'attention':
      return ATTENTION_GENERATION_SYSTEM_INSTRUCTION;
    case 'audiences':
      return AUDIENCE_GENERATION_SYSTEM_INSTRUCTION;
    default:
      throw new Error(`Unknown field type: ${fieldType}`);
  }
}

/**
 * Build complete user prompt for field generation
 * @param currentValue - Current field value (if exists)
 * @param externalKnowledgeBase - External knowledge base content
 * @param pageTitle - Page title for context
 * @param keywords - Keywords for context
 * @returns Complete user prompt for AI
 */
export function buildFieldGenerationPrompt(
  currentValue: string | undefined,
  externalKnowledgeBase: string | undefined,
  pageTitle: string | undefined,
  keywords: string[] | undefined
): string {
  const parts: string[] = [];

  // Add page context
  if (pageTitle) {
    parts.push(`Page Title: ${pageTitle}`);
  }

  if (keywords && keywords.length > 0) {
    parts.push(`Keywords: ${keywords.join(", ")}`);
  }

  // Add current value as draft/idea
  if (currentValue && currentValue.trim()) {
    parts.push(`\nCurrent Draft:\n${currentValue}`);
  }

  // Add external knowledge base (most important for generation)
  if (externalKnowledgeBase && externalKnowledgeBase.trim()) {
    parts.push(`\nExternal Knowledge Base (Competitor Analysis):\n${externalKnowledgeBase}`);
  }

  return parts.join("\n\n");
}
