"use client";

import { useRouter } from "next/navigation";

export default function Header({
  displayName,
  totalDogs,
  daysLeft,
}: {
  displayName: string;
  totalDogs: number;
  daysLeft: number;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-hotdog text-white px-4 py-3 lg:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Claude your Dog</h1>
          <p className="text-sm text-orange-100">
            {totalDogs} total dogs eaten &middot; {daysLeft} days left
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-orange-100 hidden sm:inline">
            Logged in as <strong className="text-white">{displayName}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-orange-700 rounded-lg text-sm hover:bg-orange-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
