"use client";

import React, { forwardRef, useId } from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={[
              "w-full rounded-xl border bg-white/[0.03]",
              "px-4 py-3 text-sm text-white",
              "placeholder:text-slate-600",
              "outline-none transition-all duration-200",
              "border-white/10",
              "hover:border-white/15",
              "focus:border-white/25 focus:bg-white/[0.045]",
              "focus:ring-2 focus:ring-white/5",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error
                ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10"
                : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {rightIcon && (
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-xs font-medium text-red-400"
          >
            {error}
          </p>
        )}

        {!error && hint && (
          <p
            id={`${inputId}-hint`}
            className="mt-2 text-xs text-slate-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;