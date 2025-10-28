// @/components/shared/markdown.tsx

"use client";

import { useRouter } from "next/navigation";
import React, { memo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../../app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/code-block";
import { DefaultSuggestionButton } from "./default-suggestion-button";
import { suggestedActions } from "@/config/chat-config/start-suggestions-buttons";
import { SuggestionButton } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/suggestion-button";

/**
 * Check if URL is internal (same application)
 */
function checkIfInternalLink(href: string): boolean {
  if (href.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(href);
    const currentHostname = window.location.hostname;
    const productionDomain = extractDomainFromUrl("https://putevye-listy.ru");

    return (
      url.hostname === currentHostname ||
      url.hostname === productionDomain ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

/**
 * Extract domain from full URL
 */
function extractDomainFromUrl(fullUrl: string): string {
  try {
    const url = new URL(fullUrl);
    return url.hostname;
  } catch {
    return "";
  }
}

/**
 * Extract relative path and hash from any URL format
 */
function extractRelativePathFromUrl(href: string): {
  relativePath: string;
  hash: string;
} {
  if (href.startsWith("/")) {
    const hashIndex = href.indexOf("#");
    if (hashIndex !== -1) {
      return {
        relativePath: href.substring(0, hashIndex),
        hash: href.substring(hashIndex),
      };
    }
    return { relativePath: href, hash: "" };
  }

  try {
    const url = new URL(href);
    return {
      relativePath: url.pathname,
      hash: url.hash,
    };
  } catch {
    return { relativePath: href, hash: "" };
  }
}

/**
 * Parse suggestions from markdown text
 */
function parseSuggestions(text: string): {
  cleanText: string;
  suggestions: string[];
} {
  const suggestionRegex = /\[suggestion:(.*?)\]/g;
  const suggestions: string[] = [];

  let match;
  while ((match = suggestionRegex.exec(text)) !== null) {
    suggestions.push(match[1].trim());
  }

  const cleanText = text.replace(suggestionRegex, "").trim();

  return { cleanText, suggestions };
}

/**
 * Custom link component for chat markdown
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
              behavior: "smooth",
              block: "start",
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
      {children}
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

interface MarkdownProps {
  children: string;
  onSuggestionClick?: (text: string) => void;
  disableSuggestions?: boolean;
}

const NonMemoizedMarkdown = ({
  children,
  onSuggestionClick,
  disableSuggestions = false,
}: MarkdownProps) => {
  const { cleanText, suggestions } = parseSuggestions(children);
  const [mode, setMode] = useState<"ai" | "default">("ai");

  const handleDefaultSuggestionClick = (action: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(action);
      // Automatically switch back to AI mode after sending message
      setMode("ai");
    }
  };

  return (
    <>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {cleanText}
      </ReactMarkdown>

      {onSuggestionClick && (
        <>
          {mode === "ai" && suggestions.length > 0 && (
            <>
              {/* AI-generated suggestions */}
              <div className="flex flex-row flex-wrap gap-2 mt-3 min-w-0">
                {suggestions.map((suggestion, index) => (
                  <SuggestionButton
                    key={`${suggestion}-${index}`}
                    text={suggestion}
                    onClick={onSuggestionClick}
                    disabled={disableSuggestions}
                  />
                ))}
              </div>

              {/* Toggle to default suggestions */}
              <button
                className="text-sm text-muted-foreground hover:text-foreground underline cursor-pointer  text-left"
                onClick={() => setMode("default")}
              >
                Start over
              </button>
            </>
          )}

          {mode === "default" && (
            <>
              {/* Default suggestions (grid layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 w-full">
                {suggestedActions.map((action, index) => (
                  <DefaultSuggestionButton
                    key={`${action.title}-${index}`}
                    title={action.title}
                    label={action.label}
                    action={action.action}
                    onClick={handleDefaultSuggestionClick}
                    disabled={disableSuggestions}
                  />
                ))}
              </div>

              {/* Toggle back to AI suggestions */}
              <button
                className="text-sm text-muted-foreground hover:text-foreground underline cursor-pointer  text-left"
                onClick={() => setMode("ai")}
              >
                Back to chat
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.disableSuggestions === nextProps.disableSuggestions
);
