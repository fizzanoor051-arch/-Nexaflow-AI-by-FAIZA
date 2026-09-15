
import { NextResponse } from "next/server";
import { createLeadSchema } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";
import {
  createLead as createSharedLead,
  getLeads as getSharedLeads,
  updateLead as updateSharedLead,
  deleteLead as deleteSharedLead,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id =
      typeof body?.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required.",
        },
        { status: 400 }
      );
    }

    const existingLead = getSharedLeads().find(
      (lead) => lead.id === id
    );

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found.",
        },
        { status: 404 }
      );
    }

    const validation = createLeadSchema.safeParse({
      ...existingLead,
      ...body,
    });

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

    const updatedLead = updateSharedLead(id, {
      ...validation.data,
      status:
        validation.data.status ??
        existingLead.status,
      priority:
        validation.data.priority ??
        existingLead.priority,
    });

    if (!updatedLead) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to update lead.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update lead.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id =
      typeof body?.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required.",
        },
        { status: 400 }
      );
    }

    const deleted = deleteSharedLead(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
      leadId: id,
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete lead.",
      },
      { status: 500 }
    );
  }
}

