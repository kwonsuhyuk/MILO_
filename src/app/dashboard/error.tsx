"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-xl rounded-xl border bg-background px-6 py-12 text-center">
      <h1 className="text-xl font-bold tracking-[-0.03em]">
        화면을 불러오지 못했어요.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침해 주세요.
      </p>
      <button
        className="mt-6 min-h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background outline-offset-2"
        onClick={reset}
        type="button"
      >
        다시 시도
      </button>
    </main>
  );
}
