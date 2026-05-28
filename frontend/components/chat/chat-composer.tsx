"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about status, blast radius, remediation…"
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-border/70 bg-background/80 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/20 disabled:opacity-50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          className="shrink-0 bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground">
        Enter to send · Shift+Enter for newline
      </p>
    </form>
  );
}
