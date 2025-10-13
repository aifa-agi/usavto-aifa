/**
 * Save All V2 Button - File System Based Section Editor
 * AUTONOMOUS VERSION - mirrors SaveAllButton but adapted for V2 architecture
 * Integrates with Step12V2 contexts for save functionality and button state management
 */

"use client";

import React from "react";
import { useStep12V2Root } from "../(_contexts)/step12-v2-root-context";
import { useStep12V2Buttons } from "../(_contexts)/step12-v2-buttons-context";
import { useStep12V2Save } from "../(_hooks)/use-step12-v2-save";
import { STEP12_V2_TEXTS } from "../(_constants)/step12-v2-texts";
import { STEP12_V2_IDS } from "../(_constants)/step12-v2-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { Button } from "@/components/ui/button";
import { STEP12_TEXTS } from "../../step12-1-fractal/(_constants)/step12-texts";
import { Save } from "lucide-react";

interface SaveAllV2ButtonProps {
    page?: PageData | null;
}

/**
 * Utility function for combining class names - mirrors cx from V1
 */
function cx(...arr: Array<string | false | null | undefined>): string {
    return arr.filter(Boolean).join(" ");
}

/**
 * SaveAllV2Button - Main save button component for V2
 * FIXED: Proper type handling for page parameter (null safety)
 */
export function SaveAllV2Button({ page }: SaveAllV2ButtonProps) {
    const rootContext = useStep12V2Root();
    const { isAllReady, resetAllFlags, setSaving, sections } = rootContext;
    const { allConfirmed, resetAll: resetButtonFlags } = useStep12V2Buttons();

    console.log("🔘 [SaveAllV2Button] Render", {
        hasPage: !!page,
        pageId: page?.id,
        pageHref: page?.href,
        allConfirmed,
        isAllReady: isAllReady(),
        sectionsCount: sections.length
    });

    // Convert page to proper type: null becomes undefined
    const pageForHook: PageData | undefined = page || undefined;

    const { save, saving } = useStep12V2Save(
        sections,
        isAllReady,
        resetAllFlags,
        setSaving,
        pageForHook
    );

    // Button is disabled if: no page, not all sections confirmed, or currently saving
    const disabled = !allConfirmed || saving || !page;

    console.log("🔘 [SaveAllV2Button] Button state", {
        disabled,
        saving,
        allConfirmed,
        hasPage: !!page
    });

    const onClick = async () => {
        console.log("🔘 [SaveAllV2Button] Button clicked!", {
            hasPage: !!page,
            pageId: page?.id,
            disabled
        });

        if (!page) {
            console.error("❌ [SaveAllV2Button] No page available");
            return;
        }

        console.log("🔘 [SaveAllV2Button] Calling save function...");
        const success = await save(page);

        console.log("🔘 [SaveAllV2Button] Save result:", { success });

        if (success) {
            console.log("✅ [SaveAllV2Button] Save successful, resetting button flags");
            resetButtonFlags();
        } else {
            console.error("❌ [SaveAllV2Button] Save failed");
        }
    };

    return (
        <div className="flex items-center gap-2">
            {disabled ? (
                /* Disabled state: gray muted */
                <Button
                    type="button"
                    onClick={onClick}
                    disabled
                    variant="secondary"
                    size="sm"
                    className="cursor-not-allowed opacity-50"
                    aria-busy={saving}
                >
                    {saving ? STEP12_TEXTS.labels.saving : STEP12_TEXTS.labels.saveAll}
                </Button>
            ) : (
                /* Ready state: pulsing orange */
                <Button
                    type="button"
                    onClick={onClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md"
                    size="sm"
                    aria-busy={saving}
                >
                    <Save className="size-3 mr-1.5" />
                    {saving ? STEP12_TEXTS.labels.saving : STEP12_TEXTS.labels.saveAll}
                </Button>
            )}
        </div>
    );
}
