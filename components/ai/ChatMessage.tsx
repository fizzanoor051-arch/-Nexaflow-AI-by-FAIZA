
import WorkflowPreview from "@/components/ai/WorkflowPreview";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  workflow?: unknown;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

function AIIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/10">
      <svg
        className="h-4 w-4 text-violet-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
      </svg>
    </div>
  );
}

function UserIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[10px] font-semibold text-slate-300">
      F
    </div>
  );
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  if (message.role === "system") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
        <p className="text-xs leading-5 text-slate-500">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      {isUser ? <UserIcon /> : <AIIcon />}

      <div
        className={[
          "min-w-0 max-w-[85%] sm:max-w-[75%]",
          isUser ? "items-end" : "items-start",
        ].join(" ")}
      >
        <div
          className={[
            "rounded-2xl px-4 py-3",
            isUser
              ? "rounded-tr-md bg-violet-500/10 text-slate-200 ring-1 ring-violet-400/10"
              : "rounded-tl-md bg-white/[0.035] text-slate-300 ring-1 ring-white/[0.06]",
          ].join(" ")}
        >
          <p className="whitespace-pre-wrap text-sm leading-6">
            {message.content}
          </p>
        </div>

  {message.workflow !== undefined && message.workflow !== null ? (
  <div className="mt-3 w-full min-w-[280px]">
    <WorkflowPreview workflow={message.workflow} />
  </div>
) : null}

        {message.timestamp && (
          <p
            className={[
              "mt-1.5 text-[9px] text-slate-700",
              isUser ? "text-right" : "text-left",
            ].join(" ")}
          >
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
