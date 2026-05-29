import { NextRequest, NextResponse } from "next/server";
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
      docsUrl: cfg.docsUrl,
      color: cfg.color,
      configured: !!apiKey,
      maskedKey: apiKey
        ? apiKey.slice(0, 6) + "••••" + apiKey.slice(-4)
        : null,
    };
  });

  return NextResponse.json({ providers: statuses });
}

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json();
    const cfg = PROVIDER_CONFIGS[provider as AiProvider];
    if (!cfg) {
      return NextResponse.json({ connected: false, error: "Unknown provider" }, { status: 400 });
    }

    const key = apiKey || process.env[cfg.envKey];
    if (!key) {
      return NextResponse.json({ connected: false, error: "API key not provided. Enter a key or save one first." });
    }

    let connected = false;
    let model = "";
    let error: string | null = null;
    const keyPrefix = key.slice(0, 8) + "..." + key.slice(-4);

    try {
      switch (provider) {
        case "deepseek": {
          // Use chat completion with minimal tokens to validate key
          const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
            body: JSON.stringify({
              model: cfg.defaultModel,
              messages: [{ role: "user", content: "ping" }],
              max_tokens: 1,
            }),
          });
          connected = res.ok;
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            error = `HTTP ${res.status}: ${body.slice(0, 150)}`;
          }
          break;
        }
        case "claude": {
          const res = await fetch(`${cfg.baseUrl}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: cfg.defaultModel,
              max_tokens: 10,
              messages: [{ role: "user", content: "ping" }],
            }),
          });
          connected = res.ok;
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            error = `HTTP ${res.status}: ${body.slice(0, 150)}`;
          }
          break;
        }
        case "gemini": {
          const res = await fetch(`${cfg.baseUrl}/models/${cfg.defaultModel}:generateContent?key=${key}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }],
              generationConfig: { maxOutputTokens: 1 },
            }),
          });
          connected = res.ok;
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            error = `HTTP ${res.status}: ${body.slice(0, 150)}`;
          }
          break;
        }
        case "qwen": {
          const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
            body: JSON.stringify({
              model: cfg.defaultModel,
              messages: [{ role: "user", content: "ping" }],
              max_tokens: 1,
            }),
          });
          connected = res.ok;
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            error = `HTTP ${res.status}: ${body.slice(0, 150)}`;
          }
          break;
        }
        case "custom": {
          const res = await fetch(`${key}/api/tags`);
          connected = res.ok;
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            error = `HTTP ${res.status}: ${body.slice(0, 150)}`;
          }
          break;
        }
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Connection failed";
    }

    return NextResponse.json({
      provider: cfg.name,
      connected,
      model: model || cfg.defaultModel,
      keyPrefix,
      error,
    });
  } catch (e) {
    return NextResponse.json(
      { connected: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
