
import { NextResponse } from "next/server";
import { executeAICommand } from "@/lib/ai/command-actions";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type AIRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  pageContext?: unknown;
};

type DemoAnalysis = {
  intent: string;
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Negative";
  priority: "Low" | "Medium" | "High";
  confidence: number;
  actions: string[];
  response: string;
  suggestedReply?: string;
  recommendedAction?: string;
  actionType?: string;
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

function analyzeCustomerSupport(
  text: string
): DemoAnalysis | null {
  const lower = text.toLowerCase();

  const refundWords = [
    "refund",
    "money back",
    "return my money",
    "want my money",
    "chargeback",
    "reimbursement",
    "charged",
    "charged me",
  ];

  const supportWords = [
    "support",
    "help",
    "issue",
    "problem",
    "complaint",
    "customer service",
    "not working",
    "doesn't work",
    "cant use",
    "can't use",
  ];

  const frustratedWords = [
    "waiting",
    "10 days",
    "days",
    "nobody",
    "no one",
    "still",
    "again",
    "frustrated",
    "angry",
    "disappointed",
    "unacceptable",
    "terrible",
    "ridiculous",
    "ignored",
    "not helping",
    "not helping me",
  ];

  const negativeWords = [
    "bad",
    "worst",
    "hate",
    "awful",
    "terrible",
    "angry",
    "unacceptable",
  ];

  const hasRefundIntent = refundWords.some((word) =>
    lower.includes(word)
  );

  const hasSupportIntent = supportWords.some((word) =>
    lower.includes(word)
  );

  const hasFrustration = frustratedWords.some((word) =>
    lower.includes(word)
  );

  const hasNegative = negativeWords.some((word) =>
    lower.includes(word)
  );

  if (!hasRefundIntent && !hasSupportIntent) {
    return null;
  }

  let sentiment: DemoAnalysis["sentiment"] = "Neutral";

  if (hasFrustration) {
    sentiment = "Frustrated";
  } else if (hasNegative) {
    sentiment = "Negative";
  }

  const priority: DemoAnalysis["priority"] =
    hasRefundIntent || hasFrustration
      ? "High"
      : hasSupportIntent
        ? "Medium"
        : "Low";

  if (hasRefundIntent) {
    return {
      intent: "Refund Request",
      sentiment,
      priority,
      confidence: hasFrustration ? 97 : 94,
      actions: [
        "Detect refund intent",
        "Analyze customer sentiment",
        "Generate a helpful response",
        "Create a support follow-up task",
        "Track the refund request",
      ],
      response: `I detected a refund request and analyzed the customer's emotional state.

Intent: Refund Request
Sentiment: ${sentiment}
Priority: ${priority}

Recommended action:
Offer a clear refund response and create a support follow-up task so the request is not lost.`,
      suggestedReply:
        "I'm sorry you've had to wait this long. I understand how frustrating that is. I'll make sure your refund request is reviewed and followed up on promptly.",
      recommendedAction:
        "Offer refund + create support task",
      actionType: "refund",
    };
  }

  return {
    intent: "Customer Support Request",
    sentiment,
    priority,
    confidence: hasFrustration ? 94 : 91,
    actions: [
      "Classify the customer request",
      "Analyze customer sentiment",
      "Generate a suggested response",
      "Create a support follow-up task",
      "Track the interaction",
    ],
    response: `I analyzed this customer support request.

Intent: Customer Support Request
Sentiment: ${sentiment}
Priority: ${priority}

Recommended action:
Respond to the customer and create a support follow-up task when human assistance is required.`,
    suggestedReply:
      "Thanks for reaching out. I'm sorry you're experiencing this issue. I'll review your request and make sure the appropriate next step is taken.",
    recommendedAction:
      "Respond + create support task",
    actionType: "support",
  };
}

function analyzeRequest(message: string): DemoAnalysis {
  const text = message.toLowerCase().trim();

  /*
   * Explicit task commands are checked first so commands such as
   * "Create a follow-up task..." are treated as executable tasks.
   */
  if (
    /\b(create|make|add|set up)\b.*\btask\b/i.test(text) ||
    /\bfollow[- ]?up task\b/i.test(text)
  ) {
    return {
      intent: "Task automation",
      sentiment: "Neutral",
      priority:
        text.includes("urgent") || text.includes("asap")
          ? "High"
          : "Medium",
      confidence: 99,
      actions: [
        "Understand the task request",
        "Extract task details",
        "Create the task",
        "Track task status",
      ],
      response:
        "I can create this task and track it in your NexaFlow workspace.",
    };
  }

  /*
   * Customer-support intelligence is checked before generic
   * business automation so real customer messages are analyzed
   * as support conversations.
   */
  const customerAnalysis = analyzeCustomerSupport(text);

  if (customerAnalysis) {
    return customerAnalysis;
  }

  if (
    /^(hi|hello|hey|hy|helo|salam|aoa|assalamualaikum|good morning|good afternoon|good evening)[!. ]*$/i.test(
      text
    )
  ) {
    return {
      intent: "General assistance",
      sentiment: "Positive",
      priority: "Low",
      confidence: 99,
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
    text.includes("lead") ||
    text.includes("prospect") ||
    text.includes("potential customer") ||
    text.includes("qualification")
  ) {
    return {
      intent: "Lead management automation",
      sentiment: "Neutral",
      priority: "High",
      confidence: 96,
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
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 95,
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
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 94,
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
      sentiment: "Neutral",
      priority: "High",
      confidence: 95,
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

NexaFlow can connect these steps into one repeatable automation.`,
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
      sentiment: "Neutral",
      priority: "Medium",
      confidence: 93,
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
      sentiment: "Neutral",
      priority: "High",
      confidence: 95,
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
      sentiment: "Neutral",
      priority: "High",
      confidence: 94,
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
    sentiment: "Neutral",
    priority: "Medium",
    confidence: 88,
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
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const conversationMessages = getSafeMessages(
      body.messages
    );

    let userMessage = directMessage;

    if (
      !userMessage &&
      conversationMessages.length > 0
    ) {
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

    /*
     * Explicit NexaFlow commands still execute through the
     * existing command system.
     */
    const actionResult = await executeAICommand(
      userMessage
    );

    if (actionResult.handled) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        message:
          actionResult.message ||
          "Action completed successfully.",
        reply:
          actionResult.message ||
          "Action completed successfully.",
        action: {
          type: actionResult.type,
          status: "completed",
        },
        task: actionResult.task,
        workflow: {
          intent: analysis.intent,
          priority: analysis.priority,
          actions: actionResult.type
            ? [
                "Understand the task request",
                "Extract task details",
                "Create the task",
                "Track task status",
              ]
            : analysis.actions,
          status: "completed",
        },
        analysis: {
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          priority: analysis.priority,
          confidence: analysis.confidence,
          actions: analysis.actions,
          suggestedReply: analysis.suggestedReply,
          recommendedAction:
            analysis.recommendedAction,
          actionType: analysis.actionType,
        },
        usage: null,
      });
    }

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
        sentiment: analysis.sentiment,
        priority: analysis.priority,
        confidence: analysis.confidence,
        actions: analysis.actions,
        suggestedReply: analysis.suggestedReply,
        recommendedAction:
          analysis.recommendedAction,
        actionType: analysis.actionType,
      },
      usage: null,
    });
  } catch (error) {
    console.error(
      "NexaFlow Demo AI error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process the request right now.",
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
