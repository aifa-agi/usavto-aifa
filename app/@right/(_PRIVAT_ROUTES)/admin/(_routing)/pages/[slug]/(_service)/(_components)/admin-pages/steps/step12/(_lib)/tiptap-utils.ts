// @/lib/tiptap-utils.ts
// Comments in English: Extract plain text from TipTap JSON structure

import { BodyContent, ContentNode } from "../(_types)/tiptap-types";


/**
 * Comments in English: Recursively extract plain text from TipTap JSON content
 * Handles nested structures (paragraphs, headings, lists, etc.)
 * 
 * @param content - TipTap content node or array of nodes
 * @returns Plain text string with spaces between nodes
 */
export function extractPlainText(content: BodyContent | ContentNode | ContentNode[] | undefined): string {
  if (!content) return "";

  // Handle array of nodes
  if (Array.isArray(content)) {
    return content
      .map((node) => extractPlainText(node))
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  // Handle single node
  const node = content as ContentNode;

  // Base case: text node with actual text content
  if (node.type === "text" && node.text) {
    return node.text;
  }

  // Recursive case: node with nested content
  if (node.content && Array.isArray(node.content)) {
    return extractPlainText(node.content);
  }

  return "";
}

/**
 * Comments in English: Extract text from TipTap document structure
 * Main entry point for bodyContent extraction
 * 
 * @param bodyContent - Full TipTap document object
 * @returns Cleaned plain text
 */
export function extractTextFromBodyContent(bodyContent: BodyContent | undefined): string {
  if (!bodyContent) return "";
  
  const text = extractPlainText(bodyContent);
  
  // Clean up: remove multiple spaces, trim
  return text.replace(/\s+/g, " ").trim();
}
