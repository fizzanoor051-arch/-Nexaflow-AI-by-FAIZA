
"use client";

import React, { useState } from "react";
import ChatMessage, {
  ChatMessageData,
} from "@/components/ai/ChatMessage";
import ChatInput from "@/components/ai/ChatInput";
import AIThinking from "@/components/ai/AIThinking";

interface AIChatProps {
  initialMessages?: ChatMessageData[];
  title?: string;
  subtitle?: string;
  onWorkflowCreated?: (workflow: unknown) => void;
}

const defaultMessages: ChatMessageData[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm NexaFlow AI. Tell me what you'd like to automate, and I'll turn your request into an actionable workflow.",
    timestamp: "Just now",
  },
];

export default function AIChat({
  initialMessages = defaultMessages,
  title = "NexaFlow AI",
  subtitle = "Turn business requests into automated workflows",
  onWorkflowCreated,
}: AIChatProps) {
  const [messages, setMessages] =
    useState<ChatMessageData[]>(initialMessages);

  const [isThinking, setIsThinking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSend = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isThinking) return;

    setError(null);

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      timestamp: "Just now",
    };

    const conversationMessages = [...messages, userMessage];

    setMessages((current) => [...current, userMessage]);
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages: conversationMessages,
        }),
      });

      let data: {
        success?: boolean;
        message?: string;
        reply?: string;
        response?: string;
        error?: string;
        workflow?: unknown;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {
          error: "The AI server returned an invalid response.",
        };
      }

      console.log("NexaFlow AI response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            "The AI service returned an error. Please try again."
        );
      }

      const aiReply =
        data.message ||
        data.reply ||
        data.response ||
        "I processed your request, but no response was returned.";

      const assistantMessage: ChatMessageData = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiReply,
        timestamp: "Just now",
        workflow: data.workflow,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      if (data.workflow && onWorkflowCreated) {
        onWorkflowCreated(data.workflow);
      }
    } catch (err) {
      console.error("NexaFlow AI chat error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Unable to connect to the AI service right now.";

      setError(message);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <section className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a]">
      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
          <div className="absolute h-5 w-5 animate-pulse rounded-full bg-violet-400/20 blur-md" />

          <svg
            className="relative h-5 w-5 text-violet-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
            <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-white">
            {title}
          </h2>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <p className="truncate text-[10px] text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-500 sm:block">
          AI powered
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-5">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))}

          {isThinking && <AIThinking />}

          {error && (
            <div className="rounded-xl border border-red-400/15 bg-red-500/[0.05] px-4 py-3">
              <div className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>

                <div>
                  <p className="text-xs font-medium text-red-300">
                    AI request failed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-300/80">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && !isThinking && (
            <div className="pt-2">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                Try asking
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Automate customer support inquiries",
                  "Create a lead follow-up workflow",
                  "Prioritize my new leads",
                  "Summarize today's business activity",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      handleSuggestion(suggestion)
                    }
                    disabled={isThinking}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-left text-xs text-slate-400 transition-all duration-200 hover:border-violet-400/15 hover:bg-violet-500/[0.04] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.07] bg-[#070b16] p-4 sm:p-5">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={handleSend}
            disabled={isThinking}
            placeholder="Tell NexaFlow what you want to automate..."
          />

          <p className="mt-2 text-center text-[9px] text-slate-700">
            AI can make mistakes. Review important actions before execution.
          </p>
        </div>
      </div>
    </section>
  );
}
