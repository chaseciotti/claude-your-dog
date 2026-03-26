"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = [
  "#e8590c", "#f59e0b", "#dc2626", "#d97706", "#ea580c",
  "#b45309", "#c2410c", "#a16207", "#9a3412", "#78350f",
  "#854d0e", "#7c2d12", "#92400e", "#713f12", "#451a03",
];

type LeaderboardEntry = {
  displayName: string;
  totalDogs: number;
};

export default function Leaderboard({ data }: { data: LeaderboardEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Leaderboard</h2>
        <p className="text-stone-500 text-center py-8">
          No dogs logged yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-stone-800 mb-4">Leaderboard</h2>

      <div className="w-full" style={{ height: Math.max(300, data.length * 50) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="displayName" width={100} tick={{ fontSize: 13 }} />
            <Tooltip
              formatter={(value) => [`${value} dog${value !== 1 ? "s" : ""}`, "Total"]}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="totalDogs" radius={[0, 6, 6, 0]} barSize={30}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Numeric ranking below chart */}
      <div className="mt-4 space-y-2">
        {data.map((entry, i) => (
          <div key={entry.displayName} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-stone-50">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-400 w-6">#{i + 1}</span>
              <span className="font-medium text-stone-800">{entry.displayName}</span>
            </div>
            <span className="font-bold text-hotdog text-lg">{entry.totalDogs}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
