
"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import AIChat from "@/components/ai/AIChat";

export default function ConversationsPage() {
  const [activeConversation, setActiveConversation] = useState("support");

  const conversations = [
    {
      id: "support",
      name: "AI Support Assistant",
      preview: "Help me handle customer inquiries...",
      time: "2 min ago",
      unread: 2,
    },
    {
      id: "leads",
      name: "Lead Qualification",
      preview: "Analyze the new incoming leads...",
      time: "18 min ago",
      unread: 0,
    },
    {
      id: "automation",
      name: "Automation Planner",
      preview: "Create a workflow for my business...",
      time: "1 hour ago",
      unread: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-400">AI Workspace</p>
        <h1 className="mt-1 text-3xl font-bold text-white">
          Conversations
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Work with your AI assistant and turn conversations into actions.
        </p>
      </div>

      <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-white/[0.02] lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-4">
            <button
              type="button"
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              + New conversation
            </button>
          </div>

          <div className="space-y-1 p-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveConversation(conversation.id)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  activeConversation === conversation.id
                    ? "bg-violet-500/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-white">
                    {conversation.name}
                  </span>

                  {conversation.unread > 0 && (
                    <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[10px] text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>

                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                  {conversation.preview}
                </p>

                <p className="mt-2 text-[10px] text-slate-600">
                  {conversation.time}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[600px] flex-col">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                ✦
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  {conversations.find(
                    (item) => item.id === activeConversation
                  )?.name}
                </h2>
                <p className="text-xs text-emerald-400">
                  ● AI assistant online
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <AIChat />
          </div>
        </section>
      </div>
    </div>
  );
}
