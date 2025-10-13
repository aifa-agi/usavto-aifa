// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_sub_dommain)/save-all-button.tsx
"use client";

/**
 * Changes (EN):
 * - Disabled state: gray muted background
 * - Ready state: pulsing orange when allConfirmed
 * - Resets confirmation flags after successful save
 * - Matches Step8 visual design pattern
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useStep12Save } from "../(_hooks)/use-step12-save";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useStep12Buttons } from "../(_contexts)/step12-buttons-context";

export function SaveAllButton({ page }: { page?: PageData | null }) {
    const { save, saving } = useStep12Save();
    const { allConfirmed, resetAll } = useStep12Buttons();
    const disabled = !allConfirmed || saving || !page;

    const onClick = async () => {
        if (!page) return;
        const ok = await save(page);
        if (ok) {
            resetAll();
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
