import "server-only";

import { headers } from "next/headers";

function normalizeUrl(value: string) {
  const url = value.startsWith("http") ? value : `https://${value}`;
  return url.replace(/\/$/, "");
}

function getRequestOrigin(
  requestHeaders: Awaited<ReturnType<typeof headers>>,
  configuredSiteUrl?: string,
) {
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost?.trim() || requestHeaders.get("host")?.trim();

  if (!host) {
    return null;
  }

  const hostname = host.split(":")[0];
  const configuredHostname = configuredSiteUrl
    ? new URL(normalizeUrl(configuredSiteUrl)).hostname
    : null;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const isTrustedHost =
    isLocal ||
    hostname.endsWith(".vercel.app") ||
    hostname === configuredHostname;

  if (!isTrustedHost) {
    return null;
  }

  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol = isLocal && forwardedProtocol !== "https" ? "http" : "https";

  return `${protocol}://${host}`;
}

export async function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestOrigin = getRequestOrigin(await headers(), siteUrl);

  if (requestOrigin) {
    return requestOrigin;
  }

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
