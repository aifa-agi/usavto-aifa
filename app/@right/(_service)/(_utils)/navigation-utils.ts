// @/app/@right/(_service)/(_utils)/navigation-utils.ts
// Navigation extraction utilities for building Table of Contents
// Comments in English: Extracts H2 headings with unique IDs for anchor navigation

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
  humanizedPath: string;
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
 */
export function extractFirstH2Heading(document: TipTapDocument): string | null {
  if (!document?.content) {
    return null;
  }

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
 */
export function generateShortTitle(
  fullTitle: string, 
  maxLength: number = SHORT_TITLE_MAX_LENGTH
): string {
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  return fullTitle.substring(0, maxLength).trim() + TRUNCATION_INDICATOR;
}

// ============================================
// NAVIGATION EXTRACTION WITH UNIQUE IDS
// ============================================

/**
 * Extract navigation sections from array of content sections
 * CRITICAL FIX: Ensures all IDs are unique to prevent anchor navigation issues
 * 
 * @param sections - Array of content sections with TipTap body content
 * @returns Array of navigation sections with guaranteed unique IDs
 */
export function extractNavigationSections(
  sections: ExtendedSection[]
): NavigationSection[] {
  const navigationSections: NavigationSection[] = [];
  const usedIds = new Set<string>(); // Track used IDs to prevent duplicates

  sections.forEach((section, index) => {
    // Try to extract H2 heading from body content
    if (!section.bodyContent) {
      return; // Skip sections without content
    }

    const h2Title = extractFirstH2Heading(section.bodyContent as TipTapDocument);
    
    if (!h2Title) {
      return; // Skip sections without H2 heading
    }

    // Generate base anchor ID from H2 text
    let anchorId = generateSectionId(h2Title, index);

    // CRITICAL FIX: Ensure uniqueness by adding numeric suffix if needed
    let counter = 1;
    const baseId = anchorId;
    
    while (usedIds.has(anchorId)) {
      anchorId = `${baseId}-${counter}`;
      counter++;
    }
    
    // Mark this ID as used
    usedIds.add(anchorId);

    // Create navigation section entry
    navigationSections.push({
      humanizedPath: anchorId,
      h2Title,
      shortTitle: generateShortTitle(h2Title)
    });
  });

  return navigationSections;
}

/**
 * Check if a section has navigable content (H2 heading)
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
 */
export function countNavigableSections(sections: ExtendedSection[]): number {
  return sections.filter(hasNavigableHeading).length;
}

// ============================================
// SECTION MAPPING
// ============================================

/**
 * Create a map of section IDs to their navigation data
 */
export function createNavigationMap(
  sections: ExtendedSection[]
): Map<string, NavigationSection> {
  const navigationSections = extractNavigationSections(sections);
  const map = new Map<string, NavigationSection>();

  navigationSections.forEach(navSection => {
    map.set(navSection.humanizedPath, navSection);
  });

  return map;
}

/**
 * Get navigation section by ID
 */
export function getNavigationSectionById(
  sections: ExtendedSection[],
  sectionId: string
): NavigationSection | null {
  const navigationSections = extractNavigationSections(sections);
  return navigationSections.find(nav => nav.humanizedPath === sectionId) || null;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate that sections array has at least one navigable section
 */
export function hasAnyNavigation(sections: ExtendedSection[]): boolean {
  return countNavigableSections(sections) > 0;
}

/**
 * Validate section structure for navigation
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

/**
 * Validate that all navigation IDs are unique
 * Used for debugging and testing
 */
export function validateUniqueIds(sections: NavigationSection[]): {
  isValid: boolean;
  duplicates: string[];
} {
  const idCounts = new Map<string, number>();
  
  sections.forEach(section => {
    const count = idCounts.get(section.humanizedPath) || 0;
    idCounts.set(section.humanizedPath, count + 1);
  });

  const duplicates = Array.from(idCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([id, _]) => id);

  return {
    isValid: duplicates.length === 0,
    duplicates
  };
}

// ============================================
// UTILITY EXPORTS
// ============================================

export {
  extractTextFromNode,
  generateSectionId
} from "../(_components)/server-render-tiptap";
