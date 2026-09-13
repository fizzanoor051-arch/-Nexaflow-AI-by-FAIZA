import React from "react";

type LoadingSize = "sm" | "md" | "lg";

interface LoadingProps {
  size?: LoadingSize;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeStyles: Record<
  LoadingSize,
  { spinner: string; text: string }
> = {
  sm: {
    spinner: "h-4 w-4 border-2",
    text: "text-xs",
  },
  md: {
    spinner: "h-6 w-6 border-2",
    text: "text-sm",
  },
  lg: {
    spinner: "h-9 w-9 border-[3px]",
    text: "text-sm",
  },
};

export default function Loading({
  size = "md",
  text,
  fullScreen = false,
  className = "",
}: LoadingProps) {
  const styles = sizeStyles[size];

  const content = (
    <div
      className={[
        "flex items-center justify-center",
        text ? "gap-3" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-label={text || "Loading"}
    >
      <span
        className={[
          "animate-spin rounded-full",
          "border-white/20 border-t-white",
          styles.spinner,
        ].join(" ")}
        aria-hidden="true"
      />

      {text && (
        <span className={["text-slate-400", styles.text].join(" ")}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#050816]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}