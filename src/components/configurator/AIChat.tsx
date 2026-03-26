"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildConfiguratorContext } from "@/lib/ai/build-config-context";
import { renderMarkdown } from "@/lib/ai/markdown";
import { useConfiguratorStore } from "@/stores/configuratorStore";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AIChat() {
  const motorcycles = useConfiguratorStore((s) => s.motorcycles);
  const parts = useConfiguratorStore((s) => s.parts);
  const selectedMotorcycleId = useConfiguratorStore(
    (s) => s.selectedMotorcycleId,
  );
  const selectedPartData = useConfiguratorStore((s) => s.selectedPartData);
  const equippedParts = useConfiguratorStore((s) => s.equippedParts);
  const globalColor = useConfiguratorStore((s) => s.globalColor);
  const globalMaterial = useConfiguratorStore((s) => s.globalMaterial);
  const totalPrice = useConfiguratorStore((s) => s.totalPrice);
  const configName = useConfiguratorStore((s) => s.configName);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm MOTO3D AI assistant. I can help you configure your motorcycle, recommend parts, explain specifications, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contextString = useCallback(() => {
    return buildConfiguratorContext({
      motorcycles,
      selectedMotorcycleId,
      parts,
      equippedParts,
      globalColor,
      globalMaterial,
      totalPrice,
      selectedPartData,
      configName,
    });
  }, [
    motorcycles,
    selectedMotorcycleId,
    parts,
    equippedParts,
    globalColor,
    globalMaterial,
    totalPrice,
    selectedPartData,
    configName,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleSend = useCallback(
    async (messageOverride?: string) => {
      const text = (messageOverride ?? inputValue).trim();
      if (!text || isTyping) return;

      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((m) => [...m, userMsg]);
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            context: contextString(),
          }),
        });
        const data = (await res.json()) as {
          response?: string;
          error?: string;
        };

        let assistantText: string;
        if (!res.ok) {
          assistantText =
            data.error === "AI not configured"
              ? "AI features require an API key. Add GOOGLE_AI_API_KEY to your .env.local file."
              : "Sorry, I encountered an error. Please try again.";
        } else if (data.response) {
          assistantText = data.response;
        } else {
          assistantText = "Sorry, I encountered an error. Please try again.";
        }

        setMessages((m) => [
          ...m,
          {
            id: newId(),
            role: "assistant",
            content: assistantText,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: newId(),
            role: "assistant",
            content:
              "Sorry, I encountered an error. Please check your connection and try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, contextString],
  );

  const quickActions = [
    {
      label: "Recommend parts",
      message: "What parts do you recommend for my current setup?",
    },
    {
      label: "Analyze my build",
      message: "Analyze my current configuration and give me scores",
    },
    {
      label: "Best for city riding",
      message: "What's the best setup for city riding?",
    },
    {
      label: "Improve performance",
      message: "How can I improve the performance of my bike?",
    },
    {
      label: "Explain selected part",
      message:
        "Tell me everything about the currently selected part in my configuration",
    },
  ];

  return (
    <div className="pointer-events-none absolute right-6 bottom-6 z-30">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="launcher"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto"
          >
            <button
              type="button"
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/50"
              onClick={() => setIsOpen(true)}
              aria-label="Open MOTO3D AI chat"
            >
              <Bot className="size-7" />
              <span className="absolute top-0 right-0 h-3 w-3 animate-pulse rounded-full bg-green-500 ring-2 ring-background" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex h-[min(500px,60vh)] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl sm:h-[500px] sm:w-96"
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-primary/5 px-4">
              <div className="flex items-center gap-2">
                <Bot className="size-4 text-primary" />
                <span className="font-semibold text-sm">MOTO3D AI</span>
                <Badge className="h-5 border-0 bg-green-500/20 px-1.5 text-[10px] text-green-400">
                  Online
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8"
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize"
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1 px-2">
              <div className="space-y-3 py-3 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start gap-2"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="mt-1 size-4 shrink-0 text-primary" />
                    ) : null}
                    <div
                      className={
                        msg.role === "user"
                          ? "max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-primary-foreground text-sm"
                          : "max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2 text-sm"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <div
                          className="text-sm leading-relaxed [&_code]:text-xs"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(msg.content),
                          }}
                        />
                      ) : (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping ? (
                  <div className="flex justify-start gap-2">
                    <Bot className="mt-1 size-4 shrink-0 text-primary" />
                    <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm">
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      </span>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-border px-3 py-2">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className="shrink-0 rounded-full border border-border px-3 py-1 text-xs whitespace-nowrap transition-colors hover:border-primary/50 hover:bg-primary/10"
                  onClick={() => void handleSend(a.message)}
                >
                  <Sparkles className="mr-1 inline size-3 opacity-70" />
                  {a.label}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-border px-3 py-3">
              <Input
                placeholder="Ask about parts, specs, recommendations..."
                className="flex-1 rounded-full border-0 bg-muted/50 px-4 text-sm focus-visible:ring-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                disabled={!inputValue.trim() || isTyping}
                onClick={() => void handleSend()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
