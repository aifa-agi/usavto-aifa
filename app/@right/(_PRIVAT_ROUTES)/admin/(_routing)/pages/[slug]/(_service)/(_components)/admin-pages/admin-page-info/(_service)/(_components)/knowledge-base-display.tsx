// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/knowledge-base-display.tsx

/**
 * Knowledge Base Display Component
 * 
 * Purpose:
 * - Display external knowledge base (competitor analysis) in a read-only scrollable container
 * - Shows content only if externallKnowledgeBase exists
 * - Uses custom-scrollbar for vertical scroll
 * - Limited to 5 lines height with overflow scroll
 * 
 * Props:
 * - externalKnowledgeBase: string | undefined - Content to display
 * 
 * Visual:
 * - Header: "External Knowledge Base" with info icon
 * - Content: Read-only text area with custom scrollbar
 * - Height: ~5 lines (approx 120px)
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export interface KnowledgeBaseDisplayProps {
    /** External knowledge base content (competitor analysis) */
    externalKnowledgeBase?: string;
    /** Optional additional CSS classes */
    className?: string;
}

export function KnowledgeBaseDisplay({
    externalKnowledgeBase,
    className,
}: KnowledgeBaseDisplayProps) {
    // Don't render if no content exists
    if (!externalKnowledgeBase || !externalKnowledgeBase.trim()) {
        return null;
    }

    return (
        <div className={cn("space-y-3", className)}>
            {/* Header */}
            <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">
                    External Knowledge Base
                </h3>
            </div>

            {/* Content Container */}
            <div className="relative rounded-lg border border-border bg-muted/30 p-4">
                {/* Read-only scrollable text area */}
                <div
                    className={cn(
                        "custom-scrollbar",
                        "max-h-[120px] overflow-y-auto",
                        "text-sm leading-relaxed text-muted-foreground",
                        "whitespace-pre-wrap break-words"
                    )}
                >
                    {externalKnowledgeBase}
                </div>

                {/* Optional: Fade overlay at bottom to indicate more content */}
                <div
                    className={cn(
                        "pointer-events-none absolute bottom-0 left-0 right-0",
                        "h-8 bg-gradient-to-t from-muted/30 to-transparent",
                        "rounded-b-lg"
                    )}
                />
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
                This knowledge base is used as context for AI-powered field generation.
            </p>
        </div>
    );
}
