import { setTimeout as delay } from "node:timers/promises";

const base = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3137").replace(/\/$/, "");
const baseUrl = new URL(base);
if (!["http:", "https:"].includes(baseUrl.protocol)) {
  throw new Error("SMOKE_BASE_URL must be an HTTP(S) origin");
}
if (process.env.SMOKE_ALLOW_EXTERNAL !== "1" && !["localhost", "127.0.0.1"].includes(baseUrl.hostname)) {
  throw new Error("By default smoke tests only target localhost; explicitly set SMOKE_ALLOW_EXTERNAL=1 for owned sites");
}
const routes = [
  { path: "/", expected: 200, type: "text/html" },
  { path: "/insights", expected: 200, type: "text/html" },
  { path: "/projects", expected: 200, type: "text/html" },
  { path: "/dossiers", expected: 200, type: "text/html" },
  { path: "/sources", expected: 200, type: "text/html" },
  { path: "/submissions", expected: 200, type: "text/html" },
  { path: "/submit", expected: 200, type: "text/html" },
  { path: "/about", expected: 200, type: "text/html" },
  { path: "/robots.txt", expected: 200, type: "text/plain" },
  { path: "/sitemap.xml", expected: 200, type: "application/xml" },
  { path: "/api/health", expected: 200, type: "application/json" },
  { path: "/api/admin/reports", expected: 401, type: "application/json" },
];
async function waitForServer() {
  for (let i = 0; i < 45; i++) {
    try {
      const result = await fetch(base + "/api/health", {
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
      });
      if (result.status === 200) return;
    } catch {
      // Next.js can take a few seconds to start after the build.
    }
    await delay(250);
  }
  throw new Error("Next.js server did not become ready within the smoke-test startup window");
}
await waitForServer();
let failures = 0;
for (const route of routes) {
  try {
    const response = await fetch(base + route.path, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const type = response.headers.get("content-type") || "";
    if (response.status !== route.expected || !type.includes(route.type)) {
      console.error(`FAIL ${route.path}: status=${response.status} type=${type}`);
      failures++;
      continue;
    }
    if (route.path === "/api/health") {
      const payload = await response.json();
      if (
        payload.status !== "ok" || payload.scope !== "public-content" ||
        !Number.isInteger(payload.articles) || payload.articles < 25 ||
        !Number.isInteger(payload.trackedProjects) || payload.trackedProjects < 12 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(payload.snapshotDate || "") ||
        payload.dependenciesChecked !== false ||
        response.headers.get("cache-control")?.includes("no-store") !== true
      ) {
        console.error("FAIL /api/health: invalid public-content health contract");
        failures++;
        continue;
      }
    }
    console.log(`PASS ${route.path}: HTTP ${response.status}`);
  } catch (error) {
    console.error(`FAIL ${route.path}: ${error instanceof Error ? error.message : "unknown error"}`);
    failures++;
  }
}
if (failures > 0) {
  console.error(`Smoke test FAILED with ${failures} route errors`);
  process.exitCode = 1;
} else {
  console.log(`Smoke test PASS: ${routes.length} read-only routes and security boundary validated`);
}
