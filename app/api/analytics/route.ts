
import { NextResponse } from "next/server";
import {
  getAnalytics,
  getLeads,
  getRecentActivity,
  getWorkflows,
} from "@/lib/workflows/store";

export async function GET() {
  try {
    const analytics = getAnalytics();
    const workflows = getWorkflows();
    const leads = getLeads();
    const activities = getRecentActivity(20);

    const totalRuns = analytics.totalRuns;

    const successfulRuns = workflows.reduce(
      (total, workflow) =>
        total +
        Math.round(
          workflow.runs * (workflow.successRate / 100)
        ),
      0
    );

    const failedRuns = Math.max(
      totalRuns - successfulRuns,
      0
    );

    /*
     * Demo-safe derived analytics.
     *
     * These are calculated from the shared application state,
     * so the analytics screen stays consistent with workflows,
     * leads, tasks and executions.
     */

    const qualifiedLeads = leads.filter(
      (lead) => lead.status === "qualified"
    ).length;

    const contactedLeads = leads.filter(
      (lead) =>
        lead.status === "contacted" ||
        lead.status === "qualified"
    ).length;

    const convertedLeads = leads.filter(
      (lead) => lead.status === "qualified"
    ).length;

    const conversionRate =
      leads.length === 0
        ? 0
        : Number(
            ((convertedLeads / leads.length) * 100).toFixed(1)
          );

    const funnel = [
      {
        label: "New leads",
        value: leads.length,
      },
      {
        label: "Contacted",
        value: contactedLeads,
      },
      {
        label: "Qualified",
        value: qualifiedLeads,
      },
      {
        label: "Converted",
        value: convertedLeads,
      },
    ];

    const workflowPerformance = workflows
      .map((workflow) => ({
        id: workflow.id,
        name: workflow.name,
        runs: workflow.runs,
        successRate: workflow.successRate,
        status: workflow.status,
      }))
      .sort((a, b) => {
        if (b.successRate !== a.successRate) {
          return b.successRate - a.successRate;
        }

        return b.runs - a.runs;
      });

    const aiActions = Math.round(
      totalRuns * 0.68
    );

    const responseTime = Math.max(
      120,
      Math.round(
        180 -
          Math.min(
            40,
            workflows.length * 4
          )
      )
    );

    const leadsOverTime = createLeadTimeline(leads);

    const activityTimeline = activities.map(
      (activity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        createdAt: activity.createdAt,
      })
    );

    return NextResponse.json({
      success: true,

      metrics: {
        totalRuns,
        successfulRuns,
        failedRuns,
        successRate: analytics.successRate,
        totalLeads: leads.length,
        qualifiedLeads,
        aiActions,
        responseTime,
        conversionRate,
        totalTasks: analytics.tasksCreated,
        activeWorkflows: analytics.activeWorkflows,
      },

      leadsOverTime,

      workflowPerformance,

      funnel,

      activity: activityTimeline,
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load analytics.",
      },
      { status: 500 }
    );
  }
}

function createLeadTimeline(
  leads: ReturnType<typeof getLeads>
) {
  const now = new Date();

  const days = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(now);

      date.setDate(
        now.getDate() - (6 - index)
      );

      return date;
    }
  );

  return days.map((date) => {
    const dayKey = date.toISOString().slice(0, 10);

    const count = leads.filter((lead) =>
      lead.createdAt?.startsWith(dayKey)
    ).length;

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      leads: count,
    };
  });
}
