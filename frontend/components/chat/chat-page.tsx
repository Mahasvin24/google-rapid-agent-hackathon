"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessageBubble } from "@/components/chat/chat-message";
import { useChatAgent } from "@/components/chat/use-chat-agent";
import { CHAT_AGENT_NAME } from "@/lib/chat-agent";

export function ChatPage() {
  const { messages, isTyping, sendMessage, scrollRef } = useChatAgent();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 bg-card/30 px-4 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          nativeButton={false}
          render={
            <Link href="/" aria-label="Back to agent diagram">
              <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
            <Radio className="size-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight">
              {CHAT_AGENT_NAME}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Live incident Q&amp;A · connected to orchestrator workflow
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 sm:inline-flex">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Streaming updates
        </span>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15">
                <Loader2 className="size-4 animate-spin text-cyan-400" />
              </div>
              <span className="text-xs">{CHAT_AGENT_NAME} is typing…</span>
            </div>
          )}
        </div>
      </div>

      <ChatComposer onSend={sendMessage} disabled={isTyping} />
    </div>
  );
}
