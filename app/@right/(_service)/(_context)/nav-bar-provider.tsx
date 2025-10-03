// @/app/(_service)/contexts/nav-bar-provider.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  persistMenuCategories,
  isPersistSuccess,
  isGitHubError,
  isNetworkError,
  shouldRetry,
  getUserFriendlyMessage,
  type PersistMenuResult,
} from "../(_libs)/persist-menu";
import { toast } from "sonner";
import { OperationStatus } from "../(_types)/api-response-types";
import { fetchMenuCategories, type FetchMenuResponse } from "../(_libs)/fetch-menu";
import { MenuCategory } from "../(_types)/menu-types";

/**
 * Extended error information for better error handling
 * Step 1: Define error structure with source tracking
 */
export interface OperationError {
  status: OperationStatus;
  message: string;
  canRetry: boolean;
  isNetworkError: boolean;
  isGitHubError: boolean;
  userMessage: string;
  environment?: "development" | "production";
  source?: "Local FileSystem" | "GitHub API";
}

/**
 * Context interface with source tracking
 * Step 2: Add silent parameter for controlling toast display
 */
interface NavigationMenuContextProps {
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  resetCategories: () => void;
  serverCategoriesRef: React.MutableRefObject<MenuCategory[]>;
  loading: boolean;
  dirty: boolean;
  updateCategories: () => Promise<OperationError | null>;
  refreshCategories: (options?: { silent?: boolean }) => Promise<void>;
  initialized: boolean;
  lastOperationResult: PersistMenuResult | null;
  retryCount: number;
  dataSource?: "Local FileSystem" | "GitHub API";
  lastFetchResult?: FetchMenuResponse;
}

const NavigationMenuContext = createContext<
  NavigationMenuContextProps | undefined
>(undefined);

function isCategoriesEqual(a: MenuCategory[], b: MenuCategory[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function NavigationMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const serverCategoriesRef = useRef<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [lastOperationResult, setLastOperationResult] =
    useState<PersistMenuResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [dataSource, setDataSource] = useState<"Local FileSystem" | "GitHub API" | undefined>();
  const [lastFetchResult, setLastFetchResult] = useState<FetchMenuResponse | undefined>();

  const dirty = !isCategoriesEqual(categories, serverCategoriesRef.current);

  /**
   * Refresh categories from server with optional silent mode
   * Step 3: Add silent parameter to control toast notifications
   * Step 4: Show success toast only for explicit user actions
   * Step 5: Always show error toasts for user awareness
   */
  const refreshCategories = useCallback(async (options?: { silent?: boolean }) => {
    const { silent = false } = options || {};
    setLoading(true);

    try {
      const result = await fetchMenuCategories();
      setLastFetchResult(result);

      if (result.status === "ok" && result.categories) {
        setCategories(result.categories);
        serverCategoriesRef.current = JSON.parse(
          JSON.stringify(result.categories)
        );
        setDataSource(result.source);
        setLastOperationResult(null);
        setRetryCount(0);

        // Show success toast ONLY if not silent
        if (!silent && result.source) {
          console.log(`✅ Menu loaded from ${result.source}`, result.serverMessage);
          toast.success(`Menu loaded from ${result.source}`);
        } else if (result.source) {
          // Log silently without toast
          console.log(`[Silent] Menu loaded from ${result.source}`);
        }
      } else {
        // ALWAYS show error toasts (ignore silent flag)
        console.error("Failed to refresh categories:", {
          error: result.error,
          source: result.source,
          environment: result.environment,
        });

        const errorMessage = result.source
          ? `Failed to load from ${result.source}: ${result.error}`
          : `Failed to load menu: ${result.error}`;

        toast.error(errorMessage); // ❗ Always show errors
      }
    } catch (error) {
      console.error("Unexpected error in refreshCategories:", error);
      toast.error("Failed to load menu categories"); // ❗ Always show errors
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  /**
   * Update categories with enhanced error tracking
   * Step 6: Show toasts for all update operations
   */
  const updateCategories =
    useCallback(async (): Promise<OperationError | null> => {
      setLoading(true);

      try {
        const result = await persistMenuCategories(categories);
        setLastOperationResult(result);

        if (isPersistSuccess(result)) {
          serverCategoriesRef.current = JSON.parse(JSON.stringify(categories));
          setRetryCount(0);

          const userMessage = getUserFriendlyMessage(result);
          toast.success(userMessage); // ✅ Always show success for updates

          return null;
        } else {
          const operationError: OperationError = {
            status: result.status,
            message: result.message,
            canRetry: shouldRetry(result),
            isNetworkError: isNetworkError(result),
            isGitHubError: isGitHubError(result),
            userMessage: getUserFriendlyMessage(result),
            environment: result.environment,
            source: dataSource,
          };

          setRetryCount((prev) => prev + 1);

          console.error("Failed to update categories:", {
            error: operationError,
            result: result,
            retryAttempt: retryCount + 1,
            dataSource: dataSource,
          });

          return operationError;
        }
      } catch (unexpectedError: any) {
        console.error("Unexpected error in updateCategories:", unexpectedError);

        const operationError: OperationError = {
          status: OperationStatus.UNKNOWN_ERROR,
          message: "Unexpected client-side error",
          canRetry: true,
          isNetworkError: true,
          isGitHubError: false,
          userMessage: "An unexpected error occurred. Please try again.",
          environment: "production",
          source: dataSource,
        };

        setRetryCount((prev) => prev + 1);
        return operationError;
      } finally {
        setLoading(false);
      }
    }, [categories, retryCount, dataSource]);

  /**
   * Reset with explicit user action (show toast)
   * Step 7: Explicit reset shows success toast
   */
  const resetCategories = useCallback(async () => {
    await refreshCategories({ silent: false }); // Show toast on manual reset
  }, [refreshCategories]);

  /**
   * Initial load on mount (silent)
   * Step 8: Suppress toast on initial mount
   */
  useEffect(() => {
    refreshCategories({ silent: true }); // Silent on initial load
  }, [refreshCategories]);

  return (
    <NavigationMenuContext.Provider
      value={{
        categories,
        setCategories,
        resetCategories,
        serverCategoriesRef,
        loading,
        dirty,
        updateCategories,
        refreshCategories,
        initialized,
        lastOperationResult,
        retryCount,
        dataSource,
        lastFetchResult,
      }}
    >
      {children}
    </NavigationMenuContext.Provider>
  );
}

export function useNavigationMenu() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error(
      "useNavigationMenu must be used within a NavigationMenuProvider"
    );
  }
  return context;
}

/**
 * Enhanced hook with better error handling
 * Step 9: All update operations show toasts
 */
export function useMenuOperations() {
  const {
    updateCategories,
    refreshCategories,
    loading,
    dirty,
    lastOperationResult,
    retryCount,
    dataSource,
    lastFetchResult,
  } = useNavigationMenu();

  /**
   * Handle update with toast notifications
   * Step 10: Show error toasts with detailed information
   */
  const handleUpdate = useCallback(async () => {
    const error = await updateCategories();

    if (error) {
      // Enhanced error messages with source
      let errorMsg = error.userMessage;
      if (error.source) {
        errorMsg += ` (Source: ${error.source})`;
      }

      // Show appropriate toast based on error type
      if (error.isGitHubError) {
        toast.error(errorMsg); // ✅ GitHub error toast
      } else if (error.isNetworkError) {
        toast.error(
          `${errorMsg}${error.canRetry ? " You can try again." : ""}`
        ); // ✅ Network error toast
      } else {
        toast.error(errorMsg); // ✅ Generic error toast
      }

      console.warn("Menu update failed:", {
        status: error.status,
        canRetry: error.canRetry,
        retryAttempt: retryCount,
        environment: error.environment,
        source: error.source,
      });

      return false;
    }

    return true;
  }, [updateCategories, retryCount]);

  /**
   * Retry with toast notification
   * Step 11: Retry shows toast on success/failure
   */
  const handleRetry = useCallback(async () => {
    if (lastOperationResult && shouldRetry(lastOperationResult)) {
      return await handleUpdate();
    }
    toast.warning("Cannot retry: operation not retryable"); // ⚠️ Warning toast
    return false;
  }, [handleUpdate, lastOperationResult]);

  /**
   * Manual refresh with toast
   * Step 12: Expose manual refresh that shows toast
   */
  const handleManualRefresh = useCallback(async () => {
    await refreshCategories({ silent: false }); // Show toast on manual action
  }, [refreshCategories]);

  const canRetry = lastOperationResult
    ? shouldRetry(lastOperationResult)
    : false;

  return {
    handleUpdate,
    handleRetry,
    handleManualRefresh, // New method for explicit refresh
    canRetry,
    loading,
    dirty,
    retryCount,
    dataSource,
    lastFetchResult,
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
