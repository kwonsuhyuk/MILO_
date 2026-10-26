import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle } from "./actions";
import { GoogleIcon } from "./google-icon";

const errorMessages: Record<string, string> = {
  oauth_start_failed:
    "Google 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  oauth_callback_failed:
    "Google 로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)]">
      <section className="flex min-h-[46vh] flex-col bg-surface-subtle px-6 py-6 sm:px-10 sm:py-8 lg:min-h-screen lg:px-14 lg:py-10">
        <div className="flex items-center gap-2.5">
          <Image src="/milo-mark.svg" width={34} height={34} alt="" priority />
          <span className="text-[15px] font-bold tracking-[-0.03em]">MILO</span>
        </div>

        <div className="my-auto max-w-xl py-12 lg:py-8">
          <h1 className="text-[36px] font-bold leading-[1.2] tracking-[-0.05em] sm:text-[44px]">
            취업 준비 기록을
            <br />
            한곳에.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-[15px]">
            이력서와 자기소개서 버전, 지원 현황과 일정을 연결해 관리하세요.
          </p>

          <div className="mt-9 overflow-hidden rounded-xl border bg-background sm:mt-11">
            <div className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
              <p className="text-sm font-semibold">지원 흐름</p>
              <span className="text-xs text-muted-foreground">예시</span>
            </div>

            <div className="px-4 py-5 sm:px-5">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-md border bg-surface px-3 py-2 font-medium">
                  <FileText aria-hidden="true" size={15} />
                  프론트엔드 이력서 v3
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="text-muted-foreground"
                  size={15}
                />
                <span className="rounded-md border bg-surface px-3 py-2 font-medium">
                  마일로 테크
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="text-muted-foreground"
                  size={15}
                />
                <span className="rounded-md bg-primary-soft px-3 py-2 font-semibold text-success">
                  면접 진행 중
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-2.5">
                  <CalendarDays
                    aria-hidden="true"
                    className="text-muted-foreground"
                    size={17}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">다음 일정</p>
                    <p className="mt-0.5 text-sm font-semibold">1차 면접</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">10월 28일</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-14 sm:px-10 lg:px-14">
        <div className="w-full max-w-[360px]">
          <h2 className="text-2xl font-bold tracking-[-0.04em]">로그인</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Google 계정으로 바로 시작할 수 있습니다.
          </p>

          {errorMessage ? (
            <p
              className="mt-6 rounded-md bg-destructive-soft px-4 py-3 text-sm leading-6 text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <form action={signInWithGoogle} className="mt-8">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-input-border bg-background px-4 text-sm font-semibold outline-offset-2 transition-colors hover:bg-surface-subtle focus-visible:outline-2"
            >
              <GoogleIcon />
              Google로 계속하기
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
