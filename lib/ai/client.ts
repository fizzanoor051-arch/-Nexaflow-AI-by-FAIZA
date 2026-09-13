export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  message: string;
  workflow?: {
    name: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
      type: string;
    }>;
  };
}

const DEMO_RESPONSES = [
  "I understand the request. I can turn this into a structured workflow with clear actions, priorities, and follow-up tasks.",
  "I've analyzed your request and identified the key business actions. A workflow can be created from these steps.",
  "This request can be automated by classifying the intent, extracting important information, creating the required task, and tracking the result.",
];

export async function generateAIResponse(
  messages: AIMessage[]
): Promise<AIResponse> {
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage?.content?.trim()) {
    return {
      message: "Please describe what you would like NexaFlow to automate.",
    };
  }

  /*
   * Real AI integration will be added here later.
   *
   * Example future flow:
   *
   * 1. Read AI provider API key from environment variables.
   * 2. Send messages to the selected LLM.
   * 3. Request structured JSON output.
   * 4. Validate the response with Zod.
   * 5. Return the validated workflow.
   *
   * Keeping this function isolated makes it easy to replace
   * the demo response with a real provider later.
   */

  const lowerMessage = lastMessage.content.toLowerCase();

  const shouldCreateWorkflow =
    lowerMessage.includes("automate") ||
    lowerMessage.includes("workflow") ||
    lowerMessage.includes("customer") ||
    lowerMessage.includes("lead") ||
    lowerMessage.includes("task");

  if (shouldCreateWorkflow) {
    return {
      message:
        "I've analyzed your request and created a workflow plan. Review the steps below before creating the workflow.",
      workflow: {
        name: "Customer Request Automation",
        description:
          "Analyze incoming requests, organize customer information, and create the appropriate follow-up action.",
        steps: [
          {
            title: "Analyze request",
            description:
              "Understand the customer's message and identify the main intent.",
            type: "ai",
          },
          {
            title: "Extract information",
            description:
              "Identify relevant customer, lead, or order information.",
            type: "extract",
          },
          {
            title: "Create follow-up",
            description:
              "Create a task for the next action when human attention is required.",
            type: "task",
          },
          {
            title: "Track result",
            description:
              "Save the workflow outcome for future reporting and analytics.",
            type: "save",
          },
        ],
      },
    };
  }

  const responseIndex =
    messages.filter((message) => message.role === "user").length %
    DEMO_RESPONSES.length;

  return {
    message: DEMO_RESPONSES[responseIndex],
  };
}