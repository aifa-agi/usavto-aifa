// @/app/@right/(_service)/(_components)/server-render-tiptap.tsx
// Server-side utilities for rendering TipTap JSON to React JSX
// Comments in English: This module converts TipTap Document JSON into static React elements
// for server-side rendering, ensuring all content is present in the initial HTML.

import React from "react";
import { TipTapNode, TipTapDocument } from "./content-renderer/types";

// ============================================
// TYPES & INTERFACES
// ============================================

interface RenderOptions {
  /** Optional section ID to add to H2 headings for anchor navigation */
  sectionId?: string;
  /** Index of the current node (used for React keys) */
  index?: number;
}

// ============================================
// ID GENERATION UTILITIES
// ============================================

/**
 * Generate a URL-friendly ID from H2 heading text
 * Used for anchor navigation links
 * 
 * @param h2Text - The text content of the H2 heading
 * @param fallbackIndex - Fallback index if text is empty
 * @returns URL-safe ID string
 */
export function generateSectionId(h2Text: string, fallbackIndex: number): string {
  if (!h2Text || !h2Text.trim()) {
    return `section-${fallbackIndex}`;
  }

  // Convert to lowercase and remove special characters
  // Support both Latin and Cyrillic characters
  const slug = h2Text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/g, '') // Keep letters, numbers, spaces, hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .slice(0, 60); // Limit length

  return slug || `section-${fallbackIndex}`;
}

/**
 * Extract plain text from TipTap node recursively
 * Used for generating IDs and metadata
 */
export function extractTextFromNode(node: TipTapNode): string {
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

// ============================================
// NODE RENDERERS
// ============================================

/**
 * Render heading node (h1-h6)
 * Adds id attribute to H2 for anchor navigation
 */
function renderHeading(
  node: TipTapNode,
  index: number,
  sectionId?: string
): React.ReactNode {
  const level = node.attrs?.level || 1;
  const textAlign = node.attrs?.textAlign;
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  const style: React.CSSProperties = textAlign
    ? { textAlign: textAlign as React.CSSProperties['textAlign'] }
    : {};

  // Add padding and scroll margin for H2 headings
  if (level === 2) {
    style.paddingRight = '36px';
    style.paddingTop = '4px';
    style.scrollMarginTop = '100px'; // Offset for fixed header
  }

  // Add id to H2 for anchor navigation
  const h2Props = level === 2 && sectionId
    ? { id: sectionId, style }
    : { style };

  // Return appropriate heading level
  switch (level) {
    case 1:
      return <h1 key={index} style={style}>{content}</h1>;
    case 2:
      return <h2 key={index} {...h2Props}>{content}</h2>;
    case 3:
      return <h3 key={index} style={style}>{content}</h3>;
    case 4:
      return <h4 key={index} style={style}>{content}</h4>;
    case 5:
      return <h5 key={index} style={style}>{content}</h5>;
    case 6:
      return <h6 key={index} style={style}>{content}</h6>;
    default:
      return <h1 key={index} style={style}>{content}</h1>;
  }
}

/**
 * Render paragraph node
 */
function renderParagraph(node: TipTapNode, index: number): React.ReactNode {
  const textAlign = node.attrs?.textAlign;
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  const style: React.CSSProperties = textAlign
    ? { textAlign: textAlign as React.CSSProperties['textAlign'] }
    : {};

  return (
    <p key={index} style={style}>
      {content}
    </p>
  );
}

/**
 * Render blockquote node
 */
function renderBlockquote(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  return (
    <blockquote key={index}>
      {content}
    </blockquote>
  );
}

/**
 * Render code block node
 */
function renderCodeBlock(node: TipTapNode, index: number): React.ReactNode {
  const language = node.attrs?.language || "";
  const code = node.content?.map(child => child.text || "").join("") || "";

  return (
    <pre key={index}>
      <code className={language ? `language-${language}` : ""}>
        {code}
      </code>
    </pre>
  );
}

/**
 * Render horizontal rule
 */
function renderHorizontalRule(index: number): React.ReactNode {
  return <hr key={index} />;
}

/**
 * Render image node
 * Note: Using standard img tag here. Can be upgraded to Next/Image if needed.
 */
function renderImage(node: TipTapNode, index: number): React.ReactNode {
  const src = node.attrs?.src || "";
  const alt = node.attrs?.alt || "";
  const title = node.attrs?.title;

  if (!src) return null;

  return (
    <img
      key={index}
      src={src}
      alt={alt}
      title={title}
      loading="lazy"
    />
  );
}

/**
 * Render list (bullet or ordered)
 */
function renderList(node: TipTapNode, index: number): React.ReactNode {
  const isOrdered = node.type === "orderedList";
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  if (isOrdered) {
    return <ol key={index}>{content}</ol>;
  }

  return <ul key={index}>{content}</ul>;
}

/**
 * Render list item
 */
function renderListItem(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  return <li key={index}>{content}</li>;
}

/**
 * Render table with proper structure
 */
function renderTable(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  // Detect if table has header rows
  const hasHeaders = node.content?.some(row =>
    row.type === 'tableRow' &&
    row.content?.some(cell => cell.type === 'tableHeader')
  );

  return (
    <div key={index} className="table-responsive-wrapper">
      <table>
        {hasHeaders && (
          <thead>
            {content.filter((_, idx) => {
              const row = node.content?.[idx];
              return row?.content?.some(cell => cell.type === 'tableHeader');
            })}
          </thead>
        )}
        <tbody>
          {hasHeaders
            ? content.filter((_, idx) => {
              const row = node.content?.[idx];
              return !row?.content?.some(cell => cell.type === 'tableHeader');
            })
            : content
          }
        </tbody>
      </table>
    </div>
  );
}

/**
 * Render table row
 */
function renderTableRow(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  return <tr key={index}>{content}</tr>;
}

/**
 * Render table header cell
 */
function renderTableHeader(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  const colspan = node.attrs?.colspan || 1;
  const rowspan = node.attrs?.rowspan || 1;
  const colwidth = node.attrs?.colwidth;

  const style: React.CSSProperties = {};
  if (colwidth && Array.isArray(colwidth) && colwidth[0]) {
    style.minWidth = `${colwidth[0]}px`;
    style.width = `${colwidth[0]}px`;
  }

  return (
    <th
      key={index}
      colSpan={colspan}
      rowSpan={rowspan}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {content}
    </th>
  );
}

/**
 * Render table cell
 */
function renderTableCell(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, idx) =>
    renderTipTapNode(child, idx)
  ) || [];

  const colspan = node.attrs?.colspan || 1;
  const rowspan = node.attrs?.rowspan || 1;
  const colwidth = node.attrs?.colwidth;

  const style: React.CSSProperties = {};
  if (colwidth && Array.isArray(colwidth) && colwidth[0]) {
    style.minWidth = `${colwidth[0]}px`;
    style.width = `${colwidth[0]}px`;
  }

  return (
    <td
      key={index}
      colSpan={colspan}
      rowSpan={rowspan}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {content}
    </td>
  );
}

/**
 * Render text node (leaf node)
 */
function renderText(node: TipTapNode): string {
  return node.text || "";
}

// ============================================
// MAIN RENDERING FUNCTION
// ============================================

/**
 * Main dispatcher for rendering TipTap nodes
 * Routes to appropriate renderer based on node type
 */
export function renderTipTapNode(
  node: TipTapNode,
  index: number,
  sectionId?: string
): React.ReactNode {
  switch (node.type) {
    case "heading":
      return renderHeading(node, index, sectionId);
    case "paragraph":
      return renderParagraph(node, index);
    case "blockquote":
      return renderBlockquote(node, index);
    case "codeBlock":
      return renderCodeBlock(node, index);
    case "horizontalRule":
      return renderHorizontalRule(index);
    case "image":
      return renderImage(node, index);
    case "bulletList":
    case "orderedList":
      return renderList(node, index);
    case "listItem":
      return renderListItem(node, index);
    case "table":
      return renderTable(node, index);
    case "tableRow":
      return renderTableRow(node, index);
    case "tableHeader":
      return renderTableHeader(node, index);
    case "tableCell":
      return renderTableCell(node, index);
    case "text":
      return renderText(node);
    default:
      console.warn(`[ServerRender] Unknown TipTap node type: ${node.type}`);
      return (
        <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
          Unsupported content type: {node.type}
        </div>
      );
  }
}

/**
 * Render complete TipTap document to React elements
 * Main entry point for server-side rendering
 * 
 * @param document - TipTap JSON document
 * @param sectionId - Optional ID to add to first H2 heading
 * @returns Array of React elements
 */
export function renderTipTapDocument(
  document: TipTapDocument,
  sectionId?: string
): React.ReactNode[] {
  if (!document?.content) {
    return [];
  }

  // Track if we've added the sectionId to an H2 yet
  let h2IdApplied = false;

  return document.content.map((node, index) => {
    // Apply sectionId to first H2 heading only
    if (node.type === "heading" && node.attrs?.level === 2 && !h2IdApplied && sectionId) {
      h2IdApplied = true;
      return renderTipTapNode(node, index, sectionId);
    }

    return renderTipTapNode(node, index);
  });
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate that the provided object is a valid TipTap document
 */
export function isValidTipTapDocument(doc: any): doc is TipTapDocument {
  return (
    doc &&
    typeof doc === "object" &&
    doc.type === "doc" &&
    Array.isArray(doc.content)
  );
}

/**
 * Safe wrapper for rendering that handles invalid documents
 */
export function safeRenderTipTapDocument(
  document: any,
  sectionId?: string
): React.ReactNode[] {
  if (!isValidTipTapDocument(document)) {
    console.error("[ServerRender] Invalid TipTap document structure");
    return [
      <div key="error" className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
        <p className="text-sm text-red-800 dark:text-red-200">
          Unable to render content: Invalid document structure
        </p>
      </div>
    ];
  }

  return renderTipTapDocument(document, sectionId);
}
