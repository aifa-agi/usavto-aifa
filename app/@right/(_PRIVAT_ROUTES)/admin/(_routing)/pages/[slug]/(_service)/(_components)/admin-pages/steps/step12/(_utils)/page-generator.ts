// Page generation service for creating Next.js page.tsx files
// Critical template generator - preserve exact formatting and structure


import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";

// Типы для работы с содержимым секций
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
 * Production-critical function - generates fully static SEO-optimized pages
 * 
 * @param firstPartHref - First part of the URL path (category)
 * @param secondPartHref - Second part of the URL path (subcategory)
 * @param payload - Complete page data including pageMetadata and sections
 * @returns string - Complete TypeScript/React page component code
 */
export function generatePageTsxContent(
  firstPartHref: string,
  secondPartHref: string,
  payload: PageUploadPayload
): string {
  const { pageMetadata, sections } = payload;
  
  // Use metadata from payload or fallback from first section
  const finalMetadata = {
    title: pageMetadata.title || "Страница без заголовка",
    description: pageMetadata.description || "Описание отсутствует", 
    keywords: pageMetadata.keywords || [],
    images: pageMetadata.images || []
  };

  // Properly escape strings for template literals (not JSX)
  const escapedTitle = finalMetadata.title.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const escapedDescription = finalMetadata.description.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  // Create JSON string for sections with proper formatting
  const sectionsJson = JSON.stringify(sections, null, 2);
  
  // Prepare hero image data
  const heroImageData = finalMetadata.images.length > 0 ? {
    href: finalMetadata.images[0].href,
    alt: finalMetadata.images[0].alt || ""
  } : null;

  // Extract alt attributes from sections for better SEO - с правильной типизацией
  const extractImageAlts = (sections: ExtendedSection[]): string[] => {
    const alts: string[] = [];
    
    sections.forEach(section => {
      if (section.bodyContent && typeof section.bodyContent === 'object') {
        const bodyContent = section.bodyContent as BodyContent;
        
        if (bodyContent.content && Array.isArray(bodyContent.content)) {
          const extractFromContent = (content: ContentNode[]): void => {
            content.forEach((node: ContentNode) => {
              if (node.type === 'image' && node.attrs?.alt) {
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

  // Generate the page content using template literal
  return `// Auto-generated SEO-optimized static page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: /${firstPartHref}/${secondPartHref}
// Page metadata: ${pageMetadata.title || 'No title'} | ${sections.length} sections
// SEO Mode: STATIC GENERATION ENABLED

import { Metadata } from "next";
import { appConfig } from "@/config/appConfig";
import ContentRenderer from "@/app/@right/(_service)/(_components)/content-renderer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ПРИНУЖДЕНИЕ К СТАТИЧЕСКОЙ ГЕНЕРАЦИИ - критически важно для SEO
export const dynamic = 'force-static';
export const revalidate = false;
export const fetchCache = 'force-cache';

// Встроенные данные секций
const sections = ${sectionsJson};

// Данные героического изображения
const heroImage = ${heroImageData ? JSON.stringify(heroImageData, null, 2) : 'null'};

// ПОЛНАЯ SEO-ОПТИМИЗАЦИЯ: генерация метаданных из appConfig
export async function generateMetadata(): Promise<Metadata> {
  // Используем URL из appConfig вместо переменных окружения
  const siteUrl = appConfig.url;
  
  // КРИТИЧЕСКИ ВАЖНО: правильная сборка canonical URL
  const canonicalUrl = \`\${siteUrl}/${firstPartHref}/${secondPartHref}\`;
  
  return {
    title: "${escapedTitle}",
    description: "${escapedDescription}",
    keywords: ${JSON.stringify(finalMetadata.keywords)},
    
    // Используем надежный metadataBase из конфигурации
    metadataBase: new URL(siteUrl),
    
    // Полные Open Graph метатеги
    openGraph: {
      title: "${escapedTitle}",
      description: "${escapedDescription}",
      type: "article",
      url: canonicalUrl,
      siteName: appConfig.name,
      locale: appConfig.lang,${finalMetadata.images.length > 0 ? `
      images: [
        {
          url: "${finalMetadata.images[0].href}",
          alt: "${finalMetadata.images[0].alt?.replace(/`/g, '\\`').replace(/\$/g, '\\$') || ''}",
          width: 1200,
          height: 630,
        }
      ],` : `
      images: [
        {
          url: appConfig.ogImage,
          alt: appConfig.name,
          width: 1200,
          height: 630,
        }
      ],`}
    },
    
    // Twitter метатеги
    twitter: {
      card: "summary_large_image",
      title: "${escapedTitle}",
      description: "${escapedDescription}",${finalMetadata.images.length > 0 ? `
      images: ["${finalMetadata.images[0].href}"],` : `
      images: [appConfig.ogImage],`}
    },
    
    // Canonical URL из appConfig
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Управление поисковыми роботами
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Автор из конфигурации
    authors: [{ name: appConfig.name }],
    
    // Дополнительные SEO метатеги
    category: 'article',
    classification: 'business',
    
    // Structured data для лучшего SEO
    other: {
      'article:author': appConfig.name,
      'article:section': '${firstPartHref}',
      'article:tag': ${JSON.stringify(finalMetadata.keywords)}.join(', '),
    },
  };
}

// Основной компонент страницы - полностью статический
export default function Page() {
  return (
    <article className="page-content">
      {/* Заголовок страницы с правильной SEO структурой */}
      <div className="container max-w-screen-2xl pt-6 px-4 md:pt-10">
        <div className="flex flex-col space-y-4">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            ${escapedTitle}
          </h1>
        
          {/* Описание страницы */}
          <p className="text-base text-muted-foreground md:text-lg">
            ${escapedDescription}
          </p>

          <div className="flex items-center space-x-4">
            <Badge className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
              ${firstPartHref}
            </Badge>
            {${finalMetadata.keywords.length > 0 ? `${JSON.stringify(finalMetadata.keywords)}.slice(0, 3).map((keyword: string, index: number) => (
              <Badge key={index} variant="outline" className="shadow-none rounded-md px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
                {keyword}
              </Badge>
            ))` : ''}}
          </div>
        </div>
      </div>

      {/* Контент секций с героическим изображением */}
      <div className="relative">
        <div className="absolute top-52 w-full border-t" />
        <ContentRenderer sections={sections} heroImage={heroImage} />
      </div>
      
      {/* JSON-LD Structured Data для поисковых систем */}
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
              "url": appConfig.url,
            },
            "publisher": {
              "@type": "Organization",
              "name": appConfig.name,
              "url": appConfig.url,
              "logo": {
                "@type": "ImageObject",
                "url": \`\${appConfig.url}\${appConfig.logo}\`,
              },
            },
            "url": \`\${appConfig.url}/${firstPartHref}/${secondPartHref}\`,${finalMetadata.images.length > 0 ? `
            "image": {
              "@type": "ImageObject",
              "url": "${finalMetadata.images[0].href}",
              "alt": "${finalMetadata.images[0].alt || ''}"
            },` : `
            "image": {
              "@type": "ImageObject",
              "url": appConfig.ogImage,
              "alt": appConfig.name
            },`}
            "datePublished": "${new Date().toISOString()}",
            "dateModified": "${new Date().toISOString()}",
            "articleSection": "${firstPartHref}",
            "keywords": ${JSON.stringify(finalMetadata.keywords)},
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": \`\${appConfig.url}/${firstPartHref}/${secondPartHref}\`
            }
          })
        }}
      />
    </article>
  );
}`;
}
