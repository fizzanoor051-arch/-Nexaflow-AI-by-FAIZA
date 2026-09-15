import { NextResponse } from "next/server";
import {
getWorkflows,
getLeads,
getTasks,
getAnalytics,
getRecentActivity,
} from "@/lib/workflows/store";

type Period = "week" | "month";

type Trend = "up" | "down" | "neutral";

type Change = {
value: number;
trend: Trend;
};

type GraphPoint = {
label: string;
value: number;
};

function getPeriodDays(period: Period) {
return period === "week" ? 7 : new Date().getDate();
}

function getPeriodStart(
period: Period,
offset = 0
) {
const now = new Date();

if (period === "week") {
const start = new Date(now);


start.setDate(
  now.getDate() - 6 - offset * 7
);

start.setHours(0, 0, 0, 0);

return start;


}

const start = new Date(
now.getFullYear(),
now.getMonth(),
1
);

start.setMonth(
start.getMonth() - offset
);

return start;
}

function getPeriodEnd(
period: Period,
offset = 0
) {
const now = new Date();

if (period === "week") {
const end = new Date(now);


end.setDate(
  now.getDate() - offset * 7
);

end.setHours(23, 59, 59, 999);

return end;


}

const start = new Date(
now.getFullYear(),
now.getMonth() + 1 - offset,
0
);

start.setHours(23, 59, 59, 999);

return start;
}

function isBetween(
createdAt: string | undefined,
start: Date,
end: Date
) {
if (!createdAt) {
return false;
}

const time = new Date(createdAt).getTime();

if (Number.isNaN(time)) {
return false;
}

return (
time >= start.getTime() &&
time <= end.getTime()
);
}

function getChange(
current: number,
previous: number
): Change {
if (previous === 0) {
if (current === 0) {
return {
value: 0,
trend: "neutral",
};
}


return {
  value: 100,
  trend: "up",
};


}

const percentage =
((current - previous) / previous) * 100;

const rounded = Number(
percentage.toFixed(1)
);

if (rounded === 0) {
return {
value: 0,
trend: "neutral",
};
}

return {
value: Math.abs(rounded),
trend:
rounded > 0
? "up"
: "down",
};
}

function createGraphBuckets(
period: Period,
start: Date
) {
const days = getPeriodDays(period);

return Array.from(
{ length: days },
(_, index) => {
const date = new Date(start);


  date.setDate(
    start.getDate() + index
  );

  return {
    date,
    label:
      period === "week"
        ? date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          )
        : date.toLocaleDateString(
            "en-US",
            {
              day: "numeric",
            }
          ),
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksCompleted: 0,
    aiActions: 0,
    workflowActivity: 0,
  };
}


);
}

function addToGraph(
buckets: ReturnType<typeof createGraphBuckets>,
createdAt: string | undefined,
key:
| "totalLeads"
| "qualifiedLeads"
| "tasksCompleted"
| "aiActions"
| "workflowActivity"
) {
if (!createdAt) {
return;
}

const time = new Date(createdAt).getTime();

if (Number.isNaN(time)) {
return;
}

const matchingBucket = buckets.find(
(bucket, index) => {
const bucketStart =
new Date(bucket.date);


  bucketStart.setHours(
    0,
    0,
    0,
    0
  );

  const bucketEnd =
    new Date(bucket.date);

  bucketEnd.setHours(
    23,
    59,
    59,
    999
  );

  return (
    time >= bucketStart.getTime() &&
    time <= bucketEnd.getTime()
  );
}


);

if (matchingBucket) {
matchingBucket[key] += 1;
}
}

function buildGraphData(
period: Period,
start: Date,
leads: ReturnType<typeof getLeads>,
tasks: ReturnType<typeof getTasks>,
activities: ReturnType<typeof getRecentActivity>,
workflows: ReturnType<typeof getWorkflows>
) {
const buckets = createGraphBuckets(
period,
start
);

for (const lead of leads) {
addToGraph(
buckets,
lead.createdAt,
"totalLeads"
);


if (lead.status === "qualified") {
  addToGraph(
    buckets,
    lead.createdAt,
    "qualifiedLeads"
  );
}


}

for (const task of tasks) {
if (task.status === "completed") {
addToGraph(
buckets,
task.updatedAt || task.createdAt,
"tasksCompleted"
);
}
}

for (const activity of activities) {
if (activity.type === "ai") {
addToGraph(
buckets,
activity.createdAt,
"aiActions"
);
}


if (activity.type === "workflow") {
  addToGraph(
    buckets,
    activity.createdAt,
    "workflowActivity"
  );
}


}

/*

* Workflows do not store individual run timestamps.
* Therefore we do NOT distribute cumulative `runs`
* across days. The graph uses real workflow activity
* timestamps instead.
*
* `workflows` is intentionally referenced here so the
* graph builder stays aligned with the same store source.
  */
  void workflows;

const totalLeads = buckets.reduce(
(sum, bucket) =>
sum + bucket.totalLeads,
0
);

const qualifiedLeads =
buckets.reduce(
(sum, bucket) =>
sum + bucket.qualifiedLeads,
0
);

const conversionRate =
totalLeads === 0
? 0
: Number(
(
(qualifiedLeads /
totalLeads) *
100
).toFixed(1)
);

return {
totalLeads: buckets.map(
(bucket) => ({
label: bucket.label,
value: bucket.totalLeads,
})
),


qualifiedLeads: buckets.map(
  (bucket) => ({
    label: bucket.label,
    value: bucket.qualifiedLeads,
  })
),

activeWorkflows: buckets.map(
  (bucket) => ({
    label: bucket.label,
    value: bucket.workflowActivity,
  })
),

tasksCompleted: buckets.map(
  (bucket) => ({
    label: bucket.label,
    value: bucket.tasksCompleted,
  })
),

aiActions: buckets.map(
  (bucket) => ({
    label: bucket.label,
    value: bucket.aiActions,
  })
),

conversionRate: buckets.map(
  (bucket) => {
    const bucketConversion =
      bucket.totalLeads === 0
        ? 0
        : Number(
            (
              (bucket.qualifiedLeads /
                bucket.totalLeads) *
              100
            ).toFixed(1)
          );

    return {
      label: bucket.label,
      value: bucketConversion,
    };
  }
),

periodConversionRate:
  conversionRate,


};
}

export async function GET(
request: Request
) {
try {
const { searchParams } =
new URL(request.url);


const requestedPeriod =
  searchParams.get("period");

const period: Period =
  requestedPeriod === "month"
    ? "month"
    : "week";

const currentStart =
  getPeriodStart(period, 0);

const currentEnd =
  getPeriodEnd(period, 0);

const previousStart =
  getPeriodStart(period, 1);

const previousEnd =
  getPeriodEnd(period, 1);

const workflows = getWorkflows();
const leads = getLeads();
const tasks = getTasks();
const analytics = getAnalytics();

/*
 * Use a large activity window so the selected
 * period has access to all available dated activity.
 */
const activities =
  getRecentActivity(1000);

/* ---------------------------------------------------------------------- */
/* CURRENT TOTALS                                                         */
/* ---------------------------------------------------------------------- */

const totalLeads = leads.length;

const qualifiedLeads =
  leads.filter(
    (lead) =>
      lead.status === "qualified"
  ).length;

const activeWorkflows =
  workflows.filter(
    (workflow) =>
      workflow.status === "active"
  ).length;

const tasksCompleted =
  tasks.filter(
    (task) =>
      task.status === "completed"
  ).length;

const aiActions =
  activities.filter(
    (activity) =>
      activity.type === "ai"
  ).length;

const totalRuns =
  workflows.reduce(
    (total, workflow) =>
      total + workflow.runs,
    0
  );

const conversionRate =
  totalLeads === 0
    ? 0
    : Number(
        (
          (qualifiedLeads /
            totalLeads) *
          100
        ).toFixed(1)
      );

/* ---------------------------------------------------------------------- */
/* CURRENT PERIOD                                                         */
/* ---------------------------------------------------------------------- */

const periodLeads =
  leads.filter((lead) =>
    isBetween(
      lead.createdAt,
      currentStart,
      currentEnd
    )
  );

const periodTasks =
  tasks.filter((task) =>
    isBetween(
      task.createdAt,
      currentStart,
      currentEnd
    )
  );

const periodActivities =
  activities.filter((activity) =>
    isBetween(
      activity.createdAt,
      currentStart,
      currentEnd
    )
  );

const periodQualifiedLeads =
  periodLeads.filter(
    (lead) =>
      lead.status === "qualified"
  ).length;

const periodTasksCompleted =
  periodTasks.filter(
    (task) =>
      task.status === "completed"
  ).length;

const periodAiActions =
  periodActivities.filter(
    (activity) =>
      activity.type === "ai"
  ).length;

const periodConversionRate =
  periodLeads.length === 0
    ? 0
    : Number(
        (
          (periodQualifiedLeads /
            periodLeads.length) *
          100
        ).toFixed(1)
      );

/* ---------------------------------------------------------------------- */
/* PREVIOUS PERIOD                                                        */
/* ---------------------------------------------------------------------- */

const previousLeads =
  leads.filter((lead) =>
    isBetween(
      lead.createdAt,
      previousStart,
      previousEnd
    )
  );

const previousTasks =
  tasks.filter((task) =>
    isBetween(
      task.createdAt,
      previousStart,
      previousEnd
    )
  );

const previousActivities =
  activities.filter((activity) =>
    isBetween(
      activity.createdAt,
      previousStart,
      previousEnd
    )
  );

const previousQualifiedLeads =
  previousLeads.filter(
    (lead) =>
      lead.status === "qualified"
  ).length;

const previousTasksCompleted =
  previousTasks.filter(
    (task) =>
      task.status === "completed"
  ).length;

const previousAiActions =
  previousActivities.filter(
    (activity) =>
      activity.type === "ai"
  ).length;

const previousConversionRate =
  previousLeads.length === 0
    ? 0
    : Number(
        (
          (previousQualifiedLeads /
            previousLeads.length) *
          100
        ).toFixed(1)
      );

/* ---------------------------------------------------------------------- */
/* REAL GRAPH DATA                                                        */
/* ---------------------------------------------------------------------- */

const graphData =
  buildGraphData(
    period,
    currentStart,
    leads,
    tasks,
    activities,
    workflows
  );

/* ---------------------------------------------------------------------- */
/* RESPONSE                                                               */
/* ---------------------------------------------------------------------- */

return NextResponse.json({
  success: true,

  period,

  stats: {
    /* Current real totals */
    totalLeads,
    qualifiedLeads,
    activeWorkflows,
    tasksCompleted,
    aiActions,
    conversionRate,

    /* Existing analytics */
    totalWorkflows:
      workflows.length,

    totalTasks:
      tasks.length,

    totalRuns,

    successRate:
      analytics.successRate,

    successfulRuns:
      analytics.successfulRuns,

    failedRuns:
      analytics.failedRuns,

    /* Selected period */
    periodLeadsCreated:
      periodLeads.length,

    periodQualifiedLeads,

    periodTasksCreated:
      periodTasks.length,

    periodTasksCompleted,

    periodWorkflowRuns:
      periodActivities.filter(
        (activity) =>
          activity.type ===
          "workflow"
      ).length,

    periodAiActions,

    periodConversionRate,

    /* Previous period */
    previousLeadsCreated:
      previousLeads.length,

    previousQualifiedLeads,

    previousTasksCompleted,

    previousAiActions,

    previousConversionRate,
  },

  changes: {
    totalLeads: getChange(
      periodLeads.length,
      previousLeads.length
    ),

    qualifiedLeads: getChange(
      periodQualifiedLeads,
      previousQualifiedLeads
    ),

    /*
     * Active workflow count is a current-state
     * metric. There is no historical status snapshot
     * in the store, so we do not invent a percentage.
     */
    activeWorkflows: {
      value: 0,
      trend: "neutral",
    },

    tasksCompleted: getChange(
      periodTasksCompleted,
      previousTasksCompleted
    ),

    aiActions: getChange(
      periodAiActions,
      previousAiActions
    ),

    conversionRate: getChange(
      periodConversionRate,
      previousConversionRate
    ),
  },

  graphData,

  meta: {
    totalWorkflows:
      workflows.length,

    totalTasks:
      tasks.length,

    totalLeads,

    activeWorkflows,

    totalRuns,

    analytics,
  },
});


} catch (error) {
console.error(
"Dashboard stats error:",
error
);


return NextResponse.json(
  {
    success: false,
    error:
      "Unable to load dashboard statistics.",
  },
  {
    status: 500,
  }
);


}
}
