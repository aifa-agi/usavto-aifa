// @/app/@right/(_service)/(_components)/static-toc.tsx
// Server component for Table of Contents with anchor navigation
// Comments in English: Renders a static TOC with pure anchor links,
// providing instant navigation without JavaScript.

import React from "react";
import { NavigationSection } from "../(_utils)/navigation-utils";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface StaticTOCProps {
    /** Array of navigation sections extracted from content */
    navigationSections?: NavigationSection[];
    /** Optional heading text for TOC (defaults to "Contents") */
    heading?: string;
}

// ============================================
// STATIC TOC COMPONENT
// ============================================

/**
 * StaticTOC - Server component for Table of Contents
 * 
 * Features:
 * - Pure anchor links for instant browser-native navigation
 * - Works without JavaScript (progressive enhancement)
 * - Sticky positioning on desktop (2xl+)
 * - Hidden when no navigable navigationSection exist
 * - Accessible with proper semantic HTML
 * - SEO-friendly (crawlable links)
 * 
 * @param navigationSections? - Navigation snavigationSection with IDs and titles
 * @param heading - Optional custom heading (default: "Contents")
 * @returns Rendered TOC navigation
 */
export function StaticTOC({ navigationSections, heading = "Contents" }: StaticTOCProps) {
    // Hide TOC if no navigationSection available
    if (!navigationSections || navigationSections.length === 0) {
        return null;
    }

    return (
        <nav
            className="static-toc space-y-1"
            aria-label="Table of contents"
            role="navigation"
        >
            {/* TOC Heading */}
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {heading}
            </h3>

            {/* Navigation Links */}
            <ul className="space-y-1" role="list">
                {navigationSections.map(({ humanizedPath, h2Title }) => (
                    <li key={humanizedPath}>
                        <a
                            href={`#${humanizedPath}`}
                            className="
                block text-sm text-muted-foreground 
                hover:text-foreground 
                transition-colors 
                py-1 
                leading-tight 
                line-clamp-2
                focus:outline-none
                focus:text-foreground
                focus:underline
              "
                            title={h2Title}
                        >
                            {h2Title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// ============================================
// ALTERNATIVE COMPACT VERSION
// ============================================

/**
 * CompactTOC - Condensed version for narrow sidebars
 * Shows only first 30 characters of each title
 */
export function CompactTOC({ navigationSections, heading = "Contents" }: StaticTOCProps) {
    if (!navigationSections || navigationSections.length === 0) {
        return null;
    }

    return (
        <nav
            className="compact-toc space-y-0.5"
            aria-label="Table of contents"
            role="navigation"
        >
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {heading}
            </h3>

            <ul className="space-y-0.5" role="list">
                {navigationSections.map(({ humanizedPath, h2Title }) => {
                    // Truncate long titles
                    const displayTitle = h2Title.length > 30
                        ? `${h2Title.substring(0, 30)}...`
                        : h2Title;

                    return (
                        <li key={humanizedPath}>
                            <a
                                href={`#${humanizedPath}`}
                                className="
                  block text-xs text-muted-foreground 
                  hover:text-foreground 
                  transition-colors 
                  py-0.5
                  truncate
                  focus:outline-none
                  focus:text-foreground
                "
                                title={h2Title}
                            >
                                {displayTitle}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

// ============================================
// NUMBERED VERSION
// ============================================

/**
 * NumberedTOC - Version with section numbers
 * Useful for formal documents or tutorials
 */
export function NumberedTOC({ navigationSections, heading = "Contents" }: StaticTOCProps) {
    if (!navigationSections || navigationSections.length === 0) {
        return null;
    }

    return (
        <nav
            className="numbered-toc space-y-1"
            aria-label="Table of contents"
            role="navigation"
        >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {heading}
            </h3>

            <ol className="space-y-1 list-none" role="list">
                {navigationSections.map(({ humanizedPath, h2Title }, index) => (
                    <li key={humanizedPath} className="flex items-start">
                        <span className="text-xs text-muted-foreground mr-2 mt-1 font-mono flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}.
                        </span>
                        <a
                            href={`#${humanizedPath}`}
                            className="
                flex-1 text-sm text-muted-foreground 
                hover:text-foreground 
                transition-colors 
                py-1 
                leading-tight 
                line-clamp-2
                focus:outline-none
                focus:text-foreground
                focus:underline
              "
                            title={h2Title}
                        >
                            {h2Title}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// ============================================
// COLLAPSIBLE VERSION (requires client component wrapper)
// ============================================

/**
 * CollapsibleTOCStatic - Static structure for collapsible TOC
 * Note: Actual collapse functionality requires client-side wrapper
 * This provides the HTML structure only
 */
export function CollapsibleTOCStatic({ navigationSections, heading = "Contents" }: StaticTOCProps) {
    if (!navigationSections || navigationSections.length === 0) {
        return null;
    }

    return (
        <details
            className="collapsible-toc"
            open
        >
            <summary className="
        text-sm font-medium text-muted-foreground mb-3 
        cursor-pointer 
        hover:text-foreground 
        transition-colors
        list-none
        flex items-center justify-between
      ">
                <span>{heading}</span>
                <svg
                    className="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>

            <ul className="space-y-1 mt-3" role="list">
                {navigationSections.map(({ humanizedPath, h2Title }) => (
                    <li key={humanizedPath}>
                        <a
                            href={`#${humanizedPath}`}
                            className="
                block text-sm text-muted-foreground 
                hover:text-foreground 
                transition-colors 
                py-1 
                leading-tight 
                line-clamp-2
                focus:outline-none
                focus:text-foreground
                focus:underline
              "
                            title={h2Title}
                        >
                            {h2Title}
                        </a>
                    </li>
                ))}
            </ul>
        </details>
    );
}

// ============================================
// EXPORTS
// ============================================

export default StaticTOC;
