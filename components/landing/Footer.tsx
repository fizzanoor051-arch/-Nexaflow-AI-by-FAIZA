import Link from "next/link";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Pricing", href: "/#pricing" },
];

const workspaceLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Workflows", href: "/workflows" },
  { label: "Conversations", href: "/conversations" },
  { label: "Leads", href: "/leads" },
  { label: "Tasks", href: "/tasks" },
  { label: "Analytics", href: "/analytics" },
];

const accountLinks = [
  { label: "Sign in", href: "/login" },
  { label: "Create account", href: "/register" },
  { label: "Settings", href: "/settings" },
  { label: "Account", href: "/account" },
];

const companyLinks = [
  { label: "About", href: "/#about" },
  {
    label: "Contact",
    href: "https://faiza-noor10.vercel.app/",
    external: true,
  },
  {
    label: "Portfolio",
    href: "https://faiza-noor10.vercel.app/",
    external: true,
  },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security", href: "/security" },
];

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-3 w-3 shrink-0"
    >
      <path
        d="M9.5 2H14v4.5M13.5 2.5 8 8M7 3H4.5A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3.5 8h8.5M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="m4 5.5 6 4.5 6-4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 10h13M10 3c2 2 3 4.5 3 7s-1 5-3 7c-2-2-3-4.5-3-7s1-5 3-7Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M12 .75A11.25 11.25 0 0 0 8.44 22.67c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.51-.29-5.15-1.26-5.15-5.61 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.01 0 0 .95-.31 3.1 1.16A10.75 10.75 0 0 1 12 6.1c.96 0 1.93.13 2.84.38 2.14-1.47 3.09-1.16 3.09-1.16.61 1.56.23 2.72.11 3.01.72.8 1.16 1.81 1.16 3.05 0 4.36-2.65 5.31-5.17 5.6.4.35.76 1.04.76 2.1v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 7.9a2.2 2.2 0 0 1 0-4.4ZM3.3 9.5h3.8V21H3.3V9.5Zm6.1 0h3.6v1.57h.05c.5-.95 1.73-1.95 3.56-1.95 3.81 0 4.51 2.5 4.51 5.75V21h-3.8v-5.43c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88V21H9.4V9.5Z" />
    </svg>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D8D4C8] sm:text-[11px] sm:tracking-[0.18em]">
        {title}
      </h3>

      <ul className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
        {links.map((link) => {
          const external =
            link.external || link.href.startsWith("http");

          return (
            <li key={link.label}>
              {external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex max-w-full items-center gap-1 text-[12px] leading-5 text-[#8F938A] transition-colors hover:text-[#F5D98B] sm:gap-1.5 sm:text-sm"
                >
                  <span className="truncate">{link.label}</span>
                  <ExternalIcon />
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="group inline-flex max-w-full items-center gap-1 text-[12px] leading-5 text-[#8F938A] transition-colors hover:text-[#F5D98B] sm:gap-1.5 sm:text-sm"
                >
                  <span className="truncate">{link.label}</span>
                  <ArrowIcon />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#F5D98B]/[0.08] bg-[#151713]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[520px] -translate-x-1/2 rounded-full bg-[#E7B84B]/[0.025] blur-3xl sm:h-64 sm:w-[700px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-x-7 gap-y-9 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 sm:gap-3"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E7B84B]/25 bg-[#252A22] shadow-[0_0_24px_rgba(231,184,75,0.07)] transition-all duration-300 group-hover:border-[#E7B84B]/45 group-hover:shadow-[0_0_28px_rgba(231,184,75,0.14)] sm:h-11 sm:w-11">
                <div className="absolute inset-0 bg-[#E7B84B]/[0.06] blur-xl" />

                <span className="relative text-sm font-black text-[#F5D98B]">
                  N
                </span>

                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E7B84B] shadow-[0_0_8px_rgba(231,184,75,0.65)]" />
              </div>

              <div>
                <div className="text-sm font-bold text-[#F4F0E6]">
                  NexaFlow AI
                </div>

                <div className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#BFAF7A] sm:text-[9px] sm:tracking-[0.2em]">
                  AI Automation
                </div>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-[13px] leading-5 text-[#9A9D94] sm:mt-5 sm:text-sm sm:leading-6">
              An AI-powered business automation platform that turns natural
              language requests into structured workflows and actionable
              business operations.
            </p>

            {/* Status */}
            <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#5ED6A0]/10 bg-[#5ED6A0]/[0.035] px-2.5 py-1.5 sm:mt-6 sm:px-3">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#5ED6A0] shadow-[0_0_8px_rgba(94,214,160,0.45)]" />

              <span className="truncate text-[10px] text-[#9A9D94] sm:text-[11px]">
                Automation workspace online
              </span>
            </div>

            {/* Creator */}
            <div className="mt-5 border-l border-[#E7B84B]/20 pl-3 sm:mt-6 sm:pl-4">
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#777D70] sm:text-[10px] sm:tracking-[0.18em]">
                Designed & built by
              </p>

              <a
                href="https://faiza-noor10.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5D98B] transition-colors hover:text-[#FFF0B5]"
              >
                FAIZA NOOR
                <ExternalIcon />
              </a>

              <p className="mt-0.5 text-[11px] text-[#73776F] sm:text-xs">
                Full-Stack Web Engineer
              </p>
            </div>

            {/* Contact */}
            <div className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">
              <a
                href="mailto:fizzanoor051@gmail.com"
                className="group flex min-w-0 items-center gap-2.5 text-[12px] text-[#8F938A] transition-colors hover:text-[#F5D98B] sm:gap-3 sm:text-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#F5D98B]/10 bg-[#20241D] text-[#BFAF7A] transition-colors group-hover:border-[#E7B84B]/25 group-hover:text-[#F5D98B] sm:h-8 sm:w-8">
                  <MailIcon />
                </span>

                <span className="truncate">fizzanoor051@gmail.com</span>
              </a>

              <a
                href="https://faiza-noor10.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center gap-2.5 text-[12px] text-[#8F938A] transition-colors hover:text-[#F5D98B] sm:gap-3 sm:text-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#F5D98B]/10 bg-[#20241D] text-[#BFAF7A] transition-colors group-hover:border-[#E7B84B]/25 group-hover:text-[#F5D98B] sm:h-8 sm:w-8">
                  <GlobeIcon />
                </span>

                <span className="truncate">faiza-noor10.vercel.app</span>

                <ExternalIcon />
              </a>
            </div>
          </div>

          {/* Product */}
          <LinkColumn title="Product" links={productLinks} />

          {/* Workspace */}
          <LinkColumn title="Workspace" links={workspaceLinks} />

          {/* Account */}
          <LinkColumn title="Account" links={accountLinks} />

          {/* Company */}
          <LinkColumn title="Company" links={companyLinks} />
        </div>

        {/* Contact CTA */}
        <div className="mt-9 overflow-hidden rounded-2xl border border-[#F5D98B]/[0.08] bg-[#1B1F19] sm:mt-12">
          <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F4F0E6]">
                Need a custom automation solution?
              </p>

              <p className="mt-1 max-w-xl text-[11px] leading-5 text-[#8F938A] sm:text-xs">
                Get in touch with Faiza Noor for web development and AI
                automation projects.
              </p>
            </div>

            <a
              href="https://faiza-noor10.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E7B84B]/25 bg-[#E7B84B]/[0.08] px-4 py-2.5 text-xs font-semibold text-[#F5D98B] transition-all duration-200 hover:border-[#E7B84B]/45 hover:bg-[#E7B84B]/[0.14] hover:shadow-[0_0_22px_rgba(231,184,75,0.08)] sm:w-auto"
            >
              Contact / Portfolio
              <ExternalIcon />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-7 flex flex-col gap-4 border-t border-[#F5D98B]/[0.07] pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="min-w-0">
            <p className="text-[11px] text-[#73776F] sm:text-xs">
              © {currentYear} NexaFlow AI. All rights reserved.
            </p>

            <p className="mt-1 text-[9px] text-[#555A52] sm:text-[10px]">
              Built with precision by{" "}
              <a
                href="https://faiza-noor10.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B805F] transition-colors hover:text-[#F5D98B]"
              >
                FAIZA NOOR
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-[#73776F] sm:gap-x-5 sm:text-xs">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#BFAF7A]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-[#BFAF7A]"
            >
              Terms
            </Link>

            <Link
              href="/security"
              className="transition-colors hover:text-[#BFAF7A]"
            >
              Security
            </Link>

            <a
              href="mailto:fizzanoor051@gmail.com"
              className="transition-colors hover:text-[#BFAF7A]"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Social / professional links */}
        <div className="mt-5 flex flex-col gap-4 border-t border-[#F5D98B]/[0.04] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <span className="text-[8px] uppercase tracking-[0.14em] text-[#555A52] sm:text-[10px] sm:tracking-[0.16em]">
            NexaFlow AI · Intelligent Operations
          </span>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/fizzanoor051-arch"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faiza Noor GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5D98B]/[0.07] bg-[#1B1F19] text-[#777D70] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B]"
            >
              <GithubIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/faiza-noor-b2711b42b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faiza Noor LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5D98B]/[0.07] bg-[#1B1F19] text-[#777D70] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B]"
            >
              <LinkedinIcon />
            </a>

            <a
              href="https://faiza-noor10.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faiza Noor Portfolio"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5D98B]/[0.07] bg-[#1B1F19] text-[#777D70] transition-all duration-200 hover:border-[#E7B84B]/25 hover:bg-[#252A22] hover:text-[#F5D98B]"
            >
              <GlobeIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}