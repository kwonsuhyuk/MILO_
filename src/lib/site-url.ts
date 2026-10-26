import "server-only";

function normalizeUrl(value: string) {
  const url = value.startsWith("http") ? value : `https://${value}`;
  return url.replace(/\/$/, "");
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return normalizeUrl(siteUrl);
  }

  const vercelUrl =
    process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl) {
    return normalizeUrl(vercelUrl);
  }

  return "http://localhost:3000";
}
