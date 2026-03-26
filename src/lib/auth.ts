import { cookies } from "next/headers";

export async function verifySession(): Promise<{ userId: string; displayName: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export function verifyAccessCode(code: string): boolean {
  const accessCode = process.env.ACCESS_CODE || "hotdog2026";
  return code === accessCode;
}
