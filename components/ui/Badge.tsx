"use client";

import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlay = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={closeOnOverlay ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
      />

      {/* Modal */}
      <div
        className={[
          "relative z-10 w-full",
          sizeStyles[size],
          "overflow-hidden rounded-2xl",
          "border border-white/10",
          "bg-[#0a0f1f]/95",
          "shadow-[0_24px_100px_rgba(0,0,0,0.55)]",
          "animate-in fade-in zoom-in-95 duration-200",
        ].join(" ")}
      >
        {/* Top glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden="true"
        />

        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold tracking-tight text-white"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1.5 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}