// @/app/(_CHAT)/(chat)/(_routing)/not-found.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "../(_service)/(_libs)/translation";
import { getErrorIllustration } from "@/config/appConfig";

/**
 * Comments in English: Chat-specific 404 Not Found page with theme-aware illustration
 * Uses notFound-dark.svg and notFound-light.svg from appConfig
 * ✅ ИСПРАВЛЕНИЕ: Client component with safe rendering to prevent empty src errors
 */
export default function NotFound() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme (default to dark on server)
  const currentTheme = mounted ? (resolvedTheme as "dark" | "light") || "dark" : "dark";

  // Get theme-specific 404 illustration
  const illustrationPath = getErrorIllustration("404", currentTheme);

  // ✅ Validate path before rendering
  const illustrationSrc = illustrationPath &&
    typeof illustrationPath === 'string' &&
    illustrationPath.length > 0
    ? illustrationPath
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* 404 Heading */}
      <h1 className="text-6xl font-bold">404</h1>

      {/* Theme-aware illustration */}
      {illustrationSrc && (
        <Image
          src={illustrationSrc}
          alt={t("Page not found illustration")}
          width={400}
          height={400}
          className="pointer-events-none mb-5 mt-6"
          priority
        />
      )}

      {/* Error message with link to home */}
      <p className="text-balance px-4 text-center text-2xl font-medium">
        {t("The page was not found. Go back to the main page.")}{" "}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
        >
          {t("Home page")}
        </Link>
      </p>
    </div>
  );
}
