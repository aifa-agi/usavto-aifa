// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/components/section-generation-card.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Zap, XCircle, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStep5Stream } from "../(_hooks)/use-step5-stream";
import { useStep5Save } from "../(_hooks)/use-step5-save";
import { validateAndParseSection } from "../(_utils)/validation-utils";
import type { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

interface SectionGenerationCardProps {
    sectionIndex: number;
    totalSections: number;
    sectionData: RootContentStructure;
    previousSections: RootContentStructure[];
    systemInstructionGenerator: (
        section: RootContentStructure,
        index: number,
        total: number,
        previous: RootContentStructure[]
    ) => string;
    pageData: any;
    onSectionGenerated: (sectionIndex: number, generatedData: RootContentStructure) => void;
    onSectionSaved: (sectionIndex: number) => void;
    isActive: boolean;
    isPending: boolean;
    isCompleted: boolean;
}

export function SectionGenerationCard({
    sectionIndex,
    totalSections,
    sectionData,
    previousSections,
    systemInstructionGenerator,
    pageData,
    onSectionGenerated,
    onSectionSaved,
    isActive,
    isPending,
    isCompleted: initialCompleted,
}: SectionGenerationCardProps) {
    const { streamText, isStreaming, startStreaming, cancel } = useStep5Stream();
    const { saveSingleSection } = useStep5Save();

    const [generatedData, setGeneratedData] = useState<RootContentStructure | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(initialCompleted);
    const [isSaved, setIsSaved] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Holds the last full system instruction and prompt used for the current run
    const lastSystemInstructionRef = useRef<string>("");
    const lastPromptRef = useRef<string>("");

    // Track if processing has already occurred for this stream
    const lastProcessedText = useRef<string>("");

    // Load saved content if present
    useEffect(() => {
        const savedSection = pageData?.page?.draftContentStructure?.[sectionIndex];
        if (savedSection && !generatedData && !streamText && !isStreaming) {
            setGeneratedData(savedSection);
            setIsCompleted(true);
            setIsSaved(true);
            lastProcessedText.current = JSON.stringify(savedSection, null, 2);
        }
    }, [pageData, sectionIndex, generatedData, streamText, isStreaming]);

    // Direct display of stream or saved JSON
    const displayText = useMemo(() => {
        if (streamText) return streamText;
        if (generatedData) return JSON.stringify(generatedData, null, 2);
        return "No content yet. Click 'Start Generation' to begin.";
    }, [streamText, generatedData]);

    // Auto-scroll preview on streaming
    useEffect(() => {
        if (isStreaming && previewRef.current) {
            previewRef.current.scrollTop = previewRef.current.scrollHeight;
        }
    }, [isStreaming, streamText]);

    // Start generation for this section
    const handleStartGeneration = useCallback(async () => {
        if (!isActive) {
            toast.warning("Cannot start", { description: "Previous section must complete first." });
            return;
        }

        setError(null);
        setGeneratedData(null);
        setIsCompleted(false);
        setIsSaved(false);
        lastProcessedText.current = "";

        // Build the system instruction and store it for copying
        const systemInstruction = systemInstructionGenerator(
            sectionData,
            sectionIndex,
            totalSections,
            previousSections
        );

        if (!systemInstruction || systemInstruction.trim().length < 100) {
            const errorMsg = "System instruction is too short or invalid";
            setError(errorMsg);
            toast.error("Cannot generate", { description: errorMsg });
            return;
        }

        lastSystemInstructionRef.current = systemInstruction;

        // Define the prompt used for this call and store it for copying
        const prompt = "Generate enriched content structure for this section";
        lastPromptRef.current = prompt;

        await startStreaming({
            system: systemInstruction,
            prompt,
            model: "gpt-4o-mini",
            sectionIndex,
            totalSections,
        });
    }, [
        isActive,
        sectionData,
        sectionIndex,
        totalSections,
        previousSections,
        systemInstructionGenerator,
        startStreaming,
    ]);

    // Process after streaming completes
    useEffect(() => {
        if (!isStreaming && streamText && streamText.length > 10 && lastProcessedText.current !== streamText) {
            lastProcessedText.current = streamText;

            const result = validateAndParseSection(streamText);

            if (result.success && result.data) {
                setGeneratedData(result.data);
                setIsCompleted(true);
                setIsSaved(false);
                setError(null);
                onSectionGenerated(sectionIndex, result.data);
            } else {
                setError(result.error || "Validation failed");
                setGeneratedData(null);
                setIsCompleted(false);
                setIsSaved(false);
            }
        }
    }, [isStreaming, streamText, sectionIndex, onSectionGenerated]);

    // Save section to draftContentStructure
    const handleSave = useCallback(async () => {
        if (!generatedData || !pageData?.page) {
            toast.error("Cannot save", { description: "No generated data or page not found." });
            return;
        }

        const success = await saveSingleSection(pageData.page, generatedData, sectionIndex);

        if (success) {
            setIsSaved(true);
            onSectionSaved(sectionIndex);
        }
    }, [generatedData, pageData, sectionIndex, saveSingleSection, onSectionSaved]);

    // Clear preview
    const handleClear = useCallback(() => {
        setGeneratedData(null);
        setError(null);
        setIsSaved(false);
        lastProcessedText.current = "";
    }, [sectionIndex]);

    // Status badge
    const statusBadge = useMemo(() => {
        if (error) {
            return (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    <XCircle className="size-3 mr-1" />
                    Error
                </Badge>
            );
        }
        if (isSaved && isCompleted && generatedData) {
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="size-3 mr-1" />
                    Saved
                </Badge>
            );
        }
        if (isCompleted && generatedData && !isSaved) {
            return (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 animate-pulse">
                    <CheckCircle className="size-3 mr-1" />
                    Ready to Save
                </Badge>
            );
        }
        if (isStreaming) {
            return (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 animate-pulse">
                    <LoadingSpinner className="size-3 mr-1" />
                    Generating
                </Badge>
            );
        }
        if (isPending) {
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Pending
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                Ready
            </Badge>
        );
    }, [error, isCompleted, isStreaming, isPending, generatedData, isSaved]);

    // Copy helpers for links
    const copyToClipboard = useCallback(async (text: string, okMsg: string, errMsg: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(okMsg);
        } catch (e) {
            console.error("Copy failed:", e);
            toast.error(errMsg);
        }
    }, []);

    const handleCopySystem = useCallback(() => {
        // Fallback to regenerate on demand if missing
        let sys = lastSystemInstructionRef.current;
        if (!sys || sys.length < 10) {
            sys = systemInstructionGenerator(sectionData, sectionIndex, totalSections, previousSections);
        }
        copyToClipboard(sys, "System instruction copied", "Failed to copy system instruction");
    }, [copyToClipboard, systemInstructionGenerator, sectionData, sectionIndex, totalSections, previousSections]);

    const handleCopyPrompt = useCallback(() => {
        let pr = lastPromptRef.current || "Generate enriched content structure for this section";
        copyToClipboard(pr, "Prompt copied", "Failed to copy prompt");
    }, [copyToClipboard]);

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {statusBadge}
                        <CardTitle className="text-lg">
                            Section {sectionIndex + 1} of {totalSections}
                        </CardTitle>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Section ID: <span className="font-mono">{sectionData.id}</span>
                </p>

                {/* Minimal links row under Section ID */}
                <div className="mt-1 flex items-center gap-3">
                    {/* Styled as text links, 10px font, underline, no borders */}
                    <button
                        type="button"
                        onClick={handleCopySystem}
                        className="p-0 m-0 bg-transparent text-[10px] underline text-blue-600 hover:text-blue-700"
                    >
                        Copy system instruction
                    </button>

                    <span className="text-[10px] text-muted-foreground">•</span>

                    <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="p-0 m-0 bg-transparent text-[10px] underline text-blue-600 hover:text-blue-700"
                    >
                        Copy prompt
                    </button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Control buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {isActive && !isStreaming && !isCompleted && (
                        <Button onClick={handleStartGeneration} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Zap className="size-4 mr-2" />
                            Start Generation
                        </Button>
                    )}

                    {isStreaming && (
                        <Button onClick={cancel} variant="outline">
                            <XCircle className="size-4 mr-2" />
                            Cancel
                        </Button>
                    )}

                    {isCompleted && generatedData && !isSaved && (
                        <Button
                            onClick={handleSave}
                            className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong"
                        >
                            <CheckCircle className="size-4 mr-2" />
                            Save Section
                        </Button>
                    )}

                    <Button onClick={handleStartGeneration} variant="outline" disabled={!isActive}>
                        <RotateCcw className="size-4 mr-2" />
                        Regenerate
                    </Button>

                    {/* <Button onClick={handleClear} variant="outline">
                        <Trash2 className="size-4 mr-2" />
                        Clear
                    </Button> */}
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Preview area */}
                <div
                    ref={previewRef}
                    className="w-full h-96 overflow-y-auto rounded-md border border-gray-300 bg-white p-4"
                >
                    <pre className="text-xs text-black whitespace-pre-wrap font-mono">
                        {displayText}
                    </pre>
                </div>

                {/* Success indicator */}
                {isCompleted && generatedData && (
                    <div
                        className={`p-3 rounded-md border text-sm flex items-center gap-2 ${isSaved
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-orange-50 border-orange-200 text-orange-800"
                            }`}
                    >
                        <CheckCircle className="size-4" />
                        <span>
                            {isSaved
                                ? "Section saved successfully. Content will persist after page reload."
                                : "Section structure generated successfully. Review and save."}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
