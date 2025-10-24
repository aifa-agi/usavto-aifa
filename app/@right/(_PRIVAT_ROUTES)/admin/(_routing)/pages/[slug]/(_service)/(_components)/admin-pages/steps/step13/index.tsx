// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/step13-main.tsx

"use client";

/**
 * Step13Main - Simplified version:
 * Understanding of the task (step-by-step):
 * 1) Keep header content as is (Step13HeaderCard)
 * 2) Remove Status Card (Step13StatusCard) - redundant
 * 3) Remove Reports Card (Step13ReportsCard) - redundant
 * 4) Remove Cleanup Card (Step13CleanupCard) - functionality moved to deploy button
 * 5) Integrate cleanup logic into Deploy Card button
 * 6) Show progress bar during cleanup, then redirect to admin/vercel-deploy
 * 7) Apply custom button styles: bg-orange-500 hover:bg-orange-600 text-white animate-pulse-strong shadow-md max-w-[240px] truncate
 */

import * as React from "react";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Step13Props } from "./(_types)/step13-types";

// Import utilities
import { findPageBySlug } from "../../../../(_utils)/page-helpers";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { PageNotFound } from "../../../page-not-found";

// Import components
import { Step13HeaderCard } from "./(_components)/step13-header-card";
import { Step13DeployWithCleanupCard } from "./(_components)/step13-deploy-with-cleanup-card";

// Import constants
import { STEP13_IDS } from "./(_constants)/step13-ids";
import { STEP13_TEXTS } from "./(_constants)/step13-texts";

/**
 * Main Step 13 Component - Simplified Version
 */
export function Step13Main({ slug }: Step13Props) {
  // CRITICAL: ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { categories, loading, initialized } = useNavigationMenu();
  const { data: session } = useSession();

  // Memoized values (hooks)
  const role: UserType = React.useMemo(() => {
    return session?.user?.type || "guest";
  }, [session?.user?.type]);

  // Find page by slug - memoized
  const searchResult = React.useMemo(() => {
    if (loading || !initialized || !categories) return null;
    return findPageBySlug(categories, slug);
  }, [categories, slug, loading, initialized]);

  // Normalize page data structure - memoized
  const pageData: PageData | null = React.useMemo(() => {
    if (!searchResult) return null;

    if (typeof searchResult === "object" && "page" in searchResult) {
      return (searchResult as any).page;
    }
    return searchResult;
  }, [searchResult]);

  // Calculate total pages count - memoized
  const totalPagesCount = React.useMemo(() => {
    if (!categories) return 0;
    return categories.reduce((total, category) => {
      return total + (category.pages?.length || 0);
    }, 0);
  }, [categories]);

  // NOW SAFE TO DO CONDITIONAL RETURNS (after all hooks)

  // Loading state - show spinner while navigation data loads
  if (loading || !initialized) {
    return (
      <div
        className="flex items-center justify-center py-12"
        role="status"
        aria-label="Loading page data"
      >
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading page data...</span>
      </div>
    );
  }

  // Page not found
  if (!searchResult) {
    return <PageNotFound slug={slug} />;
  }

  // Main render (pageData guaranteed to exist here)
  return (
    <div
      className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6"
      id={STEP13_IDS.containers.main}
      role="main"
      aria-labelledby="step13-main-title"
    >
      {/* Accessible main title (screen reader only) */}
      <h1 id="step13-main-title" className="sr-only">
        {STEP13_TEXTS.header.title} - {pageData?.title || "Untitled Page"}
      </h1>

      {/* Header Card - Full Width */}
      <section aria-labelledby="step13-header">
        <Step13HeaderCard pageData={pageData} />
      </section>

      {/* Deploy with Cleanup Card - Centered */}
      <section aria-labelledby="step13-deploy-cleanup" className="flex justify-center">
        <div className="w-full max-w-2xl">
          <Step13DeployWithCleanupCard
            pageData={pageData}
            slug={slug}
            totalPagesCount={totalPagesCount}
          />
        </div>
      </section>

      {/* Footer Information */}
      <footer className="mt-8 p-4 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Step 13 Complete
            </p>
            <p className="text-xs text-muted-foreground">
              Final step completed successfully. Click "Go to Deploy" to clean temporary data and proceed to deployment.
            </p>
          </div>
        </div>
      </footer>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-3 text-xs bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800/30">
          <summary className="cursor-pointer font-medium text-yellow-800 dark:text-yellow-300">
            Development Debug Info
          </summary>
          <div className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-400">
            <p><strong>Slug:</strong> {slug}</p>
            <p><strong>Page ID:</strong> {pageData?.id || "N/A"}</p>
            <p><strong>Total Pages:</strong> {totalPagesCount}</p>
            <p><strong>User Role:</strong> {role}</p>
            <p><strong>Is Preview Completed:</strong> {pageData?.isPreviewComplited ? "Yes" : "No"}</p>
          </div>
        </details>
      )}
    </div>
  );
}

// Export aliases for backward compatibility
export { Step13Main as AdminPageStep13 };
export { Step13Main as Step13Root };
export { Step13Main as FinalStep };

// Default export
export default Step13Main;
