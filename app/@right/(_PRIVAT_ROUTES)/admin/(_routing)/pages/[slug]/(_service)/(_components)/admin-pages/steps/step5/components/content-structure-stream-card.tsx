"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { useStep5Save } from "../(_hooks)/use-step5-save";
import { RootContentStructure } from "@/app/@right/(_service)/(_types)/page-types";
import { useStep5Stream } from "../(_hooks)/use-step5-stream";

interface ContentStructureStreamCardProps {
    systemInstruction: string;
    pageData: any;
    onStreamCompleted?: (structure: RootContentStructure[]) => void;
}

export function ContentStructureStreamCard({
    systemInstruction,
    pageData,
    onStreamCompleted
}: ContentStructureStreamCardProps) {
    const { streamText, isStreaming, startStreaming, cancel } = useStep5Stream();
    const { saveDraftContentStructure } = useStep5Save();

    const [localPreview, setLocalPreview] = useState<string>("");
    const [generatedStructure, setGeneratedStructure] = useState<RootContentStructure[]>([]);
    const [streamCompleted, setStreamCompleted] = useState<boolean>(false);

    const streamOutputRef = useRef<HTMLDivElement>(null);

    // ✅ ИСПРАВЛЕНО: Дебаунс автоскролла с requestAnimationFrame
    const scrollToBottomRef = useRef<number | null>(null);

    const scrollToBottom = useCallback(() => {
        // Отменяем предыдущий запланированный скролл
        if (scrollToBottomRef.current !== null) {
            cancelAnimationFrame(scrollToBottomRef.current);
        }

        // Планируем скролл на следующий frame (избегаем перегрузки)
        scrollToBottomRef.current = requestAnimationFrame(() => {
            if (streamOutputRef.current) {
                streamOutputRef.current.scrollTop = streamOutputRef.current.scrollHeight;
            }
        });
    }, []);

    // ✅ ИСПРАВЛЕНО: Скролл только когда streaming активен И контент изменился
    useEffect(() => {
        if (isStreaming && localPreview) {
            scrollToBottom();
        }

        // Cleanup: отменяем запланированный скролл при unmount
        return () => {
            if (scrollToBottomRef.current !== null) {
                cancelAnimationFrame(scrollToBottomRef.current);
            }
        };
    }, [isStreaming, localPreview, scrollToBottom]);

    // Keep the textarea in sync with the streaming completion
    useEffect(() => {
        if (isStreaming) {
            setLocalPreview(streamText ?? "");
        }
    }, [isStreaming, streamText]);

    // Watch for streaming completion and parse JSON
    useEffect(() => {
        if (!isStreaming && streamText && streamText.trim().length > 0) {
            try {
                const parsed = JSON.parse(streamText);
                if (Array.isArray(parsed)) {
                    setGeneratedStructure(parsed);
                    setStreamCompleted(true);
                    onStreamCompleted?.(parsed);
                }
            } catch (e) {
                console.warn("Failed to parse streamed JSON:", e);
                setStreamCompleted(true);
            }
        }
    }, [isStreaming, streamText, onStreamCompleted]);

    // Chip-style classes
    const chipBase = "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    // ✅ ИСПРАВЛЕНО: Темный текст в светлой теме, светлый в темной
    const tonePrimary = "border-violet-500 bg-violet-500/15 text-black dark:text-white hover:bg-violet-500/20 focus-visible:ring-violet-500";

    const toneNeutral = "border-border bg-background/60 text-muted-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
    const toneDisabled = "opacity-50 cursor-not-allowed";
    const toneCancel = "border-border bg-background/60 text-muted-foreground hover:bg-background/70 dark:bg-background/30 focus-visible:ring-neutral-500";
    const toneSave = "border-orange-500 bg-orange-500 text-black dark:text-white hover:bg-orange-600 focus-visible:ring-orange-500 animate-pulse-strong font-semibold shadow-lg";

    const onStream = async () => {
        if (!systemInstruction) {
            toast.error("System instruction is required", {
                id: "step5-stream-error",
                description: "Please configure the system instruction first.",
            });
            return;
        }

        if (!pageData?.page) {
            toast.error("Page data is missing", {
                id: "step5-stream-error",
                description: "Cannot generate structure without page data.",
            });
            return;
        }

        setLocalPreview("");
        setStreamCompleted(false);
        setGeneratedStructure([]);

        await startStreaming({
            system: systemInstruction,
            prompt: "Generate enhanced content structure with selfPrompt fields for recursive generation.",
            model: "gpt-4o-mini",
        });
    };

    const onSave = async () => {
        if (!pageData?.page || generatedStructure.length === 0) {
            toast.error("Nothing to save", {
                description: "No generated structure found.",
            });
            return;
        }

        const success = await saveDraftContentStructure(pageData.page, generatedStructure);
        if (success) {
            setStreamCompleted(false);
            setGeneratedStructure([]);
            setLocalPreview("");
            toast.success("Structure saved successfully", {
                description: "Content structure has been saved to the page.",
            });
        }
    };

    const onClear = () => {
        setLocalPreview("");
        setGeneratedStructure([]);
        setStreamCompleted(false);
        toast.info("Output cleared", {
            description: "Streaming output has been cleared.",
        });
    };

    const streamDisabled = isStreaming || !systemInstruction;

    return (
        <div className="rounded-md border p-4">
            <div className="custom-sidebar overflow-x-auto">
                <div className="flex min-w-max items-center gap-2">
                    {/* Start Generation button - ✅ Темный/светлый текст */}
                    {!isStreaming && !streamCompleted && (
                        <button
                            type="button"
                            onClick={onStream}
                            disabled={streamDisabled}
                            className={[chipBase, tonePrimary, streamDisabled ? toneDisabled : ""].join(" ")}
                        >
                            <Zap className="size-4 mr-2" />
                            Start Structure Generation
                        </button>
                    )}

                    {/* Cancel button */}
                    {isStreaming && (
                        <button
                            type="button"
                            onClick={cancel}
                            className={[chipBase, toneCancel].join(" ")}
                        >
                            Cancel
                        </button>
                    )}

                    {/* Save button - Пульсирующая оранжевая */}
                    {streamCompleted && (
                        <button
                            type="button"
                            onClick={onSave}
                            className={[chipBase, toneSave].join(" ")}
                        >
                            <CheckCircle className="size-4 mr-2" />
                            Save Content Structure
                        </button>
                    )}

                    {/* Clear button */}
                    <button
                        type="button"
                        onClick={onClear}
                        className={[chipBase, toneNeutral].join(" ")}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Streaming output */}
            <div className="mt-3">
                <div
                    ref={streamOutputRef}
                    className="w-full h-96 p-4 text-sm font-mono bg-white text-black border border-input rounded-lg overflow-auto"
                >
                    {isStreaming && (
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <LoadingSpinner className="size-4" />
                            <span>Generating content structure...</span>
                        </div>
                    )}

                    {localPreview ? (
                        <pre className="whitespace-pre-wrap text-xs leading-relaxed">{localPreview}</pre>
                    ) : (
                        <div className="text-gray-400 italic">Content structure will appear here during generation...</div>
                    )}

                    {/* Зеленая плашка успешного завершения */}
                    {streamCompleted && generatedStructure.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                            <div className="text-green-800 text-xs font-medium">
                                ✓ Structure generation completed! {generatedStructure.length} elements ready to save.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
