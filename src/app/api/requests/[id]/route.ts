import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        category: true,
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignments: {
          include: {
            officer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        statusLogs: {
          include: {
            updater: {
              select: {
                name: true,
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Role-based Access Control:
    // Students/Staff can only view their own requests.
    // Officers and Admins can view any request.
    if (
      session.role === "STUDENT_STAFF" &&
      serviceRequest.requesterId !== session.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Failed to fetch request details:", error);
    return NextResponse.json(
      { error: "Failed to fetch request details" },
      { status: 500 }
    );
  }
}
