"use client";

import { useState, useRef } from "react";

export default function LogForm({ onLogged }: { onLogged: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("quantity", quantity.toString());
    if (note.trim()) formData.append("note", note.trim());
    if (fileRef.current?.files?.[0]) {
      formData.append("photo", fileRef.current.files[0]);
    }

    const res = await fetch("/api/logs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setQuantity(1);
      setNote("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onLogged();
    }

    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-stone-800 mb-4">Log a Dog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quantity selector */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            How many dogs?
          </label>
          <div className="flex gap-3">
            {[1, 2].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQuantity(n)}
                className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all ${
                  quantity === n
                    ? "bg-hotdog text-white shadow-md scale-105"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {n === 1 ? "1 Dog" : "2 Dogs"}
              </button>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Photo (optional)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-hotdog-light file:text-hotdog hover:file:bg-orange-100 file:cursor-pointer"
          />
          {preview && (
            <div className="mt-2 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/70"
              >
                x
              </button>
            </div>
          )}
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-stone-700 mb-1">
            Note (optional)
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Chicago style at the ballpark"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hotdog focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-hotdog text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 text-lg"
        >
          {loading ? "Logging..." : success ? "Logged!" : "Log This Dog"}
        </button>

        {success && (
          <p className="text-green-600 text-center text-sm font-medium">
            Dog logged successfully!
          </p>
        )}
      </form>
    </div>
  );
}
