import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, companies } from "@/db/schema";

export async function getApplicationsForUser(userId: string) {
  return db
    .select({
      id: applications.id,
      companyName: companies.name,
      positionTitle: applications.positionTitle,
      appliedOn: applications.appliedOn,
      currentStage: applications.currentStage,
      overallResult: applications.overallResult,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .innerJoin(
      companies,
      and(
        eq(applications.companyId, companies.id),
        eq(companies.userId, userId),
      ),
    )
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt));
}
