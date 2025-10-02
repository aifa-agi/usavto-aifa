// @/app/@right/(_service)/(_context)/admin-nav-bar-provider.tsx
"use client";

/**
 * AdminNavigationMenuProvider
 *
 * Purpose:
 * - Admin-only data source for navigation menu categories.
 * - Reads categories from the server route /api/menu/read (FS in dev, GitHub in prod).
 * - Persists categories via persistMenuCategories (server route that commits to GitHub).
 *
 * Why separate from the public provider:
 * - Public UI must not touch GitHub and can rely on static/FS data.
 * - Admin UI needs fresh, authoritative data and write capabilities.
 *
 * Notes:
 * - All comments are in English per requirements.
 * - No Redis. Each refresh reads fresh data.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import {
    persistMenuCategories,
    isPersistSuccess,
    isGitHubError,
    isNetworkError,
    shouldRetry,
    getUserFriendlyMessage,
    type PersistMenuResult,
} from "../(_libs)/persist-menu";
import type { MenuCategory } from "../(_types)/menu-types";
import { OperationStatus } from "../(_types)/api-response-types";

// Server read response shape (mirrors /api/menu/read)
interface ReadOk {
    success: true;
    message: string;
    categories: MenuCategory[];
    source?: "Local FileSystem" | "GitHub API";
    environment?: string;
}
interface ReadFail {
    success: false;
    message: string;
    source?: "Local FileSystem" | "GitHub API";
    environment?: string;
}
type ReadResponse = ReadOk | ReadFail;

async function readCategoriesFromServer(): Promise<ReadResponse> {
    try {
        const res = await fetch("/api/menu/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // no filePath override by default
            cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: String(data?.message || `HTTP ${res.status}`),
                source: data?.source,
                environment: data?.environment,
            };
        }
        if (data?.success) {
            return {
                success: true,
                message: String(data?.message || "OK"),
                categories: Array.isArray(data?.categories) ? data.categories : [],
                source: data?.source,
                environment: data?.environment,
            };
        }
        return {
            success: false,
            message: String(data?.message || "Unknown server error"),
            source: data?.source,
            environment: data?.environment,
        };
    } catch (e: any) {
        return {
            success: false,
            message: e instanceof Error ? e.message : "Network error",
        };
    }
}

export interface OperationError {
    status: OperationStatus;
    message: string;
    canRetry: boolean;
    isNetworkError: boolean;
    isGitHubError: boolean;
    userMessage: string;
    environment?: "development" | "production";
}

interface AdminNavigationMenuContextValue {
    categories: MenuCategory[];
    setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
    serverCategoriesRef: React.MutableRefObject<MenuCategory[]>;
    loading: boolean;
    dirty: boolean;
    initialized: boolean;
    retryCount: number;
    lastOperationResult: PersistMenuResult | null;

    // Actions
    refreshCategories: () => Promise<void>;
    updateCategories: () => Promise<OperationError | null>;
    resetCategories: () => Promise<void>;
}

const AdminNavigationMenuContext = createContext<AdminNavigationMenuContextValue | null>(null);

function deepEqualCategories(a: MenuCategory[], b: MenuCategory[]): boolean {
    // Simple, deterministic deep compare for "dirty" detection
    return JSON.stringify(a) === JSON.stringify(b);
}

export function AdminNavigationMenuProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const serverCategoriesRef = useRef<MenuCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [lastOperationResult, setLastOperationResult] = useState<PersistMenuResult | null>(null);

    const dirty = !deepEqualCategories(categories, serverCategoriesRef.current);

    const refreshCategories = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await readCategoriesFromServer();
            if (resp.success) {
                setCategories(resp.categories);
                serverCategoriesRef.current = JSON.parse(JSON.stringify(resp.categories));
                setLastOperationResult(null);
                setRetryCount(0);
            } else {
                toast.error(`Failed to load categories: ${resp.message}`);
            }
        } catch (e) {
            console.error("Admin refreshCategories error:", e);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    }, []);

    const updateCategories = useCallback(async (): Promise<OperationError | null> => {
        setLoading(true);
        try {
            const result = await persistMenuCategories(categories);
            setLastOperationResult(result);

            if (isPersistSuccess(result)) {
                serverCategoriesRef.current = JSON.parse(JSON.stringify(categories));
                setRetryCount(0);
                toast.success(getUserFriendlyMessage(result));
                // Optional: immediately refresh from source of truth to avoid any drift
                // await refreshCategories();
                return null;
            } else {
                const opError: OperationError = {
                    status: result.status,
                    message: result.message,
                    canRetry: shouldRetry(result),
                    isNetworkError: isNetworkError(result),
                    isGitHubError: isGitHubError(result),
                    userMessage: getUserFriendlyMessage(result),
                    environment: result.environment,
                };
                setRetryCount((v) => v + 1);
                console.warn("Admin updateCategories failed:", { opError, result });
                return opError;
            }
        } catch (unexpected: any) {
            console.error("Admin updateCategories unexpected error:", unexpected);
            const opError: OperationError = {
                status: OperationStatus.UNKNOWN_ERROR,
                message: "Unexpected client-side error",
                canRetry: true,
                isNetworkError: true,
                isGitHubError: false,
                userMessage: "An unexpected error occurred. Please try again.",
                environment: "production",
            };
            setRetryCount((v) => v + 1);
            return opError;
        } finally {
            setLoading(false);
        }
    }, [categories]);

    const resetCategories = useCallback(async () => {
        await refreshCategories();
    }, [refreshCategories]);

    useEffect(() => {
        // Initial fetch on mount
        void refreshCategories();
    }, [refreshCategories]);

    const value = useMemo<AdminNavigationMenuContextValue>(
        () => ({
            categories,
            setCategories,
            serverCategoriesRef,
            loading,
            dirty,
            initialized,
            retryCount,
            lastOperationResult,
            refreshCategories,
            updateCategories,
            resetCategories,
        }),
        [
            categories,
            setCategories,
            loading,
            dirty,
            initialized,
            retryCount,
            lastOperationResult,
            refreshCategories,
            updateCategories,
            resetCategories,
        ]
    );

    return (
        <AdminNavigationMenuContext.Provider value={value}>
            {children}
        </AdminNavigationMenuContext.Provider>
    );
}

export function useAdminNavigationMenu() {
    const ctx = useContext(AdminNavigationMenuContext);
    if (!ctx) {
        throw new Error("useAdminNavigationMenu must be used within AdminNavigationMenuProvider");
    }
    return ctx;
}
