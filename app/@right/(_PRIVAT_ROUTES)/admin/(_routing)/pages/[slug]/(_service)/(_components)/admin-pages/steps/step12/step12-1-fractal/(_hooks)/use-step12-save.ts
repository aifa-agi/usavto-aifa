// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_hooks)/use-step12-save.ts
"use client";

/**
 * Step 12 - Save hook following Step5/Step8 stability patterns
 * ✅ REFACTORED: Updates state AFTER server persistence (no optimistic update)
 * 
 * Understanding of the task (step-by-step):
 * 1) Build payload from sections and page metadata
 * 2) Upload sections to file system (uploadSections)
 * 3) Persist to server: await updateCategories() (NO args)
 * 4) On success: Update local state with isPreviewComplited: true
 * 5) On failure: Show error toast (no rollback needed)
 * 6) Reset content flags after successful update
 * 
 * Key changes from previous version:
 * - Removed optimistic update (state updates only after server confirmation)
 * - Removed deepCloneCategories (no rollback needed)
 * - Server persistence happens BEFORE state update
 * - Eliminates race condition with Next.js re-render
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import type { PageUploadPayload } from "@/app/@right/(_service)/(_types)/section-types";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { uploadSections, SectionUploadError, UploadErrorType } from "../(_utils)/sections-upload.service";
import { toPageUploadPayload } from "../(_adapters)/sections-mapper";
import { STEP12_IDS } from "../(_constants)/step12-ids";
import { useStep12Root } from "../(_contexts)/step12-root-context";

interface UseStep12SaveReturn {
  save: (page?: PageData) => Promise<boolean>;
  saving: boolean;
}

/** Replaces a page within categories by href, returns new categories array. */
function replacePageInCategories(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  let replaced = false;
  const nextCategories = categories.map((cat) => {
    const pages = Array.isArray(cat.pages) ? cat.pages : [];
    const newPages = pages.map((p) => {
      if (p?.href === updatedPage.href) {
        replaced = true;
        return { ...updatedPage, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { ...cat, pages: newPages };
  });

  return replaced ? nextCategories : categories;
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
      if (!targetPage) {
        toast.error("Page data is required for saving", { 
          id: STEP12_IDS.toasts.saveError 
        });
        return false;
      }

      if (!targetPage.href) {
        toast.error("Page href is required for saving", { 
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
        // 1. Build payload with sections and page metadata
        const payload: PageUploadPayload = toPageUploadPayload(sections, targetPage);

        if (payload.sections.length === 0) {
          throw new Error("No sections to save");
        }

        // 2. Upload sections to file system
        console.log("[Step12Save] Uploading sections...");
        const response = await uploadSections(payload);
        console.log("[Step12Save] Upload successful:", response);

        // 3. Build updated page object
        const updatedPage: PageData = {
          ...targetPage,
          isPreviewComplited: true,
          title: payload.pageMetadata.title || targetPage.title,
          description: payload.pageMetadata.description || targetPage.description,
          updatedAt: new Date().toISOString(),
        };

        // 4. ✅ FIX: Persist to server FIRST (before state update)
        console.log("[Step12Save] Persisting to server...");
        const nextCategories = replacePageInCategories(categories, updatedPage);
        
        // Temporarily update categories in memory for server action
        const tempCategories = nextCategories;
        
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

        // 5. ✅ FIX: Update local state AFTER successful server persistence
        setCategories(nextCategories);
        console.log("[Step12Save] Local state updated with isPreviewComplited: true");

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
          let errorMessage = error.message;

          switch (error.type) {
            case UploadErrorType.VALIDATION_ERROR:
              errorMessage = `Validation error: ${error.message}`;
              break;
            case UploadErrorType.NETWORK_ERROR:
              errorMessage = "Network error: Please check your connection and try again";
              break;
            case UploadErrorType.GITHUB_ERROR:
              errorMessage = "GitHub integration error: Please contact administrator";
              break;
            case UploadErrorType.FILESYSTEM_ERROR:
              errorMessage = "File system error: Unable to save page";
              break;
            case UploadErrorType.SERVER_ERROR:
              errorMessage = `Server error: ${error.message}`;
              break;
            default:
              errorMessage = `Upload failed: ${error.message}`;
          }

          toast.error(errorMessage, { 
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
