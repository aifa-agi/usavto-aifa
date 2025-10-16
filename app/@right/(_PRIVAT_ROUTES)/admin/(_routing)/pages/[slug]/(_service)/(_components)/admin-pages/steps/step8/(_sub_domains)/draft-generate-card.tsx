// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step8/(_sub_domains)/draft-generate-card.tsx
"use client";

/**
 * DraftGenerateCard:
 * - Streaming generation flow with proper state management (production-proven patterns from Step 5).
 * - "Copy Prompt" copies the current system instruction to the clipboard.
 * - Auto-scrolls to the bottom of the preview container during streaming for visibility.
 * - "Save to Section" button: orange pulsing, visible only when content is completed and not yet saved.
 * - "Stream Generate" button states:
 *   1. Disabled (gray) when no section selected
 *   2. Orange pulsing when new section (no saved content)
 *   3. Green (active) when section has saved content (for regeneration)
 *   4. Replaced by blue "Generating" badge during streaming
 *   5. Disabled (gray) when content completed but not saved
 * - Read-only preview area (pre element instead of Textarea) for HTML display.
 * - Loads saved content from context when switching sections.
 *
 * Notes:
 * - UI strings and comments are in English (US). Toaster: Sonner.
 * - No persistence here; saving is delegated to useStep8Save.
 */

import * as React from "react";
import { useStep8Guard } from "../(_hooks)/use-step8-guard";
import { useStep8Prompt } from "../(_hooks)/content-draft-prompt-generator";
import { useStep8Stream } from "../(_hooks)/use-step8-stream";
import { useStep8Save } from "../(_hooks)/use-step8-save";
import { toast } from "sonner";
import { STEP8_TEXTS } from "../(_constants)/step8-texts";
import { STEP8_IDS } from "../(_constants)/step8-ids";
import { useStep8Root } from "../(_contexts)/step8-root-context";

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function DraftGenerateCard() {
  const { getActiveSection, ui } = useStep8Root();
  const { canActivateId } = useStep8Guard();
  const { buildForActiveSection } = useStep8Prompt();
  const { saveSectionTempMDX } = useStep8Save();

  const active = getActiveSection();
  const activeId = active?.id ?? null;

  const hasSavedContent = activeId ? !!ui.resultsBySection[activeId] : false;

  const { streamText, isStreaming, startStreaming, cancel } = useStep8Stream();
  const [localPreview, setLocalPreview] = React.useState<string>("");
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const previewRef = React.useRef<HTMLDivElement>(null);
  const lastProcessedText = React.useRef<string>("");

  React.useEffect(() => {
    if (!activeId) {
      setLocalPreview("");
      setIsCompleted(false);
      setIsSaved(false);
      lastProcessedText.current = "";
      return;
    }

    const savedResult = ui.resultsBySection[activeId];
    let contentToLoad = "";

    if (savedResult) {
      if (typeof savedResult === "string") {
        contentToLoad = savedResult;
      } else if (typeof savedResult === "object" && savedResult !== null) {
        contentToLoad =
          (savedResult as any).html ||
          (savedResult as any).content ||
          (savedResult as any).text ||
          "";
      }
    }

    if (contentToLoad && contentToLoad.length > 0) {
      setLocalPreview(contentToLoad);
      setIsCompleted(false);
      setIsSaved(true);
    } else {
      setLocalPreview("");
      setIsCompleted(false);
      setIsSaved(false);
    }

    lastProcessedText.current = "";
  }, [activeId, ui.resultsBySection]);

  React.useEffect(() => {
    if (isStreaming) {
      setLocalPreview(streamText ?? "");
    }
  }, [isStreaming, streamText]);

  React.useEffect(() => {
    if (isStreaming && previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [isStreaming, streamText]);

  React.useEffect(() => {
    if (
      !isStreaming &&
      streamText &&
      streamText.length > 10 &&
      lastProcessedText.current !== streamText
    ) {
      lastProcessedText.current = streamText;
      setLocalPreview(streamText);
      setIsCompleted(true);
      setIsSaved(false);
    }
  }, [isStreaming, streamText]);

  const chipBase =
    "inline-flex items-center truncate rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const toneNeutral =
    "border-border bg-background/60 text-foreground hover:bg-background/80 dark:bg-background/30 focus-visible:ring-neutral-500";
  const toneDisabled =
    "opacity-50 cursor-not-allowed border-border bg-background/60 text-muted-foreground";
  const toneCancel =
    "border-border bg-background/60 text-muted-foreground hover:bg-background/70 dark:bg-background/30 focus-visible:ring-neutral-500";
  const tonePulsing =
    "bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md focus-visible:ring-orange-500";
  const toneGreen =
    "bg-green-500 hover:bg-green-600 text-white shadow-md focus-visible:ring-green-500";

  const onStream = async () => {
    if (!activeId) {
      toast.error(STEP8_TEXTS.errors.missingActive, {
        id: STEP8_IDS.toasts.generateError,
        description: STEP8_TEXTS.selector.selectPrompt,
      });
      return;
    }
    if (!canActivateId(activeId)) {
      toast.error(STEP8_TEXTS.guard.lockedTitle, {
        id: STEP8_IDS.toasts.guardLocked,
        description: STEP8_TEXTS.guard.lockedDescription,
      });
      return;
    }
    const prompt = buildForActiveSection();
    if (!prompt) return;

    setLocalPreview("");
    setIsCompleted(false);
    setIsSaved(false);
    lastProcessedText.current = "";

    await startStreaming({
      system: prompt.system,
      prompt: prompt.user,
      model: "gpt-4.1-mini",
    });
  };

  const onCopyPrompt = async () => {
    if (!activeId) {
      toast.error(STEP8_TEXTS.errors.missingActive, {
        id: STEP8_IDS.toasts.copyError,
        description: STEP8_TEXTS.selector.selectPrompt,
      });
      return;
    }
    const prompt = buildForActiveSection();
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.system);
      toast.success(STEP8_TEXTS.copy.successTitle, {
        id: STEP8_IDS.toasts.copySuccess,
        description: STEP8_TEXTS.copy.successDescription,
      });
    } catch {
      toast.error(STEP8_TEXTS.copy.errorTitle, {
        id: STEP8_IDS.toasts.copyError,
        description: STEP8_TEXTS.copy.errorDescription,
      });
    }
  };

  const onSave = async () => {
    if (!activeId) return;
    const ok = await saveSectionTempMDX(activeId, localPreview ?? "");
    if (ok) {
      setIsSaved(true);
      setIsCompleted(false);
      toast.success(STEP8_TEXTS.save.successTitle, {
        id: STEP8_IDS.toasts.saveSuccess,
        description: STEP8_TEXTS.save.successDescription,
      });
    }
  };

  const onClear = () => {
    setLocalPreview("");
    setIsCompleted(false);
    setIsSaved(false);
    lastProcessedText.current = "";
    toast.info(STEP8_TEXTS.save.clearedTitle, {
      id: STEP8_IDS.toasts.saveCleared,
      description: STEP8_TEXTS.save.clearedDescription,
    });
  };

  const streamDisabled = !activeId || isStreaming || (isCompleted && !isSaved);

  const getStreamButtonClass = () => {
    if (!activeId || (isCompleted && !isSaved)) return toneDisabled;
    if (hasSavedContent) return toneGreen;
    return tonePulsing;
  };

  return (
    <div className="rounded-md border p-4">
      <div className="custom-sidebar overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {!isStreaming ? (
            <button
              type="button"
              onClick={onStream}
              disabled={streamDisabled}
              className={[chipBase, getStreamButtonClass()].join(" ")}
            >
              Stream Generate
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-md border border-blue-300 bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 animate-pulse">
              <LoadingSpinner className="size-3 animate-spin" />
              Generating
            </span>
          )}

          {isCompleted && !isSaved && (
            <button
              type="button"
              onClick={onSave}
              className={[chipBase, tonePulsing].join(" ")}
            >
              Save to Section
            </button>
          )}

          <button
            type="button"
            onClick={onCopyPrompt}
            disabled={!activeId}
            className={[chipBase, toneNeutral, !activeId ? toneDisabled : ""].join(
              " "
            )}
            title="Copy current system instruction"
          >
            {STEP8_TEXTS.labels.copyPrompt}
          </button>

          {isStreaming && (
            <button
              type="button"
              onClick={cancel}
              className={[chipBase, toneCancel].join(" ")}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onClear}
            className={[chipBase, toneNeutral].join(" ")}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        ref={previewRef}
        className="mt-3 w-full h-96 overflow-y-auto rounded-md border border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-4"
      >
        <pre className="text-xs text-black dark:text-white whitespace-pre-wrap font-mono">
          {localPreview || "No content yet. Click 'Stream Generate' to begin."}
        </pre>
      </div>
    </div>
  );
}
