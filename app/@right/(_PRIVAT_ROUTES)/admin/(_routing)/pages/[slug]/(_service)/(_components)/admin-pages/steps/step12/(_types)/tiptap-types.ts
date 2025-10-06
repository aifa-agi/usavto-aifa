// @/app/@right/(_service)/(_types)/tiptap-types.ts
// Comments in English: TipTap/ProseMirror JSON structure type definitions

/**
 * Comments in English: Base content node in TipTap document tree
 * Represents any node type: paragraph, heading, text, image, etc.
 */
export interface ContentNode {
  /** Node type: "text", "paragraph", "heading", "image", etc. */
  type: string;

  /** Optional attributes (e.g., heading level, image src/alt) */
  attrs?: Record<string, any>;

  /** Text content (only for type: "text") */
  text?: string;

  /** Text formatting marks (bold, italic, link, etc.) */
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;

  /** Nested child nodes (for containers like doc, paragraph, heading) */
  content?: ContentNode[];
}

/**
 * Comments in English: Root TipTap document structure
 * Always has type: "doc" at the top level
 */
export interface TipTapDocument {
  type: "doc";
  content?: ContentNode[];
}

/**
 * Comments in English: Alias for backward compatibility
 * Use this as the type for section.bodyContent
 */
export type BodyContent = TipTapDocument | ContentNode;
