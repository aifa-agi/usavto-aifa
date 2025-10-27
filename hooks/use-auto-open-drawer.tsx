// @/app/@right/(_service)/hooks/use-auto-open-drawer.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRightSidebar } from "@/contexts/right-sidebar-context";

/**
 * Hook that automatically opens the drawer when navigating to URLs with hash anchors
 * Handles both: pathname changes with hash and hash-only changes
 */
export function useAutoOpenDrawer() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { openDrawer } = useRightSidebar();

    const prevUrlRef = useRef<string>("");
    const isInitializedRef = useRef(false);

    // Handle pathname changes (main navigation)
    useEffect(() => {
        const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
        const fullUrl = currentUrl + currentHash;

        // First run - just initialize
        if (!isInitializedRef.current) {
            prevUrlRef.current = fullUrl;
            isInitializedRef.current = true;

            // Open drawer if initial URL has hash
            if (currentHash && currentHash.length > 1) {
                openDrawer();
            }
            return;
        }

        // Skip if URL hasn't changed
        if (prevUrlRef.current === fullUrl) {
            return;
        }

        // Open drawer if new URL contains hash
        if (currentHash && currentHash.length > 1) {
            openDrawer();
        }

        prevUrlRef.current = fullUrl;

    }, [pathname, searchParams, openDrawer]);

    // Handle hash-only changes (same page anchor navigation)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;

            if (hash && hash.length > 1) {
                openDrawer();
            }
        };

        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [openDrawer]);
}
