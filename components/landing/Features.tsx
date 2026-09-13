const features = [
  {
    number: "01",
    title: "AI understands the request",
    description:
      "Turn natural-language business requests into structured, actionable information using intelligent AI processing.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Build intelligent workflows",
    description:
      "Create repeatable workflows that connect AI decisions with practical business actions, tasks, leads, and follow-ups.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="4" width="7" height="6" rx="1.5" />
        <rect x="14" y="14" width="7" height="6" rx="1.5" />
        <path d="M10 7h3a2 2 0 0 1 2 2v5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Manage leads automatically",
    description:
      "Capture important customer information, classify leads, assign priorities, and keep every opportunity organized.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 11h5M18.5 8.5v5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Track tasks & outcomes",
    description:
      "Convert AI-generated actions into trackable tasks so your team always knows what needs attention next.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "See business analytics",
    description:
      "Understand workflow activity, AI usage, automation performance, and operational trends from one dashboard.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Designed for secure growth",
    description:
      "The architecture is prepared for authentication, validation, protected routes, secure APIs, and scalable data storage.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15" r="1" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#050816] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Platform
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to automate
            <span className="text-violet-300"> repetitive work.</span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            NexaFlow combines AI reasoning with structured workflows, helping
            teams move from unstructured requests to measurable business
            actions.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative bg-[#070b1c] p-7 transition-colors duration-300 hover:bg-[#0a0f24]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300 transition-all duration-300 group-hover:border-violet-400/25 group-hover:bg-violet-500/15">
                  {feature.icon}
                </div>

                <span className="text-xs font-medium text-slate-700">
                  {feature.number}
                </span>
              </div>

              <h3 className="mt-7 text-base font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>

              <div className="mt-7 h-px w-10 bg-violet-500/30 transition-all duration-300 group-hover:w-20" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}