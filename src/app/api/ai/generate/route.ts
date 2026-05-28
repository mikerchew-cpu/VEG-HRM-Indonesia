import { NextRequest, NextResponse } from "next/server";
import { callAi, crossValidate } from "@/lib/ai/providers";
import { PROVIDER_CONFIGS } from "@/lib/ai/config";
import type { AiProvider } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, provider, model, reportType, data, providers } = body;

    if (action === "cross-validate") {
      const results = await crossValidate(
        reportType,
        data || "No additional data provided.",
        providers || ["deepseek", "claude", "gemini"]
      );
      return NextResponse.json({ results });
    }

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 });
    }

    const cfg = PROVIDER_CONFIGS[provider as AiProvider];
    if (!cfg) {
      return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    const systemPrompt = reportType
      ? (await import("@/lib/ai/config")).REPORT_PROMPTS[reportType] ??
        "Analyze the following HR data and provide insights."
      : "You are a helpful HR assistant for Indonesian mining industry.";

    const response = await callAi({
      provider: provider as AiProvider,
      model: model || cfg.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data || "Generate a standard HR analysis report." },
      ],
      temperature: body.temperature ?? 0.3,
      max_tokens: body.max_tokens ?? 2048,
    });

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
