// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_hooks)/use-app-config-status.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";

interface UseAppConfigStatusReturn {
  config: AppConfigUpdateData | null;
  loading: boolean;
  error: boolean;  // ✅ ИСПРАВЛЕНИЕ: boolean, не string | null
  reload: () => Promise<void>;
}

/**
 * Comments in English: Custom hook for managing appConfig status and reload
 * 
 * Features:
 * - Fetches current appConfig from API
 * - Provides reload functionality with cache invalidation
 * - Handles loading and error states (error is boolean flag)
 * - Adds timestamp-based cache busting for config reload
 * 
 * @returns Object with config data, loading state, error flag, and reload function
 * 
 * @example
 * const { config, loading, error, reload } = useAppConfigStatus();
 */
export function useAppConfigStatus(): UseAppConfigStatusReturn {
  const [config, setConfig] = useState<AppConfigUpdateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);  // ✅ boolean флаг

  /**
   * Comments in English: Check appConfig status from API
   * Adds cache-busting timestamp to ensure fresh data
   */
  const checkAppConfigStatus = useCallback(async (cacheBust?: number) => {
    try {
      console.log("=== Client: Checking appConfig status ===", {
        timestamp: new Date().toISOString(),
        cacheBust,
      });

      // Comments in English: Add cache-busting parameter to force fresh fetch
      const timestamp = cacheBust || Date.now();
      const url = `/api/app-config-update?t=${timestamp}`;

      const res = await fetch(url, {
        // Comments in English: Disable all caching mechanisms
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      console.log("=== Client: appConfig status response ===", {
        status: res.status,
        ok: res.ok,
        url,
      });

      if (!res.ok) {
        console.error("=== Client: Failed to fetch appConfig ===", {
          status: res.status,
          statusText: res.statusText,
        });
        setError(true);  // ✅ Устанавливаем error в true
        setConfig(null);
        return;
      }

      const result = await res.json();

      console.log("=== Client: appConfig data received ===", {
        hasConfig: !!result.config,
        configKeys: result.config ? Object.keys(result.config) : [],
      });

      setConfig(result.config);
      setError(false);  // ✅ Очищаем ошибку при успехе
    } catch (err: any) {
      console.error("=== Client: appConfig status error ===", {
        error: err.message || err,
        stack: err.stack,
      });

      setError(true);  // ✅ Устанавливаем error в true
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Comments in English: Reload configuration with cache invalidation
   * This function is called after successful image uploads to ensure
   * the UI displays the latest image paths and metadata
   * 
   * Process:
   * 1. Set loading state
   * 2. Wait 200ms for filesystem to settle
   * 3. Fetch fresh config with cache-busting timestamp
   * 4. Retry up to 3 times if needed
   */
  const reload = useCallback(async () => {
    console.log("=== Client: Config reload triggered ===", {
      timestamp: new Date().toISOString(),
    });

    setLoading(true);
    setError(false);  // ✅ Очищаем предыдущие ошибки

    try {
      // Comments in English: Wait for filesystem operations to complete
      // This ensures files are fully written before we try to read new paths
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Comments in English: Generate unique cache-busting timestamp
      const cacheBust = Date.now();

      console.log("=== Client: Fetching fresh config ===", {
        cacheBust,
      });

      // Comments in English: Attempt to fetch with retry logic
      let attempts = 0;
      const maxAttempts = 3;
      let lastErrorOccurred = false;

      while (attempts < maxAttempts) {
        attempts++;

        try {
          await checkAppConfigStatus(cacheBust + attempts);
          
          // Comments in English: Check if error flag was set
          // If error is false, consider it success
          if (!error) {
            console.log("=== Client: Config reload successful ===", {
              attempt: attempts,
              cacheBust: cacheBust + attempts,
            });
            return;  // ✅ Успешно - выходим
          }

          lastErrorOccurred = true;
        } catch (err: any) {
          lastErrorOccurred = true;
          console.warn(`=== Client: Config reload attempt ${attempts} failed ===`, {
            error: err.message,
            willRetry: attempts < maxAttempts,
          });

          if (attempts < maxAttempts) {
            // Wait before retry (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, 100 * attempts));
          }
        }
      }

      // Comments in English: All attempts failed
      if (lastErrorOccurred) {
        throw new Error("Failed to reload configuration after retries");
      }
    } catch (err: any) {
      console.error("=== Client: Config reload failed after retries ===", {
        error: err.message || err,
      });

      // ✅ Устанавливаем error в true
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [checkAppConfigStatus, error]);

  /**
   * Comments in English: Initial load on component mount
   */
  useEffect(() => {
    console.log("=== Client: useAppConfigStatus initialized ===");
    checkAppConfigStatus();
  }, [checkAppConfigStatus]);

  return {
    config,
    loading,
    error,  // ✅ Возвращаем boolean
    reload,
  };
}
