// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/results-selector-card.tsx
"use client";

/**
 * ResultsSelectorCard:
 * - Horizontal navigation of H2 sections with four visual states:
 *   1. Locked (secondary gray) - Index > unlockedIndex (previous sections not completed)
 *   2. Active (primary) - Currently selected section
 *   3. Completed (green with checkmark) - Index < unlockedIndex (saved, clickable for editing)
 *   4. Next (orange pulsing) - Index === unlockedIndex && not active (available to work on)
 * - Enforces sequential activation: only completed + current sections are clickable
 * - Matches corporate design standard with shadcn/ui Button variants
 * - Logic based on unlockedIndex from useStep8Status (enhanced from ProgressStrip)
 */

import * as React from "react";
import { CheckCircle, Edit, Edit2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "../(_hooks)/use-step8-status";
import { toast } from "sonner";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";

function labelByIndex(index: number): string {
  return `Section ${index + 1}`;
}

export function ResultsSelectorCard() {
  const { getSections, ui, setActiveSection } = useStep8Root();
  const { unlockedIndex } = useStep8Status();
  const sections = getSections();

  const containerCls =
    "w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40";
  const titleCls = "text-sm font-semibold text-foreground";
  const subtitleCls = "text-xs text-muted-foreground";

  const handlePick = React.useCallback(
    (id: string | undefined | null, index: number) => {
      if (!id) return;

      // Allow clicking on:
      // 1. Completed sections (index < unlockedIndex) - for editing
      // 2. Current section (index === unlockedIndex) - for working
      // Block only: locked sections (index > unlockedIndex)
      if (index > unlockedIndex) {
        toast.error(STEP8_TEXTS.guard.lockedTitle, {
          id: STEP8_IDS.toasts.guardLocked,
          description: STEP8_TEXTS.guard.lockedDescription,
        });
        return;
      }

      setActiveSection(id);
    },
    [unlockedIndex, setActiveSection]
  );

  return (
    <div className={containerCls}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={titleCls}>Results Navigation</h3>
        <p className={subtitleCls}>Pick a section to inspect its AI results.</p>
      </div>

      <div className="custom-scrollbar overflow-x-auto overflow-y-hidden">
        <div className="flex min-w-max items-center gap-2">
          {sections.map((s, idx) => {
            const isActive = ui.activeSectionId === s.id;
            const label = labelByIndex(idx);

            // State logic based on unlockedIndex
            const isCompleted = idx < unlockedIndex; // Saved sections (green)
            const isCurrent = idx === unlockedIndex; // Current unlocked section (orange if not active)
            const isLocked = idx > unlockedIndex; // Locked sections (gray)

            return (
              <React.Fragment key={s.id ?? `idx-${idx}`}>
                {/* State 1: Locked (secondary gray with lock icon) - NOT CLICKABLE */}
                {isLocked ? (
                  <Button
                    onClick={() => handlePick(s.id, idx)}
                    variant="secondary"
                    size="sm"
                    className="max-w-[240px] truncate"
                    aria-pressed="false"
                    disabled
                    title={`${label} - ${STEP8_TEXTS.labels.locked}`}
                  >
                    <Lock className="size-3 mr-1.5" />
                    {label}
                  </Button>
                ) : isActive ? (
                  /* State 2: Active (primary with edit icon) - CLICKABLE */
                  <Button
                    onClick={() => handlePick(s.id, idx)}
                    variant="default"
                    size="sm"
                    className="max-w-[240px] truncate"
                    aria-pressed="true"
                    title={label}
                  >
                    <Edit className="size-3 mr-1.5" />
                    {label}
                  </Button>
                ) : isCompleted ? (
                  /* State 3: Completed (green with checkmark) - CLICKABLE for editing */
                  <Button
                    onClick={() => handlePick(s.id, idx)}
                    className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate"
                    size="sm"
                    aria-pressed="false"
                    title={`${label} - Click to edit`}
                  >
                    <CheckCircle className="size-3 mr-1.5" />
                    {label}
                  </Button>
                ) : (
                  /* State 4: Next/Current (orange pulsing) - CLICKABLE */
                  <Button
                    onClick={() => handlePick(s.id, idx)}
                    className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md max-w-[240px] truncate"
                    size="sm"
                    aria-pressed="false"
                    title={label}
                  >
                    <Edit2 className="size-3 mr-1.5" />
                    {label}
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
