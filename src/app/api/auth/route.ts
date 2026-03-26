import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessCode } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { code, displayName } = await request.json();

  if (!verifyAccessCode(code)) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  if (!displayName || displayName.trim().length === 0) {
    return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  }

  const trimmedName = displayName.trim();

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { displayName: trimmedName },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { displayName: trimmedName },
    });
  }

  const session = JSON.stringify({ userId: user.id, displayName: user.displayName });

  const response = NextResponse.json({ success: true, user: { id: user.id, displayName: user.displayName } });
  response.cookies.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180, // 6 months
    path: "/",
  });

  return response;
}
