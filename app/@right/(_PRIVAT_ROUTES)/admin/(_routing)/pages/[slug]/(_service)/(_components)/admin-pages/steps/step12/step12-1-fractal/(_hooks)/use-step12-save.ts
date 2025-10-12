// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_hooks)/use-step12-save.ts
"use client";

/**
 * Step 12 - Save hook with delayed state persistence
 * 
 * Understanding of the task (step-by-step):
 * 1) Build payload from sections and page metadata
 * 2) Upload sections to file system (uploadSections)
 * 3) Update local state with isPreviewComplited: true
 * 4) Wait 500ms for React state to commit
 * 5) Persist updated state to server via updateCategories()
 * 6) On failure: Show error toast
 * 7) Reset content flags after successful update
 * 
 * Key changes:
 * - Added 500ms delay between setCategories and updateCategories
 * - Ensures React has time to commit state updates before server sync
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { uploadSections, SectionUploadError, UploadErrorType } from "../(_utils)/sections-upload.service";
import { toPageUploadPayload } from "../(_adapters)/sections-mapper";
import { STEP12_IDS } from "../(_constants)/step12-ids";
import { useStep12Root } from "../(_contexts)/step12-root-context";

interface UseStep12SaveReturn {
  save: (page?: PageData) => Promise<boolean>;
  saving: boolean;
}

export function useStep12Save(): UseStep12SaveReturn {
  const [localSaving, setLocalSaving] = useState(false);
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  const {
    sections,
    isAllReady,
    resetAllFlags,
    setSaving: setContextSaving,
    page: contextPage,
  } = useStep12Root();

  const save = useCallback(
    async (page?: PageData): Promise<boolean> => {
      const targetPage = page || contextPage;

      // Validation checks
      if (!targetPage?.href) {
        toast.error("Page data with href is required for saving", { 
          id: STEP12_IDS.toasts.saveError 
        });
        return false;
      }

      if (!isAllReady()) {
        toast.error("Please complete all sections before saving", { 
          id: STEP12_IDS.toasts.saveNotReady 
        });
        return false;
      }

      setLocalSaving(true);
      setContextSaving(true);
      toast.loading("Saving page with all sections...", { 
        id: STEP12_IDS.toasts.saveStart 
      });

      try {
        // 1. Build and validate payload
        const payload: PageUploadPayload = toPageUploadPayload(sections, targetPage);

        if (payload.sections.length === 0) {
          throw new Error("No sections to save");
        }

        // 2. Upload sections to file system
        console.log("[Step12Save] Uploading sections...");
        const response = await uploadSections(payload);
        console.log("[Step12Save] Upload successful:", response);

        // 3. Update local state FIRST with new values
        const updatedCategories = categories.map((cat) => ({
          ...cat,
          pages: (cat.pages || []).map((p) =>
            p?.href === targetPage.href
              ? {
                  ...p,
                  isPreviewComplited: true,
                  title: payload.pageMetadata.title || p.title,
                  description: payload.pageMetadata.description || p.description,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));

        setCategories(updatedCategories);
        console.log("[Step12Save] Local state updated with isPreviewComplited: true");

        // 4. ⏱️ Wait 500ms for React to commit state update
        console.log("[Step12Save] Waiting 500ms for state to commit...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 5. Persist to server (now reading from updated context)
        console.log("[Step12Save] Persisting to server...");
        const updateError = await updateCategories();

        if (updateError) {
          console.error("[Step12Save] Persistence failed:", updateError);

          toast.error("Save failed", {
            id: STEP12_IDS.toasts.saveError,
            description: updateError.userMessage || "Could not persist changes to server",
          });

          return false;
        }

        console.log("[Step12Save] Server persistence successful");

        // 6. Reset content-related flags after successful persist
        resetAllFlags();
        console.log("[Step12Save] Content flags reset");

        toast.success(
          `Successfully saved "${payload.pageMetadata.title || 'Untitled'}" with ${payload.sections.length} sections`,
          { 
            id: STEP12_IDS.toasts.saveSuccess, 
            duration: 4000 
          }
        );
        return true;

      } catch (error) {
        console.error("[Step12Save] Save failed:", error);

        // Handle specific error types
        if (error instanceof SectionUploadError) {
          const errorMessages: Record<UploadErrorType, string> = {
            [UploadErrorType.VALIDATION_ERROR]: `Validation error: ${error.message}`,
            [UploadErrorType.NETWORK_ERROR]: "Network error: Please check your connection and try again",
            [UploadErrorType.GITHUB_ERROR]: "GitHub integration error: Please contact administrator",
            [UploadErrorType.FILESYSTEM_ERROR]: "File system error: Unable to save page",
            [UploadErrorType.SERVER_ERROR]: `Server error: ${error.message}`,
            [UploadErrorType.UNKNOWN_ERROR]: `Upload failed: ${error.message}`,
          };

          toast.error(errorMessages[error.type], { 
            id: STEP12_IDS.toasts.saveError, 
            duration: 6000 
          });
        } else {
          const message = error instanceof Error ? error.message : "Unknown error occurred";
          toast.error(`Save failed: ${message}`, { 
            id: STEP12_IDS.toasts.saveError, 
            duration: 6000 
          });
        }

        return false;
      } finally {
        setLocalSaving(false);
        setContextSaving(false);
        toast.dismiss(STEP12_IDS.toasts.saveStart);
      }
    },
    [categories, setCategories, updateCategories, contextPage, isAllReady, sections, resetAllFlags, setContextSaving]
  );

  return { save, saving: localSaving };
}
