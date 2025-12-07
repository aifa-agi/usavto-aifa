// @/app/@left/(_public)/(_CHAT)/(chat)/chat/[id]/(_routing)/page.tsx

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

export const dynamic = "force-dynamic";

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <ChatPage params={props.params} />
    </Suspense>
  );
}

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch in parallel
  const [chat, session] = await Promise.all([
    getChatById(id),
    auth(),
  ]);

  if (!chat) {
    notFound();
  }

  if (!session) {
    redirect("/login");
  }

  if (chat.visibility === Visibility.private) {
    if (!session.user || session.user.id !== chat.userId) {
      notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId(id);
  const uiMessages = convertToUIMessages(messagesFromDb);

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType={chat.visibility as VisibilityType}
        isReadonly={session?.user?.id !== chat.userId}
        session={session}
        autoResume={true}
      />
      <DataStreamHandler id={chat.id} />
    </>
  );
}

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
