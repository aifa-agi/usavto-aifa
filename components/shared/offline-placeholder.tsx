// @/components/shared/offline-placeholder.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getErrorIllustration } from "@/config/appConfig";
import { WifiOff } from "lucide-react";

/**
 * Comments in English: SVG icon component for cloud with slash (offline indicator)
 */
const CloudSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 mr-2 text-muted-foreground"
  >
    <path d="M2 2l20 20" />
    <path d="M5.48 5.48A8.03 8.03 0 0 0 4 12a8 8 0 0 0 14.3 4.3" />
    <path d="M12 12a8 8 0 0 1 7.7-4.3" />
    <path d="M20 16.5A4.5 4.5 0 0 0 15.5 12" />
  </svg>
);

/**
 * Comments in English: Offline placeholder component with theme-aware illustration
 * Uses error500-dark.svg and error500-light.svg from appConfig
 * Displays when application loses network connection
 * 
 * ✅ ИСПРАВЛЕНИЕ: Uses safe rendering to prevent empty src errors
 * 
 * TODO: Add translation support via useTranslation() hook
 * Replace hardcoded text with t('offlineMessage')
 */
export function OfflinePlaceholder() {




  // TODO: Replace with translation function
  // const { t } = useTranslation();
  // const offlineMessage = t('offlineMessage');
  const offlineMessage = "You're offline";
  const offlineDescription = "Please check your internet connection and try again.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="text-center max-w-md">


        {/* Offline message with icon */}
        <div className="flex items-center justify-center mb-4">
          <WifiOff />
          <p className="text-2xl font-semibold">{offlineMessage}</p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-lg mb-8">
          {offlineDescription}
        </p>

        {/* Retry button (optional) */}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
