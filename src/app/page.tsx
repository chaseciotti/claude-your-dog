import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return <Dashboard session={session} />;
}
