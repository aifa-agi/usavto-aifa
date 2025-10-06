// @/lib/construct-metadata.ts
// Comments in English: Dynamic page-level metadata with comprehensive SEO optimization
// JSON-LD structured data is handled directly in page components via <script> tags

import { appConfig, getOgImagePath } from "@/config/appConfig";
import type { Metadata } from "next";

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Comments in English: Author information for JSON-LD Person schema
 * Includes all fields recommended by Google for E-E-A-T
 */
export type AuthorInfo = {
  /** Full name of the author (required by Google) */
  name: string;
  /** Email address of the author */
  email?: string;
  /** Twitter handle (e.g., "@username") */
  twitter?: string;
  /** URL to author's profile page */
  url?: string;
  /** Job title or role */
  jobTitle?: string;
  /** Short biography */
  bio?: string;
  /** Profile image URL */
  image?: string;
  /** Other social media profiles (LinkedIn, GitHub, etc.) */
  sameAs?: string[];
};

/**
 * Comments in English: Arguments for constructMetadata function
 */
type ConstructArgs = {
  /** Page title (defaults to appConfig.name) */
  title?: string;
  /** Page description (defaults to appConfig.description) */
  description?: string;
  /** OG image URL (defaults to appConfig.images.ogImage.path) */
  image?: string;
  /** Page pathname for canonical URL */
  pathname?: string;
  /** Page locale (defaults to appConfig.lang) */
  locale?: string;
  /** Block search engine indexing for this page */
  noIndex?: boolean;
  /** Block search engine following links on this page */
  noFollow?: boolean;
};

// ============================================
// CONSTANTS
// ============================================

/**
 * Comments in English: Default author for main pages
 */
const DEFAULT_AUTHOR: AuthorInfo = {
  name: "Roman Bolshiyanov",
  email: "roman@aifa.dev",
  twitter: "@aifa_agi",
  url: "https://github.com/aifa-agi",
  jobTitle: "Founder & Lead Developer",
  bio: "Full-stack developer specializing in AI-powered SaaS applications",
  sameAs: [
    "https://github.com/aifa-agi",
    "https://twitter.com/aifa_agi",
  ],
};

/**
 * Comments in English: Default creator organization
 */
const DEFAULT_CREATOR = "aifa.dev";

/**
 * Comments in English: Maximum recommended description length for SEO
 */
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Comments in English: Cached icons array to avoid recreation on every call
 * ✅ ИСПРАВЛЕНИЕ: Uses explicit checks to prevent empty src errors during builds
 * Validates that each icon path is a non-empty string before adding to array
 */
const CACHED_ICONS = (() => {
  const icons: Array<{
    url: string;
    rel?: string;
    sizes?: string;
    type?: string;
  }> = [];

  // Favicon (any size)
  const faviconAny = appConfig.icons?.faviconAny;
  if (faviconAny && typeof faviconAny === 'string' && faviconAny.length > 0) {
    icons.push({
      url: faviconAny,
      rel: "icon",
      sizes: "any",
      type: "image/x-icon",
    });
  }

  // Icon 32x32
  const icon32 = appConfig.icons?.icon32;
  if (icon32 && typeof icon32 === 'string' && icon32.length > 0) {
    icons.push({
      url: icon32,
      type: "image/png",
      sizes: "32x32",
      rel: "icon",
    });
  }

  // Icon 48x48
  const icon48 = appConfig.icons?.icon48;
  if (icon48 && typeof icon48 === 'string' && icon48.length > 0) {
    icons.push({
      url: icon48,
      type: "image/png",
      sizes: "48x48",
      rel: "icon",
    });
  }

  // Icon 192x192
  const icon192 = appConfig.icons?.icon192;
  if (icon192 && typeof icon192 === 'string' && icon192.length > 0) {
    icons.push({
      url: icon192,
      type: "image/png",
      sizes: "192x192",
      rel: "icon",
    });
  }

  // Icon 512x512
  const icon512 = appConfig.icons?.icon512;
  if (icon512 && typeof icon512 === 'string' && icon512.length > 0) {
    icons.push({
      url: icon512,
      type: "image/png",
      sizes: "512x512",
      rel: "icon",
    });
  }

  // Apple Touch Icon
  const appleTouch = appConfig.icons?.appleTouch;
  if (appleTouch && typeof appleTouch === 'string' && appleTouch.length > 0) {
    icons.push({
      url: appleTouch,
      rel: "apple-touch-icon",
      sizes: "180x180",
      type: "image/png",
    });
  }

  return icons as NonNullable<Metadata["icons"]>;
})();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Comments in English: Normalize pathname to valid URL path
 */
function normalizePath(p?: string): string {
  if (!p) return "/";
  let s = String(p).trim();
  if (!s.startsWith("/")) s = `/${s}`;
  while (s.includes("//")) s = s.replace("//", "/");
  return s;
}

/**
 * Comments in English: Truncate description to SEO-friendly length
 */
function truncateDescription(desc: string, maxLength: number = MAX_DESCRIPTION_LENGTH): string {
  if (desc.length <= maxLength) return desc;
  return desc.substring(0, maxLength - 3) + "...";
}

/**
 * Comments in English: Build Person schema from AuthorInfo
 * Used by helper functions below for JSON-LD generation in page components
 */
function buildPersonSchema(author: AuthorInfo): object {
  const person: any = {
    "@type": "Person",
    name: author.name,
  };

  if (author.url) person.url = author.url;
  if (author.email) person.email = author.email;
  if (author.image) person.image = author.image;
  if (author.bio) person.description = author.bio;
  if (author.jobTitle) person.jobTitle = author.jobTitle;

  const sameAsUrls: string[] = [];
  if (author.sameAs) sameAsUrls.push(...author.sameAs);
  if (author.twitter && !author.twitter.startsWith("http")) {
    const handle = author.twitter.replace("@", "");
    sameAsUrls.push(`https://twitter.com/${handle}`);
  }
  if (sameAsUrls.length > 0) person.sameAs = sameAsUrls;

  return person;
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Comments in English: Construct complete metadata object for Next.js pages
 * 
 * Features:
 * - SEO optimization (title, description, canonical URLs)
 * - Open Graph tags for social media sharing
 * - Twitter Card metadata
 * - PWA icons (favicon, apple-touch, Android)
 * - Robots meta tags (index/follow control)
 * 
 * NOTE: JSON-LD structured data is NOT included here.
 * Add JSON-LD directly in page components using <script type="application/ld+json">
 * 
 * @param args - Metadata configuration options
 * @returns Complete Next.js Metadata object
 */
export function constructMetadata({
  title = appConfig.name,
  description = appConfig.description,
  image = getOgImagePath(),
  pathname,
  locale = appConfig.seo?.defaultLocale ?? appConfig.lang,
  noIndex = false,
  noFollow = false,
}: ConstructArgs = {}): Metadata {
  const base = appConfig.seo?.canonicalBase ?? appConfig.url;
  const path = normalizePath(pathname);
  const canonical = new URL(path, base).toString();
  const validDescription = truncateDescription(description);

  const metadata: Metadata = {
    title,
    description: validDescription,
    metadataBase: new URL(appConfig.url),
    alternates: { canonical },
    manifest: "/manifest.webmanifest",
    icons: CACHED_ICONS,
    authors: [
      { name: DEFAULT_AUTHOR.name, url: DEFAULT_AUTHOR.url },
    ],
    creator: DEFAULT_CREATOR,
    publisher: DEFAULT_CREATOR,
    openGraph: {
      type: appConfig.og?.type ?? "website",
      title,
      description: validDescription,
      url: canonical,
      siteName: appConfig.og?.siteName ?? appConfig.name,
      images: [
        {
          url: image,
          width: appConfig.og?.imageWidth ?? 1200,
          height: appConfig.og?.imageHeight ?? 630,
          alt: validDescription,
        },
      ],
      locale: appConfig.og?.locale ?? `${locale}_${locale.toUpperCase()}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: validDescription,
      images: [image],
      creator: appConfig.seo?.social?.twitter,
    },
    robots: {
      index: !noIndex && (appConfig.pageDefaults?.robotsIndex ?? true),
      follow: !noFollow && (appConfig.pageDefaults?.robotsFollow ?? true),
    },
  };

  return metadata;
}

// ============================================
// STRUCTURED DATA HELPER FUNCTIONS
// ============================================
// Comments in English: These functions are exported for use in page components
// to generate JSON-LD structured data via <script type="application/ld+json">

/**
 * Comments in English: Build Article structured data with author information
 * Use this in page components, not in metadata
 */
export function buildArticleSchema({
  headline,
  datePublished,
  dateModified,
  author,
  image,
  description,
}: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: AuthorInfo | AuthorInfo[];
  image?: string;
  description?: string;
}): object {
  const authorSchema = Array.isArray(author)
    ? author.map((a) => buildPersonSchema(a))
    : buildPersonSchema(author);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorSchema,
    ...(description && { description }),
    publisher: {
      "@type": "Organization",
      name: DEFAULT_CREATOR,
      logo: {
        "@type": "ImageObject",
        url: new URL(appConfig.logo, appConfig.url).toString(),
      },
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
  };
}

/**
 * Comments in English: Build FAQ structured data for rich snippets
 * Use this in page components via <script type="application/ld+json">
 */
export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Comments in English: Build Product structured data
 */
export function buildProductSchema({
  name,
  description,
  price,
  currency,
  rating,
  reviewCount,
  image,
  brand,
}: {
  name: string;
  description?: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  brand?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description && { description }),
    ...(image && { image }),
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    ...(rating &&
      reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount,
        },
      }),
  };
}

/**
 * Comments in English: Build BreadcrumbList structured data
 */
export function buildBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, appConfig.url).toString(),
    })),
  };
}
