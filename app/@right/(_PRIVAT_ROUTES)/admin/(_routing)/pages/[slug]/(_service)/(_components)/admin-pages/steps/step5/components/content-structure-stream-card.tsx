// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/content-structure-stream-card.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SectionGenerationCard } from "./section-generation-card";
import { useSystemInstructionGenerator } from "../(_hooks)/system-instruction-generator";
import { useStep5Save } from "../(_hooks)/use-step5-save";
import { useStep5Finalize } from "../(_hooks)/use-step5-finalize";
import type { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

interface ContentStructureStreamCardProps {
    pageData: {
        page: any;
        category: any;
    } | null;
    slug: string;
    writingStyle: string;
    contentFormat: string;
    customRequirements: string;
    writingStyles: Array<{
        value: string;
        label: string;
        description: string;
    }>;
    contentFormats: Array<{
        value: string;
        label: string;
        description: string;
    }>;
    onStreamCompleted?: (structure: RootContentStructure[]) => void;
}

export function ContentStructureStreamCard({
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles,
    contentFormats,
    onStreamCompleted,
}: ContentStructureStreamCardProps) {
    const { saveDraftContentStructure } = useStep5Save();
    const { finalizeDraft, isDraftFinalized, canFinalizeDraft, isFinalizing } = useStep5Finalize();

    const { generateSectionInstruction } = useSystemInstructionGenerator({
        pageData,
        slug,
        writingStyle,
        contentFormat,
        customRequirements,
        writingStyles,
        contentFormats,
    });

    const sections = useMemo(() => {
        if (!pageData?.page?.aiRecommendContentStructure) {
            return [];
        }
        const structure = pageData.page.aiRecommendContentStructure;
        return Array.isArray(structure) ? structure.filter((s: any) => s.tag === "h2") : [];
    }, [pageData]);

    const [generatedSections, setGeneratedSections] = useState<Array<RootContentStructure | null>>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
    const [savedSections, setSavedSections] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (sections.length > 0) {
            const savedDraft = pageData?.page?.draftContentStructure;

            if (Array.isArray(savedDraft) && savedDraft.length > 0) {
                console.log("[ContentStructure] Loading saved sections from draftContentStructure");
                console.log("[ContentStructure] Saved sections count:", savedDraft.length);

                const initialized = sections.map((_, index) => savedDraft[index] || null);
                setGeneratedSections(initialized);

                const savedIndexes = new Set<number>();
                savedDraft.forEach((section, index) => {
                    if (section !== null && section !== undefined) {
                        savedIndexes.add(index);
                    }
                });
                setSavedSections(savedIndexes);

                console.log("[ContentStructure] Saved section indexes:", Array.from(savedIndexes));

                const firstUnsaved = initialized.findIndex(s => s === null);
                setCurrentSectionIndex(firstUnsaved >= 0 ? firstUnsaved : 0);
            } else {
                console.log("[ContentStructure] No saved data, initializing empty array");
                setGeneratedSections(new Array(sections.length).fill(null));
                setCurrentSectionIndex(0);
                setSavedSections(new Set());
            }
        }
    }, [sections, pageData?.page?.draftContentStructure]);

    const handleSectionGenerated = useCallback((index: number, data: RootContentStructure) => {
        console.log(`[ContentStructure] Section ${index + 1} generated`);

        const updated = [...generatedSections];
        updated[index] = data;
        setGeneratedSections(updated);

        if (index < sections.length - 1) {
            setCurrentSectionIndex(index + 1);
        }
    }, [generatedSections, sections.length]);

    const handleSectionSaved = useCallback((index: number) => {
        console.log(`[ContentStructure] Section ${index + 1} marked as saved`);

        setSavedSections((prev) => {
            const updated = new Set(prev);
            updated.add(index);
            return updated;
        });

        toast.success("Section saved", {
            description: `Section ${index + 1} has been saved successfully.`,
        });
    }, []);

    const allCompleted = useMemo(() => {
        return generatedSections.length > 0 && generatedSections.every((s) => s !== null);
    }, [generatedSections]);

    const allSaved = useMemo(() => {
        if (sections.length === 0) return false;
        return savedSections.size === sections.length;
    }, [savedSections, sections.length]);

    // ✅ NEW: Check if we have unsaved sections
    const hasUnsavedSections = useMemo(() => {
        if (generatedSections.length === 0) return false;

        const generatedCount = generatedSections.filter(s => s !== null).length;
        const savedCount = savedSections.size;

        return generatedCount > savedCount;
    }, [generatedSections, savedSections]);

    // ✅ NEW: Show "Save All" only if we have unsaved sections AND not all completed
    const shouldShowSaveAll = useMemo(() => {
        return hasUnsavedSections && !allCompleted;
    }, [hasUnsavedSections, allCompleted]);

    const handleSaveAll = async () => {
        if (!pageData?.page) {
            toast.error("Cannot save", {
                description: "Page data not found.",
            });
            return;
        }

        const validSections = generatedSections.filter((s) => s !== null) as RootContentStructure[];

        if (validSections.length === 0) {
            toast.error("Nothing to save", {
                description: "No generated sections found.",
            });
            return;
        }

        console.log("[ContentStructure] Saving all sections:", validSections.length);

        const success = await saveDraftContentStructure(pageData.page, validSections);

        if (success) {
            const allIndexes = new Set(sections.map((_, i) => i));
            setSavedSections(allIndexes);

            console.log("[ContentStructure] All sections saved successfully");

            onStreamCompleted?.(validSections);
            toast.success("All sections saved", {
                description: `${validSections.length} sections saved to draft structure.`,
            });
        }
    };

    const handleFinalizeDraft = useCallback(async () => {
        if (!pageData?.page) {
            toast.error("Cannot finalize", {
                description: "Page data not found.",
            });
            return;
        }

        console.log("[ContentStructure] Finalizing draft...");

        const success = await finalizeDraft(pageData.page);

        if (success) {
            console.log("[ContentStructure] Draft finalized successfully");
        }
    }, [pageData, finalizeDraft]);

    const getPreviousSections = useCallback((upToIndex: number): RootContentStructure[] => {
        return generatedSections
            .slice(0, upToIndex)
            .filter((s): s is RootContentStructure => s !== null);
    }, [generatedSections]);

    const isFinalized = useMemo(() => {
        return isDraftFinalized(pageData?.page);
    }, [pageData?.page, isDraftFinalized]);

    const canFinalize = useMemo(() => {
        return canFinalizeDraft(pageData?.page);
    }, [pageData?.page, canFinalizeDraft]);

    if (sections.length === 0) {
        return (
            <div className="rounded-md border p-6 text-center text-muted-foreground">
                <p>No h2 sections found in aiRecommendContentStructure.</p>
                <p className="text-xs mt-2">Please complete previous steps to generate section structure.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sections.map((section: RootContentStructure, index: number) => (
                <SectionGenerationCard
                    key={section.id || `section-${index}`}
                    sectionIndex={index}
                    totalSections={sections.length}
                    sectionData={section}
                    previousSections={getPreviousSections(index)}
                    systemInstructionGenerator={generateSectionInstruction}
                    pageData={pageData}
                    onSectionGenerated={handleSectionGenerated}
                    onSectionSaved={handleSectionSaved}
                    isActive={currentSectionIndex === index}
                    isPending={currentSectionIndex < index}
                    isCompleted={generatedSections[index] !== null && generatedSections[index] !== undefined}
                />
            ))}

            {/* ✅ FIXED: Show "Save All" only when needed */}
            {shouldShowSaveAll && (
                <div className="pt-4">
                    <Button
                        onClick={handleSaveAll}
                        className="w-full border-orange-500 bg-orange-500 text-white hover:bg-orange-600 animate-pulse-strong font-semibold shadow-lg"
                        size="lg"
                    >
                        <CheckCircle className="size-5 mr-2" />
                        Save All Sections to Draft Structure
                    </Button>
                </div>
            )}

            {/* ✅ CORRECT: Show "Finalize Draft" when all saved but not finalized */}
            {allSaved && !isFinalized && canFinalize && (
                <div className="pt-4">
                    <Button
                        onClick={handleFinalizeDraft}
                        disabled={isFinalizing}
                        className="w-full border-green-500 bg-green-500 text-white hover:bg-green-600 font-semibold shadow-lg"
                        size="lg"
                    >
                        {isFinalizing ? (
                            <>
                                <div className="size-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Finalizing Draft...
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-5 mr-2" />
                                Finalize Draft for Perplexity
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* ✅ CORRECT: Show finalized confirmation */}
            {isFinalized && (
                <div className="pt-4">
                    <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3">
                        <Sparkles className="size-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Draft finalized successfully!</p>
                            <p className="text-xs mt-1">
                                All {sections.length} section{sections.length > 1 ? 's' : ''} are saved and ready for Perplexity processing.
                                You can proceed to the next step.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
