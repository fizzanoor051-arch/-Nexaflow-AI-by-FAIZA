import { NextResponse } from "next/server";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }[];
}

const conversations: Conversation[] = [
  {
    id: "conversation-1",
    title: "Customer Support Automation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "message-1",
        role: "user",
        content: "Help me automate customer inquiries.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "message-2",
        role: "assistant",
        content:
          "I can create a workflow that classifies customer inquiries and generates responses.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    conversations,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const conversation: Conversation = {
      id: `conversation-${Date.now()}`,
      title: body.title || "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    conversations.unshift(conversation);

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create conversation.",
      },
      { status: 500 }
    );
  }
}