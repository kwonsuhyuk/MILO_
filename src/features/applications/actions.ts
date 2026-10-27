"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { applicationEvents, applications, companies } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

export type ApplicationFormField =
  | "companyName"
  | "positionTitle"
  | "appliedOn"
  | "jobPostingUrl";

export type ApplicationFormState = {
  message: string;
  fieldErrors?: Partial<Record<ApplicationFormField, string>>;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCompanyName(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("ko-KR");
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isValidJobPostingUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createApplication(
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { message: "로그인 정보가 만료되었습니다. 다시 로그인해 주세요." };
  }

  const companyName = getText(formData, "companyName");
  const positionTitle = getText(formData, "positionTitle");
  const appliedOn = getText(formData, "appliedOn");
  const jobPostingUrl = getText(formData, "jobPostingUrl");
  const note = getText(formData, "note");
  const fieldErrors: ApplicationFormState["fieldErrors"] = {};

  if (!companyName) {
    fieldErrors.companyName = "기업명을 입력해 주세요.";
  } else if (companyName.length > 120) {
    fieldErrors.companyName = "기업명은 120자 이하로 입력해 주세요.";
  }

  if (!positionTitle) {
    fieldErrors.positionTitle = "지원 직무를 입력해 주세요.";
  } else if (positionTitle.length > 120) {
    fieldErrors.positionTitle = "지원 직무는 120자 이하로 입력해 주세요.";
  }

  if (!isValidDate(appliedOn)) {
    fieldErrors.appliedOn = "올바른 지원 날짜를 선택해 주세요.";
  }

  if (!isValidJobPostingUrl(jobPostingUrl)) {
    fieldErrors.jobPostingUrl =
      "http 또는 https로 시작하는 주소를 입력해 주세요.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      message: "입력한 내용을 확인해 주세요.",
      fieldErrors,
    };
  }

  const normalizedName = normalizeCompanyName(companyName);

  try {
    await db.transaction(async (transaction) => {
      const [existingCompany] = await transaction
        .select({ id: companies.id })
        .from(companies)
        .where(
          and(
            eq(companies.userId, userId),
            eq(companies.normalizedName, normalizedName),
            isNull(companies.archivedAt),
          ),
        )
        .limit(1);

      let companyId = existingCompany?.id;

      if (!companyId) {
        const [createdCompany] = await transaction
          .insert(companies)
          .values({ userId, name: companyName, normalizedName })
          .returning({ id: companies.id });

        companyId = createdCompany?.id;
      }

      if (!companyId) {
        throw new Error("기업 레코드를 생성하지 못했습니다.");
      }

      const [createdApplication] = await transaction
        .insert(applications)
        .values({
          userId,
          companyId,
          positionTitle,
          appliedOn,
          jobPostingUrl: jobPostingUrl || null,
          note: note || null,
        })
        .returning({ id: applications.id });

      if (!createdApplication) {
        throw new Error("지원 레코드를 생성하지 못했습니다.");
      }

      await transaction.insert(applicationEvents).values({
        userId,
        applicationId: createdApplication.id,
        type: "application_submitted",
        actor: "user",
        nextStage: "screening",
        nextResult: "in_progress",
      });
    });
  } catch {
    return {
      message: "지원 기록을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}
