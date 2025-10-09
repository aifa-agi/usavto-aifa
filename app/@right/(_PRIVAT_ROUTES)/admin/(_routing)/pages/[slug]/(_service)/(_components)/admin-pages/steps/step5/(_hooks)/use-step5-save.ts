// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/use-step5-save.ts

/**
 * Step 5 - Save hook for draftContentStructure
 * Based on Step 8 save patterns with optimistic updates
 */

import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type {
  PageData,
  RootContentStructure,
} from "@/app/@right/(_service)/(_types)/page-types";

function deepCloneCategories(src: MenuCategory[]): MenuCategory[] {
  return JSON.parse(JSON.stringify(src)) as MenuCategory[];
}

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

  return replaced ? nextCategories : categories;
}

export function useStep5Save() {
  const { categories, setCategories, updateCategories } = useNavigationMenu();

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

      // Optimistic patch
      setCategories(nextCategories);
      console.log("[Step5Save] Optimistic update applied to categories");

      // Persist
      const error = await updateCategories();

      if (error) {
        console.error("[Step5Save] Persistence failed:", error);
        
        // Rollback
        setCategories(prevCategories);

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

      toast.success("Saved", {
        id: "step5-save-success",
        description: "Draft content structure saved successfully.",
      });

      return true;
    },
    [categories, setCategories, updateCategories]
  );

  /**
   * Save a single section by index in draftContentStructure
   * Replaces the section at the specified index with new data
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

      // Use existing save method to persist entire structure
      const success = await saveDraftContentStructure(page, currentDraft);

      if (success) {
        console.log(`[Step5Save] Section ${sectionIndex + 1} saved successfully`);
      }

      return success;
    },
    [saveDraftContentStructure]
  );

  return {
    saveDraftContentStructure,
    saveSingleSection,
  };
}
