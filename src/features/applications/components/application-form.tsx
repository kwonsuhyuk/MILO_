"use client";

import { useActionState } from "react";
import { type ApplicationFormState, createApplication } from "../actions";

const initialState: ApplicationFormState = { message: "" };

type ApplicationFormProps = {
  defaultAppliedOn: string;
};

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-2 text-xs text-destructive">{message}</p>
  ) : null;
}

export function ApplicationForm({ defaultAppliedOn }: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(
    createApplication,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-7">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="companyName">
            기업명 <span className="text-primary-border">*</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-lg border border-input-border bg-background px-3.5 text-sm outline-offset-2 placeholder:text-muted-foreground/70 focus:border-primary-border focus:outline-2"
            id="companyName"
            maxLength={120}
            name="companyName"
            placeholder="예: 마일로 테크"
            required
          />
          <FieldError message={state.fieldErrors?.companyName} />
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="positionTitle">
            지원 직무 <span className="text-primary-border">*</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-lg border border-input-border bg-background px-3.5 text-sm outline-offset-2 placeholder:text-muted-foreground/70 focus:border-primary-border focus:outline-2"
            id="positionTitle"
            maxLength={120}
            name="positionTitle"
            placeholder="예: 프론트엔드 개발자"
            required
          />
          <FieldError message={state.fieldErrors?.positionTitle} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="appliedOn">
            지원 날짜 <span className="text-primary-border">*</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-lg border border-input-border bg-background px-3.5 text-sm outline-offset-2 focus:border-primary-border focus:outline-2"
            defaultValue={defaultAppliedOn}
            id="appliedOn"
            name="appliedOn"
            required
            type="date"
          />
          <FieldError message={state.fieldErrors?.appliedOn} />
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="jobPostingUrl">
            채용공고 URL{" "}
            <span className="font-normal text-muted-foreground">선택</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-lg border border-input-border bg-background px-3.5 text-sm outline-offset-2 placeholder:text-muted-foreground/70 focus:border-primary-border focus:outline-2"
            id="jobPostingUrl"
            inputMode="url"
            name="jobPostingUrl"
            placeholder="https://"
            type="url"
          />
          <FieldError message={state.fieldErrors?.jobPostingUrl} />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="note">
          메모 <span className="font-normal text-muted-foreground">선택</span>
        </label>
        <textarea
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-input-border bg-background px-3.5 py-3 text-sm leading-6 outline-offset-2 placeholder:text-muted-foreground/70 focus:border-primary-border focus:outline-2"
          id="note"
          name="note"
          placeholder="지원 경로나 기억해 둘 내용을 적어두세요."
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          현재 상태는 ‘지원 완료’로 저장됩니다.
        </p>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background outline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "저장 중..." : "지원 기록 저장"}
        </button>
      </div>

      {state.message ? (
        <p
          aria-live="polite"
          className="rounded-lg bg-destructive-soft px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
