// @/app/@right/(_service)/(_components)/static-section.tsx
// Server component for rendering individual content section
// Comments in English: Renders a single section with TipTap content as static HTML

import React from "react";
import { ExtendedSection } from "../(_types)/section-types";
import { TipTapDocument } from "./content-renderer/types";
import { renderTipTapDocument, isValidTipTapDocument } from "./server-render-tiptap";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface StaticSectionProps {
    /** The section content to render */
    section: ExtendedSection;
    /** Optional ID to add to H2 heading for anchor navigation */
    sectionId?: string;
    /** Index of the section (used for fallback keys) */
    index: number;
}

// ============================================
// STATIC SECTION COMPONENT
// ============================================

/**
 * StaticSection - Server component for rendering content section
 * 
 * Features:
 * - Pure server-side rendering of TipTap JSON to HTML
 * - Applies TipTap styling classes for proper formatting
 * - Adds section ID to H2 headings for anchor navigation
 * - Handles missing or invalid content gracefully
 * - Provides wrapper div for client-side interactivity positioning
 * 
 * @param section - The content section to render
 * @param sectionId - Optional ID for anchor navigation
 * @param index - Section index for fallback identification
 * @returns Rendered section HTML
 */
export function StaticSection({
    section,
    sectionId,
    index,
}: StaticSectionProps) {
    // Extract body content from section
    const { bodyContent } = section;

    // Handle missing content
    if (!bodyContent) {
        return (
            <div
                id={sectionId}
                className="static-section empty-section p-4 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-800"
            >
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Section {index + 1}: No content available
                </p>
            </div>
        );
    }

    // Validate TipTap document structure
    if (!isValidTipTapDocument(bodyContent)) {
        console.error(
            `[StaticSection] Invalid TipTap document for section ${sectionId || index}`
        );
        return (
            <div
                id={sectionId}
                className="static-section error-section p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
            >
                <p className="text-sm text-red-800 dark:text-red-200">
                    Unable to render section {index + 1}: Invalid content structure
                </p>
            </div>
        );
    }

    // Render TipTap document to React elements
    const renderedContent = renderTipTapDocument(
        bodyContent as TipTapDocument,
        sectionId
    );

    return (
        <section
            id={sectionId ? `section-wrapper-${sectionId}` : undefined}
            className="static-section relative"
            data-section-index={index}
        >
            {/* TipTap content container with proper styling classes */}
            {/* Classes 'tiptap' and 'ProseMirror' apply imported SCSS styles */}
            <div className="tiptap ProseMirror">
                {renderedContent}
            </div>
        </section>
    );
}

// ============================================
// UTILITY COMPONENTS
// ============================================

/**
 * EmptySection - Placeholder when section has no content
 * Used internally by StaticSection
 */
function EmptySection({ index }: { index: number }) {
    return (
        <div className="empty-section p-6 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Section {index + 1} contains no content
            </p>
        </div>
    );
}

/**
 * ErrorSection - Error state when content structure is invalid
 * Used internally by StaticSection
 */
function ErrorSection({ index, message }: { index: number; message?: string }) {
    return (
        <div className="error-section p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start">
                <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                    />
                </svg>
                <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Section {index + 1} Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {message || "Unable to render content: Invalid document structure"}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default StaticSection;
