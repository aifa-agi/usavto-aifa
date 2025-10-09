// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step5/(_hooks)/use-step5-finalize.ts

/**
 * Step 5 - Finalize hook
 * Sets isReadyDraftForPerplexity flag after all sections are saved
 * This prepares the draft for Perplexity processing in next steps
 */

import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

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

export function useStep5Finalize() {
  const { categories, setCategories, updateCategories } = useNavigationMenu();
  const [isFinalizing, setIsFinalizing] = React.useState(false);

  /**
   * Finalize draft by setting isReadyDraftForPerplexity flag
   * This marks the draft as complete and ready for Perplexity processing
   */
  const finalizeDraft = React.useCallback(
    async (page: PageData): Promise<boolean> => {
      if (!page?.id) {
        toast.error("Finalization failed", {
          id: "step5-finalize-error",
          description: "Page not found for finalization.",
        });
        return false;
      }

      // Validate that draftContentStructure exists and is not empty
      if (!Array.isArray(page.draftContentStructure) || page.draftContentStructure.length === 0) {
        toast.error("Cannot finalize", {
          id: "step5-finalize-validation-error",
          description: "No draft content structure found. Please generate and save sections first.",
        });
        return false;
      }

      // Check if all sections are saved (no null values)
      const hasNullSections = page.draftContentStructure.some((section) => section === null || section === undefined);
      if (hasNullSections) {
        toast.error("Cannot finalize", {
          id: "step5-finalize-incomplete-error",
          description: "All sections must be saved before finalizing draft.",
        });
        return false;
      }

      console.log("[Step5Finalize] Finalizing draft for page:", page.id);
      console.log("[Step5Finalize] Draft sections count:", page.draftContentStructure.length);

      setIsFinalizing(true);

      // Snapshot for rollback
      const prevCategories = deepCloneCategories(categories);

      // Build updated page with isReadyDraftForPerplexity flag
      const updatedPage: PageData = {
        ...page,
        isReadyDraftForPerplexity: true,
      };

      // Compute next categories
      const nextCategories = replacePageInCategories(categories, updatedPage);

      // Optimistic patch
      setCategories(nextCategories);
      console.log("[Step5Finalize] Optimistic update applied - isReadyDraftForPerplexity: true");

      // Persist
      const error = await updateCategories();

      if (error) {
        console.error("[Step5Finalize] Persistence failed:", error);
        
        // Rollback
        setCategories(prevCategories);

        toast.error("Finalization failed", {
          id: "step5-finalize-persist-error",
          description: "Could not finalize draft. Changes reverted.",
        });
        toast.warning("Rolled back", {
          id: "step5-finalize-rollback",
          description: "Draft finalization was reverted due to persistence error.",
        });

        setIsFinalizing(false);
        return false;
      }

      console.log("[Step5Finalize] Draft finalized successfully");

      toast.success("Draft finalized", {
        id: "step5-finalize-success",
        description: "Draft is ready for Perplexity processing. You can proceed to next step.",
      });

      setIsFinalizing(false);
      return true;
    },
    [categories, setCategories, updateCategories]
  );

  /**
   * Check if draft is already finalized
   */
  const isDraftFinalized = React.useCallback(
    (page: PageData | null | undefined): boolean => {
      return page?.isReadyDraftForPerplexity === true;
    },
    []
  );

  /**
   * Check if draft can be finalized (all sections saved)
   */
  const canFinalizeDraft = React.useCallback(
    (page: PageData | null | undefined): boolean => {
      if (!page || !Array.isArray(page.draftContentStructure)) {
        return false;
      }

      if (page.draftContentStructure.length === 0) {
        return false;
      }

      // Check that no sections are null
      const hasNullSections = page.draftContentStructure.some(
        (section) => section === null || section === undefined
      );

      return !hasNullSections;
    },
    []
  );

  return {
    finalizeDraft,
    isDraftFinalized,
    canFinalizeDraft,
    isFinalizing,
  };
}
