// @/@/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_sub_domain)/sections-selector-v2-card.tsx

"use client";

import React from "react";
import { CheckCircle, Edit, Edit2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { useStep12V2Root } from "../(_contexts)/step12-v2-root-context";
import { useStep12V2Buttons } from "../(_contexts)/step12-v2-buttons-context";
import { SaveAllV2Button } from "./save-all-v2-button";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface SectionsSelectorV2CardProps {
    page?: PageData | null;
}

export function SectionsSelectorV2Card({ page }: SectionsSelectorV2CardProps) {
    const { sections, activeId, setActive, refreshAll } = useStep12V2Root();
    const buttons = useStep12V2Buttons();

    const containerCls =
        "w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40";
    const titleCls = "text-sm font-semibold text-foreground";
    const subtitleCls = "text-xs text-muted-foreground";

    // Calculate unlockedIndex: highest confirmed section index + 1
    const unlockedIndex = React.useMemo(() => {
        const realSections = sections.filter((s) => s.id !== "all");

        let lastConfirmedIdx = -1;
        for (let i = 0; i < realSections.length; i++) {
            if (buttons.isConfirmed(realSections[i].id)) {
                lastConfirmedIdx = i;
            } else {
                break;
            }
        }

        return lastConfirmedIdx + 1;
    }, [sections, buttons]);

    // Handle section click with sequential logic
    const onChipClick = React.useCallback(
        (id: string, index: number) => {
            if (id === "all") {
                if (activeId === "all") {
                    // If already viewing all sections, refresh the view
                    refreshAll();
                } else {
                    setActive("all");
                }
                return;
            }

            // Check if section is locked
            if (index > unlockedIndex) {
                toast.error("Section Locked", {
                    description: "Please complete previous sections first.",
                });
                return;
            }

            // Set active section and mark as confirmed
            setActive(id);
            buttons.confirm(id);
        },
        [activeId, unlockedIndex, setActive, refreshAll, buttons]
    );

    const allButton = sections.find((s) => s.id === "all");
    const sectionButtons = sections.filter((s) => s.id !== "all");

    return (
        <div className={containerCls}>
            {/* Header section with title, subtitle and save button */}
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className={titleCls}>{STEP12_V2_TEXTS.labels.sections}</h3>
                    <p className={subtitleCls}>
                        {activeId === "all"
                            ? STEP12_V2_TEXTS.labels.selectToEdit
                            : STEP12_V2_TEXTS.labels.editingEnabled}
                    </p>
                </div>

                {/* Save button positioned on the right */}
                <div className="shrink-0">
                    <SaveAllV2Button page={page} />
                </div>
            </div>

            {/* Sections buttons scroll area */}
            <div className="custom-scrollbar overflow-x-auto overflow-y-hidden">
                <div className="flex min-w-max items-center gap-2 pr-1">
                    {/* "All" button - NO ICON, green by default, primary when active */}
                    {allButton && (
                        <React.Fragment key={allButton.id}>
                            {activeId === "all" ? (
                                <Button
                                    onClick={() => onChipClick(allButton.id, -1)}
                                    variant="default"
                                    size="sm"
                                    className="max-w-[240px] truncate px-4 justify-start text-left"
                                    aria-pressed="true"
                                    title={allButton.label}
                                    data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${allButton.id}`}
                                >
                                    {allButton.label}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => onChipClick(allButton.id, -1)}
                                    className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate px-4 justify-start text-left"
                                    size="sm"
                                    aria-pressed="false"
                                    title={allButton.label}
                                    data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${allButton.id}`}
                                >
                                    {allButton.label}
                                </Button>
                            )}
                        </React.Fragment>
                    )}

                    {/* Section buttons with icons, px-2 padding, left-aligned text */}
                    {sectionButtons.map((s, idx) => {
                        const isActive = activeId === s.id;
                        const isCompleted = idx < unlockedIndex;
                        const isCurrent = idx === unlockedIndex;
                        const isLocked = idx > unlockedIndex;

                        return (
                            <React.Fragment key={s.id}>
                                {isLocked ? (
                                    // Locked state - disabled secondary button with Lock icon
                                    <Button
                                        onClick={() => onChipClick(s.id, idx)}
                                        variant="secondary"
                                        size="sm"
                                        className="max-w-[240px] truncate px-2 justify-start text-left"
                                        aria-pressed="false"
                                        disabled
                                        title={`${s.label} - Locked`}
                                        data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${s.id}`}
                                    >
                                        <Lock className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">
                                            {s.isLoading ? STEP12_V2_TEXTS.loading.sectionContent : s.label}
                                        </span>
                                    </Button>
                                ) : isActive ? (
                                    // Active state - primary button with Edit icon
                                    <Button
                                        onClick={() => onChipClick(s.id, idx)}
                                        variant="default"
                                        size="sm"
                                        className="max-w-[240px] truncate px-2 justify-start text-left"
                                        aria-pressed="true"
                                        disabled={s.isLoading}
                                        title={s.label}
                                        data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${s.id}`}
                                    >
                                        <Edit className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">
                                            {s.isLoading ? STEP12_V2_TEXTS.loading.sectionContent : s.label}
                                        </span>
                                    </Button>
                                ) : isCompleted ? (
                                    // Completed state - green button with CheckCircle icon
                                    <Button
                                        onClick={() => onChipClick(s.id, idx)}
                                        className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate px-2 justify-start text-left"
                                        size="sm"
                                        aria-pressed="false"
                                        disabled={s.isLoading}
                                        title={`${s.label} - Click to edit`}
                                        data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${s.id}`}
                                    >
                                        <CheckCircle className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">
                                            {s.isLoading ? STEP12_V2_TEXTS.loading.sectionContent : s.label}
                                        </span>
                                    </Button>
                                ) : (
                                    // Current (unconfirmed) state - orange button with Edit2 icon + pulse animation
                                    <Button
                                        onClick={() => onChipClick(s.id, idx)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md max-w-[240px] truncate px-2 justify-start text-left"
                                        size="sm"
                                        aria-pressed="false"
                                        disabled={s.isLoading}
                                        title={s.label}
                                        data-testid={`${STEP12_V2_IDS.selectors.sectionChip}-${s.id}`}
                                    >
                                        <Edit2 className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">
                                            {s.isLoading ? STEP12_V2_TEXTS.loading.sectionContent : s.label}
                                        </span>
                                    </Button>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
