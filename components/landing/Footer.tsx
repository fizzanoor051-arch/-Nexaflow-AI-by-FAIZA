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
    <footer className="border-t border-[#F5D98B]/[0.08] bg-[#151713]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#E7B84B]/25 bg-[#252A22] shadow-[0_0_24px_rgba(231,184,75,0.07)]">
                <div className="absolute inset-0 bg-[#E7B84B]/[0.06] blur-xl" />

                <span className="relative text-sm font-black text-[#F5D98B]">
                  N
                </span>

                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.65)]" />
              </div>

              <div>
                <div className="text-sm font-bold text-[#F4F0E6]">
                  NexaFlow
                </div>

                <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#BFAF7A]">
                  AI Automation
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#9A9D94]">
              An AI-powered business automation platform that turns natural
              language requests into structured workflows and actionable
              business operations.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.45)]" />

              <span className="text-xs text-[#9A9D94]">
                Automation workspace online
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8D4C8]">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#8F938A] transition-colors hover:text-[#F5D98B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8D4C8]">
              Workspace
            </h3>

            <ul className="mt-5 space-y-3">
              {appLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8F938A] transition-colors hover:text-[#F5D98B]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8D4C8]">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-[#8F938A] transition-colors hover:text-[#F5D98B]"
                >
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-[#8F938A] transition-colors hover:text-[#F5D98B]"
                >
                  Create account
                </Link>
              </li>

              <li>
                <Link
                  href="/settings"
                  className="text-sm text-[#8F938A] transition-colors hover:text-[#F5D98B]"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#F5D98B]/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#73776F]">
            © {new Date().getFullYear()} NexaFlow AI. Built for intelligent
            automation.
          </p>

          <div className="flex items-center gap-5 text-xs text-[#73776F]">
            <span className="transition-colors hover:text-[#BFAF7A]">
              Privacy
            </span>

            <span className="transition-colors hover:text-[#BFAF7A]">
              Terms
            </span>

            <span className="transition-colors hover:text-[#BFAF7A]">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}