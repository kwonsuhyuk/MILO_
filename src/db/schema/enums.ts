import { pgEnum } from "drizzle-orm/pg-core";

export const documentTypeEnum = pgEnum("document_type", [
  "resume",
  "cover_letter",
  "combined",
]);

export const applicationStageEnum = pgEnum("application_stage", [
  "screening",
  "test_or_assignment",
  "interview",
  "offer_negotiation",
]);

export const applicationResultEnum = pgEnum("application_result", [
  "in_progress",
  "final_accepted",
  "employment_confirmed",
  "rejected",
  "closed",
]);

export const applicationCloseReasonEnum = pgEnum("application_close_reason", [
  "withdrawn",
  "no_response",
  "hiring_cancelled",
  "other",
]);

export const applicationEventTypeEnum = pgEnum("application_event_type", [
  "application_submitted",
  "stage_entered",
  "stage_passed",
  "stage_failed",
  "application_closed",
  "application_reopened",
  "reverted",
]);

export const applicationEventActorEnum = pgEnum("application_event_actor", [
  "user",
  "email_automation",
  "system",
]);

export const applicationTaskTypeEnum = pgEnum("application_task_type", [
  "application_deadline",
  "test_deadline",
  "assignment_deadline",
  "interview",
  "result_announcement",
  "follow_up",
  "other",
]);
