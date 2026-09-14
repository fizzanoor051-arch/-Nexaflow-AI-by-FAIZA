import Link from "next/link";
import AmbientParticles from "@/components/landing/AmbientParticles";

export default function CTA() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080806] py-24 sm:py-32">
      {/* Animated mustard pearls */}
      <AmbientParticles />

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Main golden glow */}
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.055] blur-[150px]" />

        {/* Upper glow */}
        <div className="absolute left-1/2 top-[-220px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-yellow-400/[0.025] blur-[140px]" />

        {/* Side glows */}
        <div className="absolute -left-60 bottom-[-100px] h-[420px] w-[420px] rounded-full bg-amber-300/[0.018] blur-[130px]" />

        <div className="absolute -right-60 top-[20%] h-[420px] w-[420px] rounded-full bg-amber-300/[0.018] blur-[130px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-300/[0.14] bg-gradient-to-br from-amber-300/[0.055] via-white/[0.018] to-yellow-500/[0.025] px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-12 sm:py-20">
          {/* Top golden line */}
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

          {/* Inner glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-amber-300/[0.025] blur-3xl" />

          {/* Icon */}
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/[0.18] bg-amber-300/[0.055] text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.06)] transition-all duration-500 hover:border-amber-300/30 hover:bg-amber-300/[0.08] hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 3v18M3 12h18" />
              <path d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="relative mx-auto mt-7 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next workflow could
            <span className="text-amber-300">
              {" "}
              run itself.
            </span>
          </h2>

          {/* Description */}
          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Start with a simple business problem. Let NexaFlow turn it into a
            structured AI-powered workflow you can understand, review, and
            execute.
          </p>

          {/* Buttons */}
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200/20 bg-amber-300 px-6 py-3.5 text-sm font-semibold text-[#17130a] shadow-[0_12px_35px_rgba(245,158,11,0.12)] transition-all duration-300 hover:bg-amber-200 hover:shadow-[0_16px_45px_rgba(245,158,11,0.2)]"
            >
              Create your workspace

              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-amber-300/[0.18] hover:bg-amber-300/[0.045] hover:text-amber-100"
            >
              Sign in
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-600">
            <span className="transition-colors hover:text-slate-400">
              AI-powered workflows
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-amber-300/30 sm:block" />

            <span className="transition-colors hover:text-slate-400">
              Lead management
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-amber-300/30 sm:block" />

            <span className="transition-colors hover:text-slate-400">
              Task automation
            </span>
          </div>

          {/* Bottom golden line */}
          <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent" />
        </div>
      </div>
    </section>
  );
}