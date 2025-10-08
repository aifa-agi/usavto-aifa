// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/internal-knowledge-base-display.tsx

/**
 * Internal Knowledge Base Display Component
 * 
 * Purpose:
 * - Display internal knowledge base (company's own knowledge) in a read-only scrollable container
 * - Shows content only if internalKnowledgeBase exists
 * - Uses custom-scrollbar for vertical scroll
 * - Limited to 5 lines height with overflow scroll
 * - Visual differentiation from external KB (different color scheme)
 * 
 * Props:
 * - internalKnowledgeBase: string | undefined - Content to display
 * 
 * Visual:
 * - Header: "Internal Knowledge Base" with building icon
 * - Content: Read-only text area with custom scrollbar
 * - Height: ~5 lines (approx 120px)
 * - Color: Blue accent to differentiate from external (gray)
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

export interface InternalKnowledgeBaseDisplayProps {
    /** Internal knowledge base content (company knowledge) */
    internalKnowledgeBase?: string;
    /** Optional additional CSS classes */
    className?: string;
}

export function InternalKnowledgeBaseDisplay({
    internalKnowledgeBase,
    className,
}: InternalKnowledgeBaseDisplayProps) {
    // Don't render if no content exists
    if (!internalKnowledgeBase || !internalKnowledgeBase.trim()) {
        return null;
    }

    return (
        <div className={cn("space-y-3", className)}>
            {/* Header */}
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium text-foreground">
                    Internal Knowledge Base
                </h3>
            </div>

            {/* Content Container */}
            <div className="relative rounded-lg border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                {/* Read-only scrollable text area */}
                <div
                    className={cn(
                        "custom-scrollbar",
                        "max-h-[120px] overflow-y-auto",
                        "text-sm leading-relaxed text-foreground/80",
                        "whitespace-pre-wrap break-words"
                    )}
                >
                    {internalKnowledgeBase}
                </div>

                {/* Optional: Fade overlay at bottom to indicate more content */}
                <div
                    className={cn(
                        "pointer-events-none absolute bottom-0 left-0 right-0",
                        "h-8 bg-gradient-to-t from-blue-50/30 to-transparent",
                        "rounded-b-lg",
                        "dark:from-blue-950/20"
                    )}
                />
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
                Company's internal knowledge and resources for this topic.
            </p>
        </div>
    );
}
