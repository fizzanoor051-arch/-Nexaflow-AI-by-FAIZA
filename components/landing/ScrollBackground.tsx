
"use client";

import { useEffect, useState } from "react";

const backgroundStops = [
  "#050505", // 0% — Hero
  "#0a0c0f", // 16% — Features
  "#111418", // 33% — How It Works
  "#0b0e11", // 50% — Use Cases
  "#15130f", // 66% — Pricing
  "#0b0c0d", // 83% — CTA
  "#050606", // 100% — Footer
];

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function interpolateColor(
  firstColor: string,
  secondColor: string,
  amount: number
) {
  const first = hexToRgb(firstColor);
  const second = hexToRgb(secondColor);

  const r = Math.round(
    first.r + (second.r - first.r) * amount
  );

  const g = Math.round(
    first.g + (second.g - first.g) * amount
  );

  const b = Math.round(
    first.b + (second.b - first.b) * amount
  );

  return `rgb(${r}, ${g}, ${b})`;
}

function getBackgroundColor(progress: number) {
  const scaledProgress =
    progress * (backgroundStops.length - 1);

  const index = Math.min(
    Math.floor(scaledProgress),
    backgroundStops.length - 2
  );

  const localProgress =
    scaledProgress - index;

  return interpolateColor(
    backgroundStops[index],
    backgroundStops[index + 1],
    localProgress
  );
}

export default function ScrollBackground() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const scrollTop = window.scrollY;

      const scrollHeight =
        document.documentElement.scrollHeight;

      const viewportHeight =
        window.innerHeight;

      const maxScroll =
        scrollHeight - viewportHeight;

      const nextProgress =
        maxScroll > 0
          ? Math.min(
              Math.max(scrollTop / maxScroll, 0),
              1
            )
          : 0;

      setProgress(nextProgress);

      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId !== 0) return;

      frameId =
        window.requestAnimationFrame(
          updateProgress
        );
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProgress
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        updateProgress
      );

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const backgroundColor =
    getBackgroundColor(progress);

  return (
    <>
      {/* =====================================================
          MAIN SCROLL BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundColor,
          transition:
            "background-color 450ms ease-out",
        }}
      />

      {/* =====================================================
          VERY SUBTLE LIGHT DEPTH
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute h-[600px] w-[900px] rounded-full blur-[180px]"
          style={{
            left: `${15 + progress * 65}%`,
            top: `${10 + progress * 45}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* =====================================================
          SUBTLE VIGNETTE
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.12) 100%)",
        }}
      />

      {/* =====================================================
          GLOBAL SECTION BACKGROUND OVERRIDE

          This means you DON'T have to open every section
          file and remove bg-[#...] manually.
          ===================================================== */}

      <style jsx global>{`
        html,
        body {
          background: transparent !important;
        }

        main {
          background: transparent !important;
        }

        /*
         * Direct page sections become transparent.
         *
         * Their internal cards, panels and glass surfaces
         * are NOT affected.
         */

        main > section {
          background-color: transparent !important;
        }

        /*
         * Remove only solid background colors from direct
         * sections while preserving their other styling.
         */

        main > section[class*="bg-"] {
          background-color: transparent !important;
        }
      `}</style>
    </>
  );
}
