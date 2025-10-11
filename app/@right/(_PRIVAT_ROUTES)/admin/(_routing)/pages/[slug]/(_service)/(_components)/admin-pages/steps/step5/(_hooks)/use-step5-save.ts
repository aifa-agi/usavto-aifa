// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/use-step5-save.ts

"use client";

/**
 * Step 5 - Save hook for draftContentStructure
 * ✅ REFACTORED: Follows Step8 patterns for stability
 * - No local isSaving state in deps
 * - Synchronous optimistic update (no setTimeout)
 * - Strict rollback without conditions
 * - Minimal deps for useCallback stability
 *
 * Understanding of the task (step-by-step):
 * 1) Single source of truth: PageData lives inside menu categories
 * 2) Build nextCategories by updating current page's draftContentStructure
 * 3) Optimistic UX: setCategories(nextCategories), then await updateCategories() (NO args)
 * 4) On failure: strict rollback to prevCategories
 * 5) Clearing with empty array is allowed (removes all sections)
 *
 * Notes:
 * - Comments and UI strings in English (US)
 * - Sonner toasts with stable IDs
 * - No setTimeout or local state in callback deps
 */

import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

/** Deep clone utility to snapshot categories for rollback. */
function deepCloneCategories(src: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(src)) as MenuCategory[];
}

/** Returns true if array is non-empty. */
function nonEmpty(value: RootContentStructure[] | null | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

/** Replaces a page within categories by id, returns new categories array. */
function replacePageInCategories(
  categories: MenuCategory[],
  updatedPage: PageData
): MenuCategory[] {
  let replaced = false;
  const nextCategories = categories.map((cat) => {
    const pages = Array.isArray(cat.pages) ? cat.pages : [];
    const newPages = pages.map((p) => {
      if (p?.id === updatedPage.id) {
        replaced = true;
        return { ...updatedPage, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { ...cat, pages: newPages };
  });

  // If page not found, return original to avoid data loss
  return replaced ? nextCategories : categories;
}

export function useStep5Save() {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

  /**
   * Saves entire draftContentStructure for a page.
   * Optimistic flow with strict rollback on failure.
   * Pattern follows Step8 for stability (no local state in deps, no setTimeout).
   */
  const saveDraftContentStructure = React.useCallback(
    async (
      page: PageData,
      draftStructure: RootContentStructure[]
    ): Promise<boolean> => {
      if (!page?.id) {
        toast.error("Save failed", {
          id: "step5-save-error",
          description: "Page not found for saving.",
        });
        return false;
      }

      console.log("[Step5Save] Saving draft structure for page:", page.id);
      console.log("[Step5Save] Structure length:", draftStructure.length);

      // Snapshot for rollback
      const prevCategories = deepCloneCategories(categories);

      // Build updated page
      const updatedPage: PageData = {
        ...page,
        draftContentStructure: draftStructure,
      };

      // Compute next categories
      const nextCategories = replacePageInCategories(categories, updatedPage);

      // ✅ FIX: Synchronous optimistic update (following Step8 pattern)
      setCategories(nextCategories);
      console.log("[Step5Save] Optimistic update applied (sync)");

      // Persist with provider (NO args)
      const error = await updateCategories();

      if (error) {
        console.error("[Step5Save] Persistence failed:", error);

        // ✅ FIX: Strict rollback (no condition check, following Step8)
        setCategories(prevCategories);
        console.log("[Step5Save] Rollback applied");

        toast.error("Save failed", {
          id: "step5-save-error",
          description: "Could not save draft structure. Changes reverted.",
        });
        toast.warning("Rolled back", {
          id: "step5-rollback",
          description: "Last change was reverted due to persistence error.",
        });

        return false;
      }

      console.log("[Step5Save] Draft structure saved successfully");

      // Success toast (conditional on content presence)
      if (nonEmpty(draftStructure)) {
        toast.success("Saved", {
          id: "step5-save-success",
          description: "Draft content structure saved successfully.",
        });
      } else {
        toast.info("Cleared", {
          id: "step5-save-cleared",
          description: "Draft content structure cleared.",
        });
      }

      return true;
    },
    [categories, setCategories, updateCategories]  // ✅ FIX: No local state in deps
  );

  /**
   * Save a single section by index in draftContentStructure.
   * Replaces the section at the specified index with new data.
   * Pattern follows Step8 clearSectionTempMDX (wraps main save).
   */
  const saveSingleSection = React.useCallback(
    async (
      page: PageData,
      sectionData: RootContentStructure,
      sectionIndex: number
    ): Promise<boolean> => {
      if (!page?.id) {
        toast.error("Save failed", {
          id: "step5-section-save-error",
          description: "Page not found for saving section.",
        });
        return false;
      }

      console.log(`[Step5Save] Saving section ${sectionIndex + 1} for page:`, page.id);

      // Get current draft structure or initialize empty array
      const currentDraft = Array.isArray(page.draftContentStructure)
        ? [...page.draftContentStructure]
        : [];

      // Ensure array has enough slots
      while (currentDraft.length <= sectionIndex) {
        currentDraft.push(null as any);
      }

      // Replace section at index
      currentDraft[sectionIndex] = sectionData;

      console.log("[Step5Save] Updated draft array length:", currentDraft.length);
      console.log("[Step5Save] Section data:", {
        id: sectionData.id,
        tag: sectionData.tag,
        classification: sectionData.classification,
        hasRealContent: !!sectionData.realContentStructure,
        realContentLength: Array.isArray(sectionData.realContentStructure)
          ? sectionData.realContentStructure.length
          : 0,
      });

      // Use main save method to persist entire structure
      const success = await saveDraftContentStructure(page, currentDraft);

      if (success) {
        console.log(`[Step5Save] Section ${sectionIndex + 1} saved successfully`);
      }

      return success;
    },
    [saveDraftContentStructure]  // ✅ FIX: Only depends on stable callback
  );

  /**
   * Convenience helper: clears entire draftContentStructure (sets to empty array).
   * Pattern follows Step8 clearSectionTempMDX.
   */
  const clearDraftContentStructure = React.useCallback(
    async (page: PageData): Promise<boolean> => {
      return await saveDraftContentStructure(page, []);
    },
    [saveDraftContentStructure]
  );

  return {
    saveDraftContentStructure,
    saveSingleSection,
    clearDraftContentStructure,  // ✅ NEW: Added for consistency with Step8
  };
}
