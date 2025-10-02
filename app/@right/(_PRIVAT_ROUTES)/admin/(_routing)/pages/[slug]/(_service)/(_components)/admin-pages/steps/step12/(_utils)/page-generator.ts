// @/.../page-generator.ts
// Page generation service for creating Next.js page.tsx files
// Critical template generator - preserve exact formatting and structure

import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";

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
 * Comments in English: This version delegates all Metadata to constructMetadata
 * to avoid conflicts and ensure single source of truth (icons, manifest, robots, canonical, OG/Twitter).
 */
export function generatePageTsxContent(payload: PageUploadPayload): string {
  const { pageMetadata, sections, href } = payload;
  const relativePath = href.startsWith("/") ? href.slice(1) : href;
  const categorySlug = relativePath.split("/")[0] || "general";

  const finalMetadata = {
    title: pageMetadata.title || "Страница без заголовка",
    description: pageMetadata.description || "Описание отсутствует",
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

  // Canonical as plain reference for JSON-LD; actual canonical tag comes from constructMetadata
  const canonicalUrl = `\${appConfig.url}${href}`;

  // Template output
  return `// Auto-generated SEO-optimized static page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: ${href}
// Page metadata: ${pageMetadata.title || "No title"} | ${sections.length} sections
// SEO Mode: STATIC GENERATION ENABLED

import type { Metadata } from "next";
import { appConfig } from "@/config/appConfig";
import { constructMetadata } from "@/lib/construct-metadata";
import ContentRenderer from "@/app/@right/(_service)/(_components)/content-renderer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Enforce static generation for SEO
export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

// Embedded sections data
const sections = ${sectionsJson};

// Hero image data
const heroImage = ${heroImageData ? JSON.stringify(heroImageData, null, 2) : "null"};

// Canonical URL for JSON-LD (metadata canonical is handled by constructMetadata)
const canonicalUrl = \`${"${"}appConfig.url${"}"}${href}\`;

// Centralized Metadata via constructMetadata
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "${escapedTitle}",
    description: "${escapedDescription}",
    image: ${heroImageData ? `"${heroImageData.href}"` : "appConfig.ogImage"},
    pathname: "${href}",
    locale: appConfig.seo?.defaultLocale ?? appConfig.lang,
  });
}

// Page component (fully static)
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
          <div className="flex items-center space-x-4">
            <Badge className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
              ${categorySlug}
            </Badge>
             {${finalMetadata.keywords.length > 0 ? `${JSON.stringify(finalMetadata.keywords)}.slice(0, 3).map((keyword: string, index: number) => (
              <Badge key={index} variant="outline" className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
                {keyword}
              </Badge>
            ))` : ''}}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-52 w-full border-t" />
        <ContentRenderer sections={sections} heroImage={heroImage} />
      </div>

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
    </article>
  );
}
`;
}
