
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AIChat from "@/components/ai/AIChat";
import type { ChatMessageData } from "@/components/ai/ChatMessage";

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  messages: ChatMessageData[];
};

type AnalysisResult = {
  intent: string;
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Negative";
  priority: "Low" | "Medium" | "High" | "Urgent";
  confidence: number;
  suggestion: string;
  action: string;
  actionType: "support" | "refund" | "sales" | "followup";
};

const initialConversations: Conversation[] = [
  {
    id: "support",
    name: "AI Support Assistant",
    preview: "Help me handle customer inquiries...",
    time: "2 min ago",
    unread: 0,
    messages: [
      {
        id: "support-user-1",
        role: "user",
        content: "Help me handle customer inquiries.",
        timestamp: "2 min ago",
      },
      {
        id: "support-ai-1",
        role: "assistant",
        content:
          "Absolutely. I can help you design a customer support workflow, organize incoming inquiries, and automate repetitive support tasks.",
        timestamp: "Just now",
      },
    ],
  },
  {
    id: "leads",
    name: "Lead Qualification",
    preview: "Analyze the new incoming leads...",
    time: "18 min ago",
    unread: 0,
    messages: [
      {
        id: "leads-user-1",
        role: "user",
        content: "Analyze the new incoming leads.",
        timestamp: "18 min ago",
      },
      {
        id: "leads-ai-1",
        role: "assistant",
        content:
          "I can help you qualify leads based on source, intent, engagement, budget, and other business criteria.",
        timestamp: "Just now",
      },
    ],
  },
  {
    id: "automation",
    name: "Automation Planner",
    preview: "Create a workflow for my business...",
    time: "1 hour ago",
    unread: 0,
    messages: [
      {
        id: "automation-user-1",
        role: "user",
        content: "Create a workflow for my business.",
        timestamp: "1 hour ago",
      },
      {
        id: "automation-ai-1",
        role: "assistant",
        content:
          "Sure. Tell me what process you want to automate, and I can help break it into triggers, actions, conditions, and follow-up steps.",
        timestamp: "Just now",
      },
    ],
  },
];

const suggestedPrompts = [
  "Create a customer support workflow",
  "Analyze my latest leads",
  "Build an automation plan",
  "Help me improve this workflow",
];

const STORAGE_KEY = "nexaflow-conversations";

function analyzeCustomerMessage(message: string): AnalysisResult {
  const text = message.toLowerCase();

  const refundWords = [
    "refund",
    "money back",
    "return my money",
    "chargeback",
    "charged",
    "payment",
  ];

  const supportWords = [
    "problem",
    "issue",
    "broken",
    "not working",
    "help",
    "error",
    "complaint",
    "support",
  ];

  const salesWords = [
    "price",
    "pricing",
    "buy",
    "purchase",
    "demo",
    "plan",
    "enterprise",
    "quote",
  ];

  const frustratedWords = [
    "angry",
    "frustrated",
    "waiting",
    "terrible",
    "awful",
    "ridiculous",
    "nobody",
    "worst",
    "again",
    "still",
    "disappointed",
  ];

  const positiveWords = [
    "thanks",
    "thank you",
    "great",
    "excellent",
    "love",
    "happy",
    "awesome",
  ];

  const containsAny = (words: string[]) =>
    words.some((word) => text.includes(word));

  if (containsAny(refundWords)) {
    const frustrated = containsAny(frustratedWords);

    return {
      intent: "Refund Request",
      sentiment: frustrated ? "Frustrated" : "Neutral",
      priority: frustrated ? "High" : "Medium",
      confidence: frustrated ? 96 : 92,
      suggestion: frustrated
        ? "Apologize for the inconvenience, confirm the refund request, and escalate the case to support."
        : "Confirm the refund request and guide the customer through the refund process.",
      action: "Offer refund + create support task",
      actionType: "refund",
    };
  }

  if (containsAny(salesWords)) {
    return {
      intent: "Sales Inquiry",
      sentiment: containsAny(positiveWords)
        ? "Positive"
        : "Neutral",
      priority: "Medium",
      confidence: 89,
      suggestion:
        "Answer the customer's pricing question and offer a product demo or sales follow-up.",
      action: "Route to sales + create follow-up",
      actionType: "sales",
    };
  }

  if (containsAny(supportWords)) {
    const frustrated = containsAny(frustratedWords);

    return {
      intent: "Customer Support",
      sentiment: frustrated ? "Frustrated" : "Neutral",
      priority: frustrated ? "High" : "Medium",
      confidence: frustrated ? 94 : 87,
      suggestion: frustrated
        ? "Acknowledge the customer's frustration, apologize, and provide a clear next step."
        : "Understand the issue and provide a clear troubleshooting or support response.",
      action: "Create support task",
      actionType: "support",
    };
  }

  if (containsAny(positiveWords)) {
    return {
      intent: "General Inquiry",
      sentiment: "Positive",
      priority: "Low",
      confidence: 82,
      suggestion:
        "Respond positively and offer additional assistance if needed.",
      action: "Continue conversation",
      actionType: "followup",
    };
  }

  return {
    intent: "General Inquiry",
    sentiment: "Neutral",
    priority: "Medium",
    confidence: 78,
    suggestion:
      "Ask a concise follow-up question to understand the customer's request.",
    action: "Create follow-up task",
    actionType: "followup",
  };
}

function getSuggestedReply(
  message: string,
  analysis: AnalysisResult
) {
  const lower = message.toLowerCase();

  if (analysis.intent === "Refund Request") {
    if (analysis.sentiment === "Frustrated") {
      return "I'm sorry for the frustration and the delay. I understand you're requesting a refund. I'll help get this reviewed by our support team and make sure your request is handled as quickly as possible.";
    }

    return "Thanks for reaching out. I understand you'd like to request a refund. I'll help get your request reviewed and guide you through the next steps.";
  }

  if (analysis.intent === "Sales Inquiry") {
    return "Thanks for your interest. I'd be happy to help with pricing and the available plans. We can also arrange a quick demo to find the best option for your needs.";
  }

  if (lower.includes("not working") || lower.includes("error")) {
    return "I'm sorry you're experiencing this issue. Could you share the exact error message or the step where the problem occurs? I'll help you troubleshoot it.";
  }

  if (analysis.sentiment === "Positive") {
    return "Thank you for reaching out. I'm glad to help. Let me know what you'd like to work on next.";
  }

  return "Thanks for reaching out. I can help with that. Could you share a little more detail so I can point you in the right direction?";
}

export default function ConversationsPage() {
  const [conversationList, setConversationList] =
    useState<Conversation[]>(initialConversations);

  const [activeConversation, setActiveConversation] =
    useState("support");

  const [search, setSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedPrompt, setSelectedPrompt] =
    useState<string | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [taskCreated, setTaskCreated] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversationList(parsed);

          const firstConversation = parsed[0];

          if (firstConversation?.id) {
            setActiveConversation(firstConversation.id);
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to load NexaFlow conversations:",
        error
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversationList)
      );
    } catch (error) {
      console.error(
        "Failed to save NexaFlow conversations:",
        error
      );
    }
  }, [conversationList, isHydrated]);

  const active = useMemo(
    () =>
      conversationList.find(
        (item) => item.id === activeConversation
      ),
    [conversationList, activeConversation]
  );

  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return conversationList;
    }

    return conversationList.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(value) ||
        conversation.preview.toLowerCase().includes(value)
    );
  }, [conversationList, search]);

  const lastCustomerMessage = useMemo(() => {
    if (!active?.messages?.length) return "";

    const userMessages = active.messages.filter(
      (message) => message.role === "user"
    );

    return userMessages[userMessages.length - 1]?.content || "";
  }, [active]);

  const analysis = useMemo(() => {
    if (!lastCustomerMessage.trim()) {
      return {
        intent: "Waiting for message",
        sentiment: "Neutral" as const,
        priority: "Low" as const,
        confidence: 0,
        suggestion:
          "Send a customer message to start AI analysis.",
        action: "Waiting for input",
        actionType: "followup" as const,
      };
    }

    return analyzeCustomerMessage(lastCustomerMessage);
  }, [lastCustomerMessage]);

  const suggestedReply = useMemo(() => {
    if (!lastCustomerMessage.trim()) {
      return "Your AI-generated reply will appear here after a customer message is detected.";
    }

    return getSuggestedReply(
      lastCustomerMessage,
      analysis
    );
  }, [lastCustomerMessage, analysis]);

  const handleSuggestedPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);

    window.dispatchEvent(
      new CustomEvent("nexaflow:set-chat-input", {
        detail: {
          prompt,
        },
      })
    );
  };

  const handleClearConversation = () => {
    setSelectedPrompt(null);
    setTaskCreated(false);

    setConversationList((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation
          ? {
              ...conversation,
              preview: "Start a new AI conversation...",
              time: "Just now",
              unread: 0,
              messages: [],
            }
          : conversation
      )
    );
  };

  const handleNewConversation = () => {
    const newId = `conversation-${Date.now()}`;

    const newConversation: Conversation = {
      id: newId,
      name: "New conversation",
      preview: "Start a new AI conversation...",
      time: "Just now",
      unread: 0,
      messages: [],
    };

    setConversationList((current) => [
      newConversation,
      ...current,
    ]);

    setActiveConversation(newId);
    setSelectedPrompt(null);
    setTaskCreated(false);
  };

  const handleDeleteConversation = (
    event: React.MouseEvent,
    conversationId: string
  ) => {
    event.stopPropagation();

    const remaining = conversationList.filter(
      (conversation) => conversation.id !== conversationId
    );

    if (remaining.length === 0) {
      const newId = `conversation-${Date.now()}`;

      const newConversation: Conversation = {
        id: newId,
        name: "New conversation",
        preview: "Start a new AI conversation...",
        time: "Just now",
        unread: 0,
        messages: [],
      };

      setConversationList([newConversation]);
      setActiveConversation(newId);
      setSelectedPrompt(null);
      setTaskCreated(false);

      return;
    }

    setConversationList(remaining);

    if (conversationId === activeConversation) {
      setActiveConversation(remaining[0].id);
      setSelectedPrompt(null);
      setTaskCreated(false);
    }
  };

  const handleMessagesChange = useCallback(
    (messages: ChatMessageData[]) => {
      setTaskCreated(false);

      setConversationList((current) =>
        current.map((conversation) => {
          if (conversation.id !== activeConversation) {
            return conversation;
          }

          const lastMessage =
            messages[messages.length - 1];

          const userMessages = messages.filter(
            (message) => message.role === "user"
          );

          const firstUserMessage =
            userMessages[0]?.content?.trim();

          let conversationName =
            conversation.name;

          if (
            conversation.name === "New conversation" &&
            firstUserMessage
          ) {
            conversationName =
              firstUserMessage.length > 30
                ? `${firstUserMessage.slice(0, 30)}...`
                : firstUserMessage;
          }

          return {
            ...conversation,
            name: conversationName,
            preview:
              lastMessage?.content ||
              "Start a new AI conversation...",
            time: "Just now",
            unread: 0,
            messages,
          };
        })
      );
    },
    [activeConversation]
  );

  const handleAnalyze = () => {
    if (!lastCustomerMessage.trim()) return;

    setIsAnalyzing(true);
    setTaskCreated(false);

    window.setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);
  };

  
const handleAction = async () => {
  if (
    !lastCustomerMessage.trim() ||
    actionLoading ||
    analysis.action === "Continue conversation"
  ) {
    return;
  }

  setActionLoading(true);
  setTaskCreated(false);

  try {
    const response = await fetch("/api/ai/actions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: analysis.actionType,
        customerMessage: lastCustomerMessage,
        intent: analysis.intent,
        priority: analysis.priority,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to execute AI action."
      );
    }

    console.log("NexaFlow AI action executed:", data);

    setTaskCreated(true);
  } catch (error) {
    console.error("AI action execution error:", error);
  } finally {
    setActionLoading(false);
  }
};


 
       

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#151713] text-[#F4F0E6]">
      {/* =========================================================
          PREMIUM ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#151713]">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5D642F]/[0.045] blur-[150px]" />

        <div className="absolute right-[-180px] top-[14%] h-[520px] w-[520px] rounded-full bg-[#E7B84B]/[0.022] blur-[160px]" />

        <div className="absolute bottom-[-260px] left-[30%] h-[520px] w-[520px] rounded-full bg-[#252A22]/80 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.014]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #F5D98B 1px, transparent 1px),
              linear-gradient(to bottom, #F5D98B 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#151713_84%)]" />
      </div>

      {/* =========================================================
          CHAT HISTORY DRAWER
      ========================================================== */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
            onClick={() => setSidebarOpen(false)}
          />

          <aside
            className="
              absolute left-0 top-0 h-full
              w-[30vw]
              min-w-[310px]
              max-w-[500px]
              overflow-y-auto
              border-r border-[#F5D98B]/[0.10]
              bg-[#121410]
              shadow-[20px_0_80px_rgba(0,0,0,0.55)]
            "
          >
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/60 to-transparent" />

            <div className="sticky top-0 z-10 border-b border-[#F5D98B]/[0.08] bg-[#121410]/95 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7B84B]/20 bg-[#E7B84B]/[0.07] shadow-[inset_0_1px_0_rgba(245,217,139,0.08)]">
                    <span className="text-base">🤖</span>

                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#121410] bg-[#5ED6A0]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#F4F0E6]">
                      Chat History
                    </p>

                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#777D70]">
                      AI conversation archive
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  title="Close chat history"
                  aria-label="Close chat history"
                  onClick={() => setSidebarOpen(false)}
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-xl border border-[#F5D98B]/[0.08]
                    bg-[#1B1F19]
                    text-sm text-[#777D70]
                    transition-all duration-300
                    hover:border-[#E87575]/30
                    hover:bg-[#E87575]/[0.07]
                    hover:text-[#E87575]
                  "
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="border-b border-[#F5D98B]/[0.07] p-4">
              <button
                type="button"
                onClick={handleNewConversation}
                className="
                  group flex w-full items-center justify-center gap-2
                  rounded-xl bg-[#E7B84B] px-4 py-3
                  text-sm font-bold text-[#17150D]
                  shadow-[0_10px_30px_rgba(231,184,75,0.10)]
                  transition-all duration-300
                  hover:bg-[#F5D98B]
                  hover:shadow-[0_0_30px_rgba(231,184,75,0.22)]
                "
              >
                <span className="text-base transition-transform duration-300 group-hover:rotate-90">
                  ＋
                </span>

                New conversation
              </button>

              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#777D70]">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search conversations..."
                  className="
                    h-10 w-full rounded-xl
                    border border-[#F5D98B]/[0.08]
                    bg-[#151713]
                    pl-9 pr-3
                    text-xs text-[#F4F0E6]
                    outline-none
                    placeholder:text-[#62665D]
                    transition-all
                    focus:border-[#E7B84B]/35
                    focus:bg-[#1B1F19]
                    focus:shadow-[0_0_20px_rgba(231,184,75,0.05)]
                  "
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-2 pt-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#777D70]">
                Your conversations
              </p>

              <span className="rounded-full border border-[#F5D98B]/[0.08] bg-[#1B1F19] px-2 py-0.5 text-[10px] text-[#8B8F85]">
                {filteredConversations.length}
              </span>
            </div>

            <div className="space-y-1.5 px-3 pb-6">
              {filteredConversations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#F5D98B]/[0.08] px-3 py-8 text-center text-xs text-[#62665D]">
                  No conversations found.
                </div>
              ) : (
                filteredConversations.map(
                  (conversation) => {
                    const isActive =
                      activeConversation ===
                      conversation.id;

                    return (
                      <div
                        key={conversation.id}
                        className={`
                          group relative w-full rounded-2xl
                          border transition-all duration-300
                          ${
                            isActive
                              ? "border-[#E7B84B]/25 bg-[#E7B84B]/[0.055] shadow-[0_0_25px_rgba(231,184,75,0.045)]"
                              : "border-transparent hover:border-[#F5D98B]/[0.07] hover:bg-[#1B1F19]"
                          }
                        `}
                      >
                        {isActive && (
                          <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.7)]" />
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveConversation(
                              conversation.id
                            );
                            setSelectedPrompt(null);
                            setTaskCreated(false);
                            setSidebarOpen(false);
                          }}
                          className="w-full p-4 pr-12 text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                flex h-10 w-10 shrink-0
                                items-center justify-center
                                rounded-xl border text-base
                                transition-all
                                ${
                                  isActive
                                    ? "border-[#E7B84B]/30 bg-[#E7B84B]/10 shadow-[0_0_15px_rgba(231,184,75,0.08)]"
                                    : "border-[#F5D98B]/[0.08] bg-[#1B1F19]"
                                }
                              `}
                            >
                              🤖
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <span
                                  className={`
                                    truncate text-xs font-semibold
                                    ${
                                      isActive
                                        ? "text-[#F5D98B]"
                                        : "text-[#C3C6BC]"
                                    }
                                  `}
                                >
                                  {conversation.name}
                                </span>

                                {conversation.unread >
                                  0 && (
                                  <span className="shrink-0 rounded-full bg-[#E7B84B] px-1.5 py-0.5 text-[9px] font-bold text-[#17150D]">
                                    {conversation.unread}
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#777D70]">
                                {conversation.preview}
                              </p>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] text-[#62665D]">
                                  {conversation.time}
                                </span>

                                <span
                                  className={`
                                    text-sm transition-all
                                    ${
                                      isActive
                                        ? "text-[#E7B84B] opacity-100"
                                        : "translate-x-1 text-[#62665D] opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                                    }
                                  `}
                                >
                                  →
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          title="Delete conversation"
                          aria-label={`Delete ${conversation.name}`}
                          onClick={(event) =>
                            handleDeleteConversation(
                              event,
                              conversation.id
                            )
                          }
                          className="
                            absolute right-3 top-3
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border border-transparent
                            text-[#777D70]
                            opacity-0
                            transition-all duration-200
                            group-hover:opacity-100
                            hover:border-[#E87575]/20
                            hover:bg-[#E87575]/[0.07]
                            hover:text-[#E87575]
                          "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    );
                  }
                )
              )}
            </div>

            <div className="border-t border-[#F5D98B]/[0.07] p-4">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#777D70]">
                AI capabilities
              </p>

              <div className="space-y-1">
                {[
                  ["✦", "Workflow planning"],
                  ["⌁", "Lead analysis"],
                  ["◈", "Task automation"],
                  ["◇", "Business assistance"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[11px] text-[#8B8F85] transition-colors hover:bg-[#1B1F19] hover:text-[#C3C6BC]"
                  >
                    <span className="text-[#E7B84B]">
                      {icon}
                    </span>

                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =========================================================
          MAIN WORKSPACE
      ========================================================== */}

      <div className="relative mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex shrink-0 flex-col items-start gap-2">
                <Link
                  href="/dashboard"
                  className="
                    group mt-1 inline-flex h-10 shrink-0
                    items-center gap-2 rounded-xl
                    border border-[#F5D98B]/[0.08]
                    bg-[#20241D]/80 px-3.5
                    text-sm font-medium text-[#9A9D94]
                    transition-all duration-300
                    hover:border-[#E7B84B]/35
                    hover:bg-[#252A22]
                    hover:text-[#F5D98B]
                    hover:shadow-[0_0_25px_rgba(231,184,75,0.08)]
                  "
                >
                  <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  <span className="hidden sm:inline">
                    Dashboard
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open chat history"
                  title="Open chat history"
                  className="
                    group inline-flex h-10 shrink-0
                    items-center gap-2 rounded-xl
                    border border-[#E7B84B]/20
                    bg-[#E7B84B]/[0.055]
                    px-3.5 text-sm font-medium text-[#D4B55E]
                    transition-all duration-300
                    hover:border-[#E7B84B]/40
                    hover:bg-[#E7B84B]/[0.10]
                    hover:text-[#F5D98B]
                    hover:shadow-[0_0_22px_rgba(231,184,75,0.10)]
                  "
                >
                  <span className="text-lg leading-none transition-transform duration-300 group-hover:scale-110">
                    ☰
                  </span>

                  <span className="hidden sm:inline">
                    Chats
                  </span>
                </button>
              </div>

              <div className="mt-1 h-[84px] w-px bg-gradient-to-b from-transparent via-[#F5D98B]/[0.12] to-transparent" />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7B84B]/20 bg-[#E7B84B]/[0.055] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#DDBD66]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.65)]" />
                    AI Workspace
                  </span>

                  <span className="hidden text-xs text-[#62665D] sm:inline">
                    /
                  </span>

                  <span className="hidden text-xs text-[#777D70] sm:inline">
                    Conversations
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-[#F4F0E6] sm:text-3xl">
                    AI Conversations
                  </h1>

                  <span className="hidden rounded-md border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.06] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#5ED6A0] md:inline-flex">
                    Live
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm text-[#8B8F85]">
                  Talk to your AI assistant, analyze customer intent,
                  and turn conversations into actions.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-[#F5D98B]/[0.08] bg-[#20241D]/75 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#8B8F85] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.7)]" />
                AI system operational
              </div>
            </div>
          </div>
        </header>

        <section
          className="
            relative grid min-h-[calc(100vh-175px)]
            overflow-hidden rounded-[26px]
            border border-[#F5D98B]/[0.09]
            bg-[#1B1F19]/95
            shadow-[0_25px_80px_rgba(0,0,0,0.38)]
            xl:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#E7B84B]/45 to-transparent" />

          {/* =====================================================
              CHAT AREA
          ====================================================== */}

          <section className="relative flex min-h-[650px] min-w-0 flex-col bg-[radial-gradient(circle_at_50%_0%,rgba(231,184,75,0.035),transparent_34%)]">
            <div className="flex items-center justify-between border-b border-[#F5D98B]/[0.07] bg-[#20241D]/55 px-4 py-3.5 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.07] text-xl shadow-[0_0_22px_rgba(231,184,75,0.06),inset_0_1px_0_rgba(245,217,139,0.08)]">
                  🤖

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#20241D] bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-bold text-[#F4F0E6]">
                      {active?.name || "AI Assistant"}
                    </h2>

                    <span className="hidden rounded-md border border-[#E7B84B]/15 bg-[#E7B84B]/[0.05] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#D5B45A] sm:inline-flex">
                      AI
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5ED6A0] shadow-[0_0_7px_rgba(94,214,160,0.8)]" />

                    <span className="text-[10px] text-[#5ED6A0]">
                      Online & ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                title="Clear conversation"
                aria-label="Clear conversation"
                onClick={handleClearConversation}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-[#F5D98B]/[0.07]
                  bg-[#151713]/50 text-sm text-[#777D70]
                  transition-all
                  hover:border-[#E87575]/20
                  hover:bg-[#E87575]/[0.05]
                  hover:text-[#E87575]
                "
              >
                ♲
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
              <div className="relative mb-4 overflow-hidden rounded-2xl border border-[#E7B84B]/10 bg-[#E7B84B]/[0.025] px-4 py-3">
                <div className="relative flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E7B84B]/10 bg-[#151713] text-sm">
                    ✦
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#E5C56C]">
                      AI intelligence is active
                    </p>

                    <p className="mt-0.5 text-[10px] leading-5 text-[#777D70]">
                      Messages can be analyzed for intent, sentiment,
                      priority, and recommended actions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#F5D98B]/[0.06] bg-[#151713]/65 shadow-[inset_0_1px_0_rgba(245,217,139,0.025)]">
                <AIChat
                  key={activeConversation}
                  initialMessages={active?.messages || []}
                  title={active?.name || "NexaFlow AI"}
                  onMessagesChange={handleMessagesChange}
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E7B84B]/30" />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#777D70]">
                      Try asking
                    </p>
                  </div>

                  <span className="hidden text-[9px] text-[#62665D] sm:inline">
                    AI-powered suggestions
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {suggestedPrompts.map((prompt) => {
                    const isSelected =
                      selectedPrompt === prompt;

                    return (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() =>
                          handleSuggestedPrompt(prompt)
                        }
                        className={`
                          group relative flex items-center justify-between
                          gap-2 overflow-hidden rounded-xl border
                          px-3 py-2.5 text-left text-[10px]
                          transition-all duration-300
                          ${
                            isSelected
                              ? "border-[#E7B84B]/35 bg-[#E7B84B]/[0.07] text-[#F5D98B] shadow-[0_0_18px_rgba(231,184,75,0.06)]"
                              : "border-[#F5D98B]/[0.07] bg-[#20241D]/65 text-[#8B8F85] hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B]"
                          }
                        `}
                      >
                        <span className="line-clamp-1 pl-1">
                          {prompt}
                        </span>

                        <span className="shrink-0 text-[#62665D] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#E7B84B]">
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#F5D98B]/[0.06] bg-[#20241D]/30 px-4 py-2.5 text-[9px] text-[#62665D] sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-[#E7B84B]">✦</span>

                <span>AI Assistant</span>

                <span className="text-[#454941]">•</span>

                <span>Secure workspace</span>
              </div>

              <span className="hidden sm:inline">
                Enter to send · Shift + Enter for new line
              </span>
            </div>
          </section>

          {/* =====================================================
              AI INTELLIGENCE PANEL
          ====================================================== */}

          <aside className="relative border-t border-[#F5D98B]/[0.08] bg-[#151713]/70 xl:border-l xl:border-t-0">
            <div className="sticky top-0 flex max-h-[calc(100vh-175px)] min-h-[650px] flex-col">
              {/* Panel header */}
              <div className="border-b border-[#F5D98B]/[0.07] bg-[#20241D]/65 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.8)]" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5ED6A0]">
                        AI Intelligence
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-sm font-bold text-[#F4F0E6]">
                      Conversation Analysis
                    </h3>
                  </div>

                  <div className="rounded-lg border border-[#E7B84B]/15 bg-[#E7B84B]/[0.05] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#DDBD66]">
                    AI
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Customer message */}
                <div className="mb-4 rounded-2xl border border-[#F5D98B]/[0.07] bg-[#20241D]/55 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777D70]">
                      Customer message
                    </span>

                    <span className="text-[9px] text-[#62665D]">
                      Live
                    </span>
                  </div>

                  <p className="text-xs leading-5 text-[#C3C6BC]">
                    {lastCustomerMessage ||
                      "Waiting for a customer message..."}
                  </p>
                </div>

                {/* Analyze button */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={
                    isAnalyzing ||
                    !lastCustomerMessage.trim()
                  }
                  className="
                    mb-4 flex w-full items-center justify-center gap-2
                    rounded-xl border border-[#E7B84B]/20
                    bg-[#E7B84B]/[0.055]
                    px-4 py-2.5
                    text-[10px] font-bold uppercase tracking-[0.12em]
                    text-[#E5C56C]
                    transition-all duration-300
                    hover:border-[#E7B84B]/35
                    hover:bg-[#E7B84B]/[0.10]
                    hover:shadow-[0_0_24px_rgba(231,184,75,0.08)]
                    disabled:cursor-not-allowed disabled:opacity-40
                  "
                >
                  <span className={isAnalyzing ? "animate-spin" : ""}>
                    ✦
                  </span>

                  {isAnalyzing
                    ? "Analyzing..."
                    : "Analyze conversation"}
                </button>

                {/* Intelligence grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#8D7AFF]/15 bg-[#8D7AFF]/[0.035] p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#777D70]">
                      Intent
                    </p>

                    <p className="mt-1.5 text-xs font-bold text-[#D8D2FF]">
                      {analysis.intent}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E87575]/15 bg-[#E87575]/[0.035] p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#777D70]">
                      Sentiment
                    </p>

                    <p className="mt-1.5 text-xs font-bold text-[#F2B4B4]">
                      {analysis.sentiment}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7B84B]/15 bg-[#E7B84B]/[0.035] p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#777D70]">
                      Priority
                    </p>

                    <p className="mt-1.5 text-xs font-bold text-[#F5D98B]">
                      {analysis.priority}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.035] p-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#777D70]">
                      Confidence
                    </p>

                    <p className="mt-1.5 text-xs font-bold text-[#9BE9C5]">
                      {analysis.confidence}%
                    </p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3 rounded-xl border border-[#F5D98B]/[0.06] bg-[#20241D]/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#777D70]">
                      AI confidence
                    </span>

                    <span className="text-[9px] text-[#9A9D94]">
                      {analysis.confidence}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#2A2E26]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8D7AFF] via-[#E7B84B] to-[#5ED6A0] transition-all duration-700"
                      style={{
                        width: `${analysis.confidence}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Suggested reply */}
                <div className="mt-4 rounded-2xl border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.025] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777D70]">
                      Suggested reply
                    </p>

                    <span className="rounded-md border border-[#5ED6A0]/15 bg-[#5ED6A0]/[0.05] px-1.5 py-0.5 text-[8px] font-bold text-[#79DDB0]">
                      AI GENERATED
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#C3C6BC]">
                    {suggestedReply}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent(
                          "nexaflow:set-chat-input",
                          {
                            detail: {
                              prompt: suggestedReply,
                            },
                          }
                        )
                      );
                    }}
                    className="
                      mt-3 w-full rounded-lg
                      border border-[#5ED6A0]/15
                      bg-[#5ED6A0]/[0.045]
                      px-3 py-2
                      text-[9px] font-bold uppercase tracking-[0.12em]
                      text-[#8DE4BC]
                      transition-all
                      hover:border-[#5ED6A0]/30
                      hover:bg-[#5ED6A0]/[0.08]
                    "
                  >
                    Use suggested reply →
                  </button>
                </div>

                {/* Recommended action */}
                <div className="mt-4 rounded-2xl border border-[#E7B84B]/20 bg-[#E7B84B]/[0.035] p-4 shadow-[0_0_30px_rgba(231,184,75,0.025)]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7B84B]/15 bg-[#E7B84B]/[0.06] text-sm text-[#E7B84B]">
                      ⚡
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#777D70]">
                        Recommended action
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-[#F5D98B]">
                        {analysis.action}
                      </p>
                    </div>
                  </div>

                  {taskCreated ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#5ED6A0]/20 bg-[#5ED6A0]/[0.06] px-3 py-2 text-[9px] font-semibold text-[#8DE4BC]">
                      <span>✓</span>
                      Support action executed — task created
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAction}
                      disabled={
                        actionLoading ||
                        !lastCustomerMessage.trim() ||
                        analysis.action ===
                          "Continue conversation"
                      }
                      className="
                        mt-3 flex w-full items-center justify-center gap-2
                        rounded-xl
                        bg-[#E7B84B]
                        px-4 py-2.5
                        text-[10px] font-bold uppercase tracking-[0.12em]
                        text-[#17150D]
                        transition-all duration-300
                        hover:bg-[#F5D98B]
                        hover:shadow-[0_0_25px_rgba(231,184,75,0.16)]
                        disabled:cursor-not-allowed disabled:opacity-40
                      "
                    >
                      {actionLoading
                        ? "Executing action..."
                        : "Execute AI action →"}
                    </button>
                  )}
                </div>

                {/* Processing pipeline */}
                <div className="mt-4 rounded-2xl border border-[#F5D98B]/[0.06] bg-[#20241D]/35 p-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#777D70]">
                    AI processing pipeline
                  </p>

                  <div className="space-y-2">
                    {[
                      ["01", "Message detected", true],
                      ["02", "Intent classified", true],
                      ["03", "Sentiment analyzed", true],
                      ["04", "Priority assigned", true],
                      ["05", "Action recommended", true],
                    ].map(([number, label, complete]) => (
                      <div
                        key={String(number)}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#F5D98B]/[0.08] bg-[#151713] text-[8px] font-bold text-[#777D70]">
                          {number}
                        </span>

                        <span className="flex-1 text-[10px] text-[#9A9D94]">
                          {label}
                        </span>

                        <span
                          className={
                            complete
                              ? "text-[10px] text-[#5ED6A0]"
                              : "text-[#62665D]"
                          }
                        >
                          ✓
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F5D98B]/[0.06] bg-[#20241D]/25 px-4 py-3">
                <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.13em] text-[#62665D]">
                  <span>NexaFlow AI</span>
                  <span>Decision engine ready</span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-4 flex flex-col items-center justify-between gap-2 px-1 text-[9px] text-[#62665D] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#5ED6A0]" />
            <span>NexaFlow AI Workspace</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Conversations</span>
            <span className="text-[#454941]">•</span>
            <span>Workflows</span>
            <span className="text-[#454941]">•</span>
            <span>Automation</span>
          </div>
        </div>
      </div>
    </main>
  );
}
