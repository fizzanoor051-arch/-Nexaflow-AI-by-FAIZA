
import { NextResponse } from "next/server";
import { createLeadSchema } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Sarah Khan",
    email: "sarah@example.com",
    company: "Khan Fashion",
    phone: "+92 300 1234567",
    status: "qualified",
    priority: "high",
    notes: "Interested in automation services.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    name: "Ali Raza",
    email: "ali@example.com",
    company: "Raza Digital",
    phone: "+92 301 7654321",
    status: "contacted",
    priority: "medium",
    notes: "Follow up next week.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-3",
    name: "Emma Wilson",
    email: "emma@example.com",
    company: "Wilson Studio",
    status: "new",
    priority: "low",
    notes: "New inbound lead.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    leads,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = createLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid lead data.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      ...validation.data,
      status: validation.data.status ?? "new",
      priority: validation.data.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    };

    leads.unshift(lead);

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create lead.",
      },
      { status: 500 }
    );
  }
}
