// @/lib/section-anchor-utils.ts

import { ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";



/**
 * TipTap Document Node Interface
 * Represents the structure of TipTap JSON content
 */
interface TipTapNode {
  type: string;
  text?: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
}

/**
 * TipTap Document Interface
 */
interface TipTapDocument {
  type: "doc";
  content?: TipTapNode[];
}

/**
 * Section Anchor Data
 * Contains extracted H2 title and generated anchor slug
 */
export interface SectionAnchorData {
  h2Title: string;
  humanizedPath: string;
}

/**
 * Extracts the first H2 heading text from TipTap JSON content
 * @param document - TipTap document structure
 * @returns H2 heading text or null if not found
 */
export function retrieveH2HeadingText(document: TipTapDocument): string | null {
  if (!document?.content) {
    return null;
  }

  for (const node of document.content) {
    if (node.type === "heading" && node.attrs?.level === 2 && node.content) {
      const headingText = extractPlainTextFromNode(node);
      if (headingText.trim()) {
        return headingText.trim();
      }
    }
  }

  return null;
}

/**
 * Recursively extracts plain text from TipTap node structure
 * @param node - TipTap node to extract text from
 * @returns Concatenated text content
 */
function extractPlainTextFromNode(node: TipTapNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map(childNode => extractPlainTextFromNode(childNode))
      .join(" ");
  }

  return "";
}

/**
 * Transliterates Cyrillic characters to Latin equivalents
 * Supports Russian and Ukrainian alphabets
 * @param text - Text to transliterate
 * @returns Transliterated text
 */
function convertCyrillicToLatin(text: string): string {
  const transliterationMap: Record<string, string> = {
    // Russian lowercase
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    // Russian uppercase
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'yo',
    'Ж': 'zh', 'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm',
    'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u',
    'Ф': 'f', 'Х': 'h', 'Ц': 'ts', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch',
    'Ъ': '', 'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya',
    // Ukrainian specific
    'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g',
    'І': 'i', 'Ї': 'yi', 'Є': 'ye', 'Ґ': 'g'
  };

  return text.split('').map(char => transliterationMap[char] || char).join('');
}

/**
 * Generates URL-safe anchor slug from H2 heading text
 * Handles Cyrillic transliteration and special character removal
 * @param h2Text - H2 heading text
 * @returns URL-safe slug (max 60 characters)
 */
export function buildAnchorSlugFromH2(h2Text: string): string {
  // Step 1: Transliterate Cyrillic to Latin
  const transliterated = convertCyrillicToLatin(h2Text);

  // Step 2: Convert to lowercase and create slug
  // Keep only Latin letters (a-z), numbers (0-9), spaces, and hyphens
  const slug = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-Latin characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .slice(0, 60); // Limit length to 60 characters

  return slug;
}

/**
 * Processes a section and extracts anchor data (H2 title + slug)
 * @param section - Extended section object from page
 * @returns Section anchor data or null if H2 not found
 */
export function processSectionAnchorData(section: ExtendedSection): SectionAnchorData | null {
  if (!section.bodyContent) {
    return null;
  }

  const h2Title = retrieveH2HeadingText(section.bodyContent as TipTapDocument);
  
  if (!h2Title) {
    return null;
  }

  const humanizedPath = buildAnchorSlugFromH2(h2Title);

  return {
    h2Title,
    humanizedPath
  };
}

/**
 * Builds absolute URL with anchor to specific section
 * @param baseUrl - Base domain URL (e.g., "https://yourdomain.com")
 * @param pageHref - Page path (e.g., "/putevye-listy/kak-delat")
 * @param anchorSlug - Section anchor slug
 * @returns Complete URL with anchor (e.g., "https://yourdomain.com/page#anchor")
 */
export function constructSectionAbsoluteUrl(
  baseUrl: string,
  pageHref: string,
  anchorSlug: string
): string {
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${pageHref}#${anchorSlug}`;
}
