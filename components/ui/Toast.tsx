"use client";

import React, { useEffect } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

const variantStyles: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    iconWrapper: string;
    progress: string;
  }
> = {
  success: {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
    iconWrapper: "bg-emerald-500/10 text-emerald-400",
    progress: "bg-emerald-400",
  },

  error: {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    iconWrapper: "bg-red-500/10 text-red-400",
    progress: "bg-red-400",
  },

  warning: {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.3 3.7 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
    iconWrapper: "bg-amber-500/10 text-amber-400",
    progress: "bg-amber-400",
  },

  info: {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </svg>
    ),
    iconWrapper: "bg-sky-500/10 text-sky-400",
    progress: "bg-sky-400",
  },
};

export default function Toast({
  open,
  message,
  title,
  variant = "info",
  duration = 4000,
  onClose,
}: ToastProps) {
  const styles = variantStyles[variant];

  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed right-4 top-4 z-[200] w-[calc(100vw-2rem)] max-w-sm sm:right-6 sm:top-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          "relative overflow-hidden",
          "rounded-2xl",
          "border border-white/10",
          "bg-[#0b1120]/95",
          "p-4",
          "shadow-[0_20px_70px_rgba(0,0,0,0.45)]",
          "backdrop-blur-xl",
          "animate-in slide-in-from-right-5 fade-in duration-200",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              styles.iconWrapper,
            ].join(" ")}
          >
            {styles.icon}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-semibold text-white">
                {title}
              </p>
            )}

            <p
              className={[
                "text-sm leading-5 text-slate-400",
                title ? "mt-0.5" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg
              width="16"
              height="16"
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
        </div>

        {duration > 0 && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
            <div
              className={[
                "h-full origin-left",
                styles.progress,
              ].join(" ")}
              style={{
                animation: `toast-progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}