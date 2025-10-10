// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/step8-header-card.tsx
"use client";

/**
 * Step8HeaderCard:
 * - Shows summary metrics (Coverage, Current, Saved) with three statistical blocks.
 * - Displays last update timestamp.
 * - Includes a 4px tri-state status dot INSIDE the "Generate draft" button.
 * - Status logic: green (all saved), gray (none saved or zero sections), orange (partial).
 * - Uses derived UI-only metrics from useStep8Status (no persistence).
 * - Matches corporate design standard with neutral card surfaces and colored metric indicators.
 */


import * as React from "react";
import { useStep8Root } from "../(_contexts)/step8-root-context";
import { useStep8Status } from "../(_hooks)/use-step8-status";
import { getPageTitleSafe } from "../(_utils)/step8-utils";

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 ${props.className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Step8HeaderCard() {
  const { page } = useStep8Root();
  const { savedCount, totalCount, isAllSaved8, coverage8, unlockedIndex } =
    useStep8Status();

  const pageTitleText = React.useMemo(
    () => getPageTitleSafe(page),
    [page?.title, page?.metadata?.title]
  );

  const updatedAt =
    typeof page?.updatedAt === "string"
      ? new Date(page!.updatedAt!).toLocaleString()
      : "—";

  // Tri-state: green (all), gray (none), orange (partial) — 4px dot
  const statusTone =
    totalCount === 0 || savedCount === 0
      ? "empty"
      : isAllSaved8
        ? "complete"
        : "partial";
  const dotBase = "inline-block h-1 w-1 rounded-full"; // 4px
  const dotCls =
    statusTone === "complete"
      ? `${dotBase} bg-emerald-400`
      : statusTone === "partial"
        ? `${dotBase} bg-orange-400`
        : `${dotBase} bg-neutral-500/60`;

  return (
    <div className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40">


      <div className="flex items-center gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-violet-400">
            <PencilIcon />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Sequential Content Generation
              </h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground line-clamp-2">
                {pageTitleText}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Activate content generation step-by-step with your configured structure, knowledge bases,
              and custom instructions. Export prompts for external AI tools (e.g., Perplexity) or generate
              internally, then upload results for seamless integration.
            </p>
          </div>


        </div>

      </div>

      {/* Three statistical blocks matching Step 7 design standard */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {/* Coverage Block - Emerald (green) */}
        <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 text-center dark:border-neutral-800/60 dark:bg-neutral-900/30">
          <div className="text-xl font-semibold text-emerald-400">
            {coverage8}%
          </div>
          <div className="text-xs text-muted-foreground">Coverage</div>
        </div>

        {/* Current Block - Violet (purple) */}
        <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 text-center dark:border-neutral-800/60 dark:bg-neutral-900/30">
          <div className="text-xl font-semibold text-violet-400">
            {unlockedIndex + 1} / {totalCount}
          </div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>

        {/* Saved Block - Orange */}
        <div className="rounded-md border border-neutral-200 bg-neutral-50/60 p-4 text-center dark:border-neutral-800/60 dark:bg-neutral-900/30">
          <div className="text-xl font-semibold text-orange-400">
            {savedCount}
          </div>
          <div className="text-xs text-muted-foreground">Saved</div>
        </div>
      </div>
    </div>
  );
}
