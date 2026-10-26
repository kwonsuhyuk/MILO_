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
    <main className="flex min-h-screen flex-col bg-background">
      <header className="px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex items-center gap-2.5">
          <Image src="/milo-mark.svg" width={32} height={32} alt="" priority />
          <span className="text-sm font-bold tracking-[-0.03em]">MILO</span>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 pb-24 pt-10 sm:pb-32">
        <div className="w-full max-w-[360px]">
          <h1 className="text-center text-[26px] font-bold tracking-[-0.04em]">
            MILO에 로그인
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            지원 기록과 제출 문서를 한곳에서 관리하세요.
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

          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            Gmail 접근 권한은 요청하지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
