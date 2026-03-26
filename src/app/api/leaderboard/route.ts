import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: {
      logs: {
        select: { quantity: true },
      },
    },
  });

  const leaderboard = users
    .map((user) => ({
      displayName: user.displayName,
      totalDogs: user.logs.reduce((sum, log) => sum + log.quantity, 0),
    }))
    .sort((a, b) => b.totalDogs - a.totalDogs);

  return NextResponse.json(leaderboard);
}
