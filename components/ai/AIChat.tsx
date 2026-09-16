"use client";

import React, { useEffect, useState } from "react";
import ChatMessage, {
  ChatMessageData,
} from "@/components/ai/ChatMessage";
import ChatInput from "@/components/ai/ChatInput";
import AIThinking from "@/components/ai/AIThinking";
import type { AIPageContextData } from "@/components/ai/AIPageContext";

type AIActionResult = {
  action?: string;
  message?: string;
  task?: {
    id?: string;
    title?: string;
    assignee?: string;
    dueDate?: string;
    dueTime?: string;
  };
  lead?: {
    id?: string;
    name?: string;
    status?: string;
  };
};

interface AIChatProps {
  initialMessages?: ChatMessageData[];
  title?: string;
  subtitle?: string;
  onMessagesChange?: (
    messages: ChatMessageData[]
  ) => void;
  pageContext?: AIPageContextData;
}

const defaultMessages: ChatMessageData[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm NexaFlow AI. Ask me anything about your business, leads, tasks, workflows, or automation ideas.",
    timestamp: "Just now",
  },
];

export default function AIChat({
  initialMessages = defaultMessages,
  title = "NexaFlow AI",
  subtitle = "Your AI business assistant",
  onMessagesChange,
  pageContext,
}: AIChatProps) {
  const [messages, setMessages] =
    useState<ChatMessageData[]>(initialMessages);

  const [isThinking, setIsThinking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [actionResult, setActionResult] =
    useState<AIActionResult | null>(null);

  const [actionConfirming, setActionConfirming] =
    useState(false);

  const [pendingActionMessage, setPendingActionMessage] =
    useState<string | null>(null);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  const handleSend = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isThinking) return;

    setActionResult(null);
    setPendingActionMessage(null);
    setActionConfirming(false);
    setError(null);

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      timestamp: "Just now",
    };

    const conversationMessages = [
      ...messages,
      userMessage,
    ];

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

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

          /*
           * Current page context is now sent to the AI API.
           */
          pageContext: pageContext
            ? {
                pageName: pageContext.pageName,
                pageDescription:
                  pageContext.pageDescription,
                route: pageContext.route,
                entityId: pageContext.entityId,
                details: pageContext.details,
              }
            : undefined,
        }),
      });

      let data: {
        success?: boolean;
        message?: string;
        reply?: string;
        response?: string;
        error?: string;
        action?: string;
        requiresConfirmation?: boolean;
        actionPreview?: string;
        actionData?: Record<string, unknown>;
        task?: AIActionResult["task"];
        lead?: AIActionResult["lead"];
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {
          error:
            "The AI server returned an invalid response.",
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

      if (
        data.requiresConfirmation &&
        data.action
      ) {
        setPendingActionMessage(trimmedMessage);
        setActionConfirming(true);

        setActionResult({
          action: data.action,
          message:
            data.actionPreview ||
            data.message ||
            "NexaFlow AI is ready to perform this action.",
          task: data.task,
          lead: data.lead,
        });
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
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (err) {
      console.error(
        "NexaFlow AI chat error:",
        err
      );

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to connect to the AI service right now.";

      setError(errorMessage);
    } finally {
      setIsThinking(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingActionMessage || isThinking) {
      return;
    }

    setError(null);
    setActionConfirming(false);
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: pendingActionMessage,
          pageContext: pageContext
            ? {
                pageName: pageContext.pageName,
                pageDescription:
                  pageContext.pageDescription,
                route: pageContext.route,
                entityId: pageContext.entityId,
                details: pageContext.details,
              }
            : undefined,
        }),
      });

      let data: {
        success?: boolean;
        message?: string;
        error?: string;
        action?: string;
        task?: AIActionResult["task"];
        lead?: AIActionResult["lead"];
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {
          error:
            "The action server returned an invalid response.",
        };
      }

      console.log(
        "NexaFlow AI action response:",
        {
          status: response.status,
          ok: response.ok,
          data,
        }
      );

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            "The AI action could not be completed."
        );
      }

      const result: AIActionResult = {
        action: data.action,
        message:
          data.message ||
          "Action completed successfully.",
        task: data.task,
        lead: data.lead,
      };

      setActionResult(result);

      const successMessage: ChatMessageData = {
        id: `assistant-action-${Date.now()}`,
        role: "assistant",
        content:
          data.message ||
          "Done — the requested action was completed successfully.",
        timestamp: "Just now",
      };

      setMessages((current) => [
        ...current,
        successMessage,
      ]);

      /*
       * Notify other NexaFlow UI sections that an AI action
       * has completed so they can refresh their data.
       */
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(
            "nexaflow-ai-action-completed",
            {
              detail: result,
            }
          )
        );
      }

      setPendingActionMessage(null);
    } catch (err) {
      console.error(
        "NexaFlow AI action error:",
        err
      );

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to complete the AI action.";

      setError(errorMessage);
      setActionConfirming(true);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCancelAction = () => {
    setActionConfirming(false);
    setPendingActionMessage(null);
    setActionResult(null);
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-none border-0 bg-[#080d1a]">
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

          {/* AI Action Confirmation */}
          {actionConfirming &&
            pendingActionMessage && (
              <div className="rounded-2xl border border-[#E7B84B]/20 bg-[#E7B84B]/[0.05] p-4 shadow-[0_0_30px_rgba(231,184,75,0.05)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/10">
                    <svg
                      className="h-4 w-4 text-[#F5D98B]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#F5D98B]">
                      Confirm AI action
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {actionResult?.message ||
                        "NexaFlow AI is ready to perform this action."}
                    </p>

                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                        Requested action
                      </p>

                      <p className="mt-1 text-xs text-slate-300">
                        {pendingActionMessage}
                      </p>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmAction}
                        disabled={isThinking}
                        className="rounded-lg bg-[#E7B84B] px-3.5 py-2 text-xs font-semibold text-[#151713] transition hover:bg-[#F5D98B] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Confirm & Run
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelAction}
                        disabled={isThinking}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Completed AI Action */}
          {actionResult &&
            !actionConfirming &&
            actionResult.action && (
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/[0.05] px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                    <svg
                      className="h-3 w-3 text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-300">
                      AI action completed
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-300/80">
                      {actionResult.message ||
                        "The requested action was completed successfully."}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
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

          {messages.length === 0 &&
            !isThinking && (
              <div className="pt-8">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.06]">
                    <svg
                      className="h-7 w-7 text-violet-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
                    </svg>
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    Start a new conversation
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Ask NexaFlow AI anything about your business.
                  </p>
                </div>

                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                  Try asking
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "How can I improve my customer support?",
                    "Help me organize my leads",
                    "How can I automate repetitive tasks?",
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
            placeholder="Ask NexaFlow anything..."
          />

          <p className="mt-2 text-center text-[9px] text-slate-700">
            AI can make mistakes. Review important information before acting on it.
          </p>
        </div>
      </div>
    </section>
  );
}