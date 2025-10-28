// @/components/shared/suggestion-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { memo } from "react";

interface SuggestionButtonProps {
    /**
     * The suggestion text to display and send on click
     */
    text: string;
    /**
     * Callback function triggered when button is clicked
     * Receives the suggestion text as parameter
     */
    onClick: (text: string) => void;
    /**
     * Whether the button should be disabled (e.g., during loading)
     */
    disabled?: boolean;
}

/**
 * SuggestionButton Component
 * 
 * Renders an interactive suggestion button that allows users to continue
 * the conversation without typing. When clicked, the suggestion text
 * is inserted into the chat input.
 * 
 * Features:
 * - Automatically wraps text within container boundaries
 * - Shows arrow icon on hover
 * - Responsive design (vertical on mobile, horizontal on wide screens)
 * - Disabled state during message generation
 * - Respects flex container constraints without overflow
 */
function PureSuggestionButton({
    text,
    onClick,
    disabled = false,
}: SuggestionButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onClick(text)}
            className="group relative inline-flex items-start justify-between gap-2 px-3 py-2 h-auto min-h-[36px] min-w-0 text-left text-sm font-normal rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {/* Suggestion text with automatic wrapping */}
            <span className="flex-1 break-words min-w-0 whitespace-normal">
                {text}
            </span>

            {/* Arrow icon - visible on hover */}
            <ArrowRight
                className="flex-shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5"
            />
        </Button>
    );
}

export const SuggestionButton = memo(PureSuggestionButton);
