// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_sub_dommain)/sections-selector-card.tsx

import * as React from "react";
import { CheckCircle, Edit, Edit2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import { SaveAllButton } from "./save-all-button";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useStep12Root } from "../(_contexts)/step12-root-context";
import { useStep12Buttons } from "../(_contexts)/step12-buttons-context";

export function SectionsSelectorCard({ page }: { page?: PageData | null }) {
    const { sections, activeId, setActive, refreshAll } = useStep12Root();
    const buttons = useStep12Buttons();

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

    const handleSectionClick = React.useCallback(
        (id: string, index: number) => {
            if (id === "all") {
                if (activeId === "all") {
                    refreshAll();
                } else {
                    setActive("all");
                }
                return;
            }

            if (index > unlockedIndex) {
                toast.error("Section Locked", {
                    description: "Please complete previous sections first.",
                });
                return;
            }

            setActive(id);
            buttons.confirm(id);
        },
        [activeId, unlockedIndex, setActive, refreshAll, buttons]
    );

    const allButton = sections.find((s) => s.id === "all");
    const sectionButtons = sections.filter((s) => s.id !== "all");

    return (
        <div className={containerCls}>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className={titleCls}>{STEP12_TEXTS.labels.sections}</h3>
                    <p className={subtitleCls}>
                        {activeId === "all"
                            ? STEP12_TEXTS.labels.selectToEdit
                            : STEP12_TEXTS.labels.editingEnabled}
                    </p>
                </div>
                <div className="shrink-0">
                    <SaveAllButton page={page} />
                </div>
            </div>

            <div className="custom-scrollbar overflow-x-auto overflow-y-hidden">
                <div className="flex min-w-max items-center gap-2 pr-1">
                    {/* "All" button - NO ICON, green by default, primary when active */}
                    {allButton && (
                        <React.Fragment key={allButton.id}>
                            {activeId === "all" ? (
                                <Button
                                    onClick={() => handleSectionClick(allButton.id, -1)}
                                    variant="default"
                                    size="sm"
                                    className="max-w-[240px] truncate px-4 justify-start text-left"
                                    aria-pressed="true"
                                    title={allButton.label}
                                >
                                    {allButton.label}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleSectionClick(allButton.id, -1)}
                                    className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate px-2 justify-start text-left"
                                    size="sm"
                                    aria-pressed="false"
                                    title={allButton.label}
                                >
                                    {allButton.label}
                                </Button>
                            )}
                        </React.Fragment>
                    )}

                    {/* Section buttons with icons, px-1 padding, left-aligned text */}
                    {sectionButtons.map((s, idx) => {
                        const isActive = activeId === s.id;
                        const isCompleted = idx < unlockedIndex;
                        const isCurrent = idx === unlockedIndex;
                        const isLocked = idx > unlockedIndex;

                        return (
                            <React.Fragment key={s.id}>
                                {isLocked ? (
                                    <Button
                                        onClick={() => handleSectionClick(s.id, idx)}
                                        variant="secondary"
                                        size="sm"
                                        className="max-w-[240px] truncate px-2 justify-start text-left"
                                        aria-pressed="false"
                                        disabled
                                        title={`${s.label} - Locked`}
                                    >
                                        <Lock className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{s.isLoading ? "Loading..." : s.label}</span>
                                    </Button>
                                ) : isActive ? (
                                    <Button
                                        onClick={() => handleSectionClick(s.id, idx)}
                                        variant="default"
                                        size="sm"
                                        className="max-w-[240px] truncate px-2 justify-start text-left"
                                        aria-pressed="true"
                                        disabled={s.isLoading}
                                        title={s.label}
                                    >
                                        <Edit className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{s.isLoading ? "Loading..." : s.label}</span>
                                    </Button>
                                ) : isCompleted ? (
                                    <Button
                                        onClick={() => handleSectionClick(s.id, idx)}
                                        className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate px-2 justify-start text-left"
                                        size="sm"
                                        aria-pressed="false"
                                        disabled={s.isLoading}
                                        title={`${s.label} - Click to edit`}
                                    >
                                        <CheckCircle className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{s.isLoading ? "Loading..." : s.label}</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleSectionClick(s.id, idx)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md max-w-[240px] truncate px-2 justify-start text-left"
                                        size="sm"
                                        aria-pressed="false"
                                        disabled={s.isLoading}
                                        title={s.label}
                                    >
                                        <Edit2 className="size-3 mr-1.5 shrink-0" />
                                        <span className="truncate">{s.isLoading ? "Loading..." : s.label}</span>
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
