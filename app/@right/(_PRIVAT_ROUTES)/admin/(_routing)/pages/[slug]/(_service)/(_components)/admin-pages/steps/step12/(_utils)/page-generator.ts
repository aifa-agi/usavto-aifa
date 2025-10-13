// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/(_utils)/page-generator.ts
// Page generation service for creating Next.js page.tsx files
// Critical template generator - preserve exact formatting and structure
// UPDATED: Now generates pages with ServerContentRenderer for full SSR/SSG

import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
// ✅ FIXED: Correct path to faq-extractor
import { extractFAQs, generateFAQJsonLd } from "@/app/@right/(_service)/(_utils)/faq-extractor";

// Types for content nodes
interface ContentNode {
  type: string;
  attrs?: {
    alt?: string;
    src?: string;
    [key: string]: any;
  };
  content?: ContentNode[];
  [key: string]: any;
}

interface BodyContent {
  type: string;
  content?: ContentNode[];
  [key: string]: any;
}

/**
 * Generates complete page.tsx content with embedded sections data and metadata
 * 
 * CRITICAL CHANGES:
 * - Uses ServerContentRenderer instead of client-side ContentRenderer
 * - All content is server-rendered in initial HTML
 * - Client islands provide interactivity without affecting SEO
 * - Includes FAQPage Schema.org markup when FAQ sections detected
 * 
 * Comments in English: This version ensures 100% static generation
 * with all content present in the initial HTML for optimal SEO.
 */
export function generatePageTsxContent(payload: PageUploadPayload): string {
  const { pageMetadata, sections, href } = payload;
  const relativePath = href.startsWith("/") ? href.slice(1) : href;
  const categorySlug = relativePath.split("/")[0] || "general";

  // Parse path segments for generateStaticParams
  const pathSegments = relativePath.split("/").filter(Boolean);

  const finalMetadata = {
    title: pageMetadata.title || "Page Without Title",
    description: pageMetadata.description || "No description provided",
    keywords: pageMetadata.keywords || [],
    images: pageMetadata.images || [],
  };

  const escapedTitle = finalMetadata.title.replace(/`/g, "\\`").replace(/\$/g, "\\$");
  const escapedDescription = finalMetadata.description.replace(/`/g, "\\`").replace(/\$/g, "\\$");

  const sectionsJson = JSON.stringify(sections, null, 2);

  const heroImageData =
    finalMetadata.images.length > 0
      ? {
          href: finalMetadata.images[0].href,
          alt: finalMetadata.images[0].alt || "",
        }
      : null;

  const extractImageAlts = (sectionsArr: ExtendedSection[]): string[] => {
    const alts: string[] = [];
    sectionsArr.forEach((section) => {
      if (section.bodyContent && typeof section.bodyContent === "object") {
        const bodyContent = section.bodyContent as BodyContent;
        if (bodyContent.content && Array.isArray(bodyContent.content)) {
          const extractFromContent = (content: ContentNode[]): void => {
            content.forEach((node: ContentNode) => {
              if (node.type === "image" && node.attrs?.alt) {
                alts.push(node.attrs.alt);
              }
              if (node.content && Array.isArray(node.content)) {
                extractFromContent(node.content);
              }
            });
          };
          extractFromContent(bodyContent.content);
        }
      }
    });
    return alts;
  };
  const imageAlts = extractImageAlts(sections);

  // ✅ Extract FAQs and generate JSON-LD (only if FAQ sections present)
  const faqs = extractFAQs(sections as any);
  const faqJsonLd = generateFAQJsonLd(faqs);

  // Canonical URL for JSON-LD
  const canonicalUrl = `\${appConfig.url}${href}`;

  // Template output
  return `// Auto-generated SEO-optimized static page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: ${href}
// Page metadata: ${pageMetadata.title || "No title"} | ${sections.length} sections
// FAQ sections detected: ${faqs.length}
// SEO Mode: FULL SERVER-SIDE RENDERING + STATIC GENERATION
// NOTE: This page has a hardcoded path - no dynamic segments

import type { Metadata } from "next";
import { appConfig } from "@/config/appConfig";
import { constructMetadata } from "@/lib/construct-metadata";
import ServerContentRenderer from "@/app/@right/(_service)/(_components)/server-content-renderer";
import { Badge } from "@/components/ui/badge";

// ============================================
// STATIC GENERATION CONFIGURATION
// ============================================

// Force static generation for optimal SEO and performance
export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

// NOTE: generateStaticParams is not needed for this page
// Path is hardcoded: ${href}
// Next.js will automatically detect this as a static route

// ============================================
// EMBEDDED DATA
// ============================================

const sections = ${sectionsJson};

const heroImage = ${heroImageData ? JSON.stringify(heroImageData, null, 2) : "null"};

const canonicalUrl = \`${"${"}appConfig.url${"}"}${href}\`;

// ============================================
// METADATA GENERATION
// ============================================

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "${escapedTitle}",
    description: "${escapedDescription}",
    image: ${heroImageData ? `"${heroImageData.href}"` : "appConfig.ogImage"},
    pathname: "${href}",
    locale: appConfig.seo?.defaultLocale ?? appConfig.lang,
  });
}

// ============================================
// PAGE COMPONENT (SERVER-RENDERED)
// ============================================

export default function Page() {
  return (
    <article className="page-content">
      <div className="container max-w-screen-2xl pt-6 px-4 md:pt-10">
        <div className="flex flex-col space-y-4">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            ${escapedTitle}
          </h1>
          
          <p className="text-base text-muted-foreground md:text-lg">
            ${escapedDescription}
          </p>
          
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <Badge className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
              ${categorySlug}
            </Badge>
            ${finalMetadata.keywords.length > 0 ? `{${JSON.stringify(finalMetadata.keywords)}.slice(0, 3).map((keyword: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center"
              >
                {keyword}
              </Badge>
            ))}` : ''}
          </div>
        </div>
      </div>

      <ServerContentRenderer 
        sections={sections} 
        heroImage={heroImage} 
      />

      {/* Structured data: JSON-LD Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${escapedTitle}",
            "description": "${escapedDescription}",
            "author": {
              "@type": "Organization",
              "name": appConfig.name,
              "url": appConfig.url
            },
            "publisher": {
              "@type": "Organization",
              "name": appConfig.name,
              "url": appConfig.url,
              "logo": {
                "@type": "ImageObject",
                "url": \`\${appConfig.url}\${appConfig.logo}\`
              }
            },
            "url": canonicalUrl,
            ${heroImageData
              ? `"image": {
              "@type": "ImageObject",
              "url": "${heroImageData.href}",
              "alt": "${heroImageData.alt || ""}"
            },`
              : `"image": {
              "@type": "ImageObject",
              "url": appConfig.ogImage,
              "alt": appConfig.name
            },`}
            "datePublished": "${new Date().toISOString()}",
            "dateModified": "${new Date().toISOString()}",
            "articleSection": "${categorySlug}",
            "keywords": ${JSON.stringify(finalMetadata.keywords)},
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })
        }}
      />
${faqJsonLd ? `
      {/* Structured data: JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(${JSON.stringify(faqJsonLd)})
        }}
      />` : ''}
    </article>
  );
}
`;
}
