
import Card from "@/components/ui/Card";

const metrics = [
  {
    label: "AI runs",
    value: "1,247",
    change: "+18.4%",
    icon: "✦",
  },
  {
    label: "Successful runs",
    value: "1,182",
    change: "+21.7%",
    icon: "✓",
  },
  {
    label: "Leads generated",
    value: "248",
    change: "+12.8%",
    icon: "👥",
  },
  {
    label: "Tasks created",
    value: "436",
    change: "+16.2%",
    icon: "✓",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-400">Insights</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-sm text-slate-400">
          Understand how your AI automations are performing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-emerald-400">
                  {metric.change} this month
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div>
            <h2 className="font-semibold text-white">Automation volume</h2>
            <p className="mt-1 text-sm text-slate-400">
              AI workflow runs over the last 30 days.
            </p>
          </div>

          <div className="mt-8 flex h-56 items-end gap-2">
            {[35, 48, 42, 62, 58, 74, 68, 82, 76, 91, 86, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-lg bg-violet-500/40 transition group-hover:bg-violet-400/70"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            )}
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-slate-600">
            <span>Aug 15</span>
            <span>Aug 22</span>
            <span>Aug 29</span>
            <span>Sep 5</span>
            <span>Sep 12</span>
          </div>
        </Card>

        <Card>
          <div>
            <h2 className="font-semibold text-white">Workflow performance</h2>
            <p className="mt-1 text-sm text-slate-400">
              Success rate by automation.
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {[
              ["Customer Support", 96],
              ["Lead Qualification", 94],
              ["Task Automation", 91],
              ["Email Processing", 89],
            ].map(([name, percentage]) => (
              <div key={String(name)}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{name}</span>
                  <span className="font-medium text-white">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-white">Overall success rate</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your automations are completing reliably.
            </p>
          </div>

          <div className="text-4xl font-bold text-emerald-400">94.8%</div>
        </div>
      </Card>
    </div>
  );
}
