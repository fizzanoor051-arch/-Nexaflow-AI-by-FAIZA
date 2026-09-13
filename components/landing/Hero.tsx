
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MousePosition = {
  x: number;
  y: number;
};

const automationNodes = [
  {
    id: "analyze",
    label: "ANALYZE",
    title: "Understand request",
    description: "AI classifies intent",
    icon: "⌁",
    position: "node-analyze",
  },
  {
    id: "lead",
    label: "LEAD",
    title: "Create lead",
    description: "Customer data extracted",
    icon: "↗",
    position: "node-lead",
  },
  {
    id: "task",
    label: "TASK",
    title: "Assign follow-up",
    description: "Priority automatically set",
    icon: "✓",
    position: "node-task",
  },
  {
    id: "reply",
    label: "REPLY",
    title: "Generate response",
    description: "Context-aware answer",
    icon: "◌",
    position: "node-reply",
  },
];

export default function Hero() {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="nf-hero relative min-h-screen overflow-hidden bg-[#070707] pt-28 text-white sm:pt-32">
      {/* =========================================================
          PREMIUM BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft central light */}
        <div
          className="absolute left-1/2 top-[30%] h-[650px] w-[900px] -translate-x-1/2 rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.018) 32%, transparent 70%)",
          }}
        />

        {/* Very subtle warm accent */}
        <div
          className="absolute right-[8%] top-[20%] h-[420px] w-[420px] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,177,55,0.035), transparent 68%)",
          }}
        />

        {/* Architectural vertical light */}
        <div
          className="absolute left-[18%] top-0 h-full w-px opacity-30"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 35%, rgba(255,255,255,0.025) 65%, transparent)",
          }}
        />

        <div
          className="absolute right-[18%] top-0 h-full w-px opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.02) 70%, transparent)",
          }}
        />

        {/* Minimal horizontal horizon */}
        <div
          className="absolute left-1/2 top-[56%] h-px w-[90%] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          }}
        />

        {/* Fine grain */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.4'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Tiny ambient lights */}
        <span className="nf-ambient-light nf-light-1" />
        <span className="nf-ambient-light nf-light-2" />
        <span className="nf-ambient-light nf-light-3" />
        <span className="nf-ambient-light nf-light-4" />
      </div>

      {/* =========================================================
          HERO CONTENT
      ========================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-16">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="nf-hero-reveal mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#b8b6b0] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#f5b94b]/50" />
                <span className="relative h-2 w-2 rounded-full bg-[#f5b94b]" />
              </span>

              AI-powered business automation
            </div>

            {/* Heading */}
            <h1 className="nf-hero-reveal nf-delay-1 text-[3.2rem] font-black leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-[5.4rem] xl:text-[6.1rem]">
              Work less.
              <br />
              <span className="nf-heading-accent">Automate more.</span>
            </h1>

            {/* Description */}
            <p className="nf-hero-reveal nf-delay-2 mt-7 max-w-xl text-[15px] leading-7 text-[#92918d] sm:text-[17px]">
              NexaFlow AI turns everyday business requests into intelligent
              workflows — analyzing conversations, creating leads, assigning
              tasks, and generating responses automatically.
            </p>

            {/* CTA */}
            <div className="nf-hero-reveal nf-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="nf-primary-button group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#f5f5f2] px-6 text-sm font-bold text-[#11110f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_50px_rgba(255,255,255,0.08)]"
              >
                <span>Start automating</span>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#11110f] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M3 8h9" />
                    <path d="m8.5 4.5 3.5 3.5-3.5 3.5" />
                  </svg>
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 text-sm font-semibold text-[#c7c5c0] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#77756f]" />
                See how it works
              </a>
            </div>

            {/* Trust line */}
            <div className="nf-hero-reveal nf-delay-4 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.15em] text-[#5f5e5a]">
              <span>AI workflows</span>
              <span className="h-1 w-1 rounded-full bg-[#353431]" />
              <span>Lead automation</span>
              <span className="h-1 w-1 rounded-full bg-[#353431]" />
              <span>Smart tasks</span>
            </div>
          </div>

          {/* =====================================================
              RIGHT — 3D AUTOMATION ENGINE
          ====================================================== */}

          <div className="relative mx-auto w-full max-w-[680px] lg:mx-0 lg:ml-auto">
            {/* Perspective environment */}
            <div
              className="nf-engine-scene relative h-[500px] sm:h-[570px]"
              style={{
                perspective: "1500px",
              }}
            >
              {/* Ambient floor glow */}
              <div className="pointer-events-none absolute bottom-[3%] left-[10%] right-[10%] h-28 rounded-full bg-white/[0.025] blur-[65px]" />

              {/* Main 3D object */}
              <div
                className="nf-engine-object absolute inset-0"
                style={{
                  transform: `
                    rotateX(${mouse.y * -2.5}deg)
                    rotateY(${mouse.x * 3.5}deg)
                    translate3d(${mouse.x * 3}px, ${mouse.y * 2}px, 0)
                  `,
                }}
              >
                {/* =================================================
                    CENTRAL AUTOMATION ENGINE
                ================================================== */}

                <div className="absolute left-1/2 top-[47%] z-30 -translate-x-1/2 -translate-y-1/2">
                  {/* Back plate */}
                  <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[32px] border border-white/[0.055] bg-[#10100f]/70 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl" />

                  {/* Inner plate */}
                  <div className="absolute left-1/2 top-1/2 h-[175px] w-[175px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[26px] border border-white/[0.07] bg-[#141412]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

                  {/* Core */}
                  <div className="relative flex h-[145px] w-[145px] items-center justify-center">
                    <div className="absolute inset-0 rounded-[28px] border border-[#f1c36a]/20 bg-[#171612] shadow-[0_20px_60px_rgba(0,0,0,0.65),inset_0_0_45px_rgba(245,185,75,0.025)]" />

                    {/* Core light */}
                    <div className="absolute h-20 w-20 rounded-full bg-[#f5bd54]/[0.055] blur-[25px]" />

                    {/* Core icon */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f5c56b]/25 bg-gradient-to-br from-[#242119] to-[#10100e] shadow-[0_0_40px_rgba(245,185,75,0.08)]">
                      <div className="relative h-7 w-7">
                        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[#f5c56b]" />
                        <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-[#f5c56b]" />
                        <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[#f5c56b]" />
                        <span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[#f5c56b]" />

                        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f7d68c] shadow-[0_0_14px_rgba(245,195,95,0.45)]" />
                      </div>
                    </div>

                    <span className="absolute -bottom-10 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.28em] text-[#817e76]">
                      NexaFlow Engine
                    </span>
                  </div>

                  {/* Rotating technical ring */}
                  <div className="nf-engine-ring absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08]" />

                  <div className="nf-engine-ring-reverse absolute left-1/2 top-1/2 h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5c56b]/[0.08]" />
                </div>

                {/* =================================================
                    INPUT REQUEST
                ================================================== */}

                <div
                  className="nf-floating-card absolute left-[2%] top-[4%] z-40 w-[225px] sm:left-[4%] sm:w-[245px]"
                  style={{
                    transform: `translate3d(${mouse.x * -5}px, ${
                      mouse.y * -3
                    }px, 35px)`,
                  }}
                >
                  <div className="rounded-2xl border border-white/[0.09] bg-[#111110]/90 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[10px] text-[#b8b5ae]">
                          AI
                        </span>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77756f]">
                          Incoming
                        </span>
                      </div>

                      <span className="h-1.5 w-1.5 rounded-full bg-[#8e8c86]" />
                    </div>

                    <p className="text-[11px] leading-5 text-[#b8b5ae]">
                      &ldquo;A customer wants to know if their order can be
                      delivered tomorrow.&rdquo;
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[8px] uppercase tracking-wider text-[#65635e]">
                        Customer inquiry
                      </span>

                      <span className="rounded-md border border-[#f5c56b]/10 bg-[#f5c56b]/[0.035] px-2 py-1 text-[8px] text-[#b9a16e]">
                        New
                      </span>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="nf-connector-horizontal absolute -bottom-7 right-[-30px] h-px w-[75px]" />
                </div>

                {/* =================================================
                    ANALYZE NODE
                ================================================== */}

                <div className="nf-node node-analyze absolute left-[3%] top-[38%] z-20 sm:left-[5%]">
                  <div className="nf-node-card">
                    <div className="nf-node-icon">⌁</div>

                    <div>
                      <div className="nf-node-label">ANALYZE</div>
                      <div className="nf-node-title">Understand request</div>
                      <div className="nf-node-description">
                        Intent classified
                      </div>
                    </div>

                    <span className="nf-node-status" />
                  </div>
                </div>

                {/* =================================================
                    RIGHT SIDE OUTPUT NODES
                ================================================== */}

                {automationNodes.slice(1).map((node, index) => (
                  <div
                    key={node.id}
                    className={`nf-node ${node.position} absolute right-[1%] z-20 sm:right-[3%]`}
                  >
                    <div className="nf-node-card nf-output-card">
                      <div className="nf-node-icon">{node.icon}</div>

                      <div className="min-w-0">
                        <div className="nf-node-label">{node.label}</div>
                        <div className="nf-node-title">{node.title}</div>
                        <div className="nf-node-description">
                          {node.description}
                        </div>
                      </div>

                      <span className="nf-node-status" />
                    </div>

                    {index < 2 && (
                      <div className="nf-connector-output absolute left-[-55px] top-1/2 h-px w-[55px]" />
                    )}
                  </div>
                ))}

                {/* =================================================
                    CONNECTING LINES
                ================================================== */}

                <div className="nf-flow-line nf-flow-line-left absolute left-[26%] top-[48%] h-px w-[17%]" />

                <div className="nf-flow-line nf-flow-line-right absolute left-[63%] top-[43%] h-px w-[14%] rotate-[-12deg]" />

                <div className="nf-flow-line nf-flow-line-right-2 absolute left-[63%] top-[49%] h-px w-[14%]" />

                <div className="nf-flow-line nf-flow-line-right-3 absolute left-[63%] top-[55%] h-px w-[14%] rotate-[12deg]" />

                {/* Animated data packets */}
                <span className="nf-data-packet nf-packet-1" />
                <span className="nf-data-packet nf-packet-2" />
                <span className="nf-data-packet nf-packet-3" />

                {/* =================================================
                    COMPLETED STATUS
                ================================================== */}

                <div
                  className="absolute bottom-[5%] left-1/2 z-40 -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) translate3d(${mouse.x * 4}px, ${
                      mouse.y * 2
                    }px, 25px)`,
                  }}
                >
                  <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#111110]/90 px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#d8d6cf]/20 bg-[#d8d6cf]/[0.06] text-[9px] text-[#d8d6cf]">
                      ✓
                    </span>

                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#85827b]">
                      Workflow completed
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#c7c4bb]" />
                  </div>
                </div>
              </div>

              {/* =================================================
                  TECHNICAL LABELS
              ================================================== */}

              <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[8px] font-medium uppercase tracking-[0.35em] text-[#4e4d49] sm:block">
                AUTOMATION / ENGINE
              </div>

              <div className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 rotate-90 text-[8px] font-medium uppercase tracking-[0.35em] text-[#4e4d49] sm:block">
                REAL-TIME EXECUTION
              </div>

              {/* Corner markers */}
              <span className="nf-corner-marker nf-corner-tl" />
              <span className="nf-corner-marker nf-corner-tr" />
              <span className="nf-corner-marker nf-corner-bl" />
              <span className="nf-corner-marker nf-corner-br" />
            </div>

            {/* Caption */}
            <div className="mt-1 text-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#55534e]">
                Request → Intelligence → Action
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM PRODUCT STRIP
        ========================================================== */}

        <div className="nf-hero-reveal nf-delay-4 mt-16 border-y border-white/[0.055] py-5 sm:mt-20">
          <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-0">
            {[
              ["01", "Understand", "AI classifies business intent"],
              ["02", "Decide", "Generate structured actions"],
              ["03", "Execute", "Create tasks, leads & replies"],
              ["04", "Track", "Monitor every workflow"],
            ].map(([number, title, description], index) => (
              <div
                key={number}
                className={`px-4 sm:px-6 ${
                  index !== 0 ? "sm:border-l sm:border-white/[0.055]" : ""
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[9px] font-semibold tracking-[0.2em] text-[#6d6b65]">
                    {number}
                  </span>

                  <span className="h-px w-5 bg-white/[0.08]" />
                </div>

                <div className="text-xs font-semibold text-[#b8b6b0]">
                  {title}
                </div>

                <div className="mt-1 text-[9px] leading-4 text-[#5f5d58]">
                  {description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM FADE
      ========================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#070707] to-transparent" />

      {/* =========================================================
          HERO-SPECIFIC CSS
      ========================================================== */}

      <style jsx>{`
        /* -------------------------------------------------------
           HERO REVEAL
        ------------------------------------------------------- */

        .nf-hero-reveal {
          animation: nfHeroReveal 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .nf-delay-1 {
          animation-delay: 100ms;
        }

        .nf-delay-2 {
          animation-delay: 180ms;
        }

        .nf-delay-3 {
          animation-delay: 260ms;
        }

        .nf-delay-4 {
          animation-delay: 360ms;
        }

        @keyframes nfHeroReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
            filter: blur(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        /* -------------------------------------------------------
           HEADING
        ------------------------------------------------------- */

        .nf-heading-accent {
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #e7e5df 48%,
            #d0a451 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* -------------------------------------------------------
           AMBIENT LIGHTS
        ------------------------------------------------------- */

        .nf-ambient-light {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.18);
          animation: ambientFloat 7s ease-in-out infinite;
        }

        .nf-light-1 {
          left: 13%;
          top: 27%;
        }

        .nf-light-2 {
          left: 82%;
          top: 19%;
          animation-delay: -2s;
        }

        .nf-light-3 {
          left: 72%;
          top: 73%;
          animation-delay: -4s;
        }

        .nf-light-4 {
          left: 27%;
          top: 79%;
          animation-delay: -5.5s;
        }

        @keyframes ambientFloat {
          0%,
          100% {
            opacity: 0.15;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.55;
            transform: translate3d(0, -14px, 0);
          }
        }

        /* -------------------------------------------------------
           3D ENGINE
        ------------------------------------------------------- */

        .nf-engine-scene {
          transform-style: preserve-3d;
        }

        .nf-engine-object {
          transform-style: preserve-3d;
          transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nf-engine-ring {
          animation: engineRing 18s linear infinite;
          transform-style: preserve-3d;
        }

        .nf-engine-ring-reverse {
          animation: engineRingReverse 13s linear infinite;
          transform-style: preserve-3d;
        }

        @keyframes engineRing {
          from {
            transform: translate(-50%, -50%) rotateX(68deg) rotateZ(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotateX(68deg) rotateZ(360deg);
          }
        }

        @keyframes engineRingReverse {
          from {
            transform: translate(-50%, -50%) rotateX(68deg) rotateY(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotateX(68deg) rotateY(360deg);
          }
        }

        /* -------------------------------------------------------
           FLOATING INPUT CARD
        ------------------------------------------------------- */

        .nf-floating-card {
          animation: floatingCard 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        @keyframes floatingCard {
          0%,
          100% {
            margin-top: 0;
          }

          50% {
            margin-top: -7px;
          }
        }

        /* -------------------------------------------------------
           NODES
        ------------------------------------------------------- */

        .nf-node {
          transform-style: preserve-3d;
        }

        .nf-node-card {
          display: flex;
          min-width: 205px;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 14px;
          background: rgba(17, 17, 16, 0.92);
          padding: 10px 11px;
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(18px);
          transition:
            border-color 300ms ease,
            transform 300ms ease,
            background 300ms ease;
        }

        .nf-node-card:hover {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(21, 21, 20, 0.96);
          transform: translateY(-2px);
        }

        .nf-node-icon {
          display: flex;
          height: 34px;
          width: 34px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.035);
          color: #d4d1c9;
          font-size: 13px;
        }

        .nf-node-label {
          margin-bottom: 2px;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #77756f;
        }

        .nf-node-title {
          white-space: nowrap;
          font-size: 10px;
          font-weight: 600;
          color: #c7c5bf;
        }

        .nf-node-description {
          margin-top: 2px;
          white-space: nowrap;
          font-size: 8px;
          color: #5f5d58;
        }

        .nf-node-status {
          margin-left: auto;
          height: 5px;
          width: 5px;
          flex-shrink: 0;
          border-radius: 999px;
          background: #aaa79e;
          box-shadow: 0 0 10px rgba(210, 207, 196, 0.25);
          animation: nodeStatus 2.8s ease-in-out infinite;
        }

        @keyframes nodeStatus {
          0%,
          100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        .node-analyze {
          transform: translateZ(30px);
        }

        .node-lead {
          top: 29%;
          transform: translateZ(28px);
        }

        .node-task {
          top: 43%;
          transform: translateZ(42px);
        }

        .node-reply {
          top: 57%;
          transform: translateZ(25px);
        }

        /* -------------------------------------------------------
           FLOW LINES
        ------------------------------------------------------- */

        .nf-flow-line,
        .nf-connector-horizontal,
        .nf-connector-output {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03),
            rgba(245, 197, 107, 0.32),
            rgba(255, 255, 255, 0.025)
          );
        }

        .nf-flow-line {
          transform-origin: left center;
        }

        .nf-flow-line-left {
          animation: flowPulseLeft 2.8s ease-in-out infinite;
        }

        .nf-flow-line-right {
          animation: flowPulseRight 2.8s ease-in-out infinite;
          animation-delay: 0.35s;
        }

        .nf-flow-line-right-2 {
          animation: flowPulseRight 2.8s ease-in-out infinite;
          animation-delay: 0.7s;
        }

        .nf-flow-line-right-3 {
          animation: flowPulseRight 2.8s ease-in-out infinite;
          animation-delay: 1.05s;
        }

        @keyframes flowPulseLeft {
          0%,
          100% {
            opacity: 0.15;
          }

          50% {
            opacity: 0.7;
          }
        }

        @keyframes flowPulseRight {
          0%,
          100% {
            opacity: 0.12;
          }

          50% {
            opacity: 0.65;
          }
        }

        /* -------------------------------------------------------
           DATA PACKETS
        ------------------------------------------------------- */

        .nf-data-packet {
          position: absolute;
          z-index: 50;
          height: 4px;
          width: 4px;
          border-radius: 999px;
          background: #e7c77f;
          box-shadow: 0 0 12px rgba(231, 199, 127, 0.65);
        }

        .nf-packet-1 {
          left: 29%;
          top: 47.5%;
          animation: packetLeft 2.8s linear infinite;
        }

        .nf-packet-2 {
          left: 63%;
          top: 49%;
          animation: packetRight 2.8s linear infinite 0.7s;
        }

        .nf-packet-3 {
          left: 63%;
          top: 49%;
          animation: packetRightTwo 2.8s linear infinite 1.4s;
        }

        @keyframes packetLeft {
          0% {
            opacity: 0;
            transform: translateX(0) scale(0.6);
          }

          15% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(145px) scale(1);
          }
        }

        @keyframes packetRight {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }

          15% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translate(95px, -24px) scale(1);
          }
        }

        @keyframes packetRightTwo {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }

          15% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translate(95px, 25px) scale(1);
          }
        }

        /* -------------------------------------------------------
           CORNER MARKERS
        ------------------------------------------------------- */

        .nf-corner-marker {
          position: absolute;
          height: 16px;
          width: 16px;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .nf-corner-tl {
          left: 1%;
          top: 1%;
          border-left: 1px solid;
          border-top: 1px solid;
        }

        .nf-corner-tr {
          right: 1%;
          top: 1%;
          border-right: 1px solid;
          border-top: 1px solid;
        }

        .nf-corner-bl {
          bottom: 1%;
          left: 1%;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .nf-corner-br {
          bottom: 1%;
          right: 1%;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }

        /* -------------------------------------------------------
           RESPONSIVE
        ------------------------------------------------------- */

        @media (max-width: 640px) {
          .nf-engine-scene {
            height: 520px;
          }

          .nf-node-card {
            min-width: 175px;
            padding: 8px 9px;
          }

          .nf-node-icon {
            height: 29px;
            width: 29px;
          }

          .nf-node-title {
            font-size: 9px;
          }

          .nf-node-description {
            font-size: 7px;
          }

          .node-analyze {
            left: 0;
          }

          .node-lead,
          .node-task,
          .node-reply {
            right: 0;
          }

          .nf-flow-line-left {
            left: 30%;
            width: 12%;
          }

          .nf-flow-line-right,
          .nf-flow-line-right-2,
          .nf-flow-line-right-3 {
            left: 64%;
            width: 10%;
          }
        }

        /* -------------------------------------------------------
           REDUCED MOTION
        ------------------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .nf-hero-reveal,
          .nf-ambient-light,
          .nf-engine-ring,
          .nf-engine-ring-reverse,
          .nf-floating-card,
          .nf-node-status,
          .nf-flow-line,
          .nf-data-packet {
            animation: none !important;
          }

          .nf-engine-object {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
