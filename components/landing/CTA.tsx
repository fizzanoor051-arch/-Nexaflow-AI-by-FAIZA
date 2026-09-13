import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#050816] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.09] blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.08] via-white/[0.025] to-indigo-500/[0.06] px-6 py-14 text-center shadow-2xl shadow-black/20 sm:px-12 sm:py-20">
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
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

          <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next workflow could
            <span className="text-violet-300"> run itself.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Start with a simple business problem. Let NexaFlow turn it into a
            structured AI-powered workflow you can understand, review, and
            execute.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition hover:bg-violet-500"
            >
              Create your workspace
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
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
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-600">
            <span>AI-powered workflows</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span>Lead management</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span>Task automation</span>
          </div>
        </div>
      </div>
    </section>
  );
}