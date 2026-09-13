"use client";

import React, { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  width?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const widthStyles = {
  sm: "w-40",
  md: "w-52",
  lg: "w-64",
};

export default function Dropdown({
  trigger,
  items,
  align = "right",
  width = "md",
  disabled = false,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    item.onClick?.();
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={["relative inline-block", className]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={[
          "inline-flex items-center justify-center",
          "outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-white/20",
        ].join(" ")}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute z-50 mt-2 overflow-hidden",
            widthStyles[width],
            align === "right" ? "right-0" : "left-0",
            "rounded-xl",
            "border border-white/10",
            "bg-[#0b1120]/95",
            "p-1.5",
            "shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
            "backdrop-blur-xl",
            "animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150",
          ].join(" ")}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.value || `${item.label}-${index}`}>
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                className={[
                  "flex w-full items-center gap-3",
                  "rounded-lg px-3 py-2.5",
                  "text-left text-sm",
                  "transition-colors duration-150",
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                  "disabled:pointer-events-none disabled:opacity-40",
                ].join(" ")}
              >
                {item.icon && (
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-500"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}

                <span className="truncate">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}