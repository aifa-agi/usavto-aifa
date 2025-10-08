// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/system-instruction-generator.ts

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { DEFAULT_CONTENT_STRUCTURE } from "@/config/default-page-structure-config";
import { appConfig } from "@/config/appConfig";
import { useMemo } from "react";

interface SystemInstructionGeneratorProps {
  pageData: {
    page: PageData;
    category: MenuCategory;
  } | null;
  slug: string;
  writingStyle: string;
  contentFormat: string;
  customRequirements: string;
  writingStyles: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  contentFormats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export function useSystemInstructionGenerator({
  pageData,
  slug,
  writingStyle,
  contentFormat,
  customRequirements,
  writingStyles,
  contentFormats,
}: SystemInstructionGeneratorProps) {
  return useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const { page, category } = pageData;
    
    const selectedStyle = writingStyles.find((s) => s.value === writingStyle);
    const selectedFormat = contentFormats.find((f) => f.value === contentFormat);

    const existingStructure = page.aiRecommendContentStructure || DEFAULT_CONTENT_STRUCTURE;
    const nodeCount = JSON.stringify(existingStructure).match(/"id":/g)?.length || 0;

    const totalImages = page.images?.length || 0;
    const imagesList = page.images
      ?.map((img, idx) => `${idx + 1}. ID: "${img.id}", Alt: "${img.alt || "Not specified"}"`)
      .join("\n") || "No images available";

    const h2SettingsSuffix = 
      `\n\nPAGE SETTINGS:\n` +
      `• Writing Style: ${selectedStyle?.label || ""} - ${selectedStyle?.description || ""}\n` +
      `• Content Format: ${selectedFormat?.label || ""} - ${selectedFormat?.description || ""}\n` +
      `• Custom Requirements: ${customRequirements || "none"}`;

    return `You are a SEO content strategist. Your task is to enrich the existing content structure with metadata for optimal search engine performance.

====================
INPUT DATA
====================

PAGE IDENTITY:
- Title: "${page.title || ""}"
- Description: "${page.description || ""}"
- URL Slug: "${slug}"
- Category: "${category?.title || ""}"
- Page Type: "${page.type || ""}"

SEMANTIC CORE:
- Primary Keywords: ${page.keywords?.map(k => `"${k}"`).join(", ") || "none"}
- Search Intent: ${page.intent || "not specified"}
- Taxonomy: ${page.taxonomy || "not specified"}
- Target Audience: ${page.audiences || "not specified"}
- Attention Hook: ${page.attention || "not specified"}

INTERNAL KNOWLEDGE BASE (company expertise):
${page.internalKnowledgeBase ? page.internalKnowledgeBase.substring(0, 1500) + (page.internalKnowledgeBase.length > 1500 ? '...\n[truncated for brevity]' : '') : "Not provided"}

EXTERNAL KNOWLEDGE BASE (competitive intelligence):
${page.externallKnowledgeBase ? page.externallKnowledgeBase.substring(0, 1500) + (page.externallKnowledgeBase.length > 1500 ? '...\n[truncated for brevity]' : '') : "Not provided"}

MEDIA RESOURCES:
${imagesList}

STYLE CONFIGURATION:
- Writing Style: ${selectedStyle?.label || ""} - ${selectedStyle?.description || ""}
- Content Format: ${selectedFormat?.label || ""} - ${selectedFormat?.description || ""}
${customRequirements ? `- Custom Requirements: ${customRequirements}` : ""}

OUTPUT LANGUAGE: ${appConfig.lang}

====================
CRITICAL CONSTRAINTS
====================

ABSOLUTE RULES (NO EXCEPTIONS):
1. DO NOT add new nodes (no new h2, h3, h4, p, ul, ol, li, etc.)
2. DO NOT remove existing nodes
3. DO NOT change node order
4. DO NOT modify "id" values
5. DO NOT modify "minWords" or "maxWords" values
6. DO NOT change "realContentStructure" nesting
7. DO NOT generate content in "actualContent" (keep "need generate helpful content")
8. ALL metadata must be in ${appConfig.lang} language

ALLOWED ACTIONS:
- Fill empty metadata fields: keywords, intent, audiences, taxonomy, attention, selfPrompt, classification
- Analyze knowledge bases to extract facts and insights
- Create detailed selfPrompt directives for each element
- Apply SEO best practices (mid-2025 standards)

====================
ENRICHMENT METHODOLOGY
====================

For EACH element, provide:

1. KEYWORDS (2-5 items):
   - 1-2 primary keywords from page.keywords
   - 1-2 LSI (semantically related) keywords from knowledge bases
   - 1 long-tail variation specific to this element
   - AVOID keyword stuffing
   - Use natural variations and synonyms

2. INTENT (1 sentence):
   - Explain WHY this element exists
   - Define user value proposition
   - Connect to parent section intent

3. AUDIENCES (specific persona):
   - WHO reads this element
   - Expertise level: beginner/intermediate/expert
   - Pain points this element addresses

4. TAXONOMY (semantic classification):
   - For headings: Guide/HowTo/Comparison/FAQ/Technical/List
   - For content blocks: Supporting/Transitional/Actionable
   - Align with SERP intent

5. ATTENTION (1 sentence):
   - WHY should user read this
   - Value promise or urgency trigger

6. SELFPROMPT (detailed generation directive):

Structure for selfPrompt:
---
CONTEXT: Generate [element type: h2/h3/p/ul/ol/table/code/blockquote] in section "[parent heading]" of page "${page.title || ""}"

GOAL: [micro-intent from analysis]

AUDIENCE: [specific persona] | Level: [beginner/intermediate/expert] | Pain points: [what this solves]

KEYWORDS: Naturally integrate: [list keywords]
WARNING: NO keyword stuffing! Organic use only.

WORD COUNT: minWords: [X], maxWords: [Y] - STRICT COMPLIANCE REQUIRED

STRUCTURE: [Markdown/MDX syntax for this element type]

WRITING STYLE: ${selectedStyle?.description || ""}

CONTENT FORMAT: ${selectedFormat?.description || ""}

${customRequirements ? `CUSTOM REQUIREMENTS:\n${customRequirements}` : ''}

KNOWLEDGE SOURCES:
- Use facts from Internal KB: [relevant sections]
- Apply competitive insights from External KB: [relevant data]

QUALITY CRITERIA:
- Actionable (specific actions/recommendations)
- Specific (avoid generic statements)
- Data-backed (use facts/statistics when available)
- No fluff (eliminate filler content)

MANDATORY:
- [specific actions for this element type]

FORBIDDEN:
- Exceeding maxWords
- Keyword stuffing
- Generating "filler" without value
- Copying text from knowledge bases verbatim
---

SPECIAL RULES BY ELEMENT TYPE:

H2 elements:
- selfPrompt MUST end with this exact suffix:
${h2SettingsSuffix}

H3/H4 elements:
- Specify connection to parent H2
- Detail micro-intent relative to parent intent

P elements:
- Specify paragraph role: intro/body/transition/conclusion
- For short p (5-15 words): indicate if transition/separator

UL/OL elements:
- Specify number of list items
- Define structure of each item (short bullets vs detailed points)

TABLE elements:
- Specify column and row count
- Define table headers
- Specify data type for each column

CODE elements:
- Specify programming language/syntax
- Define code purpose (example/instruction/configuration)

BLOCKQUOTE elements:
- Specify quote source (from knowledge base or expert opinion)
- Define function (confirmation/counterargument/expert insight)

7. CLASSIFICATION:
   - For headings: semantic type (Guide/HowTo/Comparison/FAQ)
   - For technical elements: "technical"

====================
VALIDATION CHECKLIST
====================

Before returning, verify:
□ Node count: ${nodeCount} (must match input exactly)
□ All "id" values unchanged
□ All "minWords" and "maxWords" unchanged
□ All empty keywords filled (2-5 items each)
□ All empty intent filled (1 sentence)
□ All empty audiences filled (specific persona)
□ All empty taxonomy filled (semantic type)
□ All empty attention filled (1 sentence)
□ All empty selfPrompt filled (complete structure above)
□ All empty classification filled (semantic type for headings)
□ All H2 selfPrompt end with mandatory suffix
□ All metadata in language: ${appConfig.lang}
□ All actualContent remain "need generate helpful content"
□ Parent-child word budget consistency verified

====================
STRUCTURE TO ENRICH
====================

${JSON.stringify(existingStructure, null, 2)}

====================
OUTPUT FORMAT
====================

CRITICAL: Return ONLY the raw JSON array with enriched structure.
DO NOT wrap output in markdown code fences.
DO NOT add any explanatory text before or after the JSON.
DO NOT use backticks or "json" language markers.

Start with [ and end with ]

Return the enriched structure now:`;

  }, [
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles,
    contentFormats,
  ]);
}
