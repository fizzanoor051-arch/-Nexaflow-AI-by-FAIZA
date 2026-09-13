"use client";

import { useCallback, useState } from "react";
import type {
  AIMessage,
  AIRequest,
  AIResponse,
} from "@/types/ai";

interface UseAIReturn {
  messages: AIMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (
    message: string,
    conversationId?: string
  ) => Promise<AIResponse | null>;
  clearMessages: () => void;
}

export function useAI(): UseAIReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (
      message: string,
      conversationId?: string
    ): Promise<AIResponse | null> => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || loading) {
        return null;
      }

      setLoading(true);
      setError(null);

      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        userMessage,
      ]);

      try {
        const request: AIRequest = {
          message: trimmedMessage,
          messages: [...messages, userMessage],
          conversationId,
        };

        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        const data: AIResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to get AI response."
          );
        }

        if (data.message) {
          const assistantMessage: AIMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date().toISOString(),
          };

          setMessages((previous) => [
            ...previous,
            assistantMessage,
          ]);
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong.";

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}