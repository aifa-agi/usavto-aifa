// @/app/@right/(_service)/(_utils)/navigation-utils.ts
// @/app/@right/(_service)/(_utils)/navigation-utils.ts
// Navigation extraction utilities for building Table of Contents
// Comments in English: Extracts H2 headings from sections to create navigation structure

import { ExtendedSection } from "../(_types)/section-types";
import { TipTapDocument, TipTapNode } from "../(_components)/content-renderer/types";
import { extractTextFromNode, generateSectionId } from "../(_components)/server-render-tiptap";

// ============================================
// TYPES & INTERFACES
// ============================================

/**
 * Navigation section structure for TOC and mobile navigation
 */
export interface NavigationSection {
  /** Unique ID for the section (used in anchor links) */
  id: string;
  /** Full H2 heading text */
  h2Title: string;
  /** Short version for mobile navigation buttons */
  shortTitle: string;
}

// ============================================
// CONFIGURATION
// ============================================

/** Maximum length for short titles in mobile navigation */
const SHORT_TITLE_MAX_LENGTH = 20;

/** Character to append when truncating titles */
const TRUNCATION_INDICATOR = "...";

// ============================================
// H2 EXTRACTION
// ============================================

/**
 * Extract the first H2 heading from a TipTap document
 * Used to build navigation structure
 * 
 * @param document - TipTap JSON document
 * @returns H2 heading text or null if not found
 */
export function extractFirstH2Heading(document: TipTapDocument): string | null {
  if (!document?.content) {
    return null;
  }

  // Search for first H2 heading in document
  for (const node of document.content) {
    if (node.type === "heading" && node.attrs?.level === 2 && node.content) {
      const headingText = extractTextFromNode(node);
      if (headingText.trim()) {
        return headingText.trim();
      }
    }
  }

  return null;
}

/**
 * Generate short title for mobile navigation
 * Truncates long titles with ellipsis
 * 
 * @param fullTitle - Complete heading text
 * @param maxLength - Maximum length before truncation
 * @returns Truncated title
 */
export function generateShortTitle(
  fullTitle: string, 
  maxLength: number = SHORT_TITLE_MAX_LENGTH
): string {
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  // Truncate and add ellipsis
  return fullTitle.substring(0, maxLength).trim() + TRUNCATION_INDICATOR;
}

// ============================================
// NAVIGATION EXTRACTION
// ============================================

/**
 * Extract navigation sections from array of content sections
 * Filters out sections without H2 headings
 * 
 * @param sections - Array of content sections with TipTap body content
 * @returns Array of navigation sections for TOC
 */
export function extractNavigationSections(
  sections: ExtendedSection[]
): NavigationSection[] {
  const navigationSections: NavigationSection[] = [];

  sections.forEach((section, index) => {
    // Generate section ID (use existing ID or create from index)
    const sectionId = section.id || `section-${index}`;

    // Try to extract H2 heading from body content
    if (!section.bodyContent) {
      return; // Skip sections without content
    }

    const h2Title = extractFirstH2Heading(section.bodyContent as TipTapDocument);
    
    if (!h2Title) {
      return; // Skip sections without H2 heading
    }

    // Generate anchor ID from H2 text (for URL-friendly links)
    const anchorId = generateSectionId(h2Title, index);

    // Create navigation section entry
    navigationSections.push({
      id: anchorId,
      h2Title,
      shortTitle: generateShortTitle(h2Title)
    });
  });

  return navigationSections;
}

/**
 * Check if a section has navigable content (H2 heading)
 * 
 * @param section - Content section to check
 * @returns True if section has H2 heading
 */
export function hasNavigableHeading(section: ExtendedSection): boolean {
  if (!section.bodyContent) {
    return false;
  }

  const h2Title = extractFirstH2Heading(section.bodyContent as TipTapDocument);
  return h2Title !== null;
}

/**
 * Count total navigable sections
 * Useful for conditional rendering of navigation components
 * 
 * @param sections - Array of content sections
 * @returns Number of sections with H2 headings
 */
export function countNavigableSections(sections: ExtendedSection[]): number {
  return sections.filter(hasNavigableHeading).length;
}

// ============================================
// SECTION MAPPING
// ============================================

/**
 * Create a map of section IDs to their navigation data
 * Useful for quick lookups in interactive components
 * 
 * @param sections - Array of content sections
 * @returns Map of section ID to navigation section
 */
export function createNavigationMap(
  sections: ExtendedSection[]
): Map<string, NavigationSection> {
  const navigationSections = extractNavigationSections(sections);
  const map = new Map<string, NavigationSection>();

  navigationSections.forEach(navSection => {
    map.set(navSection.id, navSection);
  });

  return map;
}

/**
 * Get navigation section by ID
 * 
 * @param sections - Array of content sections
 * @param sectionId - ID to search for
 * @returns Navigation section or null if not found
 */
export function getNavigationSectionById(
  sections: ExtendedSection[],
  sectionId: string
): NavigationSection | null {
  const navigationSections = extractNavigationSections(sections);
  return navigationSections.find(nav => nav.id === sectionId) || null;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate that sections array has at least one navigable section
 * Used to decide whether to render navigation components
 * 
 * @param sections - Array of content sections
 * @returns True if at least one section has H2 heading
 */
export function hasAnyNavigation(sections: ExtendedSection[]): boolean {
  return countNavigableSections(sections) > 0;
}

/**
 * Validate section structure for navigation
 * Checks for required fields and valid content
 * 
 * @param section - Section to validate
 * @returns Validation result with error messages
 */
export function validateSectionForNavigation(section: ExtendedSection): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!section) {
    errors.push("Section is null or undefined");
    return { isValid: false, errors };
  }

  if (!section.bodyContent) {
    errors.push("Section has no bodyContent");
  }

  if (section.bodyContent && typeof section.bodyContent !== "object") {
    errors.push("Section bodyContent is not a valid object");
  }

  const isValid = errors.length === 0;
  return { isValid, errors };
}

// ============================================
// UTILITY EXPORTS
// ============================================

/**
 * Re-export commonly used functions for convenience
 */
export {
  extractTextFromNode,
  generateSectionId
} from "../(_components)/server-render-tiptap";
