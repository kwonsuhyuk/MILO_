import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <Image src="/milo-mark.svg" width={34} height={34} alt="" priority />
          <span className="text-[15px] font-bold tracking-[-0.03em]">MILO</span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground outline-offset-2 hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2"
          >
            로그아웃
          </button>
        </form>
      </header>

      <section className="py-14">
        <p className="text-xs font-semibold tracking-[0.08em] text-primary-border uppercase">
          Authentication connected
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
          로그인 연결이 완료됐어요.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          다음 단계에서 지원 기록과 일정을 확인하는 실제 홈 화면을 구성합니다.
          현재 페이지는 인증 세션과 보호된 화면 이동을 확인하기 위한 기준
          화면입니다.
        </p>
      </section>
    </main>
  );
}
