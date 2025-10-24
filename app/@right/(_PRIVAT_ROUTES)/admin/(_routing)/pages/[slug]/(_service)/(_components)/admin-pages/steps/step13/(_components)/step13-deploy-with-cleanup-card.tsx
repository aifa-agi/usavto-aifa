// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step13/(_components)/step13-deploy-with-cleanup-card.tsx

"use client";

/**
 * Step13DeployWithCleanupCard - FIXED VERSION:
 * 
 * Understanding of the issue (step-by-step):
 * 1) Previous version set shouldRedirect=true immediately, but cleanup is async
 * 2) useEffect may trigger before cleanup completes
 * 3) Need to wait for startCleanup() to fully complete before redirect
 * 4) Solution: Use async/await properly and redirect after cleanup finishes
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStep13Cleanup } from "../(_hooks)/use-step13-cleanup";
import { useStep13Status } from "../(_hooks)/use-step13-status";
import { getDeployTimingMessage } from "../(_utils)/step13-helpers";
import { STEP13_TEXTS } from "../(_constants)/step13-texts";
import { STEP13_IDS } from "../(_constants)/step13-ids";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

interface Step13DeployWithCleanupCardProps {
    pageData: PageData | null;
    slug: string;
    totalPagesCount?: number;
}

export function Step13DeployWithCleanupCard({
    pageData,
    slug,
    totalPagesCount,
}: Step13DeployWithCleanupCardProps) {
    const router = useRouter();

    const {
        cleanupProcess,
        isCleanupActive,
        isCleanupCompleted,
        canStartCleanup,
        startCleanup,
        fieldsToClean,
        currentProgress,
    } = useStep13Cleanup({ pageData, slug });

    const { isAlreadyCleaned } = useStep13Status({ pageData });

    // Calculate timing message based on page count
    const timingMessage = React.useMemo(() => {
        return getDeployTimingMessage(totalPagesCount);
    }, [totalPagesCount]);

    // Handle button click - FIXED VERSION with proper async handling
    const handleGoToDeploy = React.useCallback(async () => {
        try {
            // If data is already cleaned, redirect immediately
            if (isAlreadyCleaned || isCleanupCompleted) {
                toast.loading("Redirecting to deployment management...", {
                    id: STEP13_IDS.toasts.deployRedirect,
                });

                // Small delay for UX
                setTimeout(() => {
                    toast.dismiss(STEP13_IDS.toasts.deployRedirect);
                    router.push("/admin/vercel-deploy");
                }, 500);

                return;
            }

            // If data needs cleaning, start cleanup process
            if (canStartCleanup) {
                console.log("🚀 Starting cleanup process before deploy...");

                // Start cleanup and WAIT for it to complete
                await startCleanup();

                console.log("✅ Cleanup completed successfully!");

                // Show success toast
                toast.success("Data cleaned successfully. Redirecting to deploy...", {
                    id: STEP13_IDS.toasts.cleanupSuccess,
                    duration: 2000,
                });

                // Wait a bit for user to see success message, then redirect
                setTimeout(() => {
                    console.log("🎯 Redirecting to /admin/vercel-deploy");
                    toast.dismiss(STEP13_IDS.toasts.cleanupSuccess);
                    router.push("/admin/vercel-deploy");
                }, 1500);
            } else {
                toast.error("No data available for cleanup", {
                    id: STEP13_IDS.toasts.cleanupError,
                });
            }
        } catch (error) {
            console.error("❌ Cleanup error:", error);
            toast.error("Failed to clean data. Please try again.", {
                id: STEP13_IDS.toasts.cleanupError,
            });
        }
    }, [isAlreadyCleaned, isCleanupCompleted, canStartCleanup, startCleanup, router]);

    // Button state
    const buttonText = React.useMemo(() => {
        if (isCleanupActive) return "Cleaning Data...";
        if (isAlreadyCleaned || isCleanupCompleted) return "Go to Deploy";
        return "Go to Deploy";
    }, [isCleanupActive, isAlreadyCleaned, isCleanupCompleted]);

    const isButtonDisabled = isCleanupActive;

    return (
        <div
            className="w-full rounded-md border border-neutral-200 bg-neutral-50/60 p-5 shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/40"
            id={STEP13_IDS.containers.deployCard}
        >
            {/* Header Section */}
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-0.5 text-purple-400">
                    <div
                        className="h-5 w-5 rounded-sm bg-purple-500/30"
                        aria-hidden="true"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        {STEP13_TEXTS.deploy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Clean temporary data and proceed to deployment management.
                    </p>
                </div>
            </div>

            {/* Deploy Information */}
            <div className="mb-4 p-3 rounded-md bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="flex items-start gap-2 mb-2">
                    <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Deployment Timing
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {timingMessage}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Process Overview
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Clean temporary data → GitHub data → Static HTML → Vercel deployment
                        </p>
                    </div>
                </div>
            </div>

            {/* Cleanup Status Info */}
            {!isAlreadyCleaned && !isCleanupCompleted && fieldsToClean > 0 && (
                <div className="mb-4 p-3 rounded-md bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30">
                    <p className="text-xs text-orange-800 dark:text-orange-300">
                        <span className="font-medium">{fieldsToClean}</span> temporary fields will be cleaned before deployment
                    </p>
                </div>
            )}

            {/* Cleanup Animation Section */}
            {isCleanupActive && cleanupProcess.fields.length > 0 && (
                <div
                    className="mb-4 space-y-2"
                    id={STEP13_IDS.elements.cleanupAnimation}
                    aria-live="polite"
                >
                    {cleanupProcess.fields.map((field) => (
                        <div
                            key={field.fieldName}
                            className={`flex items-center gap-2 p-2 rounded-md text-sm transition-all duration-200 ${field.phase === "idle"
                                ? "opacity-30"
                                : field.phase === "appearing"
                                    ? "opacity-60 bg-blue-50 dark:bg-blue-900/20"
                                    : field.phase === "deleting"
                                        ? "opacity-80 bg-orange-50 dark:bg-orange-900/20"
                                        : "opacity-100 bg-emerald-50 dark:bg-emerald-900/20"
                                }`}
                        >
                            {/* Status Icon */}
                            <div className="w-4 h-4 flex items-center justify-center">
                                {field.phase === "idle" && (
                                    <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                )}
                                {field.phase === "appearing" && (
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                )}
                                {field.phase === "deleting" && (
                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-spin" />
                                )}
                                {field.phase === "deleted" && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                )}
                            </div>

                            {/* Field Info */}
                            <div className="flex-1 min-w-0">
                                <span className="text-foreground font-medium truncate">
                                    {field.fieldName}
                                </span>
                            </div>

                            {/* Status Text */}
                            <div className="text-xs text-muted-foreground">
                                {field.phase === "appearing" && STEP13_TEXTS.cleanup.animation.appearing}
                                {field.phase === "deleting" && STEP13_TEXTS.cleanup.animation.deleting}
                                {field.phase === "deleted" && STEP13_TEXTS.cleanup.animation.deleted}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {isCleanupActive && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Cleanup Progress</span>
                        <span>{currentProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 dark:bg-neutral-700">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${currentProgress}%` }}
                            id={STEP13_IDS.elements.cleanupProgress}
                        />
                    </div>
                </div>
            )}

            {/* Action Button - Custom Styles */}
            <div className="flex items-center justify-center">
                <button
                    onClick={handleGoToDeploy}
                    disabled={isButtonDisabled}
                    className={`${isButtonDisabled
                        ? "bg-orange-400 cursor-not-allowed opacity-75"
                        : "bg-orange-500 hover:bg-orange-600 animate-pulse-strong"
                        } text-white shadow-md max-w-[240px] truncate px-6 py-3 rounded-md text-sm font-medium transition-all inline-flex items-center gap-2`}
                    id={STEP13_IDS.elements.deployButton}
                >
                    {isCleanupActive && (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}

                    {!isCleanupActive && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    )}

                    <span>{buttonText}</span>
                </button>
            </div>

            {/* Success State */}
            {(isAlreadyCleaned || isCleanupCompleted) && (
                <div className="mt-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                            All temporary data has been cleaned. Ready for deployment!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
