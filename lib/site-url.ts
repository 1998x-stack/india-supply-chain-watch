// Canonical URL belongs to the production hostname, not a temporary deployment hash.
// Explicit NEXT_PUBLIC_SITE_URL wins; Vercel's documented production hostname is
// the next choice in production. Preview deployments can use their preview host.
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const deploymentHost = process.env.VERCEL_URL?.trim();
  const candidate = configured ||
    (process.env.VERCEL_ENV === "production" && productionHost
      ? `https://${productionHost}`
      : deploymentHost
        ? `https://${deploymentHost}`
        : "http://localhost:3000");

  try {
    const url = new URL(candidate);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) {
      throw new Error("canonical URL must be HTTPS outside localhost");
    }
    if (url.username || url.password || url.search || url.hash) {
      throw new Error("canonical URL must not contain credentials or query parameters");
    }
    return url.origin;
  } catch {
    // No unvalidated deployment URL should reach the public sitemap.
    return "http://localhost:3000";
  }
}
