"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AIChat from "@/components/ai/AIChat";
import type { ChatMessageData } from "@/components/ai/ChatMessage";
import { useAIPageContext } from "@/components/ai/AIPageContext";

const STORAGE_PREFIX = "nexaflow-global-ai:";
const GREETING_STORAGE_KEY = "nexaflow-ai-greeting-dismissed";

const particleData = [
  { x: "-82px", y: "-18px", size: 5, delay: "0ms" },
  { x: "-72px", y: "-55px", size: 4, delay: "35ms" },
  { x: "-50px", y: "-88px", size: 6, delay: "70ms" },
  { x: "-18px", y: "-105px", size: 4, delay: "105ms" },
  { x: "20px", y: "-108px", size: 5, delay: "140ms" },
  { x: "54px", y: "-90px", size: 4, delay: "175ms" },
  { x: "82px", y: "-58px", size: 6, delay: "210ms" },
  { x: "98px", y: "-20px", size: 4, delay: "245ms" },
  { x: "92px", y: "18px", size: 5, delay: "280ms" },
  { x: "70px", y: "55px", size: 4, delay: "315ms" },
  { x: "42px", y: "88px", size: 6, delay: "350ms" },
  { x: "10px", y: "105px", size: 4, delay: "385ms" },
  { x: "-28px", y: "102px", size: 5, delay: "420ms" },
  { x: "-62px", y: "78px", size: 4, delay: "455ms" },
  { x: "-88px", y: "48px", size: 6, delay: "490ms" },
  { x: "-102px", y: "12px", size: 4, delay: "525ms" },
  { x: "-38px", y: "-42px", size: 3, delay: "90ms" },
  { x: "38px", y: "44px", size: 3, delay: "240ms" },
];

function RobotIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 10V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="24"
        cy="5"
        r="2"
        fill="currentColor"
      />

      <rect
        x="9"
        y="11"
        width="30"
        height="26"
        rx="9"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M9 21H6.5C5.67 21 5 21.67 5 22.5v3c0 .83.67 1.5 1.5 1.5H9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M39 21h2.5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H39"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="18"
        cy="23"
        r="3"
        fill="currentColor"
      />

      <circle
        cx="30"
        cy="23"
        r="3"
        fill="currentColor"
      />

      <circle
        cx="19"
        cy="22"
        r="0.8"
        fill="white"
        fillOpacity="0.9"
      />

      <circle
        cx="31"
        cy="22"
        r="0.8"
        fill="white"
        fillOpacity="0.9"
      />

      <path
        d="M18 30C20.2 32 27.8 32 30 30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="24"
        cy="29"
        r="1.3"
        fill="currentColor"
      />

      <path
        d="M18 37v3M30 37v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GlobalAIChat() {
  const { context } = useAIPageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const storageKey = useMemo(
    () =>
      `${STORAGE_PREFIX}${context.route}${
        context.entityId ? `:${context.entityId}` : ""
      }`,
    [context.route, context.entityId]
  );

  /*
   * Load page-specific chat history.
   */
  useEffect(() => {
    setIsLoaded(false);

    try {
      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMessages(parsed as ChatMessageData[]);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Failed to load global AI conversation:",
        error
      );

      setMessages([]);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  /*
   * Save page-specific chat history.
   */
  useEffect(() => {
    if (!isLoaded) return;

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "Failed to save global AI conversation:",
        error
      );
    }
  }, [messages, storageKey, isLoaded]);

  /*
   * Show the greeting once per browser session.
   */
  useEffect(() => {
    try {
      const dismissed = window.sessionStorage.getItem(
        GREETING_STORAGE_KEY
      );

      if (dismissed !== "true") {
        setShowGreeting(true);
      }
    } catch (error) {
      console.error(
        "Failed to read AI greeting state:",
        error
      );

      setShowGreeting(true);
    }
  }, []);

  const handleMessagesChange = (
    nextMessages: ChatMessageData[]
  ) => {
    setMessages(nextMessages);
  };

  const handleClear = () => {
    setMessages([]);

    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(
        "Failed to clear global AI conversation:",
        error
      );
    }
  };

  const handleDismissGreeting = () => {
    setShowGreeting(false);

    try {
      window.sessionStorage.setItem(
        GREETING_STORAGE_KEY,
        "true"
      );
    } catch (error) {
      console.error(
        "Failed to save AI greeting state:",
        error
      );
    }
  };

  const handleOpenAI = () => {
    setShowGreeting(false);
    setShowParticles(true);
    setIsOpen(true);

    try {
      window.sessionStorage.setItem(
        GREETING_STORAGE_KEY,
        "true"
      );
    } catch (error) {
      console.error(
        "Failed to save AI greeting state:",
        error
      );
    }

    window.setTimeout(() => {
      setShowParticles(false);
    }, 1100);
  };

  const handleOpenFullChat = () => {
    setIsOpen(false);
  };

  const fullChatUrl = `/conversations?from=${encodeURIComponent(
    context.route
  )}`;

  /*
   * Closed floating AI button.
   */
  if (!isOpen) {
    return (
      <>
        <style>{`
          @keyframes nexaflowParticleBurst {
            0% {
              opacity: 0;
              transform: translate(0, 0) scale(0.2);
            }

            18% {
              opacity: 1;
              transform: translate(
                calc(var(--particle-x) * 0.38),
                calc(var(--particle-y) * 0.38)
              ) scale(1);
            }

            100% {
              opacity: 0;
              transform: translate(
                var(--particle-x),
                var(--particle-y)
              ) scale(0.35);
            }
          }

          @keyframes nexaflowSmallParticleBurst {
            0% {
              opacity: 0;
              transform: translate(0, 0) scale(0.1);
            }

            22% {
              opacity: 0.95;
              transform: translate(
                calc(var(--particle-x) * 0.42),
                calc(var(--particle-y) * 0.42)
              ) scale(1);
            }

            100% {
              opacity: 0;
              transform: translate(
                var(--particle-x),
                var(--particle-y)
              ) scale(0);
            }
          }

          @keyframes nexaflowMustardFlash {
            0% {
              opacity: 0;
              transform: scale(0.25);
            }

            20% {
              opacity: 0.95;
              transform: scale(1);
            }

            100% {
              opacity: 0;
              transform: scale(1.75);
            }
          }

          @keyframes nexaflowMustardRing {
            0% {
              opacity: 0.75;
              transform: scale(0.35);
            }

            100% {
              opacity: 0;
              transform: scale(2.4);
            }
          }

          @keyframes nexaflowGreetingIn {
            0% {
              opacity: 0;
              transform: translateY(8px) scale(0.96);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>

        <div className="fixed bottom-6 right-6 z-[90]">
          {showGreeting && (
            <div
              className="
                absolute bottom-[78px] right-0
                w-[220px]
                rounded-2xl
                border border-yellow-300/15
                bg-[#0b0f1b]/95
                px-4 py-3
                shadow-[0_18px_55px_rgba(0,0,0,0.48)]
                backdrop-blur-xl
              "
              style={{
                animation:
                  "nexaflowGreetingIn 350ms ease-out both",
              }}
            >
              <button
                type="button"
                onClick={handleDismissGreeting}
                aria-label="Dismiss greeting"
                title="Dismiss"
                className="
                  absolute right-2.5 top-2.5
                  flex h-6 w-6 items-center justify-center
                  rounded-md
                  text-slate-600
                  transition-colors
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>

              <p className="pr-6 text-[12px] font-semibold text-yellow-100">
                Hi, meet me
              </p>

              <p className="mt-1 pr-3 text-[10px] leading-4 text-slate-500">
                I'm NexaFlow AI. Need a hand?
              </p>

              <div
                className="
                  absolute -bottom-1.5 right-7
                  h-3 w-3 rotate-45
                  border-b border-r border-yellow-300/15
                  bg-[#0b0f1b]
                "
              />
            </div>
          )}

          <div className="relative">
            {showParticles && (
              <div
                className="
                  pointer-events-none absolute
                  left-1/2 top-1/2
                  z-0 h-1 w-1
                "
              >
                <span
                  className="
                    absolute left-1/2 top-1/2
                    h-20 w-20
                    -translate-x-1/2 -translate-y-1/2
                    rounded-full
                    bg-yellow-300/35
                    blur-2xl
                  "
                  style={{
                    animation:
                      "nexaflowMustardFlash 800ms ease-out both",
                  }}
                />

                <span
                  className="
                    absolute left-1/2 top-1/2
                    h-[72px] w-[72px]
                    -translate-x-1/2 -translate-y-1/2
                    rounded-full
                    border border-yellow-300/60
                  "
                  style={{
                    animation:
                      "nexaflowMustardRing 900ms ease-out both",
                  }}
                />

                {particleData.map((particle, index) => (
                  <span
                    key={`particle-${index}`}
                    className="
                      absolute left-1/2 top-1/2
                      rounded-full
                      bg-yellow-300
                      shadow-[0_0_14px_rgba(234,179,8,0.95)]
                    "
                    style={
                      {
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        marginLeft: `-${particle.size / 2}px`,
                        marginTop: `-${particle.size / 2}px`,
                        "--particle-x": particle.x,
                        "--particle-y": particle.y,
                        animation: `nexaflowParticleBurst 1050ms cubic-bezier(0.16,1,0.3,1) ${particle.delay} both`,
                      } as React.CSSProperties
                    }
                  />
                ))}

                {[
                  ["-55px", "-70px"],
                  ["-20px", "-95px"],
                  ["55px", "-72px"],
                  ["82px", "5px"],
                  ["48px", "78px"],
                  ["-5px", "94px"],
                  ["-72px", "62px"],
                  ["-94px", "-8px"],
                ].map(([x, y], index) => (
                  <span
                    key={`small-particle-${index}`}
                    className="
                      absolute left-1/2 top-1/2
                      h-2 w-2
                      -ml-1 -mt-1
                      rounded-full
                      bg-yellow-200
                      shadow-[0_0_10px_rgba(250,204,21,0.9)]
                    "
                    style={
                      {
                        "--particle-x": x,
                        "--particle-y": y,
                        animation: `nexaflowSmallParticleBurst 850ms ease-out ${index * 45}ms both`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenAI}
              aria-label="Open NexaFlow AI"
              title="Open NexaFlow AI"
              className="
                group relative z-10
                flex h-[62px] w-[62px]
                items-center justify-center
                rounded-full
                border border-yellow-300/20
                bg-[#0b1020]
                shadow-[0_12px_45px_rgba(0,0,0,0.45)]
                transition-all duration-300
                hover:scale-105
                hover:border-yellow-300/40
                hover:shadow-[0_0_38px_rgba(234,179,8,0.32)]
                active:scale-95
              "
            >
              <span
                className="
                  pointer-events-none absolute
                  inset-[-7px]
                  rounded-full
                  border border-yellow-400/10
                  opacity-60
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:border-yellow-400/20
                "
              />

              <span
                className="
                  pointer-events-none absolute
                  h-9 w-9
                  rounded-full
                  bg-yellow-400/25
                  blur-xl
                  animate-pulse
                  transition-all duration-300
                  group-hover:bg-yellow-300/35
                "
              />

              <RobotIcon
                className="
                  relative z-10
                  h-9 w-9
                  text-yellow-100
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:text-[#f4c430]
                "
              />

              <span
                className="
                  absolute bottom-0.5 right-0.5
                  h-3.5 w-3.5
                  rounded-full
                  border-2 border-[#0b1020]
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.8)]
                "
              />

              <span
                className="
                  pointer-events-none absolute
                  right-[calc(100%+12px)]
                  top-1/2
                  -translate-y-1/2
                  whitespace-nowrap
                  rounded-lg
                  border border-white/[0.08]
                  bg-[#0b0f1b]
                  px-3 py-2
                  text-[10px] font-medium
                  text-slate-300
                  opacity-0
                  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                  transition-all duration-200
                  group-hover:translate-x-[-2px]
                  group-hover:opacity-100
                "
              >
                Ask NexaFlow AI
              </span>
            </button>
          </div>
        </div>
      </>
    );
  }

  /*
   * Floating AI chat.
   */
  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[min(430px,calc(100vw-24px))]">
      <div
        className="
          overflow-hidden rounded-3xl
          border border-white/[0.10]
          bg-[#070b16]
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          backdrop-blur-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-white/[0.07]
            bg-[#0a0f1d]/95
            px-4 py-3
          "
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="
                relative flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                border border-yellow-400/20
                bg-yellow-400/10
              "
            >
              <span className="absolute h-5 w-5 rounded-full bg-yellow-400/20 blur-md" />

              <RobotIcon className="relative h-[25px] w-[25px] text-yellow-200" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-semibold text-white">
                  NexaFlow AI
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" />
              </div>

              <p className="truncate text-[9px] text-slate-600">
                Connected to {context.pageName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              title="Clear this page's AI chat"
              aria-label="Clear this page's AI chat"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                border border-white/[0.06]
                text-slate-600
                transition-all
                hover:border-red-400/20
                hover:bg-red-400/[0.06]
                hover:text-red-400
              "
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>

            {/* Full workspace */}
            <Link
              href={fullChatUrl}
              onClick={handleOpenFullChat}
              title="Open full AI workspace"
              aria-label="Open full AI workspace"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                border border-white/[0.06]
                text-slate-500
                transition-all
                hover:border-yellow-400/20
                hover:bg-yellow-400/[0.06]
                hover:text-yellow-300
              "
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </Link>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Minimize AI assistant"
              aria-label="Minimize AI assistant"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                border border-white/[0.06]
                text-slate-500
                transition-all
                hover:border-white/[0.12]
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6 12h12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current page context */}
        <div
          className="
            border-b border-yellow-400/[0.08]
            bg-yellow-400/[0.025]
            px-4 py-2.5
          "
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_7px_rgba(234,179,8,0.7)]" />

            <p className="text-[9px] font-medium text-yellow-300">
              Context: {context.pageName}
            </p>

            <span className="ml-auto truncate pl-3 text-[8px] text-slate-700">
              {context.route}
            </span>
          </div>
        </div>

        {/* Existing AIChat */}
        <div className="h-[520px]">
          {isLoaded && (
            <AIChat
              key={storageKey}
              initialMessages={messages}
              title="NexaFlow AI"
              subtitle={`Connected to ${context.pageName}`}
              pageContext={context}
              onMessagesChange={handleMessagesChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}