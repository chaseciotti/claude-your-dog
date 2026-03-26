import { cookies } from "next/headers";

const ACCESS_CODE = process.env.ACCESS_CODE || "hotdog2026";

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
  return code === ACCESS_CODE;
}
