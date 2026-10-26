CREATE TYPE "application_close_reason" AS ENUM('withdrawn', 'no_response', 'hiring_cancelled', 'other');--> statement-breakpoint
CREATE TYPE "application_event_actor" AS ENUM('user', 'email_automation', 'system');--> statement-breakpoint
CREATE TYPE "application_event_type" AS ENUM('application_submitted', 'stage_entered', 'stage_passed', 'stage_failed', 'application_closed', 'application_reopened', 'reverted');--> statement-breakpoint
CREATE TYPE "application_result" AS ENUM('in_progress', 'final_accepted', 'employment_confirmed', 'rejected', 'closed');--> statement-breakpoint
CREATE TYPE "application_stage" AS ENUM('screening', 'test_or_assignment', 'interview', 'offer_negotiation');--> statement-breakpoint
CREATE TYPE "application_task_type" AS ENUM('application_deadline', 'test_deadline', 'assignment_deadline', 'interview', 'result_announcement', 'follow_up', 'other');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('resume', 'cover_letter', 'combined');--> statement-breakpoint
CREATE TABLE "application_documents" (
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"document_version_id" uuid,
	"linked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_documents_pkey" PRIMARY KEY("application_id","document_version_id")
);
--> statement-breakpoint
ALTER TABLE "application_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"related_task_id" uuid,
	"reverted_event_id" uuid,
	"type" "application_event_type" NOT NULL,
	"actor" "application_event_actor" DEFAULT 'user'::"application_event_actor" NOT NULL,
	"previous_stage" "application_stage",
	"next_stage" "application_stage",
	"previous_result" "application_result",
	"next_result" "application_result",
	"previous_close_reason" "application_close_reason",
	"next_close_reason" "application_close_reason",
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	CONSTRAINT "application_events_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "application_events_revert_target_required" CHECK ("type" <> 'reverted' or "reverted_event_id" is not null)
);
--> statement-breakpoint
ALTER TABLE "application_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "application_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"type" "application_task_type" NOT NULL,
	"title" text NOT NULL,
	"scheduled_on" date NOT NULL,
	"scheduled_time" time(0),
	"time_zone" varchar(100) NOT NULL,
	"completed_at" timestamp with time zone,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_tasks_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "application_tasks_title_not_blank" CHECK (length(trim("title")) > 0),
	CONSTRAINT "application_tasks_time_zone_not_blank" CHECK (length(trim("time_zone")) > 0)
);
--> statement-breakpoint
ALTER TABLE "application_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"position_title" text NOT NULL,
	"applied_on" date NOT NULL,
	"job_posting_url" text,
	"job_posting_text" text,
	"current_stage" "application_stage" DEFAULT 'screening'::"application_stage" NOT NULL,
	"overall_result" "application_result" DEFAULT 'in_progress'::"application_result" NOT NULL,
	"close_reason" "application_close_reason",
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applications_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "applications_position_title_not_blank" CHECK (length(trim("position_title")) > 0),
	CONSTRAINT "applications_close_reason_consistency" CHECK ((
        ("overall_result" = 'closed' and "close_reason" is not null)
        or
        ("overall_result" <> 'closed' and "close_reason" is null)
      ))
);
--> statement-breakpoint
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"note" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "companies_name_not_blank" CHECK (length(trim("name")) > 0),
	CONSTRAINT "companies_normalized_name_not_blank" CHECK (length(trim("normalized_name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"label" text NOT NULL,
	"change_summary" text,
	"storage_path" text,
	"original_file_name" text,
	"mime_type" varchar(100),
	"file_size_bytes" integer,
	"checksum_sha256" varchar(64),
	"file_deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_versions_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "document_versions_version_positive" CHECK ("version_number" > 0),
	CONSTRAINT "document_versions_label_not_blank" CHECK (length(trim("label")) > 0),
	CONSTRAINT "document_versions_pdf_mime_type" CHECK ("mime_type" is null or "mime_type" = 'application/pdf'),
	CONSTRAINT "document_versions_file_size_limit" CHECK ("file_size_bytes" is null or ("file_size_bytes" > 0 and "file_size_bytes" <= 10485760))
);
--> statement-breakpoint
ALTER TABLE "document_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"name" text NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_id_user_id_unique" UNIQUE("id","user_id"),
	CONSTRAINT "documents_name_not_blank" CHECK (length(trim("name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY,
	"display_name" varchar(80),
	"time_zone" varchar(100) DEFAULT 'Asia/Seoul' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_time_zone_not_blank" CHECK (length(trim("time_zone")) > 0)
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "application_documents_user_id_idx" ON "application_documents" ("user_id");--> statement-breakpoint
CREATE INDEX "application_documents_version_id_idx" ON "application_documents" ("document_version_id");--> statement-breakpoint
CREATE INDEX "application_events_timeline_idx" ON "application_events" ("application_id","occurred_at");--> statement-breakpoint
CREATE INDEX "application_events_user_id_idx" ON "application_events" ("user_id");--> statement-breakpoint
CREATE INDEX "application_events_related_task_id_idx" ON "application_events" ("related_task_id");--> statement-breakpoint
CREATE INDEX "application_events_reverted_event_id_idx" ON "application_events" ("reverted_event_id");--> statement-breakpoint
CREATE INDEX "application_tasks_next_action_idx" ON "application_tasks" ("user_id","completed_at","scheduled_on","scheduled_time");--> statement-breakpoint
CREATE INDEX "application_tasks_application_id_idx" ON "application_tasks" ("application_id");--> statement-breakpoint
CREATE INDEX "applications_user_updated_at_idx" ON "applications" ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "applications_user_status_idx" ON "applications" ("user_id","current_stage","overall_result");--> statement-breakpoint
CREATE INDEX "applications_company_id_idx" ON "applications" ("company_id");--> statement-breakpoint
CREATE INDEX "companies_user_name_idx" ON "companies" ("user_id","normalized_name");--> statement-breakpoint
CREATE INDEX "companies_user_updated_at_idx" ON "companies" ("user_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "document_versions_document_version_unique" ON "document_versions" ("document_id","version_number");--> statement-breakpoint
CREATE INDEX "document_versions_document_id_idx" ON "document_versions" ("document_id");--> statement-breakpoint
CREATE INDEX "documents_user_updated_at_idx" ON "documents" ("user_id","updated_at");--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_owner_fk" FOREIGN KEY ("application_id","user_id") REFERENCES "applications"("id","user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_version_owner_fk" FOREIGN KEY ("document_version_id","user_id") REFERENCES "document_versions"("id","user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_owner_fk" FOREIGN KEY ("application_id","user_id") REFERENCES "applications"("id","user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_task_owner_fk" FOREIGN KEY ("related_task_id","user_id") REFERENCES "application_tasks"("id","user_id") ON DELETE NO ACTION;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_reverted_event_owner_fk" FOREIGN KEY ("reverted_event_id","user_id") REFERENCES "application_events"("id","user_id") ON DELETE NO ACTION;--> statement-breakpoint
ALTER TABLE "application_tasks" ADD CONSTRAINT "application_tasks_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application_tasks" ADD CONSTRAINT "application_tasks_application_owner_fk" FOREIGN KEY ("application_id","user_id") REFERENCES "applications"("id","user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_company_owner_fk" FOREIGN KEY ("company_id","user_id") REFERENCES "companies"("id","user_id") ON DELETE NO ACTION;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_owner_fk" FOREIGN KEY ("document_id","user_id") REFERENCES "documents"("id","user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_profiles_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "application_documents_select_own" ON "application_documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_documents"."user_id");--> statement-breakpoint
CREATE POLICY "application_documents_insert_own" ON "application_documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "application_documents"."user_id");--> statement-breakpoint
CREATE POLICY "application_documents_update_own" ON "application_documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_documents"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "application_documents"."user_id");--> statement-breakpoint
CREATE POLICY "application_documents_delete_own" ON "application_documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_documents"."user_id");--> statement-breakpoint
CREATE POLICY "application_events_select_own" ON "application_events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_events"."user_id");--> statement-breakpoint
CREATE POLICY "application_events_insert_own" ON "application_events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "application_events"."user_id");--> statement-breakpoint
CREATE POLICY "application_tasks_select_own" ON "application_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_tasks"."user_id");--> statement-breakpoint
CREATE POLICY "application_tasks_insert_own" ON "application_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "application_tasks"."user_id");--> statement-breakpoint
CREATE POLICY "application_tasks_update_own" ON "application_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_tasks"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "application_tasks"."user_id");--> statement-breakpoint
CREATE POLICY "application_tasks_delete_own" ON "application_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "application_tasks"."user_id");--> statement-breakpoint
CREATE POLICY "applications_select_own" ON "applications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "applications"."user_id");--> statement-breakpoint
CREATE POLICY "applications_insert_own" ON "applications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "applications"."user_id");--> statement-breakpoint
CREATE POLICY "applications_update_own" ON "applications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "applications"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "applications"."user_id");--> statement-breakpoint
CREATE POLICY "applications_delete_own" ON "applications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "applications"."user_id");--> statement-breakpoint
CREATE POLICY "companies_select_own" ON "companies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "companies"."user_id");--> statement-breakpoint
CREATE POLICY "companies_insert_own" ON "companies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "companies"."user_id");--> statement-breakpoint
CREATE POLICY "companies_update_own" ON "companies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "companies"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "companies"."user_id");--> statement-breakpoint
CREATE POLICY "companies_delete_own" ON "companies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "companies"."user_id");--> statement-breakpoint
CREATE POLICY "document_versions_select_own" ON "document_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "document_versions"."user_id");--> statement-breakpoint
CREATE POLICY "document_versions_insert_own" ON "document_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "document_versions"."user_id");--> statement-breakpoint
CREATE POLICY "document_versions_update_own" ON "document_versions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "document_versions"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "document_versions"."user_id");--> statement-breakpoint
CREATE POLICY "document_versions_delete_own" ON "document_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "document_versions"."user_id");--> statement-breakpoint
CREATE POLICY "documents_select_own" ON "documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "documents"."user_id");--> statement-breakpoint
CREATE POLICY "documents_insert_own" ON "documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "documents"."user_id");--> statement-breakpoint
CREATE POLICY "documents_update_own" ON "documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "documents"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "documents"."user_id");--> statement-breakpoint
CREATE POLICY "documents_delete_own" ON "documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "documents"."user_id");--> statement-breakpoint
CREATE POLICY "profiles_select_own" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "profiles"."id");--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "profiles"."id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "profiles"."id");--> statement-breakpoint

-- Supabase의 공개 스키마 기본 권한을 명시적으로 제한한다.
REVOKE ALL ON TABLE "profiles", "companies", "applications", "documents", "document_versions", "application_documents", "application_tasks", "application_events" FROM "anon", "authenticated";--> statement-breakpoint
GRANT SELECT, UPDATE ON TABLE "profiles" TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "companies", "applications", "documents", "document_versions", "application_documents", "application_tasks" TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT ON TABLE "application_events" TO "authenticated";--> statement-breakpoint
GRANT ALL ON TABLE "profiles", "companies", "applications", "documents", "document_versions", "application_documents", "application_tasks", "application_events" TO "service_role";--> statement-breakpoint

-- 소셜 로그인이 처음 완료되면 공개 프로필의 최소 정보만 생성한다.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    NULLIF(
      TRIM(COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'name',
        NEW.raw_user_meta_data ->> 'user_name'
      )),
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;--> statement-breakpoint

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();--> statement-breakpoint

-- 수정 가능한 레코드의 updated_at을 데이터베이스에서도 일관되게 유지한다.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;--> statement-breakpoint

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER companies_set_updated_at BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER applications_set_updated_at BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER documents_set_updated_at BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint
CREATE TRIGGER application_tasks_set_updated_at BEFORE UPDATE ON public.application_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
