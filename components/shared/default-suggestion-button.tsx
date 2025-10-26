// @/components/shared/default-suggestion-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { memo } from "react";

interface DefaultSuggestionButtonProps {
    /**
     * Main question/title (e.g., "Чем занимается ЮС АВТО?")
     */
    title: string;
    /**
     * Brief description/label (e.g., "Коротко о платформе")
     */
    label: string;
    /**
     * Action text to send to chat
     */
    action: string;
    /**
     * Callback triggered when card is clicked
     */
    onClick: (action: string) => void;
    /**
     * Disabled state during message generation
     */
    disabled?: boolean;
}

/**
 * DefaultSuggestionButton Component
 * 
 * Renders a card-style suggestion button with title and description.
 * Used for initial/default suggestions at chat start.
 * 
 * Features:
 * - Two-level content: title (bold) + label (muted)
 * - Desktop: 2 columns grid, multi-line text
 * - Mobile: 1 column, single-line truncated text
 * - Matches original chat start screen design
 */
function PureDefaultSuggestionButton({
    title,
    label,
    action,
    onClick,
    disabled = false,
}: DefaultSuggestionButtonProps) {
    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={() => onClick(action)}
            className="flex flex-col items-start justify-start gap-1 px-4 py-3 h-auto w-full text-left rounded-lg border border-border bg-background hover:bg-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {/* Title - bold, primary color */}
            <span className="font-semibold text-sm md:text-base text-foreground line-clamp-1 md:line-clamp-2 w-full">
                {title}
            </span>

            {/* Label - muted, smaller */}
            <span className="text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 w-full">
                {label}
            </span>
        </Button>
    );
}

export const DefaultSuggestionButton = memo(PureDefaultSuggestionButton);
