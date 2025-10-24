// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/add-to-prompt-actions-dropdown/hooks/use-add-to-prompt-logic.ts

import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { AddToPromptMode, AddToPromptState } from "../types";
import {
  getAddToPromptState,
  getAddToPromptMode,
  isDropdownInteractive,
  shouldAutoRemoveFromPrompt,
} from "../add-to-prompt-utils";
import { PageMetadataForPrompt, TOKEN_LIMIT_EXCEEDED } from "@/types/system-prompt-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
// ✅ НОВОЕ: Импорт лимита токенов для отображения
import { SYSTEM_PROMPT_MAX_TOKENS } from "@/config/prompts/base-system-prompt";

interface UseAddToPromptLogicProps {
  singlePage: PageData;
  categoryTitle: string;
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
}

interface UseAddToPromptLogicReturn {
  addToPromptState: AddToPromptState;
  addToPromptMode: AddToPromptMode;
  isInteractive: boolean;
  isUpdating: boolean;
  error: string | null;
  handleAddToPromptMode: (mode: AddToPromptMode) => void;
}

export function useAddToPromptLogic({
  singlePage,
  categoryTitle,
  setCategories,
}: UseAddToPromptLogicProps): UseAddToPromptLogicReturn {
  const addToPromptState = getAddToPromptState(singlePage);
  const addToPromptMode = getAddToPromptMode(singlePage.isAddedToPrompt);
  const isInteractive = isDropdownInteractive(addToPromptState);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevIsAddedToPrompt, setPrevIsAddedToPrompt] = useState(singlePage.isAddedToPrompt);
  
  const isReverting = useRef(false);
  const lastAttemptTimestamp = useRef<number>(0);

  const extractPageMetadata = useCallback((): PageMetadataForPrompt => {
    return {
      id: singlePage.id,
      title: singlePage.title || "",
      description: singlePage.description || "",
      keywords: singlePage.keywords || [],
      href: singlePage.href || "",
    };
  }, [singlePage.id, singlePage.title, singlePage.description, singlePage.keywords, singlePage.href]);

  const syncToBackend = useCallback(async (shouldAdd: boolean) => {
    const now = Date.now();
    if (now - lastAttemptTimestamp.current < 2000) {
      console.warn("[Sync] Rate limit: Too many attempts, skipping");
      return;
    }
    lastAttemptTimestamp.current = now;
    
    setIsUpdating(true);
    setError(null);
    
    let loadingToastId: string | number | undefined;
    if (shouldAdd) {
      loadingToastId = toast.loading("Generating AI Summary", {
        description: `Processing "${singlePage.title}"... This may take 10-30 seconds.`,
      });
    }
    
    try {
      const requestBody = shouldAdd
        ? {
            action: "add" as const,
            pageMetadata: extractPageMetadata(),
          }
        : {
            action: "remove" as const,
            pageMetadata: extractPageMetadata(),
          };
      
      console.log("[API Request] Sending data:", requestBody);
      
      const response = await fetch("/api/config-system-prompt/update-to-system-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      if (!result.success) {
        if (result.error === TOKEN_LIMIT_EXCEEDED && result.tokenUsage) {
          const { current, attempted, projected, limit } = result.tokenUsage;
          
          toast.error("Token Limit Exceeded", {
            description: `You have reached the limit for pages in system instructions. Current: ${current.toLocaleString()} tokens, Attempted: ${attempted.toLocaleString()} tokens, Projected: ${projected.toLocaleString()} tokens, Limit: ${limit.toLocaleString()} tokens. If you need more information, use vector database integration.`,
            duration: 10000,
          });
        } else {
          toast.error("Failed to update system prompt", {
            description: result.message || "Unknown error occurred",
            duration: 5000,
          });
        }
        
        throw new Error(result.message || "Failed to update system prompt");
      }
      
      // ✅ НОВОЕ: Success с детальной статистикой токенов
      if (shouldAdd) {
        // Найти добавленную страницу в обновлённом конфиге
        const addedEntry = result.data?.knowledgeBase?.find((entry: any) => entry.id === singlePage.id);
        const pageTokens = addedEntry?.tokenCount || 0;
        const totalTokens = result.data?.totalTokenCount || 0;
        const usagePercentage = ((totalTokens / SYSTEM_PROMPT_MAX_TOKENS) * 100).toFixed(1);
        
        toast.success("System Instruction Added", {
          description: `Page "${singlePage.title}" successfully added.
          
📊 Token Usage:
• This page: ${pageTokens.toLocaleString()} tokens
• Total used: ${totalTokens.toLocaleString()} / ${SYSTEM_PROMPT_MAX_TOKENS.toLocaleString()} tokens (${usagePercentage}%)
• Remaining: ${(SYSTEM_PROMPT_MAX_TOKENS - totalTokens).toLocaleString()} tokens`,
          duration: 8000,
        });
      } else {
        const totalTokens = result.data?.totalTokenCount || 0;
        const usagePercentage = ((totalTokens / SYSTEM_PROMPT_MAX_TOKENS) * 100).toFixed(1);
        
        toast.success("System Instruction Removed", {
          description: `Page "${singlePage.title}" has been removed.
          
📊 Token Usage:
• Total used: ${totalTokens.toLocaleString()} / ${SYSTEM_PROMPT_MAX_TOKENS.toLocaleString()} tokens (${usagePercentage}%)
• Remaining: ${(SYSTEM_PROMPT_MAX_TOKENS - totalTokens).toLocaleString()} tokens`,
          duration: 6000,
        });
      }
      
      console.log(
        `[API Success] ${shouldAdd ? "Added to" : "Removed from"} system prompt:`,
        singlePage.id
      );
      console.log("[API Response]", result.data);
      
    } catch (err: any) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      
      const errorMessage = err.message || "Unknown error occurred";
      console.error("[API Error]", errorMessage);
      setError(errorMessage);
      
      isReverting.current = true;
      
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : { ...page, isAddedToPrompt: !shouldAdd }
                ),
              }
        )
      );
      
      setTimeout(() => {
        isReverting.current = false;
      }, 100);
    } finally {
      setIsUpdating(false);
    }
  }, [extractPageMetadata, singlePage.id, singlePage.title, categoryTitle, setCategories]);

  useEffect(() => {
    if (shouldAutoRemoveFromPrompt(singlePage)) {
      console.log("[Auto-remove] Content incomplete:", singlePage.id);
      
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : { ...page, isAddedToPrompt: false }
                ),
              }
        )
      );
      
      syncToBackend(false);
    }
  }, [singlePage, categoryTitle, setCategories, syncToBackend]);

  useEffect(() => {
    if (isReverting.current) {
      console.log("[State change] Skipping - reverting after error");
      return;
    }
    
    if (prevIsAddedToPrompt !== singlePage.isAddedToPrompt) {
      console.log(
        "[State change detected]",
        singlePage.id,
        "isAddedToPrompt:",
        prevIsAddedToPrompt,
        "→",
        singlePage.isAddedToPrompt
      );
      
      syncToBackend(singlePage.isAddedToPrompt);
      setPrevIsAddedToPrompt(singlePage.isAddedToPrompt);
    }
  }, [singlePage.isAddedToPrompt, singlePage.id, prevIsAddedToPrompt, syncToBackend]);

  const handleAddToPromptMode = useCallback(
    (mode: AddToPromptMode) => {
      if (!isInteractive) {
        console.warn("[Mode change blocked] Content not ready");
        toast.warning("Content Not Ready", {
          description: "Please complete the page content before adding to system instructions",
          duration: 3000,
        });
        return;
      }
      
      const newIsAddedToPrompt = mode === "AddToPromptOn";
      
      console.log(
        "[Mode change]",
        singlePage.id,
        "mode:",
        mode,
        "isAddedToPrompt:",
        newIsAddedToPrompt
      );
      
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title !== categoryTitle
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== singlePage.id
                    ? page
                    : { ...page, isAddedToPrompt: newIsAddedToPrompt }
                ),
              }
        )
      );
    },
    [singlePage.id, categoryTitle, setCategories, isInteractive]
  );

  return {
    addToPromptState,
    addToPromptMode,
    isInteractive,
    isUpdating,
    error,
    handleAddToPromptMode,
  };
}
