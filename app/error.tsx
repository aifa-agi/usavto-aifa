// @/app/not-found.tsx

"use client";

export default function NotFound() {
  // Можно показать заглушку или просто ничего
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-6xl font-bold">Error in Right Slot</h2>
      <p className="mt-8 text-2xl">Check Code...</p>
    </div>
  );
}
