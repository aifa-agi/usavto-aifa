// app/(_service)/contexts/admin-operations-hook.ts
"use client";

/**
 * Admin operations hook that relies on AdminNavigationMenuProvider.
 * Provides handleUpdate/handleRetry and exposes last error summary.
 */

import { useCallback } from "react";
import { toast } from "sonner";
import { useAdminNavigationMenu } from "./admin-nav-bar-provider";
import {
  isPersistSuccess,
  shouldRetry,
  isGitHubError,
  isNetworkError,
  getUserFriendlyMessage,
} from "../(_libs)/persist-menu";

export function useAdminMenuOperations() {
  const {
    updateCategories,
    refreshCategories,
    loading,
    dirty,
    lastOperationResult,
    retryCount,
  } = useAdminNavigationMenu();

  const handleUpdate = useCallback(async () => {
    const error = await updateCategories();
    if (error) {
      if (error.isGitHubError) toast.error(error.userMessage);
      else if (error.isNetworkError)
        toast.error(`${error.userMessage}${error.canRetry ? " You can try again." : ""}`);
      else toast.error(error.userMessage);
      return false;
    }
    // Optional: ensure reading fresh state after persist
    await refreshCategories();
    return true;
  }, [updateCategories, refreshCategories]);

  const handleRetry = useCallback(async () => {
    if (lastOperationResult && !isPersistSuccess(lastOperationResult) && shouldRetry(lastOperationResult)) {
      return await handleUpdate();
    }
    return false;
  }, [handleUpdate, lastOperationResult]);

  const canRetry = lastOperationResult ? shouldRetry(lastOperationResult) : false;

  return {
    handleUpdate,
    handleRetry,
    canRetry,
    loading,
    dirty,
    retryCount,
    lastError:
      lastOperationResult && !isPersistSuccess(lastOperationResult)
        ? {
            status: lastOperationResult.status,
            message: getUserFriendlyMessage(lastOperationResult),
            canRetry: shouldRetry(lastOperationResult),
          }
        : null,
  };
}
