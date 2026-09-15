
"use client";

import { FormEvent, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [guestLoading, setGuestLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
     if (password.length < 6) {
  setError("Password must be at least 6 characters.");
  return;
}

if (!/[0-9]/.test(password)) {
  setError("Password must contain at least one number.");
  return;
}

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to create account.");
        return;
      }

      localStorage.removeItem("nexaflow_guest");

      setSuccess(
        data.message || "Account created successfully. Opening workspace..."
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestContinue() {
    setError("");
    setSuccess("");
    setGuestLoading(true);

    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to open guest workspace.");
        return;
      }

      localStorage.setItem("nexaflow_guest", "true");

      setSuccess("Guest workspace ready. Opening dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    } catch {
      setError("Unable to open guest workspace. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#151713] px-4 py-4 text-[#F4F0E6] sm:px-8 lg:px-12">
      {/* =========================================================
          ORIGINAL BACKGROUND ARTWORK â€” UNCHANGED
      ========================================================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/auth/auth-background.jpg')",
        }}
      />

      {/* Deep cinematic overlay */}
      <div className="absolute inset-0 bg-[#151713]/70" />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(21,23,19,0.16),rgba(21,23,19,0.88)_70%)]" />

      {/* Subtle champagne atmosphere */}
      <div className="absolute left-[22%] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-[#E7B84B]/[0.025] blur-3xl" />

      {/* =========================================================
          CINEMATIC 3D SAAS WORLD
          BACKGROUND ONLY
      ========================================================= */}
      <div
        className="cinematic-world pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      >
        {/* Atmospheric floating lights */}
        <div className="world-glow world-glow-one" />
        <div className="world-glow world-glow-two" />
        <div className="world-glow world-glow-three" />

        {/* Perspective digital floor */}
        <div className="perspective-floor">
          <div className="floor-grid" />
        </div>

        {/* Large 3D orbit */}
        <div className="orbit-system orbit-one">
          <div className="orbit-ring orbit-ring-a" />
          <div className="orbit-ring orbit-ring-b" />
          <div className="orbit-ring orbit-ring-c" />
          <div className="orbit-core" />
          <div className="orbit-node node-a" />
          <div className="orbit-node node-b" />
          <div className="orbit-node node-c" />
        </div>

        {/* Secondary orbit */}
        <div className="orbit-system orbit-two">
          <div className="orbit-ring orbit-ring-a" />
          <div className="orbit-ring orbit-ring-b" />
          <div className="orbit-core" />
          <div className="orbit-node node-a" />
          <div className="orbit-node node-b" />
        </div>

        {/* Floating holographic rings */}
        <div className="holo-ring holo-one" />
        <div className="holo-ring holo-two" />
        <div className="holo-ring holo-three" />

        {/* =====================================================
            NEURAL NETWORK / AI CONNECTIONS
        ===================================================== */}
        <svg
          className="neural-network"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="registerNeuralGold"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(231,184,75,0)" />
              <stop offset="42%" stopColor="rgba(231,184,75,.28)" />
              <stop offset="72%" stopColor="rgba(245,217,139,.58)" />
              <stop offset="100%" stopColor="rgba(231,184,75,0)" />
            </linearGradient>

            <filter id="registerNetworkGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            className="network-lines"
            fill="none"
            stroke="url(#registerNeuralGold)"
            strokeWidth="1"
            filter="url(#registerNetworkGlow)"
          >
            <path d="M0 160 C180 90 260 280 430 210 S690 100 820 230 S1100 320 1260 180 S1450 80 1600 160" />
            <path d="M0 380 C160 290 260 450 410 370 S650 270 810 400 S1050 510 1210 350 S1450 270 1600 340" />
            <path d="M0 650 C190 550 280 710 470 600 S720 490 900 640 S1120 750 1300 580 S1460 510 1600 590" />
            <path d="M180 0 C250 150 200 290 330 420 S500 590 430 900" />
            <path d="M520 0 C600 150 540 270 650 390 S820 610 760 900" />
            <path d="M1050 0 C980 180 1080 310 960 450 S850 680 930 900" />
            <path d="M1390 0 C1300 170 1410 300 1290 440 S1190 650 1260 900" />
          </g>
        </svg>

        {/* =====================================================
            MOVING ENERGY BEAMS
        ===================================================== */}
        <div className="energy-path energy-path-one">
          <span />
        </div>

        <div className="energy-path energy-path-two">
          <span />
        </div>

        <div className="energy-path energy-path-three">
          <span />
        </div>

        {/* =====================================================
            FLOATING AI PARTICLES
        ===================================================== */}
        <div className="particle-field">
          <span className="particle p01" />
          <span className="particle p02" />
          <span className="particle p03" />
          <span className="particle p04" />
          <span className="particle p05" />
          <span className="particle p06" />
          <span className="particle p07" />
          <span className="particle p08" />
          <span className="particle p09" />
          <span className="particle p10" />
          <span className="particle p11" />
          <span className="particle p12" />
          <span className="particle p13" />
          <span className="particle p14" />
          <span className="particle p15" />
          <span className="particle p16" />
          <span className="particle p17" />
          <span className="particle p18" />
          <span className="particle p19" />
          <span className="particle p20" />
        </div>

        {/* =====================================================
            FLOATING 3D GLASS FRAGMENTS
        ===================================================== */}
        <div className="glass-fragment fragment-one" />
        <div className="glass-fragment fragment-two" />
        <div className="glass-fragment fragment-three" />
        <div className="glass-fragment fragment-four" />

        {/* =====================================================
            HOLOGRAPHIC MICRO PANELS
        ===================================================== */}
        <div className="holo-panel panel-one">
          <span />
          <span />
          <span />
        </div>

        <div className="holo-panel panel-two">
          <span />
          <span />
          <span />
        </div>

        <div className="holo-panel panel-three">
          <span />
          <span />
          <span />
        </div>

        {/* Global scanner */}
        <div className="scanner-beam" />

        {/* Cinematic vignette */}
        <div className="cinematic-vignette" />
      </div>

      {/* =========================================================
          ARCHITECTURAL GRID â€” ORIGINAL
      ========================================================= */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(245,217,139,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,217,139,0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* =========================================================
          TOP NAV / BRAND
      ========================================================= */}

      {/* Back button */}
      <Link
        href="/"
        className="group absolute left-5 top-5 z-30 inline-flex items-center gap-3 rounded-full border border-[#F5D98B]/10 bg-[#151713]/65 px-4 py-2.5 text-xs font-medium text-[#9A9D94] shadow-[0_10px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-[#E7B84B]/35 hover:bg-[#20241D]/90 hover:text-[#F5D98B] sm:left-8 sm:top-6 lg:left-3 lg:top-7"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E7B84B]/15 bg-[#20241D] transition-transform duration-300 group-hover:-translate-x-0.5">
         🏠
        </span>

        <span>Back to home</span>

        <span className="h-px w-0 bg-[#E7B84B]/70 transition-all duration-300 group-hover:w-5" />
      </Link>

      {/* Large NexaFlow brand */}
      <Link
        href="/"
        className="group absolute left-[9rem] top-[4.35rem] z-30 inline-flex items-center gap-4 sm:left-[11rem] sm:top-[4.25rem] lg:left-[13rem] lg:top-[1rem]"
      >
        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#E7B84B]/30 bg-[#20241D]/90 shadow-[0_0_32px_rgba(231,184,75,0.10)] backdrop-blur-xl transition-all duration-300 group-hover:border-[#E7B84B]/50 group-hover:shadow-[0_0_40px_rgba(231,184,75,0.16)]">
          <div className="absolute inset-0 bg-[#E7B84B]/[0.07] blur-xl" />

          <span className="relative text-xl font-black text-[#F5D98B]">
            N
          </span>

          <div className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E7B84B] shadow-[0_0_10px_rgba(231,184,75,0.7)]" />
        </div>

        <div>
          <span className="block text-2xl font-bold tracking-tight text-[#F4F0E6] sm:text-[1.7rem]">
            NexaFlow
          </span>

          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.32em] text-[#BFAF7A]">
            AI Automation
          </span>
        </div>
      </Link>

      {/* =========================================================
          LEFT AUTH AREA
      ========================================================= */}
      <div className="relative z-10 w-full max-w-xl pt-[9.5rem] sm:pt-[9rem] lg:ml-[3vw] lg:pt-[8.5rem] xl:ml-[6vw]">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-8 bg-[#E7B84B]/50" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#BFAF7A]">
              New automation workspace
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#F4F0E6] sm:text-4xl">
            Build something intelligent.
          </h1>

          <p className="mt-1.5 max-w-md text-sm leading-5 text-[#9A9D94]">
            Create your workspace and turn everyday business operations into
            intelligent automated workflows.
          </p>
        </div>

        {/* Floating authentication engine */}
        <div className="auth-float group relative">
          {/* Animated outer glow */}
          <div className="absolute -inset-[1px] rounded-[25px] bg-gradient-to-r from-transparent via-[#E7B84B]/35 to-transparent opacity-50 blur-[2px] transition-opacity duration-500 group-hover:opacity-90" />

          {/* Moving border beam */}
          <div className="auth-border-beam pointer-events-none absolute inset-0 rounded-[24px]" />

          {/* Main card */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#F5D98B]/[0.11] bg-[#151713]/[0.88] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-6">
            {/* Corner architecture */}
            <div className="pointer-events-none absolute left-0 top-0 h-12 w-12 border-l border-t border-[#E7B84B]/25" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#E7B84B]/25" />

            {/* Internal scan line */}
            <div className="auth-scan pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D98B]/35 to-transparent" />

            {/* Tiny system label */}
            <div className="mb-4 flex items-center justify-between border-b border-[#F5D98B]/[0.07] pb-3.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.5)]" />

                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#73776F]">
                  Workspace generator
                </span>
              </div>

              <span className="font-mono text-[9px] text-[#BFAF7A]">
                NF / 02
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="rounded-xl border border-[#E87575]/25 bg-[#E87575]/[0.08] p-3 text-sm text-[#F0A0A0]">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-[#5ED6A0]/25 bg-[#5ED6A0]/[0.08] p-3 text-sm text-[#9BE7BE]">
                  {success}
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#D8D4C8]">
                  Full name
                </span>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Your name"
                  disabled={loading || guestLoading}
                  className="w-full rounded-xl border border-[#F5D98B]/[0.10] bg-[#20241D]/80 px-4 py-2.5 text-sm text-[#F4F0E6] outline-none transition-all duration-300 placeholder:text-[#73776F] focus:border-[#E7B84B]/50 focus:bg-[#252A22] focus:shadow-[0_0_25px_rgba(231,184,75,0.06)] focus:ring-1 focus:ring-[#E7B84B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#D8D4C8]">
                  Email
                </span>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  disabled={loading || guestLoading}
                  className="w-full rounded-xl border border-[#F5D98B]/[0.10] bg-[#20241D]/80 px-4 py-2.5 text-sm text-[#F4F0E6] outline-none transition-all duration-300 placeholder:text-[#73776F] focus:border-[#E7B84B]/50 focus:bg-[#252A22] focus:shadow-[0_0_25px_rgba(231,184,75,0.06)] focus:ring-1 focus:ring-[#E7B84B]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              
<label className="block">
  <span className="mb-1.5 block text-sm font-medium text-[#D8D4C8]">
    Password
  </span>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      required
      value={password}
      onFocus={() => setError("")}
      onChange={(event) => {
        setPassword(event.target.value);
        setError("");
      }}
      placeholder="Create your password"
      disabled={loading || guestLoading}
      className="w-full rounded-xl border border-[#F5D98B]/[0.10] bg-[#20241D]/80 px-4 py-2.5 pr-12 text-sm text-[#F4F0E6] outline-none transition-all duration-300 placeholder:text-[#73776F] focus:border-[#E7B84B]/50 focus:bg-[#252A22] focus:shadow-[0_0_25px_rgba(231,184,75,0.06)] focus:ring-1 focus:ring-[#E7B84B]/15 disabled:cursor-not-allowed disabled:opacity-60"
    />

    <button
      type="button"
      aria-label={showPassword ? "Hide password" : "Show password"}
      onClick={() => setShowPassword((value) => !value)}
      disabled={loading || guestLoading}
      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#73776F] transition-colors duration-300 hover:bg-[#E7B84B]/[0.06] hover:text-[#F5D98B] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4.5 w-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A10.7 10.7 0 0112 4c5.05 0 8.94 3.28 10.5 8a11.8 11.8 0 01-2.07 3.54M6.61 6.61C4.95 7.77 3.66 9.46 3 12c1.56 4.72 5.45 8 10.5 8 1.4 0 2.72-.26 3.92-.74"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4.5 w-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
          />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )}
    </button>
  </div>

  <p className="mt-1.5 text-[10px] leading-4 text-[#73776F]">
    Minimum 6 characters and 1 number.
  </p>
</label>

<label className="block">
  <span className="mb-1.5 block text-sm font-medium text-[#D8D4C8]">
    Confirm password
  </span>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      required
      value={confirmPassword}
      onChange={(event) => {
        setConfirmPassword(event.target.value);
        setError("");
      }}
      placeholder="Confirm your password"
      disabled={loading || guestLoading}
      className="w-full rounded-xl border border-[#F5D98B]/[0.10] bg-[#20241D]/80 px-4 py-2.5 pr-12 text-sm text-[#F4F0E6] outline-none transition-all duration-300 placeholder:text-[#73776F] focus:border-[#E7B84B]/50 focus:bg-[#252A22] focus:shadow-[0_0_25px_rgba(231,184,75,0.06)] focus:ring-1 focus:ring-[#E7B84B]/15 disabled:cursor-not-allowed disabled:opacity-60"
    />

    <button
      type="button"
      aria-label={
        showConfirmPassword
          ? "Hide password"
          : "Show password"
      }
      onClick={() =>
        setShowConfirmPassword((value) => !value)
      }
      disabled={loading || guestLoading}
      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#73776F] transition-colors duration-300 hover:bg-[#E7B84B]/[0.06] hover:text-[#F5D98B] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {showConfirmPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4.5 w-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A10.7 10.7 0 0112 4c5.05 0 8.94 3.28 10.5 8a11.8 11.8 0 01-2.07 3.54M6.61 6.61C4.95 7.77 3.66 9.46 3 12c1.56 4.72 5.45 8 10.5 8 1.4 0 2.72-.26 3.92-.74"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4.5 w-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
          />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )}
    </button>
  </div>

  <p className="mt-1.5 text-[10px] leading-4 text-[#73776F]">
    Re-enter your password to confirm.
  </p>
</label>

              

               

              <button
                type="submit"
                disabled={loading || guestLoading}
                className="group/button relative mt-1 w-full overflow-hidden rounded-xl border border-[#E7B84B]/35 bg-[#E7B84B]/[0.12] px-4 py-3 text-sm font-semibold text-[#F5D98B] shadow-[0_12px_35px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5D98B]/60 hover:bg-[#E7B84B]/[0.19] hover:shadow-[0_14px_40px_rgba(231,184,75,0.10)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-y-0 -left-20 w-12 rotate-12 bg-[#F5D98B]/20 blur-md transition-all duration-700 group-hover/button:left-[120%]" />

                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? "Creating workspace..."
                    : "Create Account"}

                  {!loading && (
                    <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                      
                    </span>
                  )}
                </span>
              </button>
            </form>

            {/* Guest divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#F5D98B]/[0.08]" />

              <span className="font-mono text-[9px] tracking-[0.2em] text-[#73776F]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#F5D98B]/[0.08]" />
            </div>

            {/* Guest */}
            <button
              type="button"
              onClick={handleGuestContinue}
              disabled={loading || guestLoading}
              className="group/guest relative w-full overflow-hidden rounded-xl border border-[#F5D98B]/[0.09] bg-[#20241D]/65 px-4 py-3 text-sm font-semibold text-[#BFC1B8] transition-all duration-300 hover:border-[#E7B84B]/30 hover:bg-[#252A22] hover:text-[#F4F0E6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5D98B]/[0.04] to-transparent transition-transform duration-700 group-hover/guest:translate-x-full" />

              <span className="relative">
                {guestLoading
                  ? "Opening workspace..."
                  : "Continue as guest"}
              </span>
            </button>

            <p className="mt-4 text-center text-sm text-[#73776F]">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-medium text-[#E7B84B] transition-all duration-300 hover:text-[#F5D98B] hover:underline hover:underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* System status */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.55)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#73776F]">
              Systems online
            </span>
          </div>

          <span className="font-mono text-[9px] text-[#73776F]">
            READY TO AUTOMATE
          </span>
        </div>
      </div>

      <style jsx>{`
        /* =========================================================
           EXISTING AUTH MOTION
        ========================================================= */

        .auth-float {
          animation: authFloat 6s ease-in-out infinite;
        }

        .auth-float:hover {
          animation-play-state: paused;
        }

        .auth-border-beam {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 280deg,
            rgba(231, 184, 75, 0.65) 315deg,
            rgba(245, 217, 139, 0.95) 335deg,
            transparent 360deg
          );

          animation: borderSpin 7s linear infinite;
          opacity: 0.7;
          padding: 1px;

          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);

          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        .auth-float:hover .auth-border-beam {
          animation-play-state: paused;
        }

        .auth-scan {
          animation: scanLine 4.5s ease-in-out infinite;
        }

        .auth-float:hover .auth-scan {
          animation-play-state: paused;
        }

        @keyframes authFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -7px, 0);
          }
        }

        @keyframes borderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scanLine {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }

          20% {
            opacity: 0.8;
          }

          70% {
            opacity: 0.15;
          }

          100% {
            transform: translateY(520px);
          }
        }

        /* =========================================================
           CINEMATIC 3D WORLD
        ========================================================= */

        .cinematic-world {
          perspective: 1400px;
          transform-style: preserve-3d;
          overflow: hidden;
          isolation: isolate;
        }

        /* =========================================================
           ATMOSPHERIC LIGHTS
        ========================================================= */

        .world-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(80px);
          mix-blend-mode: screen;
          opacity: 0.16;
        }

        .world-glow-one {
          width: 520px;
          height: 520px;
          left: 2%;
          top: 8%;
          background: rgba(231, 184, 75, 0.15);
          animation: atmosphericDriftOne 18s ease-in-out infinite;
        }

        .world-glow-two {
          width: 430px;
          height: 430px;
          right: 4%;
          top: 12%;
          background: rgba(245, 217, 139, 0.12);
          animation: atmosphericDriftTwo 22s ease-in-out infinite;
        }

        .world-glow-three {
          width: 600px;
          height: 300px;
          left: 35%;
          bottom: -12%;
          background: rgba(231, 184, 75, 0.09);
          animation: atmosphericDriftThree 20s ease-in-out infinite;
        }

        @keyframes atmosphericDriftOne {
          0%,
          100% {
            transform: translate3d(-40px, -20px, 0) scale(1);
          }

          50% {
            transform: translate3d(110px, 80px, 60px) scale(1.25);
          }
        }

        @keyframes atmosphericDriftTwo {
          0%,
          100% {
            transform: translate3d(50px, -30px, 0) scale(1);
          }

          50% {
            transform: translate3d(-120px, 110px, 80px) scale(1.3);
          }
        }

        @keyframes atmosphericDriftThree {
          0%,
          100% {
            transform: translate3d(-80px, 20px, 0);
          }

          50% {
            transform: translate3d(120px, -70px, 100px);
          }
        }

        /* =========================================================
           3D PERSPECTIVE FLOOR
        ========================================================= */

        .perspective-floor {
          position: absolute;
          left: -20%;
          right: -20%;
          bottom: -35%;
          height: 72%;
          transform: perspective(700px) rotateX(68deg);
          transform-origin: center top;
          opacity: 0.14;
        }

        .floor-grid {
          position: absolute;
          inset: 0;

          background-image:
            linear-gradient(
              to right,
              rgba(245, 217, 139, 0.25) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(245, 217, 139, 0.25) 1px,
              transparent 1px
            );

          background-size: 70px 70px;

          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent
          );

          animation: floorMove 9s linear infinite;
        }

        @keyframes floorMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 0 70px;
          }
        }

        /* =========================================================
           ORBIT SYSTEMS
        ========================================================= */

        .orbit-system {
          position: absolute;
          transform-style: preserve-3d;
        }

        .orbit-one {
          width: 500px;
          height: 500px;
          right: 2%;
          top: 8%;
          animation: orbitWorldOne 24s ease-in-out infinite;
        }

        .orbit-two {
          width: 340px;
          height: 340px;
          right: 29%;
          bottom: -7%;
          opacity: 0.58;
          animation: orbitWorldTwo 30s ease-in-out infinite;
        }

        @keyframes orbitWorldOne {
          0%,
          100% {
            transform:
              rotateX(58deg)
              rotateY(-18deg)
              rotateZ(0deg)
              translate3d(0, 0, 0);
          }

          50% {
            transform:
              rotateX(70deg)
              rotateY(20deg)
              rotateZ(180deg)
              translate3d(-35px, 30px, 80px);
          }
        }

        @keyframes orbitWorldTwo {
          0%,
          100% {
            transform:
              rotateX(62deg)
              rotateY(22deg)
              rotateZ(0deg)
              translate3d(0, 0, 0);
          }

          50% {
            transform:
              rotateX(48deg)
              rotateY(-20deg)
              rotateZ(-180deg)
              translate3d(30px, -30px, 50px);
          }
        }

        .orbit-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(231, 184, 75, 0.17);
          box-shadow:
            0 0 25px rgba(231, 184, 75, 0.035),
            inset 0 0 25px rgba(231, 184, 75, 0.025);
        }

        .orbit-ring-a {
          transform: rotateX(70deg);
        }

        .orbit-ring-b {
          transform: rotateY(68deg) rotateX(12deg) scale(0.82);
          border-color: rgba(245, 217, 139, 0.12);
        }

        .orbit-ring-c {
          transform: rotateZ(40deg) rotateX(55deg) scale(0.62);
          border-color: rgba(231, 184, 75, 0.09);
        }

        .orbit-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 30px;
          height: 30px;
          transform: translate(-50%, -50%);
          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255, 242, 188, 0.95) 0%,
              rgba(231, 184, 75, 0.55) 18%,
              rgba(231, 184, 75, 0.12) 45%,
              transparent 72%
            );

          box-shadow:
            0 0 20px rgba(231, 184, 75, 0.38),
            0 0 70px rgba(231, 184, 75, 0.15);

          animation: corePulse 3s ease-in-out infinite;
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.55;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.45);
            opacity: 1;
          }
        }

        .orbit-node {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f5d98b;

          box-shadow:
            0 0 7px rgba(245, 217, 139, 0.9),
            0 0 24px rgba(231, 184, 75, 0.6);
        }

        .node-a {
          left: 8%;
          top: 35%;
          animation: nodeFloatA 5s ease-in-out infinite;
        }

        .node-b {
          right: 13%;
          top: 16%;
          animation: nodeFloatB 6s ease-in-out infinite;
        }

        .node-c {
          right: 8%;
          bottom: 18%;
          animation: nodeFloatC 7s ease-in-out infinite;
        }

        @keyframes nodeFloatA {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(22px, -15px, 30px);
          }
        }

        @keyframes nodeFloatB {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-18px, 25px, 45px);
          }
        }

        @keyframes nodeFloatC {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-25px, -20px, 35px);
          }
        }

        /* =========================================================
           HOLOGRAPHIC RINGS
        ========================================================= */

        .holo-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(245, 217, 139, 0.08);

          box-shadow:
            0 0 35px rgba(231, 184, 75, 0.025),
            inset 0 0 35px rgba(231, 184, 75, 0.02);
        }

        .holo-one {
          width: 220px;
          height: 220px;
          left: 4%;
          bottom: 7%;
          transform: rotateX(66deg) rotateY(18deg);
          animation: holoRotateOne 17s linear infinite;
        }

        .holo-two {
          width: 150px;
          height: 150px;
          left: 38%;
          top: 9%;
          transform: rotateY(65deg);
          animation: holoRotateTwo 13s linear infinite reverse;
        }

        .holo-three {
          width: 280px;
          height: 280px;
          right: 5%;
          bottom: -5%;
          transform: rotateX(58deg) rotateY(-20deg);
          animation: holoRotateThree 21s linear infinite;
        }

        @keyframes holoRotateOne {
          to {
            transform: rotateX(66deg) rotateY(18deg) rotateZ(360deg);
          }
        }

        @keyframes holoRotateTwo {
          to {
            transform: rotateY(65deg) rotateZ(-360deg);
          }
        }

        @keyframes holoRotateThree {
          to {
            transform: rotateX(58deg) rotateY(-20deg) rotateZ(360deg);
          }
        }

        /* =========================================================
           NEURAL NETWORK
        ========================================================= */

        .neural-network {
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          opacity: 0.36;
          transform: translateZ(30px);
        }

        .network-lines {
          stroke-dasharray: 7 20;
          animation: networkFlow 12s linear infinite;
        }

        @keyframes networkFlow {
          to {
            stroke-dashoffset: -280;
          }
        }

        /* =========================================================
           ENERGY BEAMS
        ========================================================= */

        .energy-path {
          position: absolute;
          height: 1px;
          overflow: hidden;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(231, 184, 75, 0.05),
            rgba(245, 217, 139, 0.55),
            rgba(231, 184, 75, 0.05),
            transparent
          );

          filter: blur(0.2px);
          opacity: 0.7;
        }

        .energy-path span {
          position: absolute;
          top: -2px;
          left: -20%;
          width: 20%;
          height: 5px;
          border-radius: 50%;
          background: #f5d98b;

          box-shadow:
            0 0 8px rgba(245, 217, 139, 0.9),
            0 0 30px rgba(231, 184, 75, 0.6);

          filter: blur(1px);
        }

        .energy-path-one {
          width: 70%;
          left: -5%;
          top: 29%;
          transform: rotate(-12deg);
        }

        .energy-path-one span {
          animation: energyTravelOne 7s linear infinite;
        }

        .energy-path-two {
          width: 65%;
          right: -8%;
          top: 58%;
          transform: rotate(14deg);
        }

        .energy-path-two span {
          animation: energyTravelTwo 9s linear infinite;
          animation-delay: 2s;
        }

        .energy-path-three {
          width: 55%;
          left: 18%;
          bottom: 18%;
          transform: rotate(-7deg);
        }

        .energy-path-three span {
          animation: energyTravelThree 8s linear infinite;
          animation-delay: 4s;
        }

        @keyframes energyTravelOne {
          0% {
            left: -20%;
          }

          100% {
            left: 110%;
          }
        }

        @keyframes energyTravelTwo {
          0% {
            left: -20%;
          }

          100% {
            left: 110%;
          }
        }

        @keyframes energyTravelThree {
          0% {
            left: -20%;
          }

          100% {
            left: 110%;
          }
        }

        /* =========================================================
           PARTICLES
        ========================================================= */

        .particle-field {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(245, 217, 139, 0.8);

          box-shadow:
            0 0 6px rgba(245, 217, 139, 0.8),
            0 0 18px rgba(231, 184, 75, 0.35);

          animation: particleFloat 8s ease-in-out infinite;
        }

        .p01 {
          left: 7%;
          top: 21%;
          animation-delay: -1s;
        }

        .p02 {
          left: 15%;
          top: 72%;
          animation-delay: -4s;
          transform: scale(0.6);
        }

        .p03 {
          left: 25%;
          top: 17%;
          animation-delay: -2s;
        }

        .p04 {
          left: 31%;
          top: 82%;
          animation-delay: -6s;
          transform: scale(0.7);
        }

        .p05 {
          left: 43%;
          top: 24%;
          animation-delay: -3s;
        }

        .p06 {
          left: 52%;
          top: 12%;
          animation-delay: -5s;
          transform: scale(0.55);
        }

        .p07 {
          left: 60%;
          top: 76%;
          animation-delay: -1.5s;
        }

        .p08 {
          left: 68%;
          top: 27%;
          animation-delay: -7s;
        }

        .p09 {
          left: 76%;
          top: 68%;
          animation-delay: -2.5s;
          transform: scale(0.7);
        }

        .p10 {
          left: 84%;
          top: 18%;
          animation-delay: -4.5s;
        }

        .p11 {
          left: 92%;
          top: 42%;
          animation-delay: -3.5s;
          transform: scale(0.65);
        }

        .p12 {
          left: 12%;
          top: 44%;
          animation-delay: -6.5s;
        }

        .p13 {
          left: 22%;
          top: 58%;
          animation-delay: -2s;
          transform: scale(0.55);
        }

        .p14 {
          left: 37%;
          top: 38%;
          animation-delay: -5.5s;
        }

        .p15 {
          left: 48%;
          top: 62%;
          animation-delay: -7.5s;
        }

        .p16 {
          left: 57%;
          top: 43%;
          animation-delay: -3s;
          transform: scale(0.6);
        }

        .p17 {
          left: 72%;
          top: 51%;
          animation-delay: -6s;
        }

        .p18 {
          left: 81%;
          top: 79%;
          animation-delay: -2.5s;
          transform: scale(0.55);
        }

        .p19 {
          left: 89%;
          top: 61%;
          animation-delay: -5s;
        }

        .p20 {
          left: 96%;
          top: 83%;
          animation-delay: -7s;
          transform: scale(0.65);
        }

        @keyframes particleFloat {
          0%,
          100% {
            opacity: 0.2;
            transform: translate3d(0, 20px, 0) scale(0.8);
          }

          25% {
            opacity: 0.75;
          }

          50% {
            opacity: 1;
            transform: translate3d(18px, -25px, 80px) scale(1.35);
          }

          75% {
            opacity: 0.45;
          }
        }

        /* =========================================================
           GLASS FRAGMENTS
        ========================================================= */

        .glass-fragment {
          position: absolute;
          border: 1px solid rgba(245, 217, 139, 0.12);

          background: linear-gradient(
            135deg,
            rgba(245, 217, 139, 0.035),
            rgba(255, 255, 255, 0.008)
          );

          backdrop-filter: blur(5px);

          box-shadow:
            inset 0 0 25px rgba(245, 217, 139, 0.025),
            0 0 25px rgba(0, 0, 0, 0.12);

          transform-style: preserve-3d;
        }

        .fragment-one {
          width: 90px;
          height: 130px;
          right: 17%;
          top: 11%;
          transform: rotate(24deg) skewY(-12deg);
          animation: fragmentOne 12s ease-in-out infinite;
        }

        .fragment-two {
          width: 65px;
          height: 95px;
          right: 7%;
          top: 72%;
          transform: rotate(-32deg);
          animation: fragmentTwo 15s ease-in-out infinite;
        }

        .fragment-three {
          width: 48px;
          height: 78px;
          left: 5%;
          top: 58%;
          transform: rotate(42deg);
          animation: fragmentThree 11s ease-in-out infinite;
        }

        .fragment-four {
          width: 55px;
          height: 55px;
          left: 43%;
          top: 5%;
          transform: rotate(18deg);
          animation: fragmentFour 14s ease-in-out infinite;
        }

        @keyframes fragmentOne {
          0%,
          100% {
            transform: rotate(24deg) translate3d(0, 0, 0);
          }

          50% {
            transform: rotate(70deg) translate3d(-45px, 55px, 100px);
          }
        }

        @keyframes fragmentTwo {
          0%,
          100% {
            transform: rotate(-32deg) translate3d(0, 0, 0);
          }

          50% {
            transform: rotate(25deg) translate3d(-35px, -45px, 70px);
          }
        }

        @keyframes fragmentThree {
          0%,
          100% {
            transform: rotate(42deg) translate3d(0, 0, 0);
          }

          50% {
            transform: rotate(-10deg) translate3d(50px, -25px, 90px);
          }
        }

        @keyframes fragmentFour {
          0%,
          100% {
            transform: rotate(18deg) translate3d(0, 0, 0);
          }

          50% {
            transform: rotate(160deg) translate3d(25px, 50px, 60px);
          }
        }

        /* =========================================================
           HOLOGRAPHIC DATA PANELS
        ========================================================= */

        .holo-panel {
          position: absolute;
          width: 90px;
          height: 42px;
          padding: 9px;

          border: 1px solid rgba(231, 184, 75, 0.1);
          background: rgba(21, 23, 19, 0.16);
          backdrop-filter: blur(5px);

          transform:
            perspective(500px)
            rotateY(-18deg)
            rotateX(8deg);

          opacity: 0.4;
        }

        .holo-panel span {
          display: block;
          height: 2px;
          margin-bottom: 5px;
          border-radius: 999px;
          background: rgba(245, 217, 139, 0.28);
        }

        .holo-panel span:nth-child(1) {
          width: 70%;
        }

        .holo-panel span:nth-child(2) {
          width: 45%;
        }

        .holo-panel span:nth-child(3) {
          width: 82%;
        }

        .panel-one {
          left: 8%;
          top: 35%;
          animation: panelFloatOne 10s ease-in-out infinite;
        }

        .panel-two {
          right: 10%;
          top: 44%;
          animation: panelFloatTwo 13s ease-in-out infinite;
        }

        .panel-three {
          left: 31%;
          bottom: 8%;
          animation: panelFloatThree 11s ease-in-out infinite;
        }

        @keyframes panelFloatOne {
          0%,
          100% {
            transform:
              perspective(500px)
              rotateY(-18deg)
              rotateX(8deg)
              translate3d(0, 0, 0);
            opacity: 0.25;
          }

          50% {
            transform:
              perspective(500px)
              rotateY(12deg)
              rotateX(-4deg)
              translate3d(35px, -25px, 80px);
            opacity: 0.55;
          }
        }

        @keyframes panelFloatTwo {
          0%,
          100% {
            transform:
              perspective(500px)
              rotateY(-18deg)
              rotateX(8deg)
              translate3d(0, 0, 0);
            opacity: 0.25;
          }

          50% {
            transform:
              perspective(500px)
              rotateY(20deg)
              rotateX(4deg)
              translate3d(-30px, 35px, 90px);
            opacity: 0.5;
          }
        }

        @keyframes panelFloatThree {
          0%,
          100% {
            transform:
              perspective(500px)
              rotateY(-18deg)
              rotateX(8deg)
              translate3d(0, 0, 0);
          }

          50% {
            transform:
              perspective(500px)
              rotateY(18deg)
              rotateX(-8deg)
              translate3d(-20px, -25px, 70px);
          }
        }

        /* =========================================================
           SCANNER
        ========================================================= */

        .scanner-beam {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 2px;
          top: 0;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(245, 217, 139, 0.03),
            rgba(245, 217, 139, 0.35),
            rgba(245, 217, 139, 0.03),
            transparent
          );

          box-shadow: 0 0 22px rgba(231, 184, 75, 0.18);

          opacity: 0;
          animation: scannerMove 10s ease-in-out infinite;
        }

        @keyframes scannerMove {
          0%,
          100% {
            top: -5%;
            opacity: 0;
          }

          12% {
            opacity: 0.4;
          }

          48% {
            opacity: 0.18;
          }

          55% {
            top: 105%;
            opacity: 0;
          }
        }

        /* =========================================================
           CINEMATIC VIGNETTE
        ========================================================= */

        .cinematic-vignette {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              ellipse at center,
              transparent 25%,
              rgba(0, 0, 0, 0.18) 62%,
              rgba(0, 0, 0, 0.62) 100%
            );
        }

        /* =========================================================
           REDUCED MOTION
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {
          .auth-float,
          .auth-border-beam,
          .auth-scan,
          .world-glow,
          .perspective-floor,
          .orbit-system,
          .orbit-core,
          .holo-ring,
          .network-lines,
          .energy-path span,
          .particle,
          .glass-fragment,
          .holo-panel,
          .scanner-beam {
            animation: none !important;
          }
        }

        /* =========================================================
           TABLET
        ========================================================= */

        @media (max-width: 900px) {
          .orbit-one {
            right: -18%;
            top: 16%;
            transform: scale(0.72);
          }

          .orbit-two {
            right: -10%;
            bottom: -5%;
            transform: scale(0.7);
          }

          .fragment-one,
          .fragment-two,
          .panel-two {
            opacity: 0.45;
          }

          .neural-network {
            opacity: 0.22;
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 640px) {
          .auth-float {
            animation-duration: 7s;
          }

          .world-glow {
            opacity: 0.1;
          }

          .orbit-one {
            right: -42%;
            top: 15%;
            transform: scale(0.52);
          }

          .orbit-two {
            right: -25%;
            bottom: -4%;
            transform: scale(0.48);
          }

          .holo-one {
            left: -18%;
            bottom: 10%;
            transform: scale(0.65) rotateX(66deg);
          }

          .holo-two,
          .fragment-four,
          .panel-three {
            display: none;
          }

          .neural-network {
            opacity: 0.15;
          }

          .particle {
            width: 2px;
            height: 2px;
          }

          .perspective-floor {
            bottom: -20%;
            opacity: 0.07;
          }

          .scanner-beam {
            opacity: 0.3;
          }
        }
      `}</style>
    </main>
  );
}

