



// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_hooks)/use-step8-prompt.ts
"use client";



import * as React from "react";
import { toast } from "sonner";
import type {
  RootContentStructure,
  SectionInfo,
  ContentStructure,
  CompetitorAnalysis,
  PageImages,
} from "@/app/@right/(_service)/(_types)/page-types";

// Optional app config import for language; keep safe fallback if not present.
import { appConfig } from "@/config/appConfig";
import { useStep8Root } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_contexts)/step8-root-context";
import { STEP8_TEXTS } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_constants)/step8-texts";
import { STEP8_IDS } from "@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_constants)/step8-ids";

export interface Step8PromptParts {
  system: string;
  user: string;
  meta: {
    sectionId: string;
    sectionIndex: number;
    previousMDXCount: number;
    totalSections: number;
    completedIndexes: number[];
    language: string;
    pageTitle: string;
    internalKBUsed: boolean;
    externalKBUsed: boolean;
    competitorsCount: number;
    imagesAvailable: number;
  };
}

function nonEmpty(v?: string | null): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function indexSections(sections: SectionInfo[] | undefined) {
  const map = new Map<string, SectionInfo>();
  (sections ?? []).forEach((s) => {
    if (s?.id) map.set(s.id, s);
  });
  return map;
}

/**
 * Serialize section blueprint with all RootContentStructure fields including
 * writingStyle, contentFormat, customRequirements.
 */
function serializeBlueprint(section: RootContentStructure): string {
  const pick = (s: any): any => ({
    id: s?.id ?? null,
    order: s?.order ?? null,
    classification: s?.classification ?? null,
    tag: s?.tag ?? null,
    description: s?.description ?? null,
    keywords: Array.isArray(s?.keywords) ? s.keywords : [],
    intent: s?.intent ?? null,
    taxonomy: s?.taxonomy ?? null,
    attention: s?.attention ?? null,
    audiences: s?.audiences ?? null,
    selfPrompt: s?.selfPrompt ?? null,
    designDescription: s?.designDescription ?? null,
    connectedDesignSectionId: s?.connectedDesignId ?? null,
    linksToSource: Array.isArray(s?.linksToSource) ? s.linksToSource : [],
    // ADDED: Include RootContentStructure-specific fields
    writingStyle: s?.writingStyle ?? null,
    contentFormat: s?.contentFormat ?? null,
    customRequirements: s?.customRequirements ?? null,
    additionalData: {
      minWords: s?.additionalData?.minWords ?? 0,
      maxWords: s?.additionalData?.maxWords ?? 0,
    },
    status: s?.status ?? null,
    children: Array.isArray(s?.realContentStructure)
      ? s.realContentStructure.map((c: ContentStructure) => pick(c))
      : [],
  });
  return JSON.stringify(pick(section), null, 2);
}

function getPreviousSectionsMDX(
  roots: RootContentStructure[],
  sectionIndex: number,
  byId: Map<string, SectionInfo>
): string[] {
  const chain: string[] = [];
  for (let i = 0; i < sectionIndex; i += 1) {
    const id = roots[i]?.id;
    if (!id) continue;
    // Read previous content; historically named tempMDXContent.
    const mdx = byId.get(id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) chain.push(mdx.trim());
  }
  return chain;
}

function joinChainMDX(chain: string[]): string {
  if (chain.length === 0) return "";
  // Keep delimiter, textual label updated to "previous section" without MDX mention.
  return chain.join("\n\n<!-- ---- previous section ---- -->\n\n");
}

function computeCompletedIndexes(
  roots: RootContentStructure[],
  byId: Map<string, SectionInfo>
): number[] {
  const indexes: number[] = [];
  roots.forEach((r, idx) => {
    if (!r?.id) return;
    const mdx = byId.get(r.id)?.tempMDXContent ?? "";
    if (nonEmpty(mdx)) indexes.push(idx);
  });
  return indexes;
}

function buildUserSeed(section: RootContentStructure): string {
  const parts: string[] = [];
  if (nonEmpty(section.description)) {
    parts.push(`Section description: ${section.description!.trim()}`);
  }
  if (Array.isArray(section.keywords) && section.keywords.length > 0) {
    parts.push(`Keywords: ${section.keywords.join(", ")}`);
  }
  if (nonEmpty(section.intent)) {
    parts.push(`Intent: ${section.intent!.trim()}`);
  }
  if (nonEmpty(section.taxonomy)) {
    parts.push(`Taxonomy: ${section.taxonomy!.trim()}`);
  }
  if (nonEmpty(section.attention)) {
    parts.push(`Attention: ${section.attention!.trim()}`);
  }
  if (nonEmpty(section.audiences)) {
    parts.push(`Target audiences: ${section.audiences!.trim()}`);
  }
  if (nonEmpty(section.selfPrompt)) {
    parts.push(`Self Prompt: ${section.selfPrompt!.trim()}`);
  }
  // Keep concise; the system prompt drives the main behavior.
  return parts.join("\n");
}

/**
 * Build ROLE & OBJECTIVES contract.
 */
function buildRoleContract(): string {
  return [
    `ROLE & OBJECTIVES:`,
    `You are a professional copywriter specializing in creating content that is indistinguishable from human writing.`,
    `Your primary objectives:`,
    `- Produce HTML content that passes AI detection tools with 100% human score.`,
    `- Follow the structural blueprint exactly (HTML tags, order, hierarchy).`,
    `- Maximize SEO quality for mid-2025 standards (E-E-A-T, entity optimization, natural language processing).`,
    `- Integrate all provided context: page metadata, knowledge bases, competitor insights, images.`,
    `- Maintain coherence with previously generated sections.`,
    `- Apply custom requirements as absolute priority overrides.`,
    ``,
    `Critical constraints:`,
    `- Generate ONE COMPLETE H2 section per request: <h2> tag + children elements.`,
    `- Output valid HTML fragment starting with <h2>, followed by children elements (p, ul, blockquote, etc.).`,
    `- Use natural, conversational tone with varied sentence structures.`,
    `- Avoid repetitive patterns, keyword stuffing, or robotic phrasing.`,
  ].join("\n");
}

/**
 * Build STRICT STRUCTURE ENFORCEMENT contract (HIGHEST PRIORITY).
 */
function buildStrictStructureContract(): string {
  return [
    `STRICT STRUCTURE ENFORCEMENT (CRITICAL — HIGHEST PRIORITY):`,
    ``,
    `⚠️  ABSOLUTE RULES FOR SECTION GENERATION:`,
    ``,
    `1. ALWAYS start output with <h2> tag containing the section heading.`,
    `   - The H2 heading MUST be SEO-optimized: keyword-rich, descriptive, natural language.`,
    `   - H2 length: 40-70 characters (optimal for readability and SEO).`,
    `   - H2 MUST include "id" attribute matching the blueprint root ID.`,
    `   - Example: <h2 id="h2-1">Преимущества телемедицины для предрейсовых медосмотров</h2>`,
    ``,
    `2. IMMEDIATELY after <h2>, generate children elements in EXACT blueprint order.`,
    `   - Each child MUST have "id" attribute matching blueprint child IDs.`,
    `   - Correct: <p id="p-1-1">content</p><p id="p-1-2">content</p><blockquote id="blockquote-1-4">quote</blockquote>`,
    `   - Wrong: <p>content</p> (missing id attribute)`,
    ``,
    `3. FOLLOW THE EXACT ORDER of children elements as defined in blueprint.children.`,
    `   - If blueprint.children is [p-1-1, p-1-2, p-1-3, blockquote-1-4, p-1-5, ul-1-6],`,
    `     your output after H2 MUST be: <p id="p-1-1">...</p><p id="p-1-2">...</p><p id="p-1-3">...</p><blockquote id="blockquote-1-4">...</blockquote><p id="p-1-5">...</p><ul id="ul-1-6">...</ul>`,
    ``,
    `4. RESPECT minWords/maxWords for EACH child element INDIVIDUALLY (NOT for H2).`,
    `   - H2 heading does NOT count toward child element word counts.`,
    `   - If {"id": "p-1-1", "minWords": 90, "maxWords": 160}, this paragraph ALONE must have 90-160 words.`,
    `   - DO NOT distribute word counts across multiple children.`,
    `   - Track word count separately for each child during generation.`,
    ``,
    `5. DO NOT add elements not present in blueprint.children (except H2).`,
    `   - If blueprint has 6 children (3 p + 1 blockquote + 1 p + 1 ul), generate H2 + EXACTLY 6 children.`,
    `   - Exception: <img> tags are allowed ONLY if AVAILABLE IMAGES contract specifies usage AND placement makes sense.`,
    ``,
    `6. NEVER generate <h1>, <h3>, or <h4> tags.`,
    `   - Only <h2> is allowed as the section heading.`,
    `   - All content hierarchy is managed through children elements (p, ul, blockquote, etc.).`,
    ``,
    `VALIDATION CHECKLIST (verify before returning output):`,
    `[ ] Does the output start with <h2 id="...">Section Heading</h2>?`,
    `[ ] Is the H2 SEO-optimized (keywords, 40-70 chars, natural language)?`,
    `[ ] Does EVERY child element have an "id" attribute matching blueprint child IDs?`,
    `[ ] Is the element order IDENTICAL to blueprint.children order?`,
    `[ ] Does EACH child element meet its minWords/maxWords requirement individually?`,
    `[ ] Are there NO extra elements (h1, h3, h4) not in blueprint?`,
    `[ ] Are all HTML tags properly closed and nested?`,
    ``,
    `IF ANY VALIDATION FAILS: STOP AND REGENERATE THE SECTION.`,
    ``,
    `Example of CORRECT output for blueprint with root id="h2-1" and children [p-1-1, p-1-2, blockquote-1-3]:`,
    `<h2 id="h2-1">SEO-Optimized Section Heading Here</h2>`,
    `<p id="p-1-1">First paragraph content here (90-160 words)...</p>`,
    `<p id="p-1-2">Second paragraph content here (70-130 words)...</p>`,
    `<blockquote id="blockquote-1-3">Blockquote content here (25-45 words)...</blockquote>`,
    ``,
    `Example of WRONG output (DO NOT DO THIS):`,
    `<h3>Section Title</h3> <!-- ❌ NO H3, use H2 -->`,
    `<p>First paragraph...</p> <!-- ❌ MISSING ID -->`,
    `<h2>Heading</h2><p id="p-1-2">Second paragraph...</p> <!-- ❌ WRONG ORDER (missing p-1-1) -->`,
    ``,
    `Directive: This contract OVERRIDES all other contracts. Structure compliance with H2 + children IDs is CRITICAL and NON-NEGOTIABLE.`,
  ].join("\n");
}

/**
 * Build SECTION NARRATIVE FLOW contract (for first/last sections).
 */
function buildSectionNarrativeContract(
  currentIndex: number,
  totalSections: number
): string {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSections - 1;
  const isSecondToLast = currentIndex === totalSections - 2;

  const parts: string[] = [`SECTION NARRATIVE FLOW (Contextual Directive):`];

  if (isFirst) {
    parts.push(
      ``,
      `This is the FIRST section of the page (section ${currentIndex + 1} of ${totalSections}).`,
      ``,
      `CRITICAL REQUIREMENTS FOR FIRST SECTION:`,
      `1. Provide a SMOOTH INTRODUCTION to the topic.`,
      `   - Start with a welcoming, engaging tone that draws readers in.`,
      `   - Establish context and relevance: why should the reader care about this topic?`,
      `   - Avoid abrupt starts; use gradual exposition to build interest.`,
      ``,
      `2. Set the stage for subsequent sections.`,
      `   - Introduce key concepts, terminology, and benefits that will be explored later.`,
      `   - Create anticipation for deeper insights in following sections.`,
      `   - Use transitional phrases that hint at what's coming next.`,
      ``,
      `3. Tone: Informative yet inviting; expert but accessible.`,
      `   - Avoid jargon-heavy opening; explain concepts in plain language first.`,
      `   - Use rhetorical questions or relatable scenarios to engage readers.`,
      ``,
      `Example opening approach:`,
      `"In the fast-paced world of transportation logistics, pre-trip medical examinations have long been a necessary but time-consuming process. Traditional methods require drivers to visit medical facilities, often resulting in delays and operational inefficiencies. However, the advent of telemedicine is revolutionizing this critical safety procedure, offering a faster, more cost-effective, and equally reliable alternative..."`,
      ``,
      `Directive: Craft the first section to gently immerse the reader into the topic, establishing credibility and interest before diving into technical details.`
    );
  } else if (isLast || isSecondToLast) {
    const isFAQNext = isSecondToLast; // Assume last section might be FAQ
    parts.push(
      ``,
      isFAQNext
        ? `This is the SECOND-TO-LAST section (section ${currentIndex + 1} of ${totalSections}). The next section may be FAQ or additional reference material.`
        : `This is the LAST section of the page (section ${currentIndex + 1} of ${totalSections}).`,
      ``,
      `CRITICAL REQUIREMENTS FOR CONCLUDING SECTION:`,
      `1. Provide a SMOOTH CONCLUSION to the topic.`,
      `   - Summarize key benefits and takeaways without repeating verbatim from earlier sections.`,
      `   - Reinforce the main value proposition: why should the reader act or adopt this solution?`,
      `   - Use confident, forward-looking language that inspires action or confidence.`,
      ``,
      `2. Create closure while leaving room for next steps.`,
      isFAQNext
        ? `   - Since an FAQ section likely follows, wrap up substantive content here gracefully.`
        : `   - If this is the final section, provide a satisfying conclusion that ties together all threads.`,
      `   - Avoid abrupt endings; use transitional phrases that signal completion.`,
      `   - Optional: Include a soft call-to-action (e.g., "Consider how telemedicine can transform your fleet operations...").`,
      ``,
      `3. Tone: Confident, authoritative, and optimistic.`,
      `   - Emphasize the future-forward nature of the solution.`,
      `   - Avoid introducing new complex concepts; focus on synthesis and reinforcement.`,
      ``,
      `Example concluding approach:`,
      `"As the transportation industry continues to embrace digital transformation, telemedicine represents a pivotal advancement in ensuring driver safety and operational efficiency. By integrating these innovative solutions into daily workflows, companies can achieve significant cost savings, regulatory compliance, and most importantly, a safer, more reliable fleet. The future of pre-trip medical examinations is here—streamlined, accessible, and built for the demands of modern logistics."`,
      ``,
      `Directive: Craft this section to elegantly conclude the narrative, reinforcing key messages and leaving the reader with a positive, action-oriented impression.`
    );
  } else {
    parts.push(
      ``,
      `This is a MIDDLE section (section ${currentIndex + 1} of ${totalSections}).`,
      ``,
      `REQUIREMENTS FOR MIDDLE SECTION:`,
      `1. Build upon previously introduced concepts.`,
      `   - Reference or expand on ideas from earlier sections without redundancy.`,
      `   - Maintain narrative continuity with CHAIN COHERENCE context.`,
      ``,
      `2. Provide substantive, actionable information.`,
      `   - Dive deeper into specific aspects, use cases, or technical details.`,
      `   - Support claims with data, examples, or case studies from knowledge bases.`,
      ``,
      `3. Transition smoothly to the next section.`,
      `   - End with phrases or ideas that naturally lead to subsequent topics.`,
      `   - Maintain consistent tone and pacing throughout.`,
      ``,
      `Directive: Ensure this section serves as a strong middle pillar, connecting the introduction and conclusion with rich, detailed content.`
    );
  }

  return parts.join("\n");
}

/**
 * Build PAGE META CONTEXT contract.
 * FIXED: Handle keywords as string[] instead of string.
 */
function buildPageMetaContract(
  pageTitle?: string,
  pageDescription?: string,
  pageKeywords?: string[],
  pageIntent?: string,
  pageTaxonomy?: string,
  pageAttention?: string,
  pageAudiences?: string
): string {
  const parts: string[] = [`PAGE META CONTEXT (overarching page goals):`];

  if (nonEmpty(pageTitle)) {
    parts.push(`- Page Title (H1): ${pageTitle!.trim()}`);
  }
  if (nonEmpty(pageDescription)) {
    parts.push(`- Page Description: ${pageDescription!.trim()}`);
  }
  // FIXED: Handle keywords as array
  if (Array.isArray(pageKeywords) && pageKeywords.length > 0) {
    parts.push(`- Page Keywords: ${pageKeywords.join(", ")}`);
  }
  if (nonEmpty(pageIntent)) {
    parts.push(`- Page Intent: ${pageIntent!.trim()}`);
  }
  if (nonEmpty(pageTaxonomy)) {
    parts.push(`- Page Taxonomy: ${pageTaxonomy!.trim()}`);
  }
  if (nonEmpty(pageAttention)) {
    parts.push(`- Page Attention Points: ${pageAttention!.trim()}`);
  }
  if (nonEmpty(pageAudiences)) {
    parts.push(`- Target Audiences: ${pageAudiences!.trim()}`);
  }

  if (parts.length === 1) {
    parts.push(`- No page-level metadata provided.`);
  }

  parts.push(
    ``,
    `Use this context to align section content with the overall page narrative, target audience, and SEO goals.`
  );

  return parts.join("\n");
}

/**
 * Build INTERNAL KNOWLEDGE BASE (TIER 1) contract.
 */
function buildInternalKBContract(
  internalKB?: string,
  mixingRatio?: number
): string {
  const parts: string[] = [
    `INTERNAL KNOWLEDGE BASE (TIER 1 — Highest Priority):`,
  ];

  if (nonEmpty(internalKB)) {
    const ratio = typeof mixingRatio === "number" ? mixingRatio : 70;
    parts.push(
      `- Priority Weight: ${ratio}% (company expertise takes precedence over external sources)`,
      ``,
      `Company Expertise & Proprietary Insights:`,
      internalKB!.trim(),
      ``,
      `Directive: Integrate this proprietary knowledge naturally throughout the section. This is the PRIMARY source of truth.`
    );
  } else {
    parts.push(
      `- No internal knowledge base provided.`,
      `- Generate content based on section blueprint and external sources.`
    );
  }

  return parts.join("\n");
}

/**
 * Build EXTERNAL KNOWLEDGE BASE (TIER 2) contract.
 */
function buildExternalKBContract(
  externalKB?: string,
  mixingRatio?: number
): string {
  const parts: string[] = [
    `EXTERNAL KNOWLEDGE BASE (TIER 2 — Competitive Intelligence):`,
  ];

  if (nonEmpty(externalKB)) {
    const ratio =
      typeof mixingRatio === "number" ? 100 - mixingRatio : 30;
    parts.push(
      `- Priority Weight: ${ratio}% (market context and industry insights)`,
      ``,
      `Market Context & Industry Insights:`,
      externalKB!.trim(),
      ``,
      `Directive: Use this context to enrich content with market trends, industry standards, and competitive positioning. Do NOT contradict TIER 1 internal knowledge.`
    );
  } else {
    parts.push(
      `- No external knowledge base provided.`,
      `- Focus on internal expertise and section blueprint.`
    );
  }

  return parts.join("\n");
}

/**
 * Build COMPETITOR INSIGHTS contract.
 */
function buildCompetitorContract(
  competitors?: CompetitorAnalysis[]
): string {
  const parts: string[] = [`COMPETITOR INSIGHTS (Actionable Recommendations):`];

  if (Array.isArray(competitors) && competitors.length > 0) {
    const analyzed = competitors.filter((c) => c?.isAnalyzed && c?.isSuitable);

    if (analyzed.length > 0) {
      parts.push(
        `- Competitors Analyzed: ${analyzed.length}`,
        ``,
        `Key Insights:`
      );

      

      parts.push(
        ``,
        `Directive: Leverage these insights to differentiate content, fill competitive gaps, and adopt proven patterns where applicable.`
      );
    } else {
      parts.push(
        `- Competitors present but not analyzed or unsuitable.`,
        `- Focus on internal knowledge and section blueprint.`
      );
    }
  } else {
    parts.push(
      `- No competitor analysis available.`,
      `- Generate content based on internal expertise and market best practices.`
    );
  }

  return parts.join("\n");
}

/**
 * Build AVAILABLE IMAGES contract.
 */
function buildImagesContract(images?: PageImages[]): string {
  const parts: string[] = [`AVAILABLE IMAGES (for content integration):`];

  if (Array.isArray(images) && images.length > 0) {
    parts.push(`- Total Images: ${images.length}`, ``, `Image List:`);

    images.forEach((img, idx) => {
      const id = img.id || `img-${idx + 1}`;
      const alt = img.alt || "No alt text";
      const href = img.href || "#";
      parts.push(`${idx + 1}. ID: ${id}, Alt: "${alt}", URL: ${href}`);
    });

    parts.push(
      ``,
      `Directive: Images may be integrated ONLY if they logically fit within the section context. DO NOT add images if blueprint.children does not include an img element, UNLESS the image significantly enhances a specific content area (e.g., after an introductory paragraph). Use proper alt attributes for accessibility.`
    );
  } else {
    parts.push(
      `- No images available.`,
      `- Generate text-only content.`
    );
  }

  return parts.join("\n");
}

/**
 * Build CUSTOM REQUIREMENTS contract (absolute priority).
 */
function buildCustomRequirementsContract(
  customRequirements?: string
): string {
  const parts: string[] = [
    `CUSTOM REQUIREMENTS (ABSOLUTE PRIORITY OVERRIDE):`,
  ];

  if (nonEmpty(customRequirements)) {
    parts.push(
      `- The following instructions take PRECEDENCE over all other contracts, including writing style, content format, SEO guidelines, and knowledge bases.`,
      ``,
      `Custom Instructions:`,
      customRequirements!.trim(),
      ``,
      `Directive: Apply these requirements strictly. If they conflict with other contracts, custom requirements WIN. However, STRICT STRUCTURE ENFORCEMENT rules (H2 + children with IDs) remain NON-NEGOTIABLE.`
    );
  } else {
    parts.push(
      `- No custom requirements specified.`,
      `- Follow all standard contracts and blueprint instructions.`
    );
  }

  return parts.join("\n");
}

/**
 * Build SEO 2025 BEST PRACTICES contract (updated for mid-2025 standards).
 */
function buildSEO2025Contract(): string {
  return [
    `SEO 2025 BEST PRACTICES (Mid-Year Standards):`,
    ``,
    `1. H2 Heading Optimization:`,
    `   - Length: 40-70 characters for optimal readability and SERP display.`,
    `   - Include primary keywords naturally without stuffing.`,
    `   - Use descriptive, action-oriented language (e.g., "Как телемедицина оптимизирует предрейсовые медосмотры").`,
    `   - Avoid generic headings like "Введение" or "Заключение"; be specific and value-driven.`,
    ``,
    `2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):`,
    `   - Demonstrate first-hand experience with the topic (use specific examples, data points, case studies).`,
    `   - Showcase expertise through detailed explanations, technical accuracy, and industry terminology.`,
    `   - Cite authoritative sources where applicable (use linksToSource if provided).`,
    `   - Build trust with transparent language, balanced viewpoints, and clear value propositions.`,
    ``,
    `3. Natural Language Processing (NLP) Optimization:`,
    `   - Write for semantic search: use topic clusters, related entities, and contextual synonyms (LSI keywords).`,
    `   - Structure content for featured snippets: use clear definitions, concise lists, and direct answers.`,
    `   - Employ varied sentence structures: mix short, punchy sentences with longer, explanatory ones.`,
    `   - Avoid keyword stuffing: target keywords should appear naturally (1-2% density max).`,
    ``,
    `4. Entity Optimization:`,
    `   - Reference specific entities (people, places, products, concepts) with proper context.`,
    `   - Use consistent terminology for key entities throughout the section.`,
    `   - Link entities to their definitions or sources where relevant.`,
    ``,
    `5. Readability & Scannability:`,
    `   - Use short paragraphs (2-4 sentences) for easy scanning.`,
    `   - Employ lists (ul, ol) for step-by-step processes, comparisons, or feature lists.`,
    `   - Highlight key points with <strong> tags (sparingly).`,
    ``,
    `6. Search Intent Alignment:`,
    `   - Match content to the section's intent (informational, navigational, transactional, commercial).`,
    `   - Address the target audiences' pain points, questions, and goals.`,
    `   - Provide actionable takeaways or next steps where appropriate.`,
    ``,
    `7. Content Freshness & Depth:`,
    `   - Cover topics comprehensively within the section's scope (respect minWords/maxWords for each child).`,
    `   - Include recent trends, data, or developments if relevant to the taxonomy.`,
    `   - Avoid surface-level content: provide depth, nuance, and unique insights.`,
    ``,
    `8. Internal Linking Strategy:`,
    `   - If linksToSource are provided in the blueprint, integrate them as contextual anchor text.`,
    `   - Use descriptive anchor text (avoid "click here" or generic phrases).`,
    `   - Ensure links add value and guide users to related, relevant content.`,
    ``,
    `Directive: Apply these principles throughout the section, especially for H2 heading optimization, to maximize organic search visibility and user engagement in the mid-2025 SEO landscape.`,
  ].join("\n");
}

/**
 * Build WORD COUNT POLICY contract (for individual children).
 */
function buildWordCountPolicy(): string {
  return [
    `WORD COUNT POLICY (FOR EACH CHILD ELEMENT, NOT H2):`,
    ``,
    `CRITICAL: minWords and maxWords apply to INDIVIDUAL child elements, NOT the entire section, cumulative totals, or the H2 heading.`,
    ``,
    `Rules:`,
    `1. H2 heading does NOT count toward child element word counts.`,
    `   - H2 should be 40-70 characters (~6-12 words), but this is separate from child requirements.`,
    ``,
    `2. Each child element in blueprint.children has its own minWords/maxWords requirement.`,
    `   Example: {"id": "p-1-1", "minWords": 90, "maxWords": 160} means THIS PARAGRAPH ALONE must have 90-160 words.`,
    ``,
    `3. DO NOT distribute word count across multiple children.`,
    `   Wrong: Generating p-1-1 with 50 words and p-1-2 with 110 words to "average out" to blueprint requirements.`,
    `   Right: Generating p-1-1 with 90-160 words AND p-1-2 with its own minWords/maxWords separately.`,
    ``,
    `4. If minWords=0 and maxWords=0 for a child, generate 50-150 words at AI discretion based on the child's intent and taxonomy.`,
    ``,
    `5. Track word count separately for each child during generation:`,
    `   - After writing p-1-1, verify: does it have 90-160 words?`,
    `   - After writing p-1-2, verify: does it have 70-130 words?`,
    `   - Continue for all children.`,
    ``,
    `6. Respect minWords as a minimum threshold; maxWords as a soft cap (slight overages of 5-10% acceptable for natural flow).`,
    ``,
    `Example:`,
    `Blueprint: [`,
    `  {"id": "p-1-1", "minWords": 90, "maxWords": 160},`,
    `  {"id": "p-1-2", "minWords": 70, "maxWords": 130},`,
    `  {"id": "p-1-3", "minWords": 5, "maxWords": 15}`,
    `]`,
    ``,
    `Correct generation:`,
    `<h2 id="h2-1">Section Heading (6-12 words, NOT counted in child requirements)</h2>`,
    `<p id="p-1-1">...content with 90-160 words...</p>`,
    `<p id="p-1-2">...content with 70-130 words...</p>`,
    `<p id="p-1-3">...content with 5-15 words...</p>`,
    ``,
    `Wrong generation:`,
    `<h2>Heading</h2>`,
    `<p id="p-1-1">...50 words...</p> <!-- ❌ Below minimum -->`,
    `<p id="p-1-2">...150 words...</p> <!-- ❌ Above maximum -->`,
    `<p id="p-1-3">...80 words...</p> <!-- ❌ Far above maximum -->`,
    ``,
    `Directive: Word count validation is CRITICAL for child elements. Verify each child meets its requirements before moving to the next. H2 is separate.`,
  ].join("\n");
}

export function useStep8Prompt() {
  const { page, getSections, getActiveSection } = useStep8Root();

  // Stable roots and index map derived once per render
  const roots = React.useMemo(() => getSections(), [getSections]);
  const indexById = React.useMemo(() => {
    const map = new Map<string, number>();
    roots.forEach((r, i) => {
      if (r?.id) map.set(r.id, i);
    });
    return map;
  }, [roots]);

  const buildForSectionId = React.useCallback(
    (sectionId: string | null | undefined): Step8PromptParts | null => {
      if (!sectionId) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }

      const index = indexById.get(sectionId);
      if (typeof index !== "number" || index < 0) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.generateError,
          description: "Invalid section index.",
        });
        return null;
      }

      const section = roots[index];
      if (!section) {
        toast.error(STEP8_TEXTS.errors.missingSection, {
          id: STEP8_IDS.toasts.generateError,
          description: "Section not found in roots.",
        });
        return null;
      }

      // Extract page-level data
      const pageTitle = page?.title ?? "";
      const pageDescription = page?.description ?? "";
      // FIXED: Read keywords as array
      const pageKeywords = Array.isArray(page?.keywords) ? page.keywords : [];
      const pageIntent = page?.intent ?? "";
      const pageTaxonomy = page?.taxonomy ?? "";
      const pageAttention = page?.attention ?? "";
      const pageAudiences = page?.audiences ?? "";

      const internalKB = page?.internalKnowledgeBase ?? "";
      const externalKB = page?.externallKnowledgeBase ?? "";
      const competitors = page?.competitorAnalysis ?? [];
      const knowledgeSettings = page?.knowledgeSettings;
      const mixingRatio = knowledgeSettings?.mixingRatio;
      const images = page?.images ?? [];

      // Extract section-level data
      const byId = indexSections(page?.sections);
      const prevChain = getPreviousSectionsMDX(roots, index, byId);
      const chainJoined = joinChainMDX(prevChain);
      const completedIndexes = computeCompletedIndexes(roots, byId);
      const totalSections = roots.length;

      const language = (appConfig as any)?.lang ?? "ru";
      const blueprint = serializeBlueprint(section);

      // Build contract sections
      const roleContract = buildRoleContract();
      const strictStructureContract = buildStrictStructureContract();
      const narrativeContract = buildSectionNarrativeContract(index, totalSections);

      const pageMetaContract = buildPageMetaContract(
        pageTitle,
        pageDescription,
        pageKeywords,
        pageIntent,
        pageTaxonomy,
        pageAttention,
        pageAudiences
      );

      const pageProgress = [
        `PAGE PROGRESS CONTEXT:`,
        `- totalSections: ${totalSections}`,
        `- completedSectionsIndexes (0-based): [${completedIndexes.join(", ")}]`,
        `- currentSectionIndex (0-based): ${index}`,
        ``,
        `Narrative directive: "Previously presented content covers sections ${
          completedIndexes.map((i) => i + 1).join(", ") || "none"
        }, now we generate section ${index + 1} of ${totalSections} total sections. Use this to maintain sequential exposition and cross-section continuity without repeating information from earlier sections."`,
      ].join("\n");

      const languageContract = [
        `LANGUAGE CONTRACT:`,
        `- All output MUST be written in "${language}".`,
        `- Do NOT switch language unless explicitly required by the blueprint.`,
      ].join("\n");

      const internalKBContract = buildInternalKBContract(
        internalKB,
        mixingRatio
      );
      const externalKBContract = buildExternalKBContract(
        externalKB,
        mixingRatio
      );
      const competitorContract = buildCompetitorContract(competitors);

      const htmlOutputContract = [
        `HTML OUTPUT CONTRACT:`,
        `- Output MUST be a single, valid HTML fragment, not Markdown, not MDX, no JSX.`,
        `- ALWAYS start with <h2 id="...">Section Heading</h2>, followed by children elements.`,
        `- Allowed tags for children elements include: <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <code>, <pre>, <blockquote>, <hr>, <br>, <img>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <figure>, <figcaption>, <details>, <summary>, and semantic containers like <div> when needed.`,
        `- All <a> tags must include rel="nofollow noopener" when target="_blank".`,
        `- Close all tags properly; ensure nesting is valid.`,
        `- CRITICAL: Do NOT include <html>, <head>, <body>, <h1>, <h3>, or <h4> tags. Only <h2> for the section heading, followed by children.`,
      ].join("\n");

      const customRequirementsContract = buildCustomRequirementsContract(
        section.customRequirements
      );

      const chainCoherence = [
        `CHAIN COHERENCE (read-only context):`,
        `- Reason: Enforce a unified tone of voice, avoid semantic duplication, and maintain a continuous flow of thought across the entire page.`,
        STEP8_TEXTS.prompt.styleCoherenceHint,
        ``,
        nonEmpty(chainJoined)
          ? `Previously saved sections (HTML, read-only context):\n${chainJoined}`
          : `No previous sections saved yet. This is the first section.`,
      ].join("\n");

      const imagesContract = buildImagesContract(images);

      const seo2025Contract = buildSEO2025Contract();

      const wordCountPolicy = buildWordCountPolicy();

      // Assemble system instruction with prioritized order
      const system = [
        roleContract,
        "",
        strictStructureContract,
        "",
        narrativeContract,
        "",
        languageContract,
        "",
        htmlOutputContract,
        "",
        pageMetaContract,
        "",
        pageProgress,
        "",
        internalKBContract,
        "",
        externalKBContract,
        "",
        competitorContract,
        "",
        `SECTION BLUEPRINT (structure to follow EXACTLY):`,
        `The blueprint below defines the H2 section root (with id, tag, keywords, intent, etc.) and its CHILDREN elements.`,
        `YOU generate <h2 id="...">Heading</h2> FIRST, then CHILDREN elements in exact order.`,
        ``,
        blueprint,
        "",
        customRequirementsContract,
        "",
        chainCoherence,
        "",
        imagesContract,
        "",
        seo2025Contract,
        "",
        wordCountPolicy,
      ].join("\n");

      const userSeed = buildUserSeed(section);
      const user = [
        `Generate the COMPLETE H2 section (heading + children content) strictly following the blueprint and all contracts above.`,
        ``,
        `CRITICAL REMINDERS:`,
        `- Start with <h2 id="${section.id}">SEO-Optimized Heading (40-70 chars, keywords-rich)</h2>`,
        `- Immediately follow with FIRST CHILD element (e.g., <p id="p-1-1">).`,
        `- Include "id" attributes for ALL elements (H2 + children) matching blueprint IDs.`,
        `- Follow the EXACT order of blueprint.children.`,
        `- Respect minWords/maxWords for EACH child element individually (NOT for H2).`,
        ``,
        userSeed,
      ]
        .filter(Boolean)
        .join("\n");

      return {
        system,
        user,
        meta: {
          sectionId: sectionId,
          sectionIndex: index,
          previousMDXCount: prevChain.length,
          totalSections,
          completedIndexes,
          language,
          pageTitle: pageTitle || "Untitled",
          internalKBUsed: nonEmpty(internalKB),
          externalKBUsed: nonEmpty(externalKB),
          competitorsCount: competitors.length,
          imagesAvailable: images.length,
        },
      };
    },
    [indexById, page, roots]
  );

  /**
   * Convenience builder for the currently active section (no hook calls inside callback).
   */
  const buildForActiveSection =
    React.useCallback((): Step8PromptParts | null => {
      const active = getActiveSection();
      if (!active?.id) {
        toast.error(STEP8_TEXTS.errors.missingActive, {
          id: STEP8_IDS.toasts.generateError,
          description: STEP8_TEXTS.selector.selectPrompt,
        });
        return null;
      }
      return buildForSectionId(active.id);
    }, [buildForSectionId, getActiveSection]);

  return {
    buildForSectionId,
    buildForActiveSection,
  };
}
