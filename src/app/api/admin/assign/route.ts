import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMINISTRATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, officerId } = await request.json();

    if (!requestId || !officerId) {
      return NextResponse.json(
        { error: "Request ID and Officer ID are required" },
        { status: 400 }
      );
    }

    // 1. Verify the ticket exists
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // 2. Verify the target officer exists and is actually a maintenance officer
    const officer = await prisma.user.findFirst({
      where: {
        id: officerId,
        role: {
          name: "MAINTENANCE_OFFICER",
        },
      },
    });

    if (!officer) {
      return NextResponse.json(
        { error: "Target maintenance officer not found" },
        { status: 404 }
      );
    }

    // 3. Perform Assignment updates in a transaction
    const updatedRequest = await prisma.$transaction(async (tx) => {
      // Clear any prior assignments (avoid duplicate assign)
      await tx.assignment.deleteMany({
        where: { requestId },
      });

      // Create new assignment
      await tx.assignment.create({
        data: {
          requestId,
          officerId,
        },
      });

      // Update ServiceRequest status to ASSIGNED
      const updated = await tx.serviceRequest.update({
        where: { id: requestId },
        data: {
          status: "ASSIGNED",
        },
        include: {
          category: true,
        },
      });

      // Log the assignment to StatusLog
      await tx.statusLog.create({
        data: {
          requestId,
          status: "ASSIGNED",
          updaterId: session.userId,
          comment: `Ticket assigned to technician ${officer.name}.`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Ticket assigned successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Admin assignment failed:", error);
    return NextResponse.json(
      { error: "Failed to assign ticket" },
      { status: 500 }
    );
  }
}
