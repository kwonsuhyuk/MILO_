"use server";

import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

async function signInWithProvider(
  provider: "google" | "kakao",
  errorCode: string,
  scopes?: string,
) {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      scopes,
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${errorCode}`);
  }

  redirect(data.url);
}

export async function signInWithGoogle() {
  return signInWithProvider("google", "oauth_google_start_failed");
}

export async function signInWithKakao() {
  return signInWithProvider(
    "kakao",
    "oauth_kakao_start_failed",
    "profile_nickname",
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
