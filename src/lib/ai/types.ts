export type AiProvider = "deepseek" | "claude" | "gemini" | "qwen" | "custom";

export interface AiRequest {
  provider: AiProvider;
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AiResponse {
  content: string;
  model: string;
  provider: AiProvider;
  tokensUsed: number;
  responseTimeMs: number;
}

export interface AiProviderConfig {
  name: string;
  models: string[];
  defaultModel: string;
  envKey: string;
  baseUrl: string;
  docsUrl: string;
  color: string;
}
