// @/app/@right/(_service)/(_components)/hero-image.tsx
// Server component for optimized hero image rendering
// Comments in English: Renders hero image with Next.js Image optimization,
// ensuring optimal LCP (Largest Contentful Paint) performance.

import React from "react";
import Image from "next/image";

// ============================================
// TYPES & INTERFACES
// ============================================

/**
 * Hero image data structure
 */
export interface PageImage {
    /** Image URL (can be external or internal) */
    href: string;
    /** Alt text for accessibility and SEO */
    alt?: string;
}

export interface HeroImageProps {
    /** Hero image data */
    image?: PageImage;
    /** Optional custom fallback image path */
    fallbackSrc?: string;
}

// ============================================
// CONFIGURATION
// ============================================

/** Default fallback image when no hero provided */
const DEFAULT_FALLBACK = "/_static/illustrations/usautopro1.jpg";

/** Default alt text when none provided */
const DEFAULT_ALT = "Page hero image";

/** Image dimensions for optimization */
const IMAGE_DIMENSIONS = {
    width: 1200,
    height: 630,
} as const;

/** Responsive sizes for different breakpoints */
const RESPONSIVE_SIZES = "(max-width: 768px) 770px, 1000px";

// ============================================
// HERO IMAGE COMPONENT
// ============================================

/**
 * HeroImage - Server component for optimized hero image
 * 
 * Features:
 * - Next.js Image optimization (automatic WebP/AVIF)
 * - Priority loading for LCP optimization
 * - Blur placeholder in production
 * - Responsive sizing
 * - Proper aspect ratio (1200x630 - OG image standard)
 * - Fallback image support
 * - Accessible alt text
 * 
 * @param image - Hero image data (optional)
 * @param fallbackSrc - Custom fallback image path
 * @returns Optimized hero image
 */
export function HeroImage({ image, fallbackSrc }: HeroImageProps) {
    // Determine image source (use provided or fallback)
    const imageSrc = image?.href || fallbackSrc || DEFAULT_FALLBACK;

    // Determine alt text (use provided or default)
    const imageAlt = image?.alt || DEFAULT_ALT;

    // Determine if we should use blur placeholder
    const shouldBlur = process.env.NODE_ENV === 'production';

    return (
        <div className="hero-image-container mb-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg 2xl:rounded-t-xl 2xl:rounded-b-none">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={IMAGE_DIMENSIONS.width}
                    height={IMAGE_DIMENSIONS.height}
                    priority
                    placeholder={shouldBlur ? 'blur' : 'empty'}
                    blurDataURL={shouldBlur ? generateBlurDataURL() : undefined}
                    sizes={RESPONSIVE_SIZES}
                    className="aspect-[1200/630] border-b object-cover md:rounded-t-xl"
                    quality={90}
                />
            </div>
        </div>
    );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a simple blur data URL for placeholder
 * Uses a tiny 1x1 pixel base64 encoded image
 */
function generateBlurDataURL(): string {
    // Simple gray placeholder
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
}

// ============================================
// VARIANT COMPONENTS
// ============================================

/**
 * HeroImageWithCaption - Hero with optional caption
 */
export function HeroImageWithCaption({
    image,
    caption,
    fallbackSrc,
}: HeroImageProps & { caption?: string }) {
    const imageSrc = image?.href || fallbackSrc || DEFAULT_FALLBACK;
    const imageAlt = image?.alt || DEFAULT_ALT;
    const shouldBlur = process.env.NODE_ENV === 'production';

    return (
        <figure className="hero-image-container mb-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg 2xl:rounded-t-xl 2xl:rounded-b-none">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={IMAGE_DIMENSIONS.width}
                    height={IMAGE_DIMENSIONS.height}
                    priority
                    placeholder={shouldBlur ? 'blur' : 'empty'}
                    blurDataURL={shouldBlur ? generateBlurDataURL() : undefined}
                    sizes={RESPONSIVE_SIZES}
                    className="aspect-[1200/630] border-b object-cover md:rounded-t-xl"
                    quality={90}
                />
            </div>
            {caption && (
                <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/**
 * CompactHeroImage - Smaller hero for secondary pages
 */
export function CompactHeroImage({ image, fallbackSrc }: HeroImageProps) {
    const imageSrc = image?.href || fallbackSrc || DEFAULT_FALLBACK;
    const imageAlt = image?.alt || DEFAULT_ALT;
    const shouldBlur = process.env.NODE_ENV === 'production';

    return (
        <div className="compact-hero-image mb-6">
            <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={IMAGE_DIMENSIONS.width}
                    height={IMAGE_DIMENSIONS.height}
                    priority
                    placeholder={shouldBlur ? 'blur' : 'empty'}
                    blurDataURL={shouldBlur ? generateBlurDataURL() : undefined}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="aspect-[1200/630] object-cover"
                    quality={85}
                />
            </div>
        </div>
    );
}

/**
 * FullWidthHeroImage - Hero that spans full container width
 */
export function FullWidthHeroImage({ image, fallbackSrc }: HeroImageProps) {
    const imageSrc = image?.href || fallbackSrc || DEFAULT_FALLBACK;
    const imageAlt = image?.alt || DEFAULT_ALT;
    const shouldBlur = process.env.NODE_ENV === 'production';

    return (
        <div className="full-width-hero -mx-6 md:-mx-8 mb-8">
            <div className="relative w-full h-80 md:h-96 lg:h-[32rem] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={IMAGE_DIMENSIONS.width}
                    height={IMAGE_DIMENSIONS.height}
                    priority
                    placeholder={shouldBlur ? 'blur' : 'empty'}
                    blurDataURL={shouldBlur ? generateBlurDataURL() : undefined}
                    sizes="100vw"
                    className="aspect-[1200/630] object-cover w-full"
                    quality={90}
                />
            </div>
        </div>
    );
}

/**
 * HeroImageWithOverlay - Hero with gradient overlay for text
 */
export function HeroImageWithOverlay({
    image,
    fallbackSrc,
    overlayIntensity = "medium",
}: HeroImageProps & { overlayIntensity?: "light" | "medium" | "dark" }) {
    const imageSrc = image?.href || fallbackSrc || DEFAULT_FALLBACK;
    const imageAlt = image?.alt || DEFAULT_ALT;
    const shouldBlur = process.env.NODE_ENV === 'production';

    const overlayClasses = {
        light: "bg-gradient-to-t from-black/20 to-transparent",
        medium: "bg-gradient-to-t from-black/40 to-transparent",
        dark: "bg-gradient-to-t from-black/60 to-transparent",
    };

    return (
        <div className="hero-image-with-overlay relative mb-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg 2xl:rounded-t-xl 2xl:rounded-b-none">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={IMAGE_DIMENSIONS.width}
                    height={IMAGE_DIMENSIONS.height}
                    priority
                    placeholder={shouldBlur ? 'blur' : 'empty'}
                    blurDataURL={shouldBlur ? generateBlurDataURL() : undefined}
                    sizes={RESPONSIVE_SIZES}
                    className="aspect-[1200/630] border-b object-cover md:rounded-t-xl"
                    quality={90}
                />
                <div
                    className={`absolute inset-0 ${overlayClasses[overlayIntensity]}`}
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default HeroImage;
