import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            aria-label="MILO 대시보드"
            className="flex items-center gap-2.5 outline-offset-4"
            href="/dashboard"
          >
            <Image
              src="/milo-mark.svg"
              width={32}
              height={32}
              alt=""
              priority
            />
            <span className="text-[15px] font-bold tracking-[-0.03em]">
              MILO
            </span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground outline-offset-2 hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2"
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
