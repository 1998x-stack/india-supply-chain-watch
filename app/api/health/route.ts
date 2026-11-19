import { NextResponse } from "next/server";
import { articles } from "@/data/articles";
import { projects } from "@/data/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, dependency-free probe for the content-reading part of the site.
// It intentionally does not expose environment variables, DB availability,
// user data, deployment identifiers, or internal exceptions.
export async function GET() {
  const snapshotDate = articles.reduce(
    (latest, article) => (article.checkedAt > latest ? article.checkedAt : latest),
    "1970-01-01",
  );
  return NextResponse.json(
    {
      status: "ok",
      scope: "public-content",
      snapshotDate,
      articles: articles.length,
      trackedProjects: projects.length,
      // No claim about PostgreSQL, Turnstile, authentication, or external URLs.
      dependenciesChecked: false,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
