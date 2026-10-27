import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  formatAppliedOn,
  getApplicationStatusLabel,
} from "@/features/applications/constants";
import { getApplicationsForUser } from "@/features/applications/queries";
import { createClient } from "@/lib/supabase/server";

type DashboardPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/login");
  }

  const [applicationList, query] = await Promise.all([
    getApplicationsForUser(userId),
    searchParams,
  ]);
  const inProgressCount = applicationList.filter(
    (application) => application.overallResult === "in_progress",
  ).length;
  const decidedCount = applicationList.length - inProgressCount;

  return (
    <main>
      {query.created === "1" ? (
        <div
          className="mb-6 flex items-center gap-2.5 rounded-lg border border-primary bg-primary-soft px-4 py-3 text-sm font-semibold"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" size={18} />
          지원 기록을 저장했습니다.
        </div>
      ) : null}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.04em]">지원 현황</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            진행 중인 지원과 최근 기록을 확인하세요.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-foreground px-4 text-sm font-semibold text-background outline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-2 sm:self-auto"
          href="/dashboard/applications/new"
        >
          <Plus aria-hidden="true" size={17} />
          지원 기록 추가
        </Link>
      </div>

      <section
        aria-label="지원 요약"
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        <article className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">전체 지원</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.04em]">
            {applicationList.length}
          </p>
        </article>
        <article className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">진행 중</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.04em]">
            {inProgressCount}
          </p>
        </article>
        <article className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">결과·종료</p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.04em]">
            {decidedCount}
          </p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border bg-background">
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold tracking-[-0.02em]">최근 지원</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              최근 변경된 기록부터 보여드려요.
            </p>
          </div>
          {applicationList.length > 0 ? (
            <span className="text-xs text-muted-foreground">
              {applicationList.length}건
            </span>
          ) : null}
        </div>

        {applicationList.length === 0 ? (
          <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft">
              <BriefcaseBusiness aria-hidden="true" size={22} />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-[-0.03em]">
              아직 등록한 지원이 없어요.
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              기업명과 지원 직무만 입력해도 첫 기록을 시작할 수 있습니다.
              이력서는 나중에 연결해도 괜찮아요.
            </p>
            <Link
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-input-border px-4 text-sm font-semibold outline-offset-2 hover:bg-surface-subtle focus-visible:outline-2"
              href="/dashboard/applications/new"
            >
              첫 지원 등록
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {applicationList.map((application) => (
              <li
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                key={application.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {application.companyName}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {application.positionTitle} ·{" "}
                    {formatAppliedOn(application.appliedOn)} 지원
                  </p>
                </div>
                <span className="self-start rounded-md bg-primary-soft px-2.5 py-1.5 text-xs font-semibold text-success sm:self-auto">
                  {getApplicationStatusLabel(
                    application.currentStage,
                    application.overallResult,
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
