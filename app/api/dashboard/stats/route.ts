
import { NextResponse } from "next/server";
import {
  getWorkflows,
  getLeads,
  getTasks,
  getAnalytics,
} from "@/lib/workflows/store";

type Period = "week" | "month";

function getStartDate(period: Period) {
  const now = new Date();

  if (period === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  const start = new Date(now);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  return start;
}

function isWithinPeriod(
  createdAt: string | undefined,
  startDate: Date
) {
  if (!createdAt) {
    return false;
  }

  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return false;
  }

  return createdTime >= startDate.getTime();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedPeriod = searchParams.get("period");

    const period: Period =
      requestedPeriod === "month" ? "month" : "week";

    const startDate = getStartDate(period);

    const workflows = getWorkflows();
    const leads = getLeads();
    const tasks = getTasks();
    const analytics = getAnalytics();

    // Leads created during selected period
    const periodLeads = leads.filter((lead) =>
      isWithinPeriod(lead.createdAt, startDate)
    );

    // Tasks created during selected period
    const periodTasks = tasks.filter((task) =>
      isWithinPeriod(task.createdAt, startDate)
    );

    // Workflows created during selected period
    const periodWorkflows = workflows.filter((workflow) =>
      isWithinPeriod(workflow.createdAt, startDate)
    );

    // Total leads
    const totalLeads = periodLeads.length;

    // Qualified leads
    const qualifiedLeads = periodLeads.filter(
      (lead) => lead.status === "qualified"
    ).length;

    // Currently active workflows
    const activeWorkflows = workflows.filter(
      (workflow) => workflow.status === "active"
    ).length;

    // Completed tasks during selected period
    const tasksCompleted = periodTasks.filter(
      (task) => task.status === "completed"
    ).length;

    // Workflow runs from workflows created during selected period
    const aiActions = periodWorkflows.reduce(
      (total, workflow) => total + workflow.runs,
      0
    );

    // Qualified leads / total leads
    const conversionRate =
      totalLeads === 0
        ? 0
        : Number(
            ((qualifiedLeads / totalLeads) * 100).toFixed(1)
          );

    return NextResponse.json({
      success: true,

      period,

      stats: {
        totalLeads,
        qualifiedLeads,
        activeWorkflows,
        tasksCompleted,
        aiActions,
        conversionRate,
      },

      meta: {
        totalWorkflows: workflows.length,
        totalTasks: periodTasks.length,
        totalLeads,
        analytics,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}
