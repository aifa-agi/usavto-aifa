// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/admin-page-info/(_service)/(_components)/page-images-section.tsx

/**
 * Page Images Section Component with GitHub Fallback
 * 
 * Purpose:
 * - Display all images associated with a page
 * - Smart image loading with retry and GitHub fallback for production
 * - Grid layout with responsive columns
 * - Image preview with alt text display
 * - Placeholder for images without href
 * - Prepared for future enhancements (edit, delete, upload, reorder)
 * 
 * Logic:
 * 1. Try to load image from original path (local in dev, deployed in prod)
 * 2. On error: retry after 1 second with cache busting
 * 3. If retry fails: fallback to GitHub raw URL (for production)
 * 
 * Props:
 * - images: PageImages[] - Array of image objects from page data
 * - canEdit: boolean - Whether user has edit permissions (for future features)
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Image data structure from PageData
 */
export interface PageImage {
    id?: string;
    href?: string | null;
    alt?: string | null;
}

export interface PageImagesSectionProps {
    /** Array of images associated with the page */
    images?: PageImage[];
    /** Whether user can edit images (for future edit/delete features) */
    canEdit?: boolean;
    /** Optional additional CSS classes */
    className?: string;
}

/**
 * Get GitHub raw URL for image fallback in production
 * Uses NEXT_PUBLIC_GITHUB_REPO from environment variables
 */
function getGitHubRawUrl(relativePath: string): string | null {
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

    if (!GITHUB_REPO) {
        console.warn("[page-images] NEXT_PUBLIC_GITHUB_REPO not configured");
        console.warn(
            "[page-images] Add to .env: NEXT_PUBLIC_GITHUB_REPO=owner/repo-name"
        );
        return null;
    }

    const cleanPath = relativePath.startsWith("/")
        ? relativePath.slice(1)
        : relativePath;

    return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${cleanPath}`;
}

/**
 * Component for displaying page images in a grid layout
 * Future enhancements: upload, edit, delete, reorder, set primary
 */
export function PageImagesSection({
    images,
    canEdit = false,
    className,
}: PageImagesSectionProps) {
    // Don't render if no images exist
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="size-5" />
                    Associated Images
                    {/* Future: Add upload button here when edit mode is enabled */}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    {images.length} {images.length === 1 ? "image" : "images"} associated
                    with this page
                </p>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <ImageCard
                            key={image.id || `image-${index}`}
                            image={image}
                            index={index}
                            canEdit={canEdit}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Individual image card component with smart loading and fallback
 */
interface ImageCardProps {
    image: PageImage;
    index: number;
    canEdit: boolean;
}

function ImageCard({ image, index, canEdit }: ImageCardProps) {
    const hasImage = image.href && image.href.trim().length > 0;
    const altText = image.alt || `Image ${index + 1}`;

    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [currentSrc, setCurrentSrc] = React.useState<string | undefined>(
        image.href || undefined
    );
    const [fallbackAttempted, setFallbackAttempted] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);
    const retryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Reset states when image href changes
    React.useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
        setCurrentSrc(image.href || undefined);
        setFallbackAttempted(false);
        setRetryCount(0);

        // Clear any pending retry
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
        }
    }, [image.href]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Handle image load error with retry and GitHub fallback
     */
    const handleImageError = () => {
        console.log("[page-images] Image load error for:", currentSrc);
        console.log("[page-images] Retry count:", retryCount);
        console.log("[page-images] Fallback attempted:", fallbackAttempted);

        // First error - try retry after 1 second for relative paths
        if (retryCount === 0 && image.href && image.href.startsWith("/app-images/")) {
            console.log("[page-images] Scheduling retry in 1 second...");
            setRetryCount(1);

            retryTimeoutRef.current = setTimeout(() => {
                console.log("[page-images] Retrying original URL:", image.href);
                // Add timestamp for cache busting
                setCurrentSrc(`${image.href}?t=${Date.now()}`);
                setImageError(false);
            }, 1000);

            return;
        }

        // Retry failed - try GitHub fallback
        if (
            retryCount > 0 &&
            !fallbackAttempted &&
            image.href &&
            image.href.startsWith("/app-images/")
        ) {
            const githubUrl = getGitHubRawUrl(image.href);

            if (githubUrl) {
                console.log("[page-images] Attempting GitHub fallback:", githubUrl);
                setCurrentSrc(githubUrl);
                setFallbackAttempted(true);
                setImageError(false);
                return;
            }
        }

        // All attempts failed
        console.error("[page-images] All attempts failed for:", image.href);
        setImageError(true);
        setImageLoaded(false);
    };

    /**
     * Handle successful image load
     */
    const handleImageLoad = () => {
        console.log("[page-images] Image loaded successfully:", currentSrc);
        setImageLoaded(true);
        setImageError(false);
    };

    return (
        <div
            className={cn(
                "group relative border border-border rounded-lg p-3 bg-card",
                "transition-all duration-200",
                canEdit && "hover:border-primary hover:shadow-md cursor-pointer"
            )}
        >
            {/* Image Container */}
            <div className="relative w-full h-32 rounded-md overflow-hidden mb-3 bg-muted">
                {hasImage && !imageError ? (
                    <>
                        {/* Image element */}
                        <img
                            src={currentSrc}
                            alt={altText}
                            className={cn(
                                "w-full h-full object-cover transition-opacity duration-200",
                                imageLoaded ? "opacity-100" : "opacity-0"
                            )}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            crossOrigin="anonymous"
                        />

                        {/* Loading spinner */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {/* GitHub fallback indicator */}
                        {fallbackAttempted && imageLoaded && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1 py-0.5 rounded">
                                GH
                            </div>
                        )}

                        {/* Retry indicator */}
                        {retryCount > 0 && !fallbackAttempted && !imageLoaded && (
                            <div className="absolute bottom-1 left-1 bg-yellow-500 text-white text-[8px] px-1 py-0.5 rounded">
                                R{retryCount}
                            </div>
                        )}
                    </>
                ) : imageError ? (
                    /* Error state */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-950/20">
                        <AlertCircle className="size-6 text-red-500 mb-1" />
                        <span className="text-[10px] text-red-600 dark:text-red-400">
                            Failed to load
                        </span>
                    </div>
                ) : (
                    /* No image placeholder */
                    <div className="w-full h-full flex items-center justify-center">
                        <FileText className="size-8 text-muted-foreground" />
                    </div>
                )}

                {/* Future: Overlay with edit/delete buttons on hover */}
                {canEdit && hasImage && imageLoaded && (
                    <div
                        className={cn(
                            "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                            "transition-opacity duration-200",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {/* Placeholder for future action buttons */}
                        {/* <Button size="sm" variant="secondary">Edit</Button> */}
                        {/* <Button size="sm" variant="destructive">Delete</Button> */}
                    </div>
                )}
            </div>

            {/* Alt Text / Description */}
            <p className="text-xs text-muted-foreground break-words line-clamp-2">
                {altText}
            </p>

            {/* Future: Image metadata (size, format, upload date, etc.) */}
        </div>
    );
}
