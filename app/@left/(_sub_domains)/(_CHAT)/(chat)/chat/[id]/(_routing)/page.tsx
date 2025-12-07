// @/app/@left/(_public)/(_CHAT)/(chat)/chat/[id]/(_routing)/page.tsx

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { Chat } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/chat";
import { DataStreamHandler } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_libs)/ai/models";
import type { Attachment, UIMessage } from "ai";
import { VisibilityType } from "@/app/@left/(_sub_domains)/(_CHAT)/(chat)/(_service)/(_components)/visibility-selector";
import { Message, Visibility } from "@prisma/client";
import { getChatById } from "../../../(_service)/(_db-queries)/chat/queries";
import { getMessagesByChatId } from "../../../(_service)/(_db-queries)/message/queries";
import { auth } from "@/app/@left/(_sub_domains)/(_AUTH)/(_service)/(_actions)/auth";

/**
 * Comments in English: Chat Page with Suspense Boundary
 *
 * Architecture:
 * - Page(): Synchronous wrapper component (returns immediately)
 * - ChatPage(): Async component with all data fetching
 * - Fallback: Skeleton UI shown during loading
 *
 * ✅ Works perfectly with Next.js 16 cacheComponents
 * ✅ No generateStaticParams needed
 * ✅ Optimal performance with streaming
 */

// ✅ SYNCHRONOUS WRAPPER
export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatPage params={props.params} />
    </Suspense>
  );
}

// ✅ ASYNC CONTENT
async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Fetch data in parallel when possible
    const [chat, session] = await Promise.all([
      getChatById(id),
      auth(),
    ]);

    // Validation: Chat exists
    if (!chat) {
      notFound();
    }

    // Validation: User authenticated
    if (!session) {
      redirect("/login");
    }

    // Validation: Visibility permissions
    if (chat.visibility === Visibility.private) {
      if (!session.user || session.user.id !== chat.userId) {
        notFound();
      }
    }

    // Fetch messages
    const messagesFromDb = await getMessagesByChatId(id);
    const uiMessages = convertToUIMessages(messagesFromDb);

    // Get chat model from cookies
    const cookieStore = await cookies();
    const chatModelFromCookie = cookieStore.get("chat-model");
    const chatModel = chatModelFromCookie?.value ?? DEFAULT_CHAT_MODEL;

    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={uiMessages}
          initialChatModel={chatModel}
          initialVisibilityType={chat.visibility as VisibilityType}
          isReadonly={session?.user?.id !== chat.userId}
          session={session}
          autoResume={true}
        />
        <DataStreamHandler id={chat.id} />
      </>
    );
  } catch (error) {
    // Log error for debugging
    console.error("[ChatPage] Error:", error);
    // Show 404 for any unexpected errors
    notFound();
  }
}

// ✅ HELPER
function convertToUIMessages(messages: Array<Message>): Array<UIMessage> {
  function isAttachmentArray(data: unknown): data is Attachment[] {
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "url" in item &&
          typeof (item as any).url === "string"
      )
    );
  }

  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage["parts"],
    role: message.role as UIMessage["role"],
    content: "",
    createdAt: message.createdAt,
    experimental_attachments: isAttachmentArray(
      message.attachments as unknown
    )
      ? (message.attachments as unknown as Attachment[])
      : [],
  }));
}

// ✅ SKELETON
function ChatPageSkeleton() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 p-4">
        {/* Header skeleton */}
        <div className="space-y-2 text-center">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Messages skeleton */}
        <div className="w-full max-w-2xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded-lg bg-muted" />
            </div>
          ))}
        </div>

        {/* Input skeleton */}
        <div className="w-full max-w-2xl pt-4">
          <div className="h-12 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
