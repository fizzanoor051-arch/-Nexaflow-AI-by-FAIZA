import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import StatsCard from "@/components/dashboard/StatsCard";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-violet-400">
          Welcome back, Faiza
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Your automation workspace
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Turn repetitive business tasks into intelligent
          workflows with NexaFlow AI.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Active Workflows"
          value="8"
          change="+12.5%"
          changeLabel="this month"
          trend="up"
          variant="violet"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 3v18M18 3v18M6 7h12M6 17h12" />
            </svg>
          }
        />

        <StatsCard
          title="Total Leads"
          value="248"
          change="+18.2%"
          changeLabel="this month"
          trend="up"
          variant="blue"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <StatsCard
          title="Tasks Created"
          value="436"
          change="+24.8%"
          changeLabel="this month"
          trend="up"
          variant="emerald"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m9 11 3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
        />

        <StatsCard
          title="AI Success Rate"
          value="94.8%"
          change="+2.4%"
          changeLabel="this month"
          trend="up"
          variant="amber"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 2 3 7l9 5 9-5-9-5Z" />
              <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ActivityFeed />

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
            <div>
              <h2 className="font-semibold">
                Automation performance
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Workflow execution overview
              </p>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              Healthy
            </span>
          </div>

          <div className="p-5">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold">
                  1,247
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Total AI runs
                </p>
              </div>

              <p className="text-sm font-medium text-emerald-400">
                +18.4%
              </p>
            </div>

            <div className="flex h-40 items-end gap-2">
              {[42, 58, 48, 72, 61, 84, 68, 92, 76, 88, 95, 82].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group relative flex-1"
                  >
                    <div
                      className="w-full rounded-t-md bg-violet-500/30 transition-all duration-300 group-hover:bg-violet-400/60"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-slate-600">
              <span>May 1</span>
              <span>May 15</span>
              <span>May 30</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}