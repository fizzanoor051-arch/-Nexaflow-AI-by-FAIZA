import Link from "next/link";

export default function NotFound() {
return ( <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 text-white">
{/* Background glow */} <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

```
  <div className="relative z-10 mx-auto max-w-xl text-center">
    <div className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-violet-400">
      NexaFlow AI
    </div>

    <h1 className="text-7xl font-black tracking-tight sm:text-8xl">
      404
    </h1>

    <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
      Page not found
    </h2>

    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
      The page you are looking for does not exist or may have been moved.
      Let&apos;s get you back to NexaFlow.
    </p>

    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.98]"
      >
        Back to Home
      </Link>

      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98]"
      >
        Open Dashboard
      </Link>
    </div>
  </div>
</main>


);
}
