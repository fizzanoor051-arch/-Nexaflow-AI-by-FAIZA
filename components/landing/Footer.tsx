import Link from "next/link";

export default function Footer() {
  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Use cases", href: "#use-cases" },
    { label: "Pricing", href: "#pricing" },
  ];

  const appLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflows", href: "/workflows" },
    { label: "Conversations", href: "/conversations" },
    { label: "Analytics", href: "/analytics" },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#040611]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <span className="text-sm font-black text-violet-200">N</span>
              </div>

              <div>
                <div className="text-sm font-bold text-white">NexaFlow</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300/50">
                  AI Automation
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
              An AI-powered business automation platform that turns natural
              language requests into structured workflows and actionable
              business operations.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-600">
                Automation workspace online
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-slate-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </h3>

            <ul className="mt-5 space-y-3">
              {appLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-slate-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 transition hover:text-slate-300"
                >
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-slate-600 transition hover:text-slate-300"
                >
                  Create account
                </Link>
              </li>

              <li>
                <Link
                  href="/settings"
                  className="text-sm text-slate-600 transition hover:text-slate-300"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} NexaFlow AI. Built for intelligent
            automation.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-700">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}