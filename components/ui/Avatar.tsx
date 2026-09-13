import React from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const sizeStyles: Record<
  AvatarSize,
  { wrapper: string; text: string; status: string }
> = {
  xs: {
    wrapper: "h-7 w-7",
    text: "text-[10px]",
    status: "h-2 w-2 border-[1.5px]",
  },
  sm: {
    wrapper: "h-8 w-8",
    text: "text-xs",
    status: "h-2.5 w-2.5 border-2",
  },
  md: {
    wrapper: "h-10 w-10",
    text: "text-sm",
    status: "h-3 w-3 border-2",
  },
  lg: {
    wrapper: "h-12 w-12",
    text: "text-base",
    status: "h-3.5 w-3.5 border-2",
  },
  xl: {
    wrapper: "h-16 w-16",
    text: "text-lg",
    status: "h-4 w-4 border-2",
  },
};

const statusStyles = {
  online: "bg-emerald-400",
  offline: "bg-slate-500",
  busy: "bg-red-400",
  away: "bg-amber-400",
};

function getInitials(name?: string) {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const styles = sizeStyles[size];
  const initials = getInitials(name);

  return (
    <div
      className={[
        "relative inline-flex shrink-0",
        styles.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex h-full w-full items-center justify-center overflow-hidden",
          "rounded-full",
          "border border-white/10",
          "bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-slate-800",
          "text-white font-semibold",
          styles.text,
        ].join(" ")}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "User avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={[
            "absolute bottom-0 right-0 rounded-full",
            "border-[#080d1c]",
            statusStyles[status],
            styles.status,
          ].join(" ")}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}