// @/app/@right/(_service)/(_components)/mobile-drawer-wrapper.tsx
"use client";

import { useAutoOpenDrawer } from "@/hooks/use-auto-open-drawer";
import { ReactNode } from "react";

/**
 * Wrapper component that adds auto-open functionality to mobile drawer
 * Opens drawer when user clicks links with anchors from chat
 */
export function MobileDrawerWrapper({ children }: { children: ReactNode }) {
    useAutoOpenDrawer();
    return <>{children}</>;
}
