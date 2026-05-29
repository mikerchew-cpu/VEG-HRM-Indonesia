import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keys: Record<string, string> = body;
    const set: string[] = [];

    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;
    const results: { key: string; status: number; ok: boolean }[] = [];

    for (const [key, value] of Object.entries(keys)) {
      if (!value || typeof value !== "string" || !value.trim()) continue;

      // Set in current process
      process.env[key] = value.trim();
      set.push(key);

      // Persist to Vercel env vars
      if (vercelToken && projectId) {
        // First, get existing env to check if we need to update or create
        const listUrl = `https://api.vercel.com/v1/projects/${projectId}/env${
          teamId ? `?teamId=${teamId}` : ""
        }`;

        // Find existing env entry by name
        const listRes = await fetch(listUrl, {
          headers: { Authorization: `Bearer ${vercelToken}` },
        });
        const listData = await listRes.json();
        const existing = (listData.envs || []).find(
          (e: { key: string; target: string[] }) =>
            e.key === key && e.target?.includes("production")
        );

        let res;
        if (existing) {
          // Update existing
          res = await fetch(
            `https://api.vercel.com/v1/projects/${projectId}/env/${existing.id}${
              teamId ? `?teamId=${teamId}` : ""
            }`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${vercelToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                value: value.trim(),
                target: ["production"],
                type: "encrypted",
              }),
            }
          );
        } else {
          // Create new
          res = await fetch(listUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${vercelToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key,
              value: value.trim(),
              target: ["production"],
              type: "encrypted",
            }),
          });
        }

        results.push({
          key,
          status: res.status,
          ok: res.ok,
        });
      }
    }

    return NextResponse.json({
      success: true,
      configured: set,
      persisted: results.filter((r) => r.ok).map((r) => r.key),
      failed: results.filter((r) => !r.ok).map((r) => `${r.key} (HTTP ${r.status})`),
      message:
        set.length > 0
          ? `Configured ${set.length} AI provider(s). ${results.filter((r) => r.ok).length} persisted to Vercel. Redeploy recommended for production.`
          : "No keys provided",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
