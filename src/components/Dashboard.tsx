"use client";

import { useState, useEffect, useCallback } from "react";
import Leaderboard from "./Leaderboard";
import LogForm from "./LogForm";
import DogFeed from "./DogFeed";
import Header from "./Header";

type LeaderboardEntry = {
  displayName: string;
  totalDogs: number;
};

type LogEntry = {
  id: string;
  quantity: number;
  photoPath: string | null;
  note: string | null;
  createdAt: string;
  user: { displayName: string };
};

export default function Dashboard({ session }: { session: { userId: string; displayName: string } }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [lbRes, logsRes] = await Promise.all([
      fetch("/api/leaderboard"),
      fetch("/api/logs"),
    ]);
    if (lbRes.ok) setLeaderboard(await lbRes.json());
    if (logsRes.ok) setLogs(await logsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalDogs = leaderboard.reduce((sum, e) => sum + e.totalDogs, 0);
  const daysLeft = Math.max(0, Math.ceil((new Date("2026-09-07").getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xl text-stone-500">Loading the dogs...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header displayName={session.displayName} totalDogs={totalDogs} daysLeft={daysLeft} />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {/* Left side (desktop) / Top (mobile): Leaderboard */}
        <div className="w-full lg:w-1/2 space-y-6">
          <Leaderboard data={leaderboard} />
        </div>

        {/* Right side (desktop) / Bottom (mobile): Log form + Feed */}
        <div className="w-full lg:w-1/2 space-y-6">
          <LogForm onLogged={fetchData} />
          <DogFeed logs={logs} />
        </div>
      </main>
    </div>
  );
}
