import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const deepseek = process.env.DEEPSEEK_API_KEY;

  return NextResponse.json({
    supabaseUrl: url ? url.slice(0, 30) + "..." : "NOT SET",
    supabaseUrlValid: url?.startsWith("https://") ?? false,
    anonKeySet: !!key,
    anonKeyPrefix: key ? key.slice(0, 10) + "..." : "NOT SET",
    deepseekSet: !!deepseek,
  });
}
