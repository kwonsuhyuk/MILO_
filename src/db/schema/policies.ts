import { sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

function ownsRow(userIdColumn: AnyPgColumn) {
  return sql`${authUid} is not null and ${authUid} = ${userIdColumn}`;
}

export function ownerCrudPolicies(
  tableName: string,
  userIdColumn: AnyPgColumn,
) {
  const ownerCondition = ownsRow(userIdColumn);

  return [
    pgPolicy(`${tableName}_select_own`, {
      for: "select",
      to: authenticatedRole,
      using: ownerCondition,
    }),
    pgPolicy(`${tableName}_insert_own`, {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownerCondition,
    }),
    pgPolicy(`${tableName}_update_own`, {
      for: "update",
      to: authenticatedRole,
      using: ownerCondition,
      withCheck: ownerCondition,
    }),
    pgPolicy(`${tableName}_delete_own`, {
      for: "delete",
      to: authenticatedRole,
      using: ownerCondition,
    }),
  ];
}

export function ownerReadInsertPolicies(
  tableName: string,
  userIdColumn: AnyPgColumn,
) {
  const ownerCondition = ownsRow(userIdColumn);

  return [
    pgPolicy(`${tableName}_select_own`, {
      for: "select",
      to: authenticatedRole,
      using: ownerCondition,
    }),
    pgPolicy(`${tableName}_insert_own`, {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownerCondition,
    }),
  ];
}

export function ownerReadUpdatePolicies(
  tableName: string,
  userIdColumn: AnyPgColumn,
) {
  const ownerCondition = ownsRow(userIdColumn);

  return [
    pgPolicy(`${tableName}_select_own`, {
      for: "select",
      to: authenticatedRole,
      using: ownerCondition,
    }),
    pgPolicy(`${tableName}_update_own`, {
      for: "update",
      to: authenticatedRole,
      using: ownerCondition,
      withCheck: ownerCondition,
    }),
  ];
}
