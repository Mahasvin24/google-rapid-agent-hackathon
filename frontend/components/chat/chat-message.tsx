"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chat-agent";
import { CHAT_AGENT_NAME } from "@/lib/chat-agent";

type ChatMessageProps = {
  message: ChatMessage;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Lightweight **bold** segments without a markdown dependency. */
function RichText({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

const kindLabels: Record<ChatMessage["kind"], string | null> = {
  update: "Status update",
  answer: null,
  question: null,
};

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isAgent = message.role === "agent";
  const kindLabel = isAgent ? kindLabels[message.kind] : null;

  return (
    <div
      className={cn(
        "flex gap-3",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      {isAgent && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
          <Bot className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[min(100%,36rem)] space-y-1",
          !isAgent && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 text-[10px] text-muted-foreground",
            !isAgent && "flex-row-reverse"
          )}
        >
          <span className="font-medium">
            {isAgent ? CHAT_AGENT_NAME : "You"}
          </span>
          <span>{formatTime(message.timestamp)}</span>
          {kindLabel && (
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-cyan-300/90">
              {kindLabel}
            </span>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl border px-3.5 py-2.5 shadow-sm",
            isAgent &&
              message.kind === "update" &&
              "border-cyan-500/25 bg-cyan-500/8 text-foreground/95",
            isAgent &&
              message.kind !== "update" &&
              "border-border/70 bg-card/80 text-foreground/95",
            !isAgent && "border-border/60 bg-muted/40 text-foreground"
          )}
        >
          <RichText content={message.content} />
        </div>
      </div>

      {!isAgent && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}
