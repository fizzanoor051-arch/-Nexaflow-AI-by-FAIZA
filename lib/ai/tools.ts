export type AIToolName =
  | "create_workflow"
  | "create_lead"
  | "create_task"
  | "search_leads"
  | "search_tasks"
  | "get_workflow"
  | "get_analytics";

export interface AIToolDefinition {
  name: AIToolName;
  description: string;
  parameters: Record<string, unknown>;
}

export const AI_TOOLS: AIToolDefinition[] = [
  {
    name: "create_workflow",
    description:
      "Create a new automation workflow from a structured workflow plan.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Workflow name",
        },
        description: {
          type: "string",
          description: "Workflow description",
        },
        steps: {
          type: "array",
          description: "Workflow steps",
        },
      },
      required: ["name", "description", "steps"],
    },
  },

  {
    name: "create_lead",
    description:
      "Create a lead from customer or prospect information extracted by AI.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        phone: {
          type: "string",
        },
        company: {
          type: "string",
        },
        priority: {
          type: "string",
        },
      },
      required: ["name"],
    },
  },

  {
    name: "create_task",
    description:
      "Create an actionable business task from an AI-generated recommendation.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        priority: {
          type: "string",
        },
        dueDate: {
          type: "string",
        },
      },
      required: ["title"],
    },
  },

  {
    name: "search_leads",
    description:
      "Search existing leads using filters such as name, email, company, or priority.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
        },
        priority: {
          type: "string",
        },
      },
    },
  },

  {
    name: "search_tasks",
    description:
      "Search existing tasks using title, status, or priority.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
        },
        status: {
          type: "string",
        },
        priority: {
          type: "string",
        },
      },
    },
  },

  {
    name: "get_workflow",
    description:
      "Retrieve details and current status of a workflow.",
    parameters: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
        },
      },
      required: ["workflowId"],
    },
  },

  {
    name: "get_analytics",
    description:
      "Retrieve workflow, AI usage, lead, task, and automation analytics.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          description: "Analytics period such as 7d, 30d, or 90d",
        },
      },
      required: ["period"],
    },
  },
];

export function getAITool(name: AIToolName) {
  return AI_TOOLS.find((tool) => tool.name === name);
}

export function isAIToolName(value: string): value is AIToolName {
  return AI_TOOLS.some((tool) => tool.name === value);
}