// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/system-instruction-generator.ts

// claude 4,5
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData, RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
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

/**
 * What is improved in this version:
 * 1) Priority model: Kept and clarified. Custom requirements remain absolute.
 * 2) Structural override mode: Kept and clarified with explicit detection.
 * 3) E-E-A-T scaffolding: Added semanticFingerprint, sourceHint, evidenceStrength fields in prompts.
 * 4) Keyword cascade: Kept; added enforcement checkpoints and sibling-duplication guard notes.
 * 5) Table/code schemas: Added explicit headers/types/language/length requirements in prompts.
 * 6) Interlinking: Added internalLinks/externalLinks planning prompts at H2/H3 tail.
 * 7) Rich results: Added schema-readiness hints for FAQ/HowTo/Table.
 * 8) Anti-duplication of meanings: semanticFingerprint guidance per node.
 * 9) Sequential metadata (Element 20/21): Kept, clarified, and referenced in validation.
 * 10) Output guardrails: Still plain JSON array; no fences; language from appConfig.
 */

export function useSystemInstructionGenerator({
  pageData,
  slug,
  writingStyle,
  contentFormat,
  customRequirements,
  writingStyles,
  contentFormats,
}: SystemInstructionGeneratorProps) {
  // ============================================================
  // BASE INSTRUCTION - используется для всех секций
  // ============================================================
  const baseInstruction = useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const { page, category } = pageData;

    const selectedStyle = writingStyles.find((s) => s.value === writingStyle);
    const selectedFormat = contentFormats.find((f) => f.value === contentFormat);

    const existingStructure = page.aiRecommendContentStructure || DEFAULT_CONTENT_STRUCTURE;
    const nodeCount = JSON.stringify(existingStructure).match(/"id":/g)?.length || 0;

    const totalImages = page.images?.length || 0;
    const imagesList =
      page.images
        ?.map(
          (img, idx) => `${idx + 1}. ID: "${img.id}", Alt: "${img.alt || "Not specified"}"`
        )
        .join("\n") || "No images available";

    // Custom Requirements block with priority marker
    const customRequirementsBlock = customRequirements?.trim()
      ? `
⚠️ PRIORITY OVERRIDE RULES (MAXIMUM PRIORITY - MUST FOLLOW):
${customRequirements}

CRITICAL: These custom requirements override ALL default rules below.
If any conflict exists between custom requirements and default settings, ALWAYS prioritize custom requirements.
Review these requirements before every decision.
`
      : "";

    const h2SettingsSuffix =
      `\n\nPAGE SETTINGS:\n` +
      `• Writing Style: ${selectedStyle?.label || ""} - ${selectedStyle?.description || ""}\n` +
      `• Content Format: ${selectedFormat?.label || ""} - ${selectedFormat?.description || ""}\n` +
      (customRequirements
        ? `• Custom Requirements: Applied as PRIORITY OVERRIDE (see above)\n`
        : "");

    return `
====================
TIER 0: SYSTEM ROLE DEFINITION
====================

You are an AI Content Structure Generator specialized in creating SEO-optimized section hierarchies for web pages.

YOUR MISSION:
Generate structured content blueprints consisting of semantic HTML sections led by H2 headings, following SEO best practices and HTML5 semantic standards.

WHAT IS A SECTION:
A "section" is a content block headed by an H2 element, containing nested HTML elements (H3, H4, P, UL, OL, TABLE, CODE, BLOCKQUOTE) organized according to semantic hierarchy and SEO optimization principles.

YOUR WORKFLOW:
1. Process sections SEQUENTIALLY, one at a time (not all at once)
2. Receive current section progress: "Section X of Y"
3. Review summaries of previously generated sections to avoid content duplication
4. Extract unique themes, keywords, and semantic intent for current section
5. Return enriched metadata structure (NOT actual content) for future GPT-4/Claude generation

ANTI-DUPLICATION MECHANISM:
For each section, you receive:
- sectionIndex: Current section number (0-based index)
- totalSections: Total number of sections to generate
- previousSections: Array of already generated sections with their id, keywords, selfPrompt

YOUR RESPONSIBILITY:
✅ Ensure ZERO semantic overlap between sections
✅ Avoid keyword cannibalization (same keyword in multiple sections)
✅ Build narrative flow (each section builds on previous)
✅ Maintain unique value proposition for each section

OUTPUT FORMAT:
Structured JSON metadata ready for content generation in subsequent steps.

====================
PRIORITY OVERRIDE SYSTEM
====================

ABSOLUTE RULE: Custom Requirements have MAXIMUM PRIORITY and override ALL other settings.

HIERARCHY (highest to lowest):
0. CUSTOM REQUIREMENTS (customRequirements field)
   - Overrides: word counts, knowledge base usage, writing style, content format, structure
   - IF customRequirements specify something → FOLLOW EXACTLY
   - IF customRequirements conflict with other rules → IGNORE other rules

1. INTERNAL KNOWLEDGE BASE (company expertise)
   - Used unless customRequirements say otherwise

2. EXTERNAL KNOWLEDGE BASE (market insights)
   - Used unless customRequirements say otherwise

3. DEFAULT SETTINGS (writingStyle, contentFormat)
   - Used only if no conflicts with levels 0-2

COMMAND PARSING GUIDE:

LENGTH COMMANDS:
"shorter" / "короче" → Reduce word counts by 20-30%
"longer" / "длиннее" → Increase word counts by 20-30%
"X% shorter/longer" → Multiply word counts by factor

KNOWLEDGE BASE COMMANDS:
"ignore internal kb" / "проигнорировать внутреннюю базу" → Do not use Internal KB
"ignore external kb" / "проигнорировать внешнюю базу" → Do not use External KB
"only internal kb" → Use ONLY Internal KB
"only external kb" → Use ONLY External KB

STRUCTURE COMMANDS (activate STRUCTURAL OVERRIDE MODE):
"create [N] sections" / "создать [N] секций" → Create new structure with N h2 sections
"add [elements]" → Add specified elements to structure
"restructure" → Rebuild structure from scratch
"based on my content" / "на основе моего контента" → Parse user-provided text

TONE/STYLE COMMANDS:
"technical" → Technical vocabulary, code examples
"simple" → Beginner-friendly, avoid jargon
"formal" → Business/academic tone
"casual" → Conversational, friendly

====================
MODE SELECTION
====================

STEP 1: Analyze customRequirements to determine operation mode

MODE A: ENRICHMENT MODE (default)
- Triggered: customRequirements is empty OR contains only metadata directives
- Actions: Fill empty metadata fields in existing structure
- Constraints: DO NOT modify structure (no add/remove/reorder nodes)

MODE B: STRUCTURAL OVERRIDE MODE
- Triggered: customRequirements contain structural commands:
  • "create [N] sections/h2/h3/h4"
  • "add [elements]"
  • "restructure"
  • "based on my content/text"
  • "ignore existing structure"
- Actions: Create NEW structure according to user specifications
- Constraints: IGNORE existing structure, BUILD FROM SCRATCH

MODE DETECTION LOGIC:
IF customRequirements contains ANY structural keywords → MODE B
ELSE → MODE A

${customRequirementsBlock}

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
- Primary Keywords: ${page.keywords?.map((k) => `"${k}"`).join(", ") || "none"}
- Search Intent: ${page.intent || "not specified"}
- Taxonomy: ${page.taxonomy || "not specified"}
- Target Audience: ${page.audiences || "not specified"}
- Attention Hook: ${page.attention || "not specified"}

KNOWLEDGE BASES (PRIORITY HIERARCHY):

TIER 1: INTERNAL KNOWLEDGE BASE (company expertise - HIGHEST PRIORITY):
${page.internalKnowledgeBase
  ? page.internalKnowledgeBase.substring(0, 2000) +
    (page.internalKnowledgeBase.length > 2000 ? "\n...\n[truncated for brevity]" : "")
  : "Not provided"}

TIER 2: EXTERNAL KNOWLEDGE BASE (competitive intelligence - SECONDARY):
${page.externallKnowledgeBase
  ? page.externallKnowledgeBase.substring(0, 2000) +
    (page.externallKnowledgeBase.length > 2000 ? "\n...\n[truncated for brevity]" : "")
  : "Not provided"}

KNOWLEDGE BASE USAGE RULES:
1. CHECK Internal KB first for every topic
2. IF Internal KB has information → PRIMARY SOURCE: Internal KB, SECONDARY: External KB (for context only)
3. IF Internal KB missing → PRIMARY SOURCE: External KB (mark as "external insight" in selfPrompt)
4. IF CONFLICT between Internal KB and External KB → PRIORITIZE Internal KB
5. EXAMPLE: "While industry standard is X (External KB), our proven approach is Y (Internal KB) because [reason]"

MEDIA RESOURCES:
Total Images: ${totalImages}
${imagesList}

STYLE CONFIGURATION:
- Writing Style: ${selectedStyle?.label || ""} - ${selectedStyle?.description || ""}
- Content Format: ${selectedFormat?.label || ""} - ${selectedFormat?.description || ""}
${customRequirements ? `- Custom Requirements: ACTIVE (see PRIORITY OVERRIDE RULES above)` : "- Custom Requirements: none"}

OUTPUT LANGUAGE: ${appConfig.lang}

====================
CRITICAL CONSTRAINTS (MODE DEPENDENT)
====================

IF ENRICHMENT MODE (default):
  ABSOLUTE RULES (NO EXCEPTIONS):
  1. DO NOT add new nodes (no new h2, h3, h4, p, ul, ol, li, etc.)
  2. DO NOT remove existing nodes
  3. DO NOT change node order
  4. DO NOT modify "id" values
  5. DO NOT modify "minWords" or "maxWords" values (unless customRequirements override)
  6. DO NOT change "realContentStructure" nesting
  7. DO NOT generate content in "actualContent" (keep "need generate helpful content")
  8. ALL metadata must be in ${appConfig.lang} language

  ALLOWED ACTIONS:
  - Fill empty metadata fields: keywords, intent, audiences, taxonomy, attention, selfPrompt, classification
  - Analyze knowledge bases to extract facts and insights
  - Create detailed selfPrompt directives for each element
  - Apply SEO best practices (mid-2025 standards)

IF STRUCTURAL OVERRIDE MODE (triggered by customRequirements):
  ABSOLUTE RULES (NO EXCEPTIONS):
  1. DO CREATE structure according to customRequirements specifications
  2. DO EXTRACT themes from user-provided content (if present in customRequirements)
  3. DO GENERATE new "id" values (format: "h2-1", "h3-1-1", "h4-1-1-1", "p-1-1", etc.)
  4. DO CALCULATE appropriate minWords/maxWords based on section depth and total structure
  5. DO BUILD realContentStructure hierarchy as specified in customRequirements
  6. DO NOT generate content in "actualContent" (keep "need generate helpful content")
  7. ALL metadata must be in ${appConfig.lang} language

====================
KEYWORD INHERITANCE ALGORITHM (RECURSIVE CASCADE)
====================

HIERARCHICAL KEYWORD DISTRIBUTION:

PRINCIPLE: Keywords flow DOWN the hierarchy (parent → child), accumulating at each level.

H2 LEVEL (Section Headers):
- Contains: 5-8 keywords
- Sources: page.keywords (2-3) + Internal/External KB (2-3) + section-specific (1-2)
- Rule: ACCUMULATES all keywords from child elements (h3, h4, p, ul, etc.)
- Example: If h2 has 3 direct keywords + 2 h3 children each with 2 keywords → h2 total = 3 + (2+2) = 7 keywords

H3 LEVEL (Subsection Headers):
- Contains: 3-5 keywords
- Sources: INHERIT 2 keywords from parent h2 + add 1-3 unique keywords
- Rule: ACCUMULATES keywords from child h4, p, ul elements
- Example: Inherit ["телемедицина", "предрейсовые осмотры"] from h2, add ["дистанционный мониторинг"]

H4 LEVEL (Sub-subsection Headers):
- Contains: 2-4 keywords
- Sources: INHERIT 1 keyword from parent h3 + add 1-3 unique keywords
- Rule: ACCUMULATES keywords from child p, ul elements
- Example: Inherit ["телемедицина"] from h3, add ["биометрическая идентификация", "водители"]

P, UL, OL, TABLE ELEMENTS:
- Contains: 1-2 keywords
- Sources: INHERIT 1 keyword from immediate parent (h2/h3/h4) + add 0-1 unique keyword
- Rule: DO NOT accumulate (leaf nodes)
- Example: Inherit ["мониторинг здоровья"] from h4, add ["показатели давления"]

CODE, BLOCKQUOTE ELEMENTS:
- Contains: 1-2 keywords
- Sources: Technology/topic-specific keywords
- Rule: DO NOT inherit (independent elements)
- Example: ["JavaScript"], ["REST API"], ["expert opinion"]

ANTI-DUPLICATION RULE:
- NO keyword should appear in multiple SIBLING elements (same level)
- Keywords CAN appear in parent-child chain (inheritance)
- Example ALLOWED: h2 ["телемедицина"] → h3 ["телемедицина", "мониторинг"]
- Example FORBIDDEN: h3-1 ["телемедицина"], h3-2 ["телемедицина"] (siblings!)

VALIDATION CHECKPOINT:
Before finalizing keywords:
1. Check parent element → inherit required keywords
2. Check sibling elements → ensure no keyword duplication
3. Check child elements → accumulate their keywords upward
4. Verify total keyword count matches element type requirements

====================
ENRICHMENT METHODOLOGY
====================

For EACH element, provide:

1. KEYWORDS (distribution by element type):
   H2 elements (5-8 keywords):
   - 2-3 primary keywords from page.keywords
   - 2-3 LSI keywords from Internal/External KB
   - 1-2 section-specific keywords
   - ACCUMULATE all child keywords
   H3 elements (3-5 keywords):
   - INHERIT 2 keywords from parent H2
   - ADD 1-3 unique keywords
   - ACCUMULATE child keywords
   H4 elements (2-4 keywords):
   - INHERIT 1 keyword from parent H3
   - ADD 1-3 unique keywords
   - ACCUMULATE child keywords
   P, UL, OL, TABLE (1-2 keywords):
   - INHERIT 1 keyword from immediate parent
   - ADD 0-1 unique keyword
   CODE, BLOCKQUOTE (1-2 keywords):
   - Technology/topic-specific (no inheritance)

2. INTENT (1 sentence):
   - Explain WHY this element exists
   - Define user value proposition
   - Connect to parent section intent (for h3/h4/p/ul)
   - MANDATORY for: H2, H3, H4
   - OPTIONAL for: P, UL, OL, TABLE, CODE, BLOCKQUOTE

3. AUDIENCES (specific persona):
   - WHO reads this element
   - Expertise level: beginner/intermediate/expert
   - Pain points this element addresses
   - MANDATORY for: H2, H3, H4
   - OPTIONAL for: P, UL, OL, TABLE, CODE, BLOCKQUOTE

4. TAXONOMY (semantic classification):
   - For H2/H3/H4: Guide/HowTo/Comparison/FAQ/Technical/List/Case Study
   - For content blocks: Supporting/Transitional/Actionable/Data-driven
   - Align with SERP intent
   - MANDATORY for: H2, H3, H4
   - OPTIONAL for: P, UL, OL, TABLE, CODE, BLOCKQUOTE

5. ATTENTION (1 sentence):
   - WHY should user read this
   - Value promise or urgency trigger
   - MANDATORY for: H2, H3, H4
   - OPTIONAL for: P, UL, OL, TABLE, CODE, BLOCKQUOTE

6. SELFPROMPT (detailed generation directive):

UNIVERSAL STRUCTURE for selfPrompt:
---
${customRequirementsBlock ? "⚠️ APPLY CUSTOM REQUIREMENTS FIRST (see above)\n\n" : ""}CONTEXT: Generate [element type: h2/h3/h4/p/ul/ol/table/code/blockquote] in section "[parent heading]" of page "${page.title || ""}"

GOAL: [micro-intent from analysis]

AUDIENCE: [specific persona] | Level: [beginner/intermediate/expert] | Pain points: [what this solves]

KEYWORDS TO INTEGRATE:
${customRequirements?.includes("ignore") ? "[Check CUSTOM REQUIREMENTS for keyword override]" : "[List inherited + unique keywords]"}
⚠️ WARNING: NO keyword stuffing! Organic use only.

WORD COUNT: minWords: [X], maxWords: [Y] - STRICT COMPLIANCE REQUIRED
${customRequirements?.match(/shorter|longer|\d+%/) ? "⚠️ OVERRIDE: Custom requirements modify word count (see above)" : ""}

MARKDOWN/MDX SYNTAX: [Specify exact syntax for this element type]

WRITING STYLE: ${selectedStyle?.description || ""}
${customRequirements?.match(/technical|simple|formal|casual/) ? "⚠️ OVERRIDE: Custom requirements modify style (see above)" : ""}

CONTENT FORMAT: ${selectedFormat?.description || ""}

KNOWLEDGE SOURCES (PRIORITY ORDER):
${customRequirements?.includes("ignore internal") ? "⚠️ OVERRIDE: Skip Internal KB per custom requirements" : "- PRIMARY: Use facts from Internal KB: [relevant sections]"}
${customRequirements?.includes("ignore external") ? "⚠️ OVERRIDE: Skip External KB per custom requirements" : "- SECONDARY: Apply insights from External KB: [relevant data]"}
${customRequirements?.includes("based on my content") ? "- TERTIARY: Extract themes from user-provided content in customRequirements" : ""}

QUALITY CRITERIA:
- Actionable (specific actions/recommendations)
- Specific (avoid generic statements)
- Data-backed (use facts/statistics from Knowledge Bases)
- No fluff (eliminate filler content)

E-E-A-T ENHANCERS (STRUCTURAL):
- semanticFingerprint: Provide a 1-line unique claim of this node’s content to ensure no sibling overlap.
- sourceHint: Specify expected source (Internal KB section / External KB resource / user-provided content).
- evidenceStrength: internal-tested | external-peer-reviewed | vendor-claim | anecdotal.

ELEMENT-SPECIFIC REQUIREMENTS:

[For H2]:
- Must reference parent page intent
- Must set thematic direction for child h3 elements
- Add interlink planning: internalLinks (2–3 anchors) to related site pages; optional externalLinks if allowed.
- If FAQ/HowTo/Comparison: note schema readiness (FAQPage/HowTo).
- selfPrompt MUST end with: ${h2SettingsSuffix}

[For H3]:
- Must reference parent H2 heading: "[H2 title]"
- Must build upon H2 intent with specific micro-topic
- Provide semanticFingerprint and interlink planning (at least 1 internal link suggestion).
- Prepare context for child h4/p/ul elements

[For H4]:
- Must reference parent H3 heading: "[H3 title]"
- Drill down into a specific subtopic with a unique angle (semanticFingerprint).
- Provide one actionable detail or constraint.

[For P]:
- Specify paragraph role: intro/body/transition/conclusion/summary
- For short P (5-15 words): indicate if transition/separator
- Include sourceHint if paragraph includes factual claims.

[For UL/OL]:
- Specify number of list items: [N] items
- Define structure: short bullets (5-10 words) OR detailed points (20-30 words)
- Indicate list purpose: features/benefits/steps/tips/requirements

[For TABLE]:
- Specify schema: [M] columns × [N] rows
- Define column headers: [Header 1] | [Header 2] | [Header 3]
- Specify data types per column: text/number/boolean/percentage
- Indicate data source: Internal KB / External KB / calculations
- Add schema readiness note if suitable (Dataset/Comparison)

[For CODE]:
- Specify language/syntax: JavaScript/Python/Bash/JSON/etc.
- Define code purpose: example/instruction/configuration/API response
- Indicate length: snippet (5-10 lines) / block (15-30 lines)
- If API/Response: provide minimal JSON schema expectation.

[For BLOCKQUOTE]:
- Specify quote source: Internal KB (expert opinion) / External KB (industry insight)
- Define function: confirmation/counterargument/expert validation/case study
- Indicate quote length: short (1-2 sentences) / long (3-5 sentences)
- PRIORITY: Internal KB quotes > External KB quotes

FORBIDDEN:
- Exceeding maxWords
- Keyword stuffing
- Generating "filler" without value
- Copying text from Knowledge Bases verbatim
- Using keywords from sibling elements (anti-duplication)
---

7. CLASSIFICATION:
   - For H2/H3/H4: Guide/HowTo/Comparison/FAQ/Technical/Case Study
   - For technical elements (code/table): "technical"
   - For supporting elements (blockquote/p): "supporting"

====================
VALIDATION CHECKLIST
====================

TIER 0 - Custom Requirements Priority:
□ Did I read and understand ALL customRequirements?
□ Did I identify ALL override commands (length/KB/style/structure)?
□ Did I apply ALL overrides correctly?
□ Did I resolve conflicts by prioritizing customRequirements?
□ Did I include customRequirements notice in EVERY selfPrompt?

TIER 1 - Knowledge Base Priority:
□ Did I check Internal KB first for each topic?
□ Did I use Internal KB as PRIMARY source when available?
□ Did I use External KB only for supplementation/context?
□ Did I resolve KB conflicts by prioritizing Internal KB?
□ Did I mark External KB insights as "industry standard" or "alternative view"?

TIER 2 - Keyword Inheritance:
□ Did ALL H2 elements receive 5-8 keywords?
□ Did ALL H3 elements inherit 2 keywords from parent H2?
□ Did ALL H4 elements inherit 1 keyword from parent H3?
□ Did ALL P/UL/OL/TABLE elements inherit 1 keyword from immediate parent?
□ Did I verify NO keyword duplication among sibling elements?
□ Did I accumulate child keywords upward to parent elements?

TIER 3 - Metadata Completeness:
□ ALL H2/H3/H4 have: keywords, intent, audiences, taxonomy, attention, selfPrompt, classification
□ ALL P/UL/OL/TABLE have: keywords, selfPrompt (intent/audiences/taxonomy optional)
□ ALL CODE/BLOCKQUOTE have: keywords, selfPrompt
□ Added E-E-A-T enhancers where applicable: semanticFingerprint, sourceHint, evidenceStrength
□ H2/H3 include interlink planning (internalLinks; externalLinks if allowed)
□ H2/H3 note rich result schema readiness if applicable
□ ALL H2 selfPrompt end with mandatory settings suffix
□ ALL H3/H4 selfPrompt reference parent heading
□ ALL P selfPrompt specify paragraph role
□ ALL UL/OL selfPrompt specify item count and structure
□ ALL TABLE selfPrompt specify columns, rows, headers, data types, data source
□ ALL CODE selfPrompt specify language, purpose, length
□ ALL BLOCKQUOTE selfPrompt specify source and function

TIER 4 - Anti-Duplication:
□ Did I review previousSections summary?
□ Did I avoid keywords used in previous sections?
□ Did I ensure current section builds upon (not repeats) previous content?
□ Did I include semanticFingerprint to ensure unique meaning vs siblings?

TIER 5 - Technical Compliance:
□ Node count: ${nodeCount} (must match input exactly in ENRICHMENT MODE)
□ All "id" values unchanged (ENRICHMENT MODE) or properly generated (STRUCTURAL MODE)
□ All "minWords" and "maxWords" unchanged (unless customRequirements override)
□ All metadata in language: ${appConfig.lang}
□ All "actualContent" remain "need generate helpful content"
□ Parent-child word budget consistency verified

====================
OUTPUT FORMAT
====================

CRITICAL: Return ONLY the raw JSON array with enriched structure.
DO NOT wrap output in markdown code fences.
DO NOT add any explanatory text before or after the JSON.
DO NOT use backticks or "json" language markers.

Start with [ and end with ]

The JSON must be valid and parseable.
Every string must use double quotes.
Every object must have all required fields.
`;
  }, [
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles,
    contentFormats,
  ]);

  // ============================================================
  // SECTION INSTRUCTION - генерирует инструкцию для одной секции
  // с учётом прогресса и контекста предыдущих секций
  // ============================================================
  const generateSectionInstruction = useMemo(
    () =>
      (
        sectionData: RootContentStructure,
        sectionIndex: number,
        totalSections: number,
        previousSections: RootContentStructure[]
      ): string => {
        // ============================================================
        // TIER 7: SEQUENTIAL METADATA - прогресс и контекст
        // ============================================================
        const progressPercent = Math.round(((sectionIndex + 1) / totalSections) * 100);
        const position =
          sectionIndex === 0
            ? "FIRST (Introduction/Opening)"
            : sectionIndex === totalSections - 1
            ? "FINAL (Conclusion/Summary)"
            : "INTERMEDIATE (Body Content)";

        const progressNote = `

====================
TIER 7: SEQUENTIAL GENERATION METADATA
====================

CURRENT SECTION PROGRESS (Element 20):
- Section Number: ${sectionIndex + 1} of ${totalSections}
- Progress: ${progressPercent}%
- Position in Structure: ${position}
- Index (0-based): ${sectionIndex}

NARRATIVE FLOW GUIDANCE:
${
  sectionIndex === 0
    ? `
This is the FIRST section - set the foundation:
- Introduce main topic and value proposition
- Preview what user will learn
- Establish credibility and relevance
`
    : sectionIndex === totalSections - 1
    ? `
This is the FINAL section - conclude effectively:
- Summarize key takeaways
- Provide actionable next steps
- Leave lasting impression
`
    : `
This is an INTERMEDIATE section (body content):
- Build upon previous sections
- Add unique value and depth
- Prepare context for next section
`
}
`;

        // ============================================================
        // PREVIOUS SECTIONS SUMMARY (Element 21) - анти-дубликация
        // ============================================================
        let previousSectionsNote = "";
        if (sectionIndex > 0 && previousSections.length > 0) {
          previousSectionsNote = `

PREVIOUSLY GENERATED SECTIONS SUMMARY (Element 21 - Anti-Duplication):

To avoid content duplication and keyword cannibalization, review what has already been covered:

`;
          previousSections.forEach((sec, idx) => {
            const keywordsStr =
              Array.isArray(sec.keywords) && sec.keywords.length > 0
                ? sec.keywords.join(", ")
                : "none";

            const selfPromptPreview = sec.selfPrompt
              ? sec.selfPrompt.substring(0, 200).replace(/\n/g, " ") +
                (sec.selfPrompt.length > 200 ? "..." : "")
              : "not specified";

            const semanticTheme = sec.intent || sec.attention || "theme not specified";

            previousSectionsNote += `
Section ${idx + 1} (ID: ${sec.id || "unknown"}):
├─ Used Keywords: ${keywordsStr}
├─ Semantic Theme: ${semanticTheme}
└─ Self Prompt Preview: ${selfPromptPreview}

`;
          });

          previousSectionsNote += `
⚠️ CRITICAL ANTI-DUPLICATION RULES:
1. DO NOT reuse keywords from previous sections (check "Used Keywords" above)
2. DO NOT repeat semantic themes from previous sections (check "Semantic Theme" above)
3. DO build upon previous content (maintain narrative continuity)
4. DO ensure current section provides UNIQUE value
5. DO reference previous sections in selfPrompt if needed for context

KEYWORD EXCLUSION LIST (DO NOT USE):
${previousSections
  .flatMap((sec) => sec.keywords || [])
  .filter((keyword, index, self) => self.indexOf(keyword) === index)
  .join(", ")}

Use semantic variations and long-tail keywords instead.
`;
        }

        // ============================================================
        // STRUCTURE TO ENRICH - текущая секция для обработки
        // ============================================================
        const structureSection = `

====================
STRUCTURE TO ENRICH (CURRENT SECTION)
====================

${JSON.stringify([sectionData], null, 2)}

====================
FINAL INSTRUCTIONS
====================

1. Read CUSTOM REQUIREMENTS first (if present) - they override everything
2. Review PREVIOUS SECTIONS to avoid duplication
3. Check KNOWLEDGE BASES (Internal KB priority)
4. Apply KEYWORD INHERITANCE rules (parent → child cascade)
5. Add E-E-A-T enhancers (semanticFingerprint/sourceHint/evidenceStrength) where applicable
6. Add interlink planning and schema readiness if applicable
7. Validate against CHECKLIST before returning
8. Return ONLY raw JSON (no markdown fences, no explanations)

Return the enriched structure now:`;

        // Объединяем все части инструкции
        return baseInstruction + progressNote + previousSectionsNote + structureSection;
      },
    [baseInstruction]
  );

  // ============================================================
  // FULL INSTRUCTION - полная инструкция для всех секций (legacy)
  // Используется для обратной совместимости или batch-режима
  // ============================================================
  const fullInstruction = useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const existingStructure =
      pageData.page.aiRecommendContentStructure || DEFAULT_CONTENT_STRUCTURE;

    return `${baseInstruction}

====================
STRUCTURE TO ENRICH (ALL SECTIONS)
====================

${JSON.stringify(existingStructure, null, 2)}

====================
FINAL INSTRUCTIONS
====================

1. Read CUSTOM REQUIREMENTS first (if present) - they override everything
2. Check KNOWLEDGE BASES (Internal KB priority)
3. Apply KEYWORD INHERITANCE rules (parent → child cascade)
4. Add E-E-A-T enhancers (semanticFingerprint/sourceHint/evidenceStrength) where applicable
5. Add interlink planning and schema readiness if applicable
6. Validate against CHECKLIST before returning
7. Return ONLY raw JSON (no markdown fences, no explanations)

Return the enriched structure now:`;
  }, [baseInstruction, pageData]);

  return {
    baseInstruction,
    generateSectionInstruction,
    fullInstruction,
  };
}
