"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, displayName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hotdog mb-2">
            Claude your Dog
          </h1>
          <p className="text-lg text-stone-600">
            Summer 2026 Hot Dog Competition
          </p>
          <p className="text-sm text-stone-500 mt-1">
            Mar 25 &ndash; Sep 7, 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-stone-700 mb-1">
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Hot Dog Henry"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hotdog focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-stone-700 mb-1">
              Access Code
            </label>
            <input
              id="code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the secret code"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hotdog focus:border-transparent"
              required
            />
          </div>

          {error && (
            <p className="text-ketchup text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-hotdog text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? "Entering..." : "Let's Eat!"}
          </button>
        </form>
      </div>
    </div>
  );
}
