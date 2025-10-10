// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step7/(_sub_domains)/section-selector-card.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 * 
 * SectionSelectorCard:
 * - Replaced custom buttons with shadcn/ui Button components.
 * - Three states for section chips:
 *   * Active: Primary button (current working section)
 *   * Completed: Green button with checkmark
 *   * Default (not completed): Orange pulsing button (needs attention)
 * - Plus buttons use secondary variant.
 * - Improved accessibility and consistency with the design system.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Edit, Edit2 } from "lucide-react";
import { useStep7Root } from "../(_contexts)/step7-root-context";
import { useSectionInsert } from "../(_hooks)/use-section-insert";

function labelByIndex(index: number): string {
  return `Section ${index + 1}`;
}

export function SectionSelectorCard() {
  const { getDraftSections, ui, setActiveSection } = useStep7Root();
  const sections = getDraftSections();
  const { insertAtIndex } = useSectionInsert();

  const handlePick = React.useCallback(
    (id: string | undefined | null) => {
      if (!id) return;
      setActiveSection(id);
    },
    [setActiveSection]
  );

  const handleInsertAt = React.useCallback(
    async (idx: number) => {
      await insertAtIndex(idx);
    },
    [insertAtIndex]
  );

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Section Navigation
        </h3>
        <p className="text-xs text-muted-foreground">
          Select a section to work with.
        </p>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {/* Leading plus -> insert at 0 */}
          <Button
            variant="secondary"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => handleInsertAt(0)}
            aria-label="Add section at beginning"
            title="Add section at beginning"
          >
            <Plus className="size-4" />
          </Button>

          {sections.map((s, idx) => {
            const isActive = ui.activeSectionId === s.id;
            const isChecked = s.status === "checked";
            const label = labelByIndex(idx);

            return (
              <React.Fragment key={s.id ?? `idx-${idx}`}>
                {/* Section button with three states */}
                {isActive ? (
                  // Active state: Primary (currently working on this)
                  <Button
                    onClick={() => handlePick(s.id)}
                    variant="default"
                    size="sm"
                    className="max-w-[240px] truncate"
                    aria-pressed="true"
                    title={label}
                  ><Edit2 className="size-3 mr-1.5" />

                    {label}
                  </Button>
                ) : isChecked ? (
                  // Completed state: Green with checkmark
                  <Button
                    onClick={() => handlePick(s.id)}
                    className="bg-green-500 hover:bg-green-600 text-white shadow-md max-w-[240px] truncate"
                    size="sm"
                    aria-pressed="false"
                    title={label}
                  >
                    <CheckCircle className="size-3 mr-1.5" />
                    {label}
                  </Button>
                ) : (
                  // Default state: Orange pulsing (needs work/attention)
                  <Button
                    onClick={() => handlePick(s.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md max-w-[240px] truncate"
                    size="sm"
                    aria-pressed="false"
                    title={label}
                  >
                    <Edit2 className="size-3 mr-1.5" />
                    {label}
                  </Button>
                )}

                {/* Plus after this section -> insert at idx + 1 */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => handleInsertAt(idx + 1)}
                  aria-label={`Add section after ${label}`}
                  title={`Add section after ${label}`}
                >
                  <Plus className="size-4" />
                </Button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
