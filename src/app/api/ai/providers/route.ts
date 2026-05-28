import { NextResponse } from "next/server";
import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import type { AiProvider } from "@/lib/ai/types";

export async function GET() {
  const statuses = (Object.keys(PROVIDER_CONFIGS) as AiProvider[]).map((key) => {
    const cfg = PROVIDER_CONFIGS[key];
    const apiKey = process.env[cfg.envKey];
    return {
      id: key,
      name: cfg.name,
      models: cfg.models,
      defaultModel: cfg.defaultModel,
      configured: !!apiKey,
      maskedKey: apiKey
        ? apiKey.slice(0, 8) + "••••" + apiKey.slice(-4)
        : null,
    };
  });

  return NextResponse.json({ providers: statuses });
}
