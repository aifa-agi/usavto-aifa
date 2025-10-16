// @/app/@right/(_service)/(_context)/dialogs/components/knowledge-base-input.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
    generateInternalKnowledgePrompt,
    generateExternalKnowledgePrompt,
} from "@/config/prompts/knowledge-base-prompts";

interface KnowledgeBaseInputProps {
    knowledgeType: "internal" | "external";
    pageData: {
        title: string;
        description: string;
        keywords: string[];
    };
    initialValue?: string;
    value: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
    onInfoDoesNotExist: () => void;
}

export function KnowledgeBaseInput({
    knowledgeType,
    pageData,
    initialValue = "",
    value,
    onChange,
    isLoading = false,
    onInfoDoesNotExist,
}: KnowledgeBaseInputProps) {
    // Track if user has copied the system instruction
    const [hasCopied, setHasCopied] = useState(false);
    const [showCopiedIcon, setShowCopiedIcon] = useState(false);

    // Determine if we're in edit mode (existing data)
    const isEditMode = Boolean(initialValue);

    // Generate the system instruction based on knowledge type
    const systemInstruction =
        knowledgeType === "internal"
            ? generateInternalKnowledgePrompt(
                pageData.title,
                pageData.description,
                pageData.keywords
            )
            : generateExternalKnowledgePrompt(pageData.title, pageData.keywords);

    // Show textarea immediately in edit mode
    const [showTextarea, setShowTextarea] = useState(isEditMode);

    // Handle copy to clipboard
    const handleCopyInstruction = async () => {
        try {
            await navigator.clipboard.writeText(systemInstruction);
            setShowCopiedIcon(true);
            setHasCopied(true);
            setShowTextarea(true);

            toast.success("System instruction copied to clipboard", {
                description: "Paste it into the chat on the left side to get response",
                duration: 3000,
            });

            // Reset copied icon after 2 seconds
            setTimeout(() => {
                setShowCopiedIcon(false);
            }, 2000);
        } catch (error) {
            toast.error("Failed to copy to clipboard", {
                description: "Please try again or copy manually",
            });
        }
    };

    // Handle "Information Does Not Exist" button click
    const handleInfoDoesNotExist = () => {
        onChange("Information does not exist");
        toast.info("Default text inserted", {
            description: "You can modify this text if needed",
        });
        onInfoDoesNotExist();
    };

    // Initialize value in edit mode
    useEffect(() => {
        if (isEditMode && initialValue) {
            onChange(initialValue);
        }
    }, [isEditMode, initialValue]);

    return (
        <div className="space-y-4">
            {/* System Instruction Preview - Hidden in edit mode */}
            {!isEditMode && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            System Instruction Preview
                        </label>
                        <div className="relative">
                            <Textarea
                                value={systemInstruction}
                                readOnly
                                className="min-h-[100px] max-h-[100px] resize-none font-mono text-xs custom-scrollbar bg-muted/50 cursor-default"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Copy System Instruction Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleCopyInstruction}
                        disabled={isLoading}
                    >
                        {showCopiedIcon ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy System Instruction
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Response Input Textarea - Shows after copy or in edit mode */}
            {(showTextarea || isEditMode) && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        {isEditMode
                            ? `${knowledgeType === "internal" ? "Internal" : "External"} Knowledge Base Content`
                            : "Paste AI Response Here"}
                    </label>
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={
                            isEditMode
                                ? "Edit your knowledge base content..."
                                : "Paste the AI response from the chat here..."
                        }
                        className="min-h-[200px] resize-none custom-scrollbar"
                        disabled={isLoading}
                        autoFocus={isEditMode || hasCopied}
                    />
                </div>
            )}

            {/* Helper Text */}
            {!isEditMode && !showTextarea && (
                <p className="text-xs text-muted-foreground">
                    Copy the system instruction above and paste it into the AI chat on
                    the left side of this window. Then paste the response back into the
                    textarea that will appear.
                </p>
            )}

            {/* Show helper in textarea mode */}
            {showTextarea && !isEditMode && (
                <p className="text-xs text-muted-foreground">
                    After getting the AI response, paste it above. If the information
                    doesn't exist, click the button in the footer.
                </p>
            )}
        </div>
    );
}
