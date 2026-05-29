import type { AiRequest, AiResponse, AiProvider } from "./types";
import { PROVIDER_CONFIGS, REPORT_PROMPTS } from "./config";

async function callDeepSeek(req: AiRequest): Promise<AiResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const start = Date.now();
  const res = await fetch(`${PROVIDER_CONFIGS.deepseek.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: req.model || PROVIDER_CONFIGS.deepseek.defaultModel,
      messages: req.messages,
      temperature: req.temperature ?? 0.3,
      max_tokens: req.max_tokens ?? 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return {
    content: json.choices[0].message.content,
    model: json.model,
    provider: "deepseek",
    tokensUsed: json.usage?.total_tokens ?? 0,
    responseTimeMs: Date.now() - start,
  };
}

async function callClaude(req: AiRequest): Promise<AiResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const start = Date.now();
  const systemMsg = req.messages.find((m) => m.role === "system")?.content;
  const userMsgs = req.messages.filter((m) => m.role !== "system");

  const body: Record<string, unknown> = {
    model: req.model || PROVIDER_CONFIGS.claude.defaultModel,
    max_tokens: req.max_tokens ?? 2048,
    messages: userMsgs.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
  };
  if (systemMsg) body.system = systemMsg;

  const res = await fetch(`${PROVIDER_CONFIGS.claude.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return {
    content: json.content[0].text,
    model: json.model,
    provider: "claude",
    tokensUsed: (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0),
    responseTimeMs: Date.now() - start,
  };
}

async function callGemini(req: AiRequest): Promise<AiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const start = Date.now();
  const model = req.model || PROVIDER_CONFIGS.gemini.defaultModel;
  const systemMsg = req.messages.find((m) => m.role === "system")?.content;
  const contents = req.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { temperature: req.temperature ?? 0.3, maxOutputTokens: req.max_tokens ?? 2048 },
  };
  if (systemMsg) body.systemInstruction = { parts: [{ text: systemMsg }] };

  const res = await fetch(
    `${PROVIDER_CONFIGS.gemini.baseUrl}/models/${model}:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return {
    content: json.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response",
    model,
    provider: "gemini",
    tokensUsed: json.usageMetadata?.totalTokenCount ?? 0,
    responseTimeMs: Date.now() - start,
  };
}

async function callCustom(req: AiRequest): Promise<AiResponse> {
  const endpoint = process.env.CUSTOM_AI_ENDPOINT || "http://localhost:11434";
  const start = Date.now();

  const res = await fetch(`${endpoint}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: req.model || "llama3",
      messages: req.messages,
      options: { temperature: req.temperature ?? 0.3 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Custom AI error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return {
    content: json.message?.content ?? json.response ?? "No response",
    model: json.model ?? req.model,
    provider: "custom",
    tokensUsed: 0,
    responseTimeMs: Date.now() - start,
  };
}

async function callQwen(req: AiRequest): Promise<AiResponse> {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) throw new Error("QWEN_API_KEY not configured");

  const start = Date.now();
  const res = await fetch(`${PROVIDER_CONFIGS.qwen.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: req.model || PROVIDER_CONFIGS.qwen.defaultModel,
      messages: req.messages,
      temperature: req.temperature ?? 0.3,
      max_tokens: req.max_tokens ?? 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Qwen API error (${res.status}): ${err}`);
  }

  const json = await res.json();
  return {
    content: json.choices?.[0]?.message?.content ?? "No response",
    model: json.model ?? req.model,
    provider: "qwen",
    tokensUsed: json.usage?.total_tokens ?? 0,
    responseTimeMs: Date.now() - start,
  };
}

export async function callAi(req: AiRequest): Promise<AiResponse> {
  switch (req.provider) {
    case "deepseek":
      return callDeepSeek(req);
    case "claude":
      return callClaude(req);
    case "gemini":
      return callGemini(req);
    case "qwen":
      return callQwen(req);
    case "custom":
      return callCustom(req);
    default:
      throw new Error(`Unknown AI provider: ${req.provider}`);
  }
}

export async function crossValidate(
  reportType: string,
  data: string,
  providers: AiProvider[]
): Promise<{ provider: AiProvider; response: AiResponse }[]> {
  const systemPrompt = REPORT_PROMPTS[reportType] ?? "Analyze the following HR data and provide insights.";
  const results = await Promise.allSettled(
    providers.map((p) =>
      callAi({
        provider: p,
        model: PROVIDER_CONFIGS[p].defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Data to analyze:\n\n${data}\n\nProvide your analysis and recommendations.` },
        ],
      }).then((response) => ({ provider: p, response }))
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{ provider: AiProvider; response: AiResponse }> => r.status === "fulfilled")
    .map((r) => r.value);
}


