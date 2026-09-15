
import { NextResponse } from "next/server";
import { createLeadSchema } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";
import {
  createLead as createSharedLead,
  getLeads as getSharedLeads,
} from "@/lib/workflows/store";
 const leads: Lead[] = getSharedLeads();

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

    createSharedLead(lead);

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
