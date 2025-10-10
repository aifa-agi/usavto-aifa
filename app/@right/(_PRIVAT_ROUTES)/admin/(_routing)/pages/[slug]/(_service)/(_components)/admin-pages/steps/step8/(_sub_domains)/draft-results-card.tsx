// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/draft-results-card.tsx
"use client";

/**
 * DraftResultsCard (Content Workspace):
 * - Purpose: Provide an integrated vertical workspace to generate (stream or one-shot) and edit MDX
 *   for the currently active H2 section under Step 8 strict sequence rules.
 * - Composition: Vertical stack -> DraftGenerateCard (top, generation UI),
 *                MDXEditorCard (bottom, manual editing & saving).
 * - Statistics removed: Coverage, Current, Saved now displayed in Step8HeaderCard.
 *
 * Understanding of the task (step-by-step):
 * 1) Active section is controlled by Step8RootProvider; we only read it and do not mutate PageData here.
 * 2) Progress/sequence state is derived (useStep8Status) and must not be persisted.
 * 3) Only the unlocked section can be generated (enforced by hooks in generator/editor flows).
 * 4) Statistics removed from this card to avoid duplication with Step8HeaderCard.
 * 5) All UI strings and comments are in English (US) as per project policy.
 */

import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Guard } from "../(_hooks)/use-step8-guard";
import { DraftGenerateCard } from "./draft-generate-card";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { HtmlEditorCard } from "./html-editor-card";

export function DraftResultsCard() {
  const { getActiveSection } = useStep8Root();
  const { canActivateId } = useStep8Guard();

  const active = getActiveSection();
  const activeId = active?.id ?? null;
  const canWork = activeId ? canActivateId(activeId) : false;

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-4 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">
      {/* Header row */}
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-sm font-semibold text-foreground">
            Content Workspace
          </h3>
          <p className="text-xs text-muted-foreground">
            Use streaming or one-shot generation, then refine and save the MDX.
          </p>
        </div>
      </div>

      {/* Active section summary */}
      <div className="mb-3 flex items-center justify-between">
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">
            {active?.description
              ? `Active section: ${active.description}`
              : activeId
                ? `Active section ID: ${activeId}`
                : "No active section selected"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeId ? (
            canWork ? (
              <span className="rounded-sm bg-violet-500/20 px-2 py-0.5 text-[11px] text-violet-300">
                {STEP8_TEXTS.selector.activeBadge}
              </span>
            ) : (
              <span className="rounded-sm bg-neutral-500/20 px-2 py-0.5 text-[11px] text-neutral-300">
                {STEP8_TEXTS.selector.lockedBadge}
              </span>
            )
          ) : null}
        </div>
      </div>

      {/* Vertical workspace: top -> generation (stream/one-shot), bottom -> editor */}
      <div className="flex flex-col gap-3">
        <div className="rounded-md border border-neutral-200 bg-background/60 p-3 dark:border-neutral-800/60 dark:bg-background/30">
          <DraftGenerateCard />
        </div>
        <div className="rounded-md border border-neutral-200 bg-background/60 p-3 dark:border-neutral-800/60 dark:bg-background/30">
          <HtmlEditorCard />
        </div>
      </div>

      {/* Hint about the chain policy */}
      <p className="mt-3 text-xs text-muted-foreground">
        Clearing the current section revokes the chain and locks the next ones
        until restored.
      </p>
    </div>
  );
}

export default DraftResultsCard;
