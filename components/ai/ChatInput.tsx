"use client";

import React, {
  KeyboardEvent,
  useRef,
  useState,
} from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export default function ChatInput({
  onSend,
  placeholder = "Type your message...",
  disabled = false,
  maxLength = 2000,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const message = value.trim();

    if (!message || disabled) return;

    onSend(message);
    setValue("");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const nextValue = event.target.value;

    if (nextValue.length <= maxLength) {
      setValue(nextValue);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-2 transition-all duration-200 focus-within:border-violet-400/20 focus-within:bg-white/[0.035]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={2}
        maxLength={maxLength}
        placeholder={placeholder}
        className="block min-h-[58px] w-full resize-none bg-transparent px-3 py-2 pr-14 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="AI message"
      />

      <div className="flex items-center justify-between px-2 pb-1">
        <span className="text-[9px] text-slate-700">
          {value.length > 0
            ? `${value.length}/${maxLength}`
            : "Shift + Enter for a new line"}
        </span>

        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_8px_25px_rgba(139,92,246,0.2)] transition-all duration-200 hover:bg-violet-400 hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          {disabled ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}