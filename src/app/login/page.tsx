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
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.72fr)]">
      <section className="flex min-h-[44vh] flex-col justify-between bg-surface-subtle px-6 py-7 sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <Image src="/milo-mark.svg" width={38} height={38} alt="" priority />
          <span className="text-[15px] font-bold tracking-[-0.03em]">MILO</span>
        </div>

        <div className="max-w-xl py-12 lg:py-0">
          <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-primary-border uppercase">
            My career log
          </p>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-[-0.05em] sm:text-5xl">
            어떤 이력서로,
            <br />
            어디까지 갔는지.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            제출한 이력서와 자기소개서, 기업별 지원 과정과 다음 일정을 한곳에서
            연결해 관리하세요.
          </p>
        </div>

        <p className="hidden text-xs text-muted-foreground lg:block">
          기록이 쌓일수록 다음 지원이 선명해집니다.
        </p>
      </section>

      <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            시작하기
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">
            MILO에 로그인
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            비밀번호를 만들 필요 없이 소셜 계정으로 안전하게 시작할 수 있습니다.
          </p>

          {errorMessage ? (
            <p
              className="mt-6 border-l-2 border-destructive bg-destructive-soft px-4 py-3 text-sm leading-6 text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <form action={signInWithGoogle} className="mt-8">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-input-border bg-background px-4 text-sm font-semibold outline-offset-2 transition-colors hover:bg-surface-subtle focus-visible:outline-2"
            >
              <GoogleIcon />
              Google로 계속하기
            </button>
          </form>

          <div className="mt-8 border-t pt-5 text-xs leading-5 text-muted-foreground">
            <p>로그인에는 계정 식별을 위한 최소 정보만 사용합니다.</p>
            <p className="mt-1">
              Gmail 채용 메일 접근 권한은 로그인 과정에서 요청하지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
