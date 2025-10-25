// @/components/shared/markdown.tsx

"use client";

import { useRouter } from "next/navigation";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../../app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_components)/code-block";

/**
 * Check if URL is internal (same application)
 * Compares against current hostname AND production domain from config
 * Works in both development (localhost) and production
 */
function checkIfInternalLink(href: string): boolean {
  // Relative paths are always internal
  if (href.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(href);
    const currentHostname = window.location.hostname;

    // Extract production domain from any URL format
    // Examples: https://putevye-listy.ru or http://localhost:3000
    const productionDomain = extractDomainFromUrl('https://putevye-listy.ru'); // ⚠️ REPLACE with appConfig.url

    // Check if URL matches:
    // 1. Current hostname (works in both dev and prod)
    // 2. Production domain (works in dev when clicking prod links)
    // 3. Localhost variants (works in dev)
    return (
      url.hostname === currentHostname ||
      url.hostname === productionDomain ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

/**
 * Extract domain from full URL
 * Example: https://putevye-listy.ru/path → putevye-listy.ru
 */
function extractDomainFromUrl(fullUrl: string): string {
  try {
    const url = new URL(fullUrl);
    return url.hostname;
  } catch {
    return '';
  }
}

/**
 * Extract relative path and hash from any URL format
 */
function extractRelativePathFromUrl(href: string): {
  relativePath: string;
  hash: string;
} {
  if (href.startsWith('/')) {
    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      return {
        relativePath: href.substring(0, hashIndex),
        hash: href.substring(hashIndex),
      };
    }
    return { relativePath: href, hash: '' };
  }

  try {
    const url = new URL(href);
    return {
      relativePath: url.pathname,
      hash: url.hash,
    };
  } catch {
    return { relativePath: href, hash: '' };
  }
}

/**
 * Custom link component for chat markdown
 * Displays absolute URLs but navigates using relative paths
 */
/**
 * Custom link component for chat markdown
 * Displays link text (children) instead of full URL
 * Navigates using Next.js router for internal links
 */
function ChatLinkComponent({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href) return;

    const isInternalLink = checkIfInternalLink(href);

    if (isInternalLink) {
      e.preventDefault();

      const { relativePath, hash } = extractRelativePathFromUrl(href);

      router.push(relativePath + hash);

      if (hash) {
        setTimeout(() => {
          const elementId = hash.substring(1);
          const element = document.getElementById(elementId);

          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 300);
      }
    }
  };

  const isExternal = href && !checkIfInternalLink(href);

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-blue-500 hover:underline cursor-pointer"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children} {/* ← Это отображает текст ссылки, а не URL */}
    </a>
  );
}


const components: Partial<Components> = {
  // @ts-expect-error
  code: CodeBlock,

  pre: ({ children }) => <>{children}</>,

  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },

  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },

  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },

  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },

  a: ({ node, ...props }) => {

    return <ChatLinkComponent {...props} />;
  },

  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },

  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },

  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },

  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },

  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },

  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },

  p: ({ node, children, ...props }) => {
    return <div {...props}>{children}</div>;
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
