// Обновленный html-section-parser.ts

import type { SectionInfo } from '@/app/@right/(_service)/(_types)/page-types';
import type { JSONContent } from '@tiptap/react';

/**
 * Extracts plain text from the first <h2>...</h2> in HTML.
 * Falls back to "Section {index}" (1-based) when no H2 is found or it's empty.
 */
export function extractH2Label(html: string, index: number): string {
  const match = html?.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!match) return `Section ${index + 1}`;
  const h2Inner = match[1] ?? '';
  const text = stripHtml(h2Inner).trim();
  return text.length > 0 ? text : `Section ${index + 1}`;
}

/**
 * Converts HTML into a tiptap-compatible JSON document.
 * Supports paragraphs, headings (h1-h6), lists, tables, and code blocks.
 */
export function htmlToTiptapJSON(html: string): JSONContent {
  const normalized = (html || '').trim();
  if (!normalized) return emptyDoc();

  const nodes: JSONContent[] = [];
  
  // Enhanced regex to capture more block elements including tables
  const blockRegex = /<(h[1-6]|p|table|ul|ol|pre)[^>]*>([\s\S]*?)<\/\1>/gi;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(normalized)) !== null) {
    const [full, tag, inner] = match;

    // Push any plain text before this block as a paragraph
    if (match.index > lastIndex) {
      const stray = stripHtml(normalized.slice(lastIndex, match.index)).trim();
      if (stray) nodes.push(paragraph(stray));
    }

    const tagLower = tag.toLowerCase();
    
    if (tagLower.startsWith('h')) {
      const level = Number(tag.slice(1));
      const text = stripHtml(inner).trim();
      if (text) nodes.push(heading(level, text));
    } else if (tagLower === 'p') {
      const text = stripHtml(inner).trim();
      if (text) nodes.push(paragraph(text));
    } else if (tagLower === 'table') {
      const tableNode = parseTable(inner);
      if (tableNode) nodes.push(tableNode);
    } else if (tagLower === 'ul') {
      const listNode = parseList(inner, 'bulletList');
      if (listNode) nodes.push(listNode);
    } else if (tagLower === 'ol') {
      const listNode = parseList(inner, 'orderedList');
      if (listNode) nodes.push(listNode);
    } else if (tagLower === 'pre') {
      const codeNode = parseCodeBlock(inner);
      if (codeNode) nodes.push(codeNode);
    }

    lastIndex = match.index + full.length;
  }

  // Handle tail content after the last block
  if (lastIndex < normalized.length) {
    const tail = stripHtml(normalized.slice(lastIndex)).trim();
    if (tail) nodes.push(paragraph(tail));
  }

  if (nodes.length === 0) nodes.push(paragraph(''));

  return { type: 'doc', content: nodes };
}

/**
 * Parses HTML table into TipTap table JSON structure
 */
function parseTable(tableInner: string): JSONContent | null {
  const rows: JSONContent[] = [];
  
  // Find all table rows (both in thead and tbody)
  const rowMatches = tableInner.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  
  if (!rowMatches) return null;
  
  let hasHeaderRow = false;
  
  rowMatches.forEach((rowHtml, index) => {
    const rowInner = rowHtml.replace(/<\/?tr[^>]*>/gi, '');
    
    // Check if this row contains header cells
    const isHeaderRow = /<th[^>]*>/i.test(rowInner);
    if (index === 0 && isHeaderRow) {
      hasHeaderRow = true;
    }
    
    const cells: JSONContent[] = [];
    
    // Find all cells (both th and td)
    const cellMatches = rowInner.match(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi);
    
    if (cellMatches) {
      cellMatches.forEach(cellHtml => {
        const cellMatch = cellHtml.match(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/i);
        if (cellMatch) {
          const [, cellType, cellContent] = cellMatch;
          const cellText = stripHtml(cellContent).trim();
          
          const cellNode: JSONContent = {
            type: isHeaderRow ? 'tableHeader' : 'tableCell',
            content: [
              {
                type: 'paragraph',
                content: cellText ? [{ type: 'text', text: cellText }] : []
              }
            ]
          };
          
          cells.push(cellNode);
        }
      });
    }
    
    if (cells.length > 0) {
      rows.push({
        type: 'tableRow',
        content: cells
      });
    }
  });
  
  if (rows.length === 0) return null;
  
  return {
    type: 'table',
    content: rows
  };
}

/**
 * Parses HTML list into TipTap list JSON structure
 */
function parseList(listInner: string, listType: 'bulletList' | 'orderedList'): JSONContent | null {
  const items: JSONContent[] = [];
  
  const itemMatches = listInner.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  
  if (!itemMatches) return null;
  
  itemMatches.forEach(itemHtml => {
    const itemMatch = itemHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
    if (itemMatch) {
      const itemContent = stripHtml(itemMatch[1]).trim();
      if (itemContent) {
        items.push({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: itemContent }]
            }
          ]
        });
      }
    }
  });
  
  if (items.length === 0) return null;
  
  return {
    type: listType,
    content: items
  };
}

/**
 * Parses HTML pre/code block into TipTap code block JSON structure
 */
function parseCodeBlock(preInner: string): JSONContent | null {
  // Extract content from <code> tag if present, otherwise use pre content directly
  const codeMatch = preInner.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  const content = codeMatch ? codeMatch[1] : preInner;
  
  const codeText = decodeEntities(content).trim();
  
  if (!codeText) return null;
  
  return {
    type: 'codeBlock',
    content: [{ type: 'text', text: codeText }]
  };
}

/**
 * Maps SectionInfo[] into ParsedSection[] ready for Step 12 editor consumption.
 * Filters out sections with empty or missing tempMDXContent.
 */
export function parseSectionsForStep12(sections: SectionInfo[]): ParsedSection[] {
  return (sections || [])
    .filter(s => {
      // Filter out sections with empty or missing content
      const content = s.tempMDXContent?.trim();
      return content && content.length > 0;
    })
    .map((s, idx) => ({
      id: s.id,
      label: extractH2Label(s.tempMDXContent || '', idx),
      content: htmlToTiptapJSON(s.tempMDXContent || ''),
    }));
}

/** Consumer-friendly shape for Step 12 editors and selectors. */
export interface ParsedSection {
  id: string;
  label: string;
  content: JSONContent;
}

/* ----------------- Internal helpers ----------------- */

/** Strips HTML tags and decodes a small set of common entities. */
function stripHtml(input: string): string {
  const withLines = (input || '').replace(/<\s*br\s*\/?>/gi, '\n');
  const noTags = withLines.replace(/<[^>]+>/g, '');
  return decodeEntities(noTags);
}

function decodeEntities(text: string): string {
  return (text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function emptyDoc(): JSONContent {
  return { type: 'doc', content: [paragraph('')] };
}

function paragraph(text: string): JSONContent {
  return { 
    type: 'paragraph', 
    content: text ? [{ type: 'text', text }] : [] 
  };
}

function heading(level: number, text: string): JSONContent {
  const safe = Math.min(6, Math.max(1, level || 2));
  return { 
    type: 'heading', 
    attrs: { level: safe }, 
    content: [{ type: 'text', text }] 
  };
}
