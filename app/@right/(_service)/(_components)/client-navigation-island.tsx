// @/app/@right/(_service)/(_components)/client-navigation-island.tsx
"use client";

// Client island for mobile navigation buttons
// Comments in English: Provides horizontal scrollable navigation buttons
// for mobile screens. Uses anchor links for navigation with optional
// active state tracking via Intersection Observer.

import React, { useState, useEffect } from "react";
import { NavigationSection } from "../(_utils)/navigation-utils";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ClientNavigationIslandProps {
    /** Navigation sections with IDs and titles */
    sections: NavigationSection[];
    /** Enable active section highlighting (default: true) */
    trackActive?: boolean;
    /** Custom class for container */
    className?: string;
}

// ============================================
// CONFIGURATION
// ============================================

/** Intersection Observer options for active section tracking */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
    rootMargin: "-100px 0px -60% 0px",
    threshold: 0,
};

// ============================================
// CLIENT NAVIGATION ISLAND
// ============================================

/**
 * ClientNavigationIsland - Mobile navigation buttons
 * 
 * Features:
 * - Horizontal scrollable button row
 * - Anchor-based navigation (works without JS)
 * - Active section highlighting (optional)
 * - Sticky positioning at top
 * - Hidden on 2xl+ screens (where sidebar TOC shows)
 * - Smooth scroll behavior
 * - Accessible keyboard navigation
 * 
 * @param sections - Navigation sections to render
 * @param trackActive - Enable active state tracking
 * @param className - Additional CSS classes
 * @returns Mobile navigation buttons
 */
export function ClientNavigationIsland({
    sections,
    trackActive = true,
    className = "",
}: ClientNavigationIslandProps) {
    // State for tracking active section
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Early return if no sections
    if (!sections || sections.length === 0) {
        return null;
    }

    // Set up Intersection Observer for active section tracking
    useEffect(() => {
        if (!trackActive) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, OBSERVER_OPTIONS);

        // Observe all section headings
        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // Cleanup observer on unmount
        return () => {
            observer.disconnect();
        };
    }, [sections, trackActive]);

    return (
        <div
            className={`
        client-navigation-island
        sticky top-0 z-40 mb-6 
        2xl:hidden
        ${className}
      `}
        >
            {/* Horizontal scrollable container */}
            <div className="overflow-x-auto custom-scrollbar">
                <div className="flex gap-4 min-w-fit bg-background py-2">
                    {sections.map(({ id, shortTitle, h2Title }) => {
                        const isActive = trackActive && activeSection === id;

                        return (
                            <Button
                                key={id}
                                asChild
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className={`
                  whitespace-nowrap flex-shrink-0
                  transition-all duration-200
                  ${isActive ? "shadow-sm" : ""}
                `}
                            >
                                <a
                                    href={`#${id}`}
                                    title={h2Title}
                                    aria-current={isActive ? "location" : undefined}
                                >
                                    {shortTitle}
                                </a>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ============================================
// SIMPLIFIED VERSION (NO ACTIVE TRACKING)
// ============================================

/**
 * SimpleNavigationButtons - Lightweight version without active tracking
 * Better performance for pages with many sections
 */
export function SimpleNavigationButtons({
    sections,
    className = "",
}: Omit<ClientNavigationIslandProps, "trackActive">) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <div className={`sticky top-0 z-40 mb-6 2xl:hidden ${className}`}>
            <div className="overflow-x-auto custom-scrollbar">
                <div className="flex gap-4 min-w-fit bg-background py-2">
                    {sections.map(({ id, shortTitle, h2Title }) => (
                        <Button
                            key={id}
                            asChild
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap flex-shrink-0"
                        >
                            <a href={`#${id}`} title={h2Title}>
                                {shortTitle}
                            </a>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// COMPACT VERSION (ICONS ONLY)
// ============================================

/**
 * CompactNavigationIsland - Icon-based navigation for minimal space
 */
export function CompactNavigationIsland({
    sections,
    className = "",
}: Omit<ClientNavigationIslandProps, "trackActive">) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <div className={`sticky top-0 z-40 mb-6 2xl:hidden ${className}`}>
            <div className="overflow-x-auto custom-scrollbar">
                <div className="flex gap-2 min-w-fit bg-background py-2">
                    {sections.map(({ id, h2Title }, index) => (
                        <Button
                            key={id}
                            asChild
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0 w-10 h-10"
                        >
                            <a
                                href={`#${id}`}
                                title={h2Title}
                                aria-label={`Section ${index + 1}: ${h2Title}`}
                            >
                                <span className="text-xs font-mono">{index + 1}</span>
                            </a>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// DROPDOWN VERSION (FOR MANY SECTIONS)
// ============================================

/**
 * DropdownNavigationIsland - Dropdown menu for pages with 10+ sections
 */
export function DropdownNavigationIsland({
    sections,
    className = "",
}: Omit<ClientNavigationIslandProps, "trackActive">) {
    const [isOpen, setIsOpen] = useState(false);

    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <div className={`sticky top-0 z-40 mb-6 2xl:hidden ${className}`}>
            <div className="relative">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between"
                >
                    <span>Jump to section</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </Button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
                        {sections.map(({ id, h2Title }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {h2Title}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ClientNavigationIsland;
