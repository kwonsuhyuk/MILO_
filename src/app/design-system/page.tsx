import { ArrowRight, CalendarDays, Check, CircleDot, Plus } from "lucide-react";
import Image from "next/image";

const colorTokens = [
  { name: "Primary", value: "#9DDF50", className: "bg-primary" },
  { name: "Primary border", value: "#78B72F", className: "bg-primary-border" },
  { name: "Foreground", value: "#17210F", className: "bg-foreground" },
  { name: "Surface subtle", value: "#F5F7F3", className: "bg-surface-subtle" },
  { name: "Border", value: "#DCE3D6", className: "bg-border" },
] as const;

const applications = [
  {
    company: "모노랩",
    role: "프론트엔드 개발자",
    status: "면접 진행 중",
    document: "이력서 v3",
    schedule: "10.19 면접",
  },
  {
    company: "스튜디오 웨이브",
    role: "웹 개발자",
    status: "결과 대기",
    document: "이력서 v2",
    schedule: "10.23 후속 연락",
  },
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/milo-mark.svg"
              width={38}
              height={38}
              alt=""
              priority
            />
            <span className="text-[15px] font-bold tracking-[-0.03em]">
              MILO
            </span>
          </div>
          <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            UI foundation
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            디자인 기준 확인
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            기능 화면을 만들기 전에 색상, 글꼴, 기본 조작 요소와 데이터 표현을
            한곳에서 검토합니다.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated · 2026.10.17
        </p>
      </header>

      <section className="grid gap-8 border-b py-9 lg:grid-cols-[180px_1fr]">
        <div>
          <h2 className="text-base font-semibold">색상</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            브랜드 색상은 행동과 선택 상태에 제한적으로 사용합니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {colorTokens.map((token) => (
            <div key={token.name}>
              <div
                className={`h-16 border ${token.className}`}
                role="img"
                aria-label={`${token.name} ${token.value}`}
              />
              <p className="mt-2 text-xs font-medium">{token.name}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {token.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-b py-9 lg:grid-cols-[180px_1fr]">
        <div>
          <h2 className="text-base font-semibold">타이포그래피</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Pretendard Variable 하나로 한글과 숫자의 위계를 구성합니다.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-[40px]">
              기록이 다음 기회로
              <br />
              이어지도록
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              제출한 문서와 지원 결과를 연결하고, 다음 일정과 변화 과정을 놓치지
              않도록 돕습니다.
            </p>
          </div>
          <dl className="divide-y border-y">
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-xs text-muted-foreground">진행 중</dt>
              <dd className="text-2xl font-bold tabular-nums">06</dd>
            </div>
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-xs text-muted-foreground">서류 통과율</dt>
              <dd className="text-2xl font-bold tabular-nums">42%</dd>
            </div>
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-xs text-muted-foreground">
                가장 가까운 일정
              </dt>
              <dd className="text-2xl font-bold tabular-nums">D-03</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-8 border-b py-9 lg:grid-cols-[180px_1fr]">
        <div>
          <h2 className="text-base font-semibold">조작 요소</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            작은 모서리와 명확한 경계로 장식보다 기능을 우선합니다.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              Buttons
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary-border bg-primary px-4 text-sm font-semibold text-primary-foreground outline-offset-2 hover:brightness-95 focus-visible:outline-2"
              >
                <Plus aria-hidden="true" size={16} />
                지원 기록 추가
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-input-border bg-background px-4 text-sm font-semibold outline-offset-2 hover:bg-surface-subtle focus-visible:outline-2"
              >
                상세 보기
                <ArrowRight aria-hidden="true" size={15} />
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-semibold text-primary-border outline-offset-2 hover:bg-primary-soft focus-visible:outline-2"
              >
                취소
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-xs font-semibold"
            >
              기업명
            </label>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue="모노랩"
              className="h-11 w-full rounded-md border border-input-border bg-background px-3 text-sm outline-offset-2 focus:border-primary-border focus:outline-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              나중에 기업 정보를 추가할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-9 lg:grid-cols-[180px_1fr]">
        <div>
          <h2 className="text-base font-semibold">데이터 목록</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            카드보다 표와 구획선을 우선해 비교 가능한 정보를 보여줍니다.
          </p>
        </div>
        <div className="overflow-x-auto border-y">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-surface-subtle text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-semibold">기업 / 직무</th>
                <th className="px-3 py-3 font-semibold">현재 상태</th>
                <th className="px-3 py-3 font-semibold">제출 문서</th>
                <th className="px-3 py-3 font-semibold">다음 일정</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((application, index) => (
                <tr key={application.company}>
                  <td className="px-3 py-4">
                    <p className="font-semibold">{application.company}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {application.role}
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium">
                      {index === 0 ? (
                        <CircleDot
                          aria-hidden="true"
                          className="text-primary-border"
                          size={13}
                        />
                      ) : (
                        <Check
                          aria-hidden="true"
                          className="text-success"
                          size={13}
                        />
                      )}
                      {application.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-primary-border underline decoration-1 underline-offset-4">
                    {application.document}
                  </td>
                  <td className="px-3 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays aria-hidden="true" size={14} />
                      {application.schedule}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
