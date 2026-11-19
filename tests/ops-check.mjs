import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

for (const path of [
  "app/api/health/route.ts",
  "scripts/smoke.mjs",
  "docs/PRODUCTION_RUNBOOK.md",
  "app/api/admin/reports/route.ts",
  "app/api/submissions/route.ts",
]) {
  assert(existsSync(new URL("../" + path, import.meta.url)), "missing operational file: " + path);
}
const health = read("app/api/health/route.ts");
assert(health.includes('"public-content"'), "health must declare its limited scope");
assert(health.includes("dependenciesChecked: false"), "health must not imply database/Turnstile checks");
assert(health.includes('"Cache-Control": "no-store"'), "health must disable caching");
assert(!/DATABASE_URL|ADMIN_PASSWORD|SESSION_SECRET|TURNSTILE_SECRET_KEY/.test(health), "health must not read secret configuration");
const submission = read("app/api/submissions/route.ts");
assert(submission.includes("!canAccept()"), "public intake must be disabled without every required configuration");
assert(submission.includes('status:"PENDING"'), "submissions must enter private moderation");
const admin = read("app/api/admin/reports/route.ts");
assert(admin.includes("!requestIsAdmin(request)"), "admin listing must check session");
const publicReports = read("app/submissions/page.tsx");
assert(!publicReports.includes("editorNote"), "internal moderator notes must never be selected or rendered publicly");
assert(publicReports.includes("publicTitle:true") && publicReports.includes("publicBody:true"), "public listing must select only reviewed publication fields");
const sitemap = read("app/sitemap.ts");
assert(sitemap.includes("a.checkedAt"), "sitemap last-modified must reflect research verification date");
const smoke = read("scripts/smoke.mjs");
for (const route of ["/", "/insights", "/projects", "/dossiers", "/sources", "/api/health", "/api/admin/reports"]) {
  assert(smoke.includes('path: "' + route + '"'), "missing smoke route " + route);
}
console.log("PASS: health scope, fail-closed intake, admin boundary, sitemap provenance, moderated publication fields and smoke-test coverage");
