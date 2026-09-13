export async function getDashboardStats() {
  return {
    workflows: 12,
    activeWorkflows: 8,
    leads: 248,
    tasks: 36,
    aiRuns: 1247,
    successRate: 94.8,
  };
}

export async function getRecentActivity() {
  return [
    {
      id: "1",
      type: "workflow",
      title: "Customer Support Workflow completed",
      description: "AI processed 24 customer inquiries",
      time: "5 minutes ago",
    },
    {
      id: "2",
      type: "lead",
      title: "New high-priority lead",
      description: "Sarah Williams added to leads",
      time: "18 minutes ago",
    },
    {
      id: "3",
      type: "task",
      title: "Follow-up task created",
      description: "Follow up with premium customer",
      time: "32 minutes ago",
    },
    {
      id: "4",
      type: "ai",
      title: "AI workflow generated",
      description: "E-commerce inquiry automation",
      time: "1 hour ago",
    },
  ];
}

export async function getWorkflows() {
  return [
    {
      id: "workflow-1",
      name: "Customer Support Automation",
      description: "Automatically classify and respond to customer inquiries.",
      status: "active",
      runs: 248,
      successRate: 96,
    },
    {
      id: "workflow-2",
      name: "Lead Qualification",
      description: "Analyze incoming leads and assign priority.",
      status: "active",
      runs: 182,
      successRate: 94,
    },
    {
      id: "workflow-3",
      name: "Follow-up Automation",
      description: "Create follow-up tasks for sales opportunities.",
      status: "draft",
      runs: 0,
      successRate: 0,
    },
  ];
}

export async function getLeads() {
  return [
    {
      id: "lead-1",
      name: "Sarah Williams",
      email: "sarah@example.com",
      company: "StyleHub",
      status: "new",
      priority: "high",
    },
    {
      id: "lead-2",
      name: "Michael Chen",
      email: "michael@example.com",
      company: "Nova Commerce",
      status: "contacted",
      priority: "medium",
    },
    {
      id: "lead-3",
      name: "Emma Johnson",
      email: "emma@example.com",
      company: "Bright Retail",
      status: "qualified",
      priority: "high",
    },
  ];
}

export async function getTasks() {
  return [
    {
      id: "task-1",
      title: "Follow up with Sarah Williams",
      description: "Send product information and pricing.",
      status: "pending",
      priority: "high",
    },
    {
      id: "task-2",
      title: "Review new leads",
      description: "Check today's incoming leads.",
      status: "in_progress",
      priority: "medium",
    },
    {
      id: "task-3",
      title: "Update support workflow",
      description: "Add FAQ response automation.",
      status: "completed",
      priority: "low",
    },
  ];
}

export async function getAnalytics() {
  return {
    totalRuns: 1247,
    successfulRuns: 1182,
    failedRuns: 65,
    successRate: 94.8,
    leadsGenerated: 248,
    tasksCreated: 436,
  };
}

export function getPrismaClient() {
  return null;
}