// @/app/@right/(_service)/(_context)/nav-bar-provider.tsx

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
 * Includes source tracking and rate limit awareness
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
 * Context interface with source and rate limit tracking
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
  const categoriesRef = useRef<MenuCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [lastOperationResult, setLastOperationResult] =
    useState<PersistMenuResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [dataSource, setDataSource] = useState<"Local FileSystem" | "GitHub API" | undefined>();
  const [lastFetchResult, setLastFetchResult] = useState<FetchMenuResponse | undefined>();

  // Sync categoriesRef with categories state changes
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  const dirty = !isCategoriesEqual(categories, serverCategoriesRef.current);

  /**
   * Refresh categories from server with optional silent mode
   * Shows rate limit information for GitHub API usage
   * 
   * @param options.silent - If true, suppresses success toast (used for initial load)
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

        // Show success toast only if not silent
        if (!silent && result.source) {
          if (result.source === "GitHub API" && result.rateLimitInfo) {
            // GitHub API with rate limit info
            const { remaining, total, percentUsed, willResetIn } = result.rateLimitInfo;

            const isLowRemaining = percentUsed >= 70;

            console.log(`✅ Menu loaded from GitHub API`, {
              remaining,
              total,
              percentUsed,
              willResetIn,
            });

            toast.success(
              "Menu loaded from GitHub API",
              {
                description: (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>API Usage:</span>
                      <span className="font-mono">{remaining}/{total}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rate limit resets {willResetIn}
                    </div>
                    {isLowRemaining && (
                      <div className="text-xs text-orange-500 mt-1">
                        ⚠️ High usage ({percentUsed}%). Consider reducing refresh frequency.
                      </div>
                    )}
                  </div>
                ),
                duration: 5000,
              }
            );
          } else if (result.source === "Local FileSystem") {
            // Local filesystem - fast and no limits
            console.log(`✅ Menu loaded from Local FileSystem`);
            toast.success(
              "Menu loaded from cache",
              {
                description: "Fast delivery. No API limits consumed.",
                duration: 3000,
              }
            );
          }
        } else if (result.source) {
          // Silent mode - log only
          console.log(`[Silent] Menu loaded from ${result.source}`);
        }
      } else {
        // Error case - always show toast (ignore silent flag)
        console.error("Failed to refresh categories:", {
          error: result.error,
          source: result.source,
          environment: result.environment,
          rateLimitInfo: result.rateLimitInfo,
        });

        let errorMessage = result.source
          ? `Failed to load from ${result.source}: ${result.error}`
          : `Failed to load menu: ${result.error}`;

        // Add rate limit hint if available
        let description: string | undefined;
        if (result.rateLimitInfo) {
          const { willResetIn } = result.rateLimitInfo;
          description = `Rate limit will reset ${willResetIn}. Please try again later.`;
        }

        toast.error(errorMessage, description ? { description } : undefined);
      }
    } catch (error) {
      console.error("Unexpected error in refreshCategories:", error);
      toast.error("Failed to load menu categories");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  /**
   * Update categories with categoriesRef to avoid stale closure
   * Shows toast notifications for all update operations
   */
  const updateCategories = useCallback(async (): Promise<OperationError | null> => {
    setLoading(true);

    try {
      // Use ref to always access latest state
      const currentCategories = categoriesRef.current;

      console.log("[updateCategories] Persisting categories from ref:", {
        categoriesCount: currentCategories.length,
        pagesCount: currentCategories.reduce((sum, cat) => sum + (cat.pages?.length || 0), 0),
        timestamp: new Date().toISOString(),
      });

      const result = await persistMenuCategories(currentCategories);
      setLastOperationResult(result);

      if (isPersistSuccess(result)) {
        // Update serverRef with the same data we just persisted
        serverCategoriesRef.current = JSON.parse(JSON.stringify(currentCategories));
        setRetryCount(0);

        const userMessage = getUserFriendlyMessage(result);
        toast.success(userMessage);

        console.log("[updateCategories] Successfully persisted to server");

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
  }, [retryCount, dataSource]);

  /**
   * Reset categories with explicit user action (shows toast)
   */
  const resetCategories = useCallback(async () => {
    await refreshCategories({ silent: false });
  }, [refreshCategories]);

  /**
   * Initial load on mount (silent to avoid toast spam)
   */
  useEffect(() => {
    refreshCategories({ silent: true });
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
 * Enhanced hook with better error handling and rate limit awareness
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
   * Shows detailed error messages with source and rate limit info
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
        toast.error(errorMsg, {
          description: "GitHub API issue. Try again in 1-2 hours if rate limit exceeded.",
        });
      } else if (error.isNetworkError) {
        toast.error(
          errorMsg,
          {
            description: error.canRetry ? "You can try again." : "Please check your connection.",
          }
        );
      } else {
        toast.error(errorMsg);
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
   */
  const handleRetry = useCallback(async () => {
    if (lastOperationResult && shouldRetry(lastOperationResult)) {
      return await handleUpdate();
    }
    toast.warning("Cannot retry: operation not retryable");
    return false;
  }, [handleUpdate, lastOperationResult]);

  /**
   * Manual refresh with toast
   */
  const handleManualRefresh = useCallback(async () => {
    await refreshCategories({ silent: false });
  }, [refreshCategories]);

  const canRetry = lastOperationResult
    ? shouldRetry(lastOperationResult)
    : false;

  return {
    handleUpdate,
    handleRetry,
    handleManualRefresh,
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
