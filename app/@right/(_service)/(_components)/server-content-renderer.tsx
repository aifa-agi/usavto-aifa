// @/app/@right/(_service)/(_components)/server-content-renderer.tsx
// Main server component for rendering static page content
// Comments in English: This is a pure server component that renders all content
// as static HTML, ensuring optimal SEO and Core Web Vitals performance.

import React from "react";
import { ExtendedSection } from "../(_types)/section-types";
import { extractNavigationSections } from "../(_utils)/navigation-utils";
import { HeroImage, type PageImage } from "./hero-image";
import { StaticSection } from "./static-section";

import { ClientNavigationIsland } from "./client-navigation-island";
import { ClientInteractivityIsland } from "./client-interactivity-island";
import { CalculatorSection } from "./home-page/(_components)/calculator-section";
import { FooterSection } from "./home-page/(_components)/footer-section";
import StaticTOC from "./static-toc";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ServerContentRendererProps {
    /** Array of content sections with TipTap body content */
    sections: ExtendedSection[];
    /** Optional hero image to display at the top */
    heroImage?: PageImage;
}

// ============================================
// LAYOUT WRAPPER COMPONENTS
// ============================================

/**
 * Wrapper for max-width content container
 * Provides consistent spacing across breakpoints
 */
function MaxWidthWrapper({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`mx-auto w-full max-w-screen-xl px-2.5 md:px-4 ${className}`}>
            {children}
        </div>
    );
}

/**
 * Section separator component
 * Adds visual spacing between content sections
 */
function SectionSeparator() {
    return (
        <div className="section-separator">
            <div className="h-6" />
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
            <div className="h-9" />
        </div>
    );
}

// ============================================
// MAIN SERVER COMPONENT
// ============================================

/**
 * ServerContentRenderer - Main server component for page content
 * 
 * Features:
 * - Pure server-side rendering (no client-side hydration for content)
 * - Semantic HTML with proper heading hierarchy
 * - Anchor navigation for sections
 * - Responsive layout with conditional styles
 * - Client islands for interactivity (navigation buttons, send to chat)
 * 
 * @param sections - Array of content sections to render
 * @param heroImage - Optional hero image data
 * @returns Fully rendered static content
 */
export default function ServerContentRenderer({
    sections,
    heroImage,
}: ServerContentRendererProps) {
    // Early return if no sections provided
    if (!sections || sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-gray-400"
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
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Content Available
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    No sections to display on this page
                </p>
            </div>
        );
    }

    // Extract navigation structure from sections
    const navigationSections = extractNavigationSections(sections);

    // Collect section IDs for client interactivity island
    const sectionIds = navigationSections.map(nav => nav.id);

    return (
        <div className="content-renderer">
            <div className="relative">
                {/* Decorative line - visible only on 2xl+ screens */}
                <div className="absolute top-52 w-full border-t hidden 2xl:block" />

                {/* Main content structure with conditional grid layout */}
                <div className="2xl:block">
                    <MaxWidthWrapper className="2xl:grid 2xl:grid-cols-4 2xl:gap-10 pt-8 max-md:px-0">
                        {/* Main content area - responsive layout */}
                        <div
                            className="
                mx-auto max-w-4xl px-6 py-8
                2xl:relative 2xl:col-span-3 2xl:mb-10 2xl:flex 2xl:flex-col 2xl:space-y-8
                2xl:bg-background 2xl:px-0 2xl:py-0 2xl:max-w-none 2xl:mx-0
              "
                        >
                            {/* Hero Image Section */}
                            {heroImage && <HeroImage image={heroImage} />}

                            {/* Content container with conditional padding */}
                            <div className="2xl:px-[.8rem] 2xl:pb-10 2xl:md:px-8">
                                {/* Client Navigation Island - Mobile navigation buttons */}
                                {/* Hidden on 2xl+ screens where sidebar TOC is shown */}
                                <ClientNavigationIsland sections={navigationSections} />

                                {/* Render all content sections */}
                                {sections.map((section, index) => {
                                    const isLastSection = index === sections.length - 1;
                                    const navigationSection = navigationSections.find(
                                        nav => sections.indexOf(section) === index
                                    );

                                    return (
                                        <React.Fragment key={section.id || `section-${index}`}>
                                            {/* Static section component - server-rendered */}
                                            <StaticSection
                                                section={section}
                                                sectionId={navigationSection?.id}
                                                index={index}
                                            />

                                            {/* Add separator between sections (except after last) */}
                                            {!isLastSection && <SectionSeparator />}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar Table of Contents - visible only on 2xl+ screens */}
                        <div className="sticky top-20 col-span-1 mt-52 hidden 2xl:flex flex-col divide-y divide-muted self-start pb-24">
                            <StaticTOC sections={navigationSections} />
                        </div>
                    </MaxWidthWrapper>
                </div>

                {/* Calculator and Footer sections */}
                <CalculatorSection />
                <FooterSection />
            </div>

            {/* Client Interactivity Island - Send to Chat functionality */}
            {/* Rendered at the end to avoid blocking content rendering */}
            <ClientInteractivityIsland sectionIds={sectionIds} sections={sections} />
        </div>
    );
}
