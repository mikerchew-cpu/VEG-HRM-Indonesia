import { NextRequest, NextResponse } from "next/server";

// In production, this would use the Vercel API to update env vars:
// POST https://api.vercel.com/v1/projects/{projectId}/env
// For development, we write to process.env (session only) and instruct user.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keys: Record<string, string> = body;
    const set: string[] = [];

    for (const [key, value] of Object.entries(keys)) {
      if (value && typeof value === "string" && value.trim()) {
        process.env[key] = value.trim();
        set.push(key);
      }
    }

    // In production, you would also store these to Vercel env vars:
    // Requires VERCEL_TOKEN + VERCEL_PROJECT_ID env vars to be set
    // const vercelToken = process.env.VERCEL_TOKEN;
    // const projectId = process.env.VERCEL_PROJECT_ID;
    // if (vercelToken && projectId) {
    //   for (const key of set) {
    //     await fetch(`https://api.vercel.com/v1/projects/${projectId}/env`, {
    //       method: "POST",
    //       headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
    //       body: JSON.stringify({ key, value: keys[key], target: ["production"], type: "encrypted" }),
    //     });
    //   }
    // }

    return NextResponse.json({
      success: true,
      configured: set,
      message: `Configured ${set.length} AI provider(s). Redeploy required for production changes to take effect.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
