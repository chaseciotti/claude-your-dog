import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { uploadPhoto } from "@/lib/storage";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.hotDogLog.findMany({
    include: { user: { select: { displayName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const note = formData.get("note") as string | null;
  const photo = formData.get("photo") as File | null;

  if (quantity < 1 || quantity > 2) {
    return NextResponse.json({ error: "Quantity must be 1 or 2" }, { status: 400 });
  }

  let photoPath: string | null = null;

  if (photo && photo.size > 0) {
    photoPath = await uploadPhoto(photo);
  }

  const log = await prisma.hotDogLog.create({
    data: {
      quantity,
      note: note || null,
      photoPath,
      userId: session.userId,
    },
    include: { user: { select: { displayName: true } } },
  });

  return NextResponse.json(log);
}
