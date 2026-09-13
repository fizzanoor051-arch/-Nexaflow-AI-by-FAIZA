const useCases = [
  {
    category: "E-commerce",
    title: "Handle customer inquiries",
    description:
      "Automatically understand customer questions, classify intent, prepare responses, capture lead information, and create follow-up tasks.",
    tags: ["Lead capture", "AI replies", "Follow-ups"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 5h16v12H4z" />
        <path d="M8 21h8M12 17v4" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    category: "Sales",
    title: "Turn conversations into leads",
    description:
      "Extract useful customer information from conversations, assign priority, and organize prospects without manually entering every detail.",
    tags: ["Lead scoring", "Extraction", "Priorities"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6 1.6 0 3 .6 4.1 1.6" />
        <path d="M16 14h5M18.5 11.5v5" />
      </svg>
    ),
  },
  {
    category: "Operations",
    title: "Automate repetitive tasks",
    description:
      "Transform recurring business processes into structured workflows so your team can spend more time on work that actually needs human attention.",
    tags: ["Task automation", "Workflows", "Tracking"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
        <path d="M10 7h3a2 2 0 0 1 2 2v5" />
      </svg>
    ),
  },
  {
    category: "Support",
    title: "Keep customer support organized",
    description:
      "Analyze incoming requests, identify the right next action, and maintain a clear history of customer conversations and outcomes.",
    tags: ["Classification", "History", "Next actions"],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative overflow-hidden bg-[#050816] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Use cases
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built around real
              <span className="text-violet-300"> business problems.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
              NexaFlow is designed to connect AI reasoning with practical
              workflows that businesses can actually use.
            </p>
          </div>

          <div className="hidden rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 lg:block">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Automation mindset
            </p>
            <p className="mt-1 text-sm font-medium text-slate-300">
              Understand → Decide → Act
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {useCases.map((item) => (
            <article
              key={item.category}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04] sm:p-7"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/[0.06] blur-3xl transition-all duration-500 group-hover:bg-violet-600/[0.12]" />

              <div className="relative flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                  {item.icon}
                </div>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-slate-500">
                  {item.category}
                </span>
              </div>

              <div className="relative mt-7">
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="relative mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/[0.06] bg-black/10 px-2.5 py-1.5 text-[10px] font-medium text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}