// @/hooks/use-auto-open-drawer.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRightSidebar } from "@/contexts/right-sidebar-context";

export function useAutoOpenDrawer() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { openDrawer } = useRightSidebar();

    // Проверка мобильной версии
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const prevUrlRef = useRef<string>("");
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (!isMobile) return;

        const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
        const fullUrl = currentUrl + currentHash;

        if (!isInitializedRef.current) {
            prevUrlRef.current = fullUrl;
            isInitializedRef.current = true;

            if (currentHash && currentHash.length > 1) {
                openDrawer();
            }
            return;
        }

        if (prevUrlRef.current === fullUrl) {
            return;
        }

        if (currentHash && currentHash.length > 1) {
            openDrawer();
        }

        prevUrlRef.current = fullUrl;

    }, [pathname, searchParams, openDrawer, isMobile]);


}
