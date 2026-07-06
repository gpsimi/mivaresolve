import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "MAINTENANCE_OFFICER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all service requests assigned to this officer
    const assignedTasks = await prisma.serviceRequest.findMany({
      where: {
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
      include: {
        category: true,
        requester: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(assignedTasks);
  } catch (error) {
    console.error("Officer fetch tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assigned tasks" },
      { status: 500 }
    );
  }
}
