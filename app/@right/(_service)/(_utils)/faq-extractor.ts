// @/app/@right/(_service)/(_utils)/faq-extractor.ts
// Utility for extracting FAQ data from content sections
// Comments in English: Automatically detects FAQ sections and extracts Q&A pairs
// for FAQPage Schema.org markup

import { ExtendedSection } from "../(_types)/section-types";
import { TipTapDocument, TipTapNode } from "../(_components)/content-renderer/types";

// ============================================
// TYPES & INTERFACES
// ============================================

/**
 * FAQ item structure for Schema.org FAQPage
 */
export interface FAQItem {
  /** Question text from H3 heading */
  question: string;
  /** Answer text from paragraph following the question */
  answer: string;
}

// ============================================
// CONSTANTS
// ============================================

/** ID patterns that indicate an FAQ section */
const FAQ_SECTION_IDS = ["FAQ", "faq", "часто-задаваемые-вопросы", "вопросы-и-ответы"];

// ============================================
// TEXT EXTRACTION UTILITIES
// ============================================

/**
 * Extract plain text from TipTap node recursively
 */
function extractTextFromNode(node: TipTapNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map(childNode => extractTextFromNode(childNode))
      .join(" ");
  }

  return "";
}

/**
 * Extract text from TipTap content array
 */
function extractTextFromContent(content: TipTapNode[]): string {
  return content
    .map(node => extractTextFromNode(node))
    .join(" ")
    .trim();
}

// ============================================
// FAQ DETECTION
// ============================================

/**
 * Check if section is an FAQ section by ID
 */
export function isFAQSection(section: ExtendedSection): boolean {
  if (!section.id) return false;
  
  const sectionId = section.id.toLowerCase();
  return FAQ_SECTION_IDS.some(faqId => sectionId.includes(faqId));
}

/**
 * Check if section contains FAQ-like structure (H3 + Paragraph pairs)
 */
export function hasFAQStructure(section: ExtendedSection): boolean {
  if (!section.bodyContent) return false;

  const document = section.bodyContent as TipTapDocument;
  if (!document?.content) return false;

  // Count H3 headings and paragraphs
  let h3Count = 0;
  let paragraphCount = 0;

  for (const node of document.content) {
    if (node.type === "heading" && node.attrs?.level === 3) {
      h3Count++;
    }
    if (node.type === "paragraph") {
      paragraphCount++;
    }
  }

  // FAQ structure typically has multiple H3 + Paragraph pairs
  return h3Count >= 2 && paragraphCount >= h3Count;
}

// ============================================
// FAQ EXTRACTION
// ============================================

/**
 * Extract FAQ items from a section
 * Pattern: H3 (question) followed by Paragraph (answer)
 * 
 * @param section - Content section to extract FAQs from
 * @returns Array of FAQ items
 */
export function extractFAQsFromSection(section: ExtendedSection): FAQItem[] {
  if (!section.bodyContent) return [];

  const document = section.bodyContent as TipTapDocument;
  if (!document?.content) return [];

  const faqs: FAQItem[] = [];
  let pendingQuestion: string | null = null;

  for (const node of document.content) {
    // H3 heading = Question
    if (node.type === "heading" && node.attrs?.level === 3 && node.content) {
      const questionText = extractTextFromContent(node.content);
      if (questionText.trim()) {
        // Save question, wait for answer
        pendingQuestion = questionText.trim();
      }
    }
    
    // Paragraph after H3 = Answer
    else if (node.type === "paragraph" && node.content && pendingQuestion) {
      const answerText = extractTextFromContent(node.content);
      if (answerText.trim()) {
        faqs.push({
          question: pendingQuestion,
          answer: answerText.trim()
        });
        pendingQuestion = null; // Reset for next Q&A pair
      }
    }
    
    // Any other node type breaks the Q&A pattern
    else if (node.type !== "heading" || node.attrs?.level !== 2) {
      // Reset pending question if we encounter non-FAQ content
      // (but allow H2 as section dividers)
      if (node.type !== "heading" || node.attrs?.level !== 2) {
        pendingQuestion = null;
      }
    }
  }

  return faqs;
}

/**
 * Extract all FAQs from array of sections
 * 
 * @param sections - Array of content sections
 * @returns Array of all FAQ items found
 */
export function extractFAQs(sections: ExtendedSection[]): FAQItem[] {
  const allFAQs: FAQItem[] = [];

  for (const section of sections) {
    // Check if this is an FAQ section
    if (isFAQSection(section) || hasFAQStructure(section)) {
      const sectionFAQs = extractFAQsFromSection(section);
      allFAQs.push(...sectionFAQs);
    }
  }

  return allFAQs;
}

// ============================================
// FAQ SCHEMA GENERATION
// ============================================

/**
 * Generate Schema.org FAQPage JSON-LD markup
 * 
 * @param faqs - Array of FAQ items
 * @returns FAQPage schema object or null if no FAQs
 */
export function generateFAQJsonLd(faqs: FAQItem[]): object | null {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate FAQ item structure
 */
export function isValidFAQItem(item: any): item is FAQItem {
  return (
    item &&
    typeof item === "object" &&
    typeof item.question === "string" &&
    typeof item.answer === "string" &&
    item.question.trim().length > 0 &&
    item.answer.trim().length > 0
  );
}

/**
 * Filter and validate FAQ array
 */
export function validateFAQs(faqs: FAQItem[]): FAQItem[] {
  return faqs.filter(isValidFAQItem);
}

// ============================================
// EXPORTS
// ============================================

export default {
  extractFAQs,
  extractFAQsFromSection,
  generateFAQJsonLd,
  isFAQSection,
  hasFAQStructure,
  validateFAQs
};
