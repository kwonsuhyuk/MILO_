export const applicationStageLabels = {
  screening: "서류",
  test_or_assignment: "테스트·과제",
  interview: "면접",
  offer_negotiation: "처우 협의",
} as const;

export const applicationResultLabels = {
  in_progress: "진행 중",
  final_accepted: "최종 합격",
  employment_confirmed: "입사 확정",
  rejected: "불합격",
  closed: "종료",
} as const;

type ApplicationStage = keyof typeof applicationStageLabels;
type ApplicationResult = keyof typeof applicationResultLabels;

export function getApplicationStatusLabel(
  stage: ApplicationStage,
  result: ApplicationResult,
) {
  if (result === "in_progress") {
    return stage === "screening"
      ? "지원 완료"
      : `${applicationStageLabels[stage]} 진행 중`;
  }

  if (result === "rejected") {
    return `${applicationStageLabels[stage]} 불합격`;
  }

  return applicationResultLabels[result];
}

export function formatAppliedOn(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${Number(month)}월 ${Number(day)}일`;
}
