// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/code-block.tsx
"use client";

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  if (!inline) {
    return (
      <div className="not-prose flex flex-col min-w-0 my-4">
        {/* Wrapper для горизонтальной прокрутки */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <pre
            {...props}
            className="text-sm w-full dark:bg-zinc-900 bg-white p-4 m-0 dark:text-zinc-50 text-zinc-900"
          >
            <code className="whitespace-pre">{children}</code>
          </pre>
        </div>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
