import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "MAINTENANCE_OFFICER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, status, comment } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    // Restrict officer to setting IN_PROGRESS or RESOLVED
    if (status !== "IN_PROGRESS" && status !== "RESOLVED") {
      return NextResponse.json(
        { error: "Invalid status transition. Allowed values: IN_PROGRESS, RESOLVED" },
        { status: 400 }
      );
    }

    // 1. Verify this request is assigned to this officer
    const assignment = await prisma.assignment.findFirst({
      where: {
        requestId,
        officerId: session.userId,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "You are not authorized to update this request as it is not assigned to you." },
        { status: 403 }
      );
    }

    // 2. Perform updates inside a transaction
    const updatedRequest = await prisma.$transaction(async (tx) => {
      // Update ticket status
      const updated = await tx.serviceRequest.update({
        where: { id: requestId },
        data: {
          status,
        },
      });

      // Write status update log
      await tx.statusLog.create({
        data: {
          requestId,
          status,
          updaterId: session.userId,
          comment: comment ? comment.trim() : `Status transitioned to ${status}.`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Task updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Officer update task status failed:", error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 }
    );
  }
}
