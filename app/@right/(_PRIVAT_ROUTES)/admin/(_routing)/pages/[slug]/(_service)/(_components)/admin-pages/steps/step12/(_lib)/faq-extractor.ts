// @/lib/faq-extractor.ts
// Comments in English: Extract FAQ data from compact page structure for JSON-LD generation

/**
 * Comments in English: Structure matches COMPACT_CONTENT_STRUCTURE format
 * Each section has id, tag, additionalData, and optional realContentStructure
 */
export interface CompactSection {
  id: string;
  tag: string;
  additionalData?: {
    minWords?: number;
    maxWords?: number;
    actualContent?: string;
  };
  realContentStructure?: CompactSection[];
  [key: string]: any;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Comments in English: Extract FAQ items from COMPACT_CONTENT_STRUCTURE sections
 * 
 * Algorithm:
 * 1. Find root FAQ section (id === "FAQ")
 * 2. Filter h3-FAQ-* subsections from realContentStructure
 * 3. Extract question from h3 additionalData.actualContent
 * 4. Extract answer from first paragraph (p-FAQ-*-1) in realContentStructure
 * 5. Return only valid Q&A pairs (both non-empty)
 * 
 * @param sections - Array of root content structure sections
 * @returns Array of FAQ items with question/answer pairs
 */
export function extractFAQs(sections: CompactSection[]): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Find the FAQ section (id: "FAQ")
  const faqSection = sections.find((section) => section.id === "FAQ");
  
  if (!faqSection?.realContentStructure) {
    return faqs; // No FAQ section found
  }

  // Filter h3-FAQ-* items from realContentStructure
  const faqItems = faqSection.realContentStructure.filter(
    (item) => item.id && /^h3-FAQ-\d+$/i.test(item.id)
  );

  for (const faqItem of faqItems) {
    try {
      // Extract question from h3 heading
      const question = faqItem.additionalData?.actualContent?.trim() || "";
      
      if (!question) {
        console.warn(`FAQ item ${faqItem.id} has no question content`);
        continue;
      }

      // Extract answer from first paragraph in realContentStructure
      const answerNode = faqItem.realContentStructure?.find(
        (node) => node.tag === "p" && node.id.startsWith("p-FAQ-")
      );

      const answer = answerNode?.additionalData?.actualContent?.trim() || "";

      if (!answer) {
        console.warn(`FAQ item ${faqItem.id} has no answer content`);
        continue;
      }

      // Only add if both question and answer are non-empty
      if (question.length > 0 && answer.length > 0) {
        faqs.push({
          question,
          answer,
        });
      }
    } catch (error) {
      console.warn(`Failed to extract FAQ from item ${faqItem.id}:`, error);
      continue;
    }
  }

  return faqs;
}

/**
 * Comments in English: Generate FAQPage JSON-LD schema
 * Follows schema.org specification for FAQ structured data
 * 
 * @param faqs - Array of FAQ items
 * @returns JSON-LD FAQPage object (only if faqs.length > 0)
 */
export function generateFAQJsonLd(faqs: FAQItem[]): object | null {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
