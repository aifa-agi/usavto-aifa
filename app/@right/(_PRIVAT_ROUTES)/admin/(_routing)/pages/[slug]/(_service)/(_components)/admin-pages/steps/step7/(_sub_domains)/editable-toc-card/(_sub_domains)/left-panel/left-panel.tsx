// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/
// admin-pages/steps/step7/(_sub_domains)/editable-toc-card/(_sub_domains)/left-panel/left-panel.tsx
"use client";

/**
 * Comments are in English. UI texts are in English (US).
 *
 * LeftPanel:
 * - Redesigned with 2025 best practices: proper visual hierarchy, breathing room, and clear information architecture.
 * - Simplified layout with removed redundant containers.
 * - Full-width pulsing orange button that becomes green metallic after confirmation.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useStep7Root } from "../../../../(_contexts)/step7-root-context";
import { useDraftConfirm } from "../../../../(_hooks)/use-draft-confirm";
import { TreeView } from "./(_sub_domains)/tree/tree-view";
import { useEditableToc } from "../(_contexts)/editable-toc-context";

import { SectionTOC } from "./(_sub_domains)/tree/toc/section-toc";
import { transformSectionChildrenToTOC } from "./(_sub_domains)/tree/toc/section-toc-transformer";

export function LeftPanel() {
  const { getActiveSection, ui } = useStep7Root();
  const { confirmSection } = useDraftConfirm();

  const active = getActiveSection();
  const derived = active?.id ? ui.derivedBySection[active.id] : undefined;

  const total = derived?.total ?? 0;
  const confirmed = derived?.confirmed ?? 0;
  const isConfirmed = Boolean(derived?.isConfirmed);

  const handleConfirmAll = async () => {
    if (isConfirmed || total === 0) return;
    await confirmSection();
  };

  // Original data for the editable tree
  const { rootSection, nodes } = useEditableToc();

  // Build read-only TOC elements for the active section
  const tocElements = React.useMemo(
    () => transformSectionChildrenToTOC(rootSection?.realContentStructure),
    [rootSection?.realContentStructure]
  );

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col rounded-lg border border-neutral-800 bg-neutral-925">
        {/* Header Zone - Compact badge + full-width action */}
        <div className="flex flex-col gap-3 p-4 border-b border-neutral-800">
          {/* Progress Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 self-start">
            <span className="text-xs font-medium text-neutral-300">
              {confirmed}/{total}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">
              confirmed
            </span>
          </div>

          {/* Full-width Confirm Button - Only when rootSection exists */}
          {rootSection && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleConfirmAll}
                  disabled={isConfirmed || total === 0}
                  className={
                    isConfirmed
                      ? "w-full bg-green-500 text-white hover:bg-green-600 font-semibold shadow-md transition-all"
                      : "w-full bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md transition-all"
                  }
                  size="default"
                  aria-label="Confirm all elements in the active section"
                >
                  <CheckCircle className="size-4 mr-2" />
                  {isConfirmed ? "Confirmed" : "Confirm"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs leading-relaxed">
                  {isConfirmed
                    ? "All elements in this section are confirmed and locked."
                    : "One-way action. Confirms and locks all existing elements in the active section."}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* TOC Zone - Read-only mini navigation */}
        <div className="px-4 pt-3 pb-2">
          <SectionTOC elements={tocElements} />
        </div>

        <Separator className="bg-neutral-800" />

        {/* Tree View Zone - Main content area */}
        <div className="flex-1 overflow-auto p-4">
          <TreeView root={rootSection} nodes={nodes} />
        </div>
      </div>
    </TooltipProvider>
  );
}
