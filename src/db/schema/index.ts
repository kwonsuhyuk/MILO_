import { sql } from "drizzle-orm";
import {
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  time,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import {
  applicationCloseReasonEnum,
  applicationEventActorEnum,
  applicationEventTypeEnum,
  applicationResultEnum,
  applicationStageEnum,
  applicationTaskTypeEnum,
  documentTypeEnum,
} from "./enums";
import {
  ownerCrudPolicies,
  ownerReadInsertPolicies,
  ownerReadUpdatePolicies,
} from "./policies";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    displayName: varchar("display_name", { length: 80 }),
    timeZone: varchar("time_zone", { length: 100 })
      .default("Asia/Seoul")
      .notNull(),
    ...timestamps,
  },
  (table) => [
    ...ownerReadUpdatePolicies("profiles", table.id),
    check(
      "profiles_time_zone_not_blank",
      sql`length(trim(${table.timeZone})) > 0`,
    ),
  ],
);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    note: text("note"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    ...ownerCrudPolicies("companies", table.userId),
    unique("companies_id_user_id_unique").on(table.id, table.userId),
    index("companies_user_name_idx").on(table.userId, table.normalizedName),
    index("companies_user_updated_at_idx").on(table.userId, table.updatedAt),
    check("companies_name_not_blank", sql`length(trim(${table.name})) > 0`),
    check(
      "companies_normalized_name_not_blank",
      sql`length(trim(${table.normalizedName})) > 0`,
    ),
  ],
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").notNull(),
    positionTitle: text("position_title").notNull(),
    appliedOn: date("applied_on", { mode: "string" }).notNull(),
    jobPostingUrl: text("job_posting_url"),
    jobPostingText: text("job_posting_text"),
    currentStage: applicationStageEnum("current_stage")
      .default("screening")
      .notNull(),
    overallResult: applicationResultEnum("overall_result")
      .default("in_progress")
      .notNull(),
    closeReason: applicationCloseReasonEnum("close_reason"),
    note: text("note"),
    ...timestamps,
  },
  (table) => [
    ...ownerCrudPolicies("applications", table.userId),
    unique("applications_id_user_id_unique").on(table.id, table.userId),
    foreignKey({
      name: "applications_company_owner_fk",
      columns: [table.companyId, table.userId],
      foreignColumns: [companies.id, companies.userId],
    }).onDelete("no action"),
    index("applications_user_updated_at_idx").on(table.userId, table.updatedAt),
    index("applications_user_status_idx").on(
      table.userId,
      table.currentStage,
      table.overallResult,
    ),
    index("applications_company_id_idx").on(table.companyId),
    check(
      "applications_position_title_not_blank",
      sql`length(trim(${table.positionTitle})) > 0`,
    ),
    check(
      "applications_close_reason_consistency",
      sql`(
        (${table.overallResult} = 'closed' and ${table.closeReason} is not null)
        or
        (${table.overallResult} <> 'closed' and ${table.closeReason} is null)
      )`,
    ),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: documentTypeEnum("type").notNull(),
    name: text("name").notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    ...ownerCrudPolicies("documents", table.userId),
    unique("documents_id_user_id_unique").on(table.id, table.userId),
    index("documents_user_updated_at_idx").on(table.userId, table.updatedAt),
    check("documents_name_not_blank", sql`length(trim(${table.name})) > 0`),
  ],
);

export const documentVersions = pgTable(
  "document_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").notNull(),
    versionNumber: integer("version_number").notNull(),
    label: text("label").notNull(),
    changeSummary: text("change_summary"),
    storagePath: text("storage_path"),
    originalFileName: text("original_file_name"),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSizeBytes: integer("file_size_bytes"),
    checksumSha256: varchar("checksum_sha256", { length: 64 }),
    fileDeletedAt: timestamp("file_deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    ...ownerCrudPolicies("document_versions", table.userId),
    unique("document_versions_id_user_id_unique").on(table.id, table.userId),
    uniqueIndex("document_versions_document_version_unique").on(
      table.documentId,
      table.versionNumber,
    ),
    foreignKey({
      name: "document_versions_document_owner_fk",
      columns: [table.documentId, table.userId],
      foreignColumns: [documents.id, documents.userId],
    }).onDelete("cascade"),
    index("document_versions_document_id_idx").on(table.documentId),
    check(
      "document_versions_version_positive",
      sql`${table.versionNumber} > 0`,
    ),
    check(
      "document_versions_label_not_blank",
      sql`length(trim(${table.label})) > 0`,
    ),
    check(
      "document_versions_pdf_mime_type",
      sql`${table.mimeType} is null or ${table.mimeType} = 'application/pdf'`,
    ),
    check(
      "document_versions_file_size_limit",
      sql`${table.fileSizeBytes} is null or (${table.fileSizeBytes} > 0 and ${table.fileSizeBytes} <= 10485760)`,
    ),
  ],
);

export const applicationDocuments = pgTable(
  "application_documents",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").notNull(),
    documentVersionId: uuid("document_version_id").notNull(),
    linkedAt: timestamp("linked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    ...ownerCrudPolicies("application_documents", table.userId),
    primaryKey({ columns: [table.applicationId, table.documentVersionId] }),
    foreignKey({
      name: "application_documents_application_owner_fk",
      columns: [table.applicationId, table.userId],
      foreignColumns: [applications.id, applications.userId],
    }).onDelete("cascade"),
    foreignKey({
      name: "application_documents_version_owner_fk",
      columns: [table.documentVersionId, table.userId],
      foreignColumns: [documentVersions.id, documentVersions.userId],
    }).onDelete("cascade"),
    index("application_documents_user_id_idx").on(table.userId),
    index("application_documents_version_id_idx").on(table.documentVersionId),
  ],
);

export const applicationTasks = pgTable(
  "application_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").notNull(),
    type: applicationTaskTypeEnum("type").notNull(),
    title: text("title").notNull(),
    scheduledOn: date("scheduled_on", { mode: "string" }).notNull(),
    scheduledTime: time("scheduled_time", { precision: 0 }),
    timeZone: varchar("time_zone", { length: 100 }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    note: text("note"),
    ...timestamps,
  },
  (table) => [
    ...ownerCrudPolicies("application_tasks", table.userId),
    unique("application_tasks_id_user_id_unique").on(table.id, table.userId),
    foreignKey({
      name: "application_tasks_application_owner_fk",
      columns: [table.applicationId, table.userId],
      foreignColumns: [applications.id, applications.userId],
    }).onDelete("cascade"),
    index("application_tasks_next_action_idx").on(
      table.userId,
      table.completedAt,
      table.scheduledOn,
      table.scheduledTime,
    ),
    index("application_tasks_application_id_idx").on(table.applicationId),
    check(
      "application_tasks_title_not_blank",
      sql`length(trim(${table.title})) > 0`,
    ),
    check(
      "application_tasks_time_zone_not_blank",
      sql`length(trim(${table.timeZone})) > 0`,
    ),
  ],
);

export const applicationEvents = pgTable(
  "application_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").notNull(),
    relatedTaskId: uuid("related_task_id"),
    revertedEventId: uuid("reverted_event_id"),
    type: applicationEventTypeEnum("type").notNull(),
    actor: applicationEventActorEnum("actor").default("user").notNull(),
    previousStage: applicationStageEnum("previous_stage"),
    nextStage: applicationStageEnum("next_stage"),
    previousResult: applicationResultEnum("previous_result"),
    nextResult: applicationResultEnum("next_result"),
    previousCloseReason: applicationCloseReasonEnum("previous_close_reason"),
    nextCloseReason: applicationCloseReasonEnum("next_close_reason"),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
  },
  (table) => [
    ...ownerReadInsertPolicies("application_events", table.userId),
    unique("application_events_id_user_id_unique").on(table.id, table.userId),
    foreignKey({
      name: "application_events_application_owner_fk",
      columns: [table.applicationId, table.userId],
      foreignColumns: [applications.id, applications.userId],
    }).onDelete("cascade"),
    foreignKey({
      name: "application_events_task_owner_fk",
      columns: [table.relatedTaskId, table.userId],
      foreignColumns: [applicationTasks.id, applicationTasks.userId],
    }).onDelete("no action"),
    foreignKey({
      name: "application_events_reverted_event_owner_fk",
      columns: [table.revertedEventId, table.userId],
      foreignColumns: [table.id, table.userId],
    }).onDelete("no action"),
    index("application_events_timeline_idx").on(
      table.applicationId,
      table.occurredAt,
    ),
    index("application_events_user_id_idx").on(table.userId),
    index("application_events_related_task_id_idx").on(table.relatedTaskId),
    index("application_events_reverted_event_id_idx").on(table.revertedEventId),
    check(
      "application_events_revert_target_required",
      sql`${table.type} <> 'reverted' or ${table.revertedEventId} is not null`,
    ),
  ],
);

export {
  applicationCloseReasonEnum,
  applicationEventActorEnum,
  applicationEventTypeEnum,
  applicationResultEnum,
  applicationStageEnum,
  applicationTaskTypeEnum,
  documentTypeEnum,
};
