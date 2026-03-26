"use client";

type LogEntry = {
  id: string;
  quantity: number;
  photoPath: string | null;
  note: string | null;
  createdAt: string;
  user: { displayName: string };
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DogFeed({ logs }: { logs: LogEntry[] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Recent Dogs</h2>
        <p className="text-stone-500 text-center py-4">No dogs in the feed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-stone-800 mb-4">Recent Dogs</h2>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="border border-stone-200 rounded-xl p-3 hover:bg-stone-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-800">{log.user.displayName}</span>
                <span className="text-hotdog font-bold">
                  +{log.quantity} {log.quantity === 1 ? "dog" : "dogs"}
                </span>
              </div>
              <span className="text-xs text-stone-400">{timeAgo(log.createdAt)}</span>
            </div>

            {log.note && (
              <p className="text-sm text-stone-600 mb-2">&ldquo;{log.note}&rdquo;</p>
            )}

            {log.photoPath && (
              <img
                src={log.photoPath}
                alt={`Hot dog by ${log.user.displayName}`}
                className="w-full max-h-64 object-cover rounded-lg"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
