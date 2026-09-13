import React from "react";

interface AIThinkingProps {
  text?: string;
}

export default function AIThinking({
  text = "NexaFlow is analyzing your request...",
}: AIThinkingProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/10">
        <div className="relative h-4 w-4">
          <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/20" />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300" />
        </div>
      </div>

      <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.025] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
          </div>

          <span className="text-xs text-slate-500">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}