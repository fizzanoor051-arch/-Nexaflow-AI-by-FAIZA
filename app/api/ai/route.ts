
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type AIRequestBody = {
  message?: string;
  messages?: ChatMessage[];
};

type DemoAnalysis = {
  intent: string;
  priority: "Low" | "Medium" | "High";
  actions: string[];
  response: string;
};

function getSafeMessages(
  messages: ChatMessage[] | undefined
): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 12000),
    }));
}

function analyzeRequest(message: string): DemoAnalysis {
  const text = message.toLowerCase().trim();

  if (
    /^(hi|hello|hey|hy|helo|salam|aoa|assalamualaikum|good morning|good afternoon|good evening)[!. ]*$/i.test(
      text
    )
  ) {
    return {
      intent: "General assistance",
      priority: "Low",
      actions: [
        "Understand the business request",
        "Identify the required automation",
        "Recommend the next action",
      ],
      response:
        "Hi! I'm NexaFlow AI. I can help turn business requests into actionable workflows. Try asking me to automate customer support, qualify leads, create follow-up tasks, or organize business activity.",
    };
  }

  if (
    text.includes("customer support") ||
    text.includes("customer inquiry") ||
    text.includes("customer inquiries") ||
    text.includes("support request") ||
    text.includes("customer service") ||
    text.includes("customer message")
  ) {
    return {
      intent: "Customer support automation",
      priority: "High",
      actions: [
        "Classify the customer inquiry",
        "Generate an appropriate response",
        "Create a follow-up task when required",
        "Save the interaction in activity history",
      ],
      response: `I identified this as a customer support automation request.

Recommended workflow:

1. Receive the customer message
2. Analyze and classify the inquiry
3. Generate a suggested reply
4. Create a follow-up task if needed
5. Save the interaction for tracking

NexaFlow can turn this into a repeatable support workflow.`,
    };
  }

  if (
    text.includes("lead") ||
    text.includes("prospect") ||
    text.includes("potential customer") ||
    text.includes("qualification")
  ) {
    return {
      intent: "Lead management automation",
      priority: "High",
      actions: [
        "Extract lead information",
        "Classify lead quality",
        "Assign lead priority",
        "Create a follow-up task",
        "Store the lead for future tracking",
      ],
      response: `I identified this as a lead management request.

Recommended workflow:

1. Capture lead information
2. Analyze and qualify the lead
3. Assign a priority
4. Create a follow-up task
5. Save the lead in the workspace

This can become an automated lead qualification and follow-up workflow.`,
    };
  }

  if (
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text.includes("followup") ||
    text.includes("remind")
  ) {
    return {
      intent: "Follow-up automation",
      priority: "Medium",
      actions: [
        "Identify the customer or lead",
        "Create a follow-up task",
        "Assign a due date",
        "Track completion status",
      ],
      response: `I identified this as a follow-up automation request.

Recommended workflow:

1. Identify the lead or customer
2. Create a follow-up task
3. Set a due date
4. Track the task until completion

NexaFlow can centralize these follow-ups so important opportunities are not missed.`,
    };
  }

  if (
    text.includes("task") ||
    text.includes("to-do") ||
    text.includes("todo") ||
    text.includes("assign")
  ) {
    return {
      intent: "Task automation",
      priority: "Medium",
      actions: [
        "Understand the requested task",
        "Create a structured task",
        "Assign priority",
        "Track task status",
      ],
      response: `I identified this as a task automation request.

Recommended workflow:

1. Understand the task
2. Create a structured task
3. Assign priority
4. Track progress
5. Mark the task complete

This can be connected to leads, customers, and other NexaFlow workflows.`,
    };
  }

  if (
    text.includes("sales") ||
    text.includes("sell") ||
    text.includes("selling") ||
    text.includes("conversion")
  ) {
    return {
      intent: "Sales automation",
      priority: "High",
      actions: [
        "Capture potential opportunities",
        "Qualify prospects",
        "Create follow-up tasks",
        "Track sales activity",
      ],
      response: `I identified this as a sales automation request.

Recommended workflow:

1. Capture a potential opportunity
2. Qualify the prospect
3. Assign priority
4. Schedule follow-up
5. Track the sales activity

NexaFlow can connect these steps into one repeatable workflow.`,
    };
  }

  if (
    text.includes("analytics") ||
    text.includes("report") ||
    text.includes("activity") ||
    text.includes("summary") ||
    text.includes("performance")
  ) {
    return {
      intent: "Business analytics",
      priority: "Medium",
      actions: [
        "Collect workspace activity",
        "Summarize important events",
        "Identify trends",
        "Present actionable insights",
      ],
      response: `I identified this as a business analytics request.

Recommended workflow:

1. Collect workspace activity
2. Summarize important events
3. Identify useful trends
4. Highlight actionable insights

The Analytics area can turn these events into a clear business activity overview.`,
    };
  }

  if (
    text.includes("automate") ||
    text.includes("automation") ||
    text.includes("workflow") ||
    text.includes("process")
  ) {
    return {
      intent: "Workflow automation",
      priority: "High",
      actions: [
        "Understand the business process",
        "Break the process into steps",
        "Define triggers and actions",
        "Create an automation workflow",
        "Track execution history",
      ],
      response: `I identified this as a workflow automation request.

Recommended workflow:

1. Define the business trigger
2. Analyze the incoming information
3. Decide the required action
4. Execute the workflow
5. Save the result in activity history

NexaFlow is designed to turn these processes into reusable automations.`,
    };
  }

  if (
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("online store") ||
    text.includes("shop") ||
    text.includes("order")
  ) {
    return {
      intent: "E-commerce automation",
      priority: "High",
      actions: [
        "Analyze customer or order information",
        "Classify the request",
        "Generate a customer response",
        "Create follow-up actions",
        "Track the interaction",
      ],
      response: `I identified this as an e-commerce automation opportunity.

Recommended workflow:

1. Receive the customer or order request
2. Analyze the intent
3. Generate a suitable response
4. Create a task when human follow-up is needed
5. Track the interaction

This could become a reusable automation for an online store.`,
    };
  }

  return {
    intent: "Business automation planning",
    priority: "Medium",
    actions: [
      "Understand the business request",
      "Identify the required information",
      "Recommend automation steps",
      "Create a task or workflow",
      "Track the result",
    ],
    response: `I analyzed your request as a business automation opportunity.

Recommended workflow:

1. Understand the request
2. Identify the important information
3. Decide what should happen next
4. Create the required task, lead, reply, or workflow
5. Track the result

For a more specific automation plan, describe the business process you want NexaFlow to handle.`,
  };
}

export async function POST(request: Request) {
  try {
    let body: AIRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const directMessage =
      typeof body.message === "string" ? body.message.trim() : "";

    const conversationMessages = getSafeMessages(body.messages);

    let userMessage = directMessage;

    if (!userMessage && conversationMessages.length > 0) {
      const lastUserMessage = [...conversationMessages]
        .reverse()
        .find((item) => item.role === "user");

      userMessage = lastUserMessage?.content || "";
    }

    if (!userMessage) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a message.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeRequest(userMessage);

    return NextResponse.json({
      success: true,
      mode: "demo",
      message: analysis.response,
      reply: analysis.response,
      workflow: {
        intent: analysis.intent,
        priority: analysis.priority,
        actions: analysis.actions,
        status: "planned",
      },
      analysis: {
        intent: analysis.intent,
        priority: analysis.priority,
        actions: analysis.actions,
      },
      usage: null,
    });
  } catch (error) {
    console.error("NexaFlow Demo AI error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process the request right now.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "NexaFlow AI",
    status: "demo",
    mode: "free",
    message:
      "NexaFlow AI Demo Mode is active. No external AI API credits are required.",
  });
}
