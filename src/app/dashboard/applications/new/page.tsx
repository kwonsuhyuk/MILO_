import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicationForm } from "@/features/applications/components/application-form";

function getTodayInSeoul() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function NewApplicationPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground outline-offset-4 hover:text-foreground"
        href="/dashboard"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        대시보드
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold text-primary-border">새 지원</p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-[-0.04em]">
          지원 기록 추가
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          먼저 기본 정보만 기록하세요. 이력서와 일정은 나중에 연결할 수
          있습니다.
        </p>
      </div>

      <section className="mt-8 rounded-xl border bg-background p-5 sm:p-7">
        <ApplicationForm defaultAppliedOn={getTodayInSeoul()} />
      </section>
    </main>
  );
}
