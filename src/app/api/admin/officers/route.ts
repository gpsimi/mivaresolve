import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMINISTRATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const officers = await prisma.user.findMany({
      where: {
        role: {
          name: "MAINTENANCE_OFFICER",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(officers);
  } catch (error) {
    console.error("Admin fetch officers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance officers" },
      { status: 500 }
    );
  }
}
