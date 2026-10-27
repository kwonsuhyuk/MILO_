"use server";

import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_start_failed");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
