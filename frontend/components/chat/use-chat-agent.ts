"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  answerUserQuestion,
  createMessage,
  INITIAL_CHAT_MESSAGES,
  nextPeriodicUpdate,
  type ChatMessage,
} from "@/lib/chat-agent";

const UPDATE_INTERVAL_MS = 28_000;
const TYPING_DELAY_MS = 900;

export function useChatAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const appendAgentMessage = useCallback(
    (content: string, kind: ChatMessage["kind"]) => {
      setMessages((prev) => [
        ...prev,
        createMessage({ role: "agent", kind, content }),
      ]);
    },
    []
  );

  const pushAgentReply = useCallback(
    (content: string, kind: ChatMessage["kind"] = "answer") => {
      setIsTyping(true);
      window.setTimeout(() => {
        appendAgentMessage(content, kind);
        setIsTyping(false);
      }, TYPING_DELAY_MS);
    },
    [appendAgentMessage]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          kind: "question",
          content: trimmed,
        }),
      ]);

      pushAgentReply(answerUserQuestion(trimmed));
    },
    [isTyping, pushAgentReply]
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      if (isTyping) return;
      pushAgentReply(nextPeriodicUpdate(), "update");
    }, UPDATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isTyping, pushAgentReply]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return {
    messages,
    isTyping,
    sendMessage,
    scrollRef,
  };
}
