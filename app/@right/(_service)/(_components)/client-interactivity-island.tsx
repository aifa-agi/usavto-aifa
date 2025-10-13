// @/app/@right/(_service)/(_components)/client-interactivity-island.tsx
"use client";

// Client island for interactive section features
// Comments in English: Adds "Send to Chat" buttons and hover effects
// to static sections. This component is the only client-side code needed
// for interactivity, keeping the main content fully server-rendered.

import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useRightSidebar } from "@/contexts/right-sidebar-context";
import { ExtendedSection } from "../(_types)/section-types";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ClientInteractivityIslandProps {
    /** Array of section IDs for interaction */
    sectionIds: string[];
    /** Full section data (optional, for additional context) */
    sections?: ExtendedSection[];
    /** Enable hover effects (default: true) */
    enableHover?: boolean;
    /** Button position (default: "top-right") */
    buttonPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

// ============================================
// HOOKS
// ============================================

/**
 * Hook to detect mobile device via media query
 */
function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Listen for changes
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, [breakpoint]);

    return isMobile;
}

// ============================================
// CLIENT INTERACTIVITY ISLAND
// ============================================

/**
 * ClientInteractivityIsland - Interactive overlay for static sections
 * 
 * Features:
 * - "Send to Chat" buttons positioned over each section
 * - Hover effects with visual feedback
 * - Mobile drawer integration
 * - Context integration for chat communication
 * - Minimal DOM footprint (uses CSS positioning)
 * - Progressive enhancement (content works without this)
 * 
 * @param sectionIds - Array of section IDs to add interactivity
 * @param sections - Full section data for context
 * @param enableHover - Enable hover effects
 * @param buttonPosition - Position of send button
 * @returns Interactive overlay components
 */
export function ClientInteractivityIsland({
    sectionIds,
    sections,
    enableHover = true,
    buttonPosition = "top-right",
}: ClientInteractivityIslandProps) {
    // Context hooks
    const { setInteractionContext } = useAppContext();
    const { isOpen, closeDrawer } = useRightSidebar();

    // Local state
    const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
    const [sendModeSectionId, setSendModeSectionId] = useState<string | null>(null);

    // Device detection
    const isMobile = useIsMobile();

    // Handle send to chat
    const handleSendToChat = useCallback(
        (sectionId: string) => {
            // Set interaction context for chat
            setInteractionContext("Content Page", sectionId);

            // Visual feedback
            setSendModeSectionId(sectionId);

            // Close mobile drawer if open
            if (isMobile && isOpen) {
                closeDrawer();
            }

            // Reset after animation
            setTimeout(() => {
                setSendModeSectionId(null);
            }, 1000);
        },
        [setInteractionContext, isMobile, isOpen, closeDrawer]
    );

    // No sections, no interactivity
    if (!sectionIds || sectionIds.length === 0) {
        return null;
    }

    return (
        <>
            {sectionIds.map((sectionId, index) => (
                <InteractiveSectionOverlay
                    key={sectionId}
                    sectionId={sectionId}
                    isHovered={enableHover && hoveredSectionId === sectionId}
                    isSendMode={sendModeSectionId === sectionId}
                    onHover={enableHover ? setHoveredSectionId : undefined}
                    onSend={handleSendToChat}
                    buttonPosition={buttonPosition}
                />
            ))}
        </>
    );
}

// ============================================
// INTERACTIVE SECTION OVERLAY
// ============================================

interface InteractiveSectionOverlayProps {
    sectionId: string;
    isHovered: boolean;
    isSendMode: boolean;
    onHover?: (id: string | null) => void;
    onSend: (id: string) => void;
    buttonPosition: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/**
 * Interactive overlay for a single section
 * Positioned absolutely over the static content
 */
function InteractiveSectionOverlay({
    sectionId,
    isHovered,
    isSendMode,
    onHover,
    onSend,
    buttonPosition,
}: InteractiveSectionOverlayProps) {
    // Determine button positioning classes
    const positionClasses = {
        "top-right": "top-2 right-2",
        "top-left": "top-2 left-2",
        "bottom-right": "bottom-2 right-2",
        "bottom-left": "bottom-2 left-2",
    };

    return (
        <div
            className="interactive-section-overlay"
            data-section-id={sectionId}
            style={{
                position: "relative",
                pointerEvents: "none", // Allow clicks to pass through to content
            }}
        >
            {/* Position button using CSS - finds the section by ID and overlays */}
            <style jsx>{`
        .interactive-section-overlay[data-section-id="${sectionId}"] {
          /* This uses CSS to position over the static section */
        }
      `}</style>

            {/* Send to Chat Button */}
            <Button
                size="sm"
                variant={isSendMode ? "default" : "outline"}
                className={`
          absolute ${positionClasses[buttonPosition]} z-10
          transition-all duration-200
          ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          ${isSendMode ? "animate-pulse" : ""}
        `}
                onClick={() => onSend(sectionId)}
                style={{ pointerEvents: "auto" }} // Re-enable clicks for button
                title="Send this section to chat"
            >
                {isSendMode ? (
                    <MessageSquare className="w-4 h-4 mr-1" />
                ) : (
                    <Send className="w-4 h-4 mr-1" />
                )}
                <span className="text-xs">Send to Chat</span>
            </Button>

            {/* Hover Detection Area */}
            {onHover && (
                <div
                    className="absolute inset-0 z-0"
                    onMouseEnter={() => onHover(sectionId)}
                    onMouseLeave={() => onHover(null)}
                    style={{ pointerEvents: "auto" }} // Enable hover detection
                />
            )}
        </div>
    );
}

// ============================================
// SIMPLIFIED VERSION (BUTTON ONLY)
// ============================================

/**
 * SimpleInteractivityIsland - Only send buttons, no hover effects
 * Better performance for pages with many sections
 */
export function SimpleInteractivityIsland({
    sectionIds,
    sections,
}: Pick<ClientInteractivityIslandProps, "sectionIds" | "sections">) {
    const { setInteractionContext } = useAppContext();
    const { isOpen, closeDrawer } = useRightSidebar();
    const isMobile = useIsMobile();

    const handleSend = useCallback(
        (sectionId: string) => {
            setInteractionContext("Content Page", sectionId);
            if (isMobile && isOpen) closeDrawer();
        },
        [setInteractionContext, isMobile, isOpen, closeDrawer]
    );

    if (!sectionIds || sectionIds.length === 0) {
        return null;
    }

    return (
        <div className="simple-interactivity-buttons fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {sectionIds.map((sectionId, index) => (
                <Button
                    key={sectionId}
                    size="sm"
                    variant="outline"
                    onClick={() => handleSend(sectionId)}
                    className="bg-background shadow-lg"
                    title={`Send section ${index + 1} to chat`}
                >
                    <Send className="w-4 h-4" />
                </Button>
            ))}
        </div>
    );
}

// ============================================
// FLOATING ACTION BUTTON VERSION
// ============================================

/**
 * FloatingInteractivityMenu - Floating menu for section interactions
 */
export function FloatingInteractivityMenu({
    sectionIds,
    sections,
}: Pick<ClientInteractivityIslandProps, "sectionIds" | "sections">) {
    const [isOpen, setIsOpen] = useState(false);
    const { setInteractionContext } = useAppContext();

    const handleSend = useCallback(
        (sectionId: string) => {
            setInteractionContext("Content Page", sectionId);
            setIsOpen(false);
        },
        [setInteractionContext]
    );

    if (!sectionIds || sectionIds.length === 0) {
        return null;
    }

    return (
        <div className="floating-interactivity-menu fixed bottom-4 right-4 z-50">
            {/* Main FAB Button */}
            <Button
                size="icon"
                className="rounded-full w-14 h-14 shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MessageSquare className="w-6 h-6" />
            </Button>

            {/* Section Menu */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 bg-background border rounded-lg shadow-xl p-2 min-w-[200px]">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                        Send to Chat
                    </p>
                    {sectionIds.map((sectionId, index) => (
                        <Button
                            key={sectionId}
                            size="sm"
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => handleSend(sectionId)}
                        >
                            <span className="text-xs font-mono mr-2">{index + 1}.</span>
                            <span className="truncate">Section {index + 1}</span>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ClientInteractivityIsland;
