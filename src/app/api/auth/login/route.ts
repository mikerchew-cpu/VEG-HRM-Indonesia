import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    // Detect if input is email or phone
    const isEmail = login.includes("@");
    const body = isEmail
      ? { email: login, password }
      : { phone: login.startsWith("+") ? login : `+62${login.replace(/^0+/, "")}`, password };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error_description || data.msg || data.error || "Invalid login credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        phone: data.user?.phone,
      },
      redirect: "/",
    });

    const cookieBase = {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    };

    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
      /https:\/\/(.+)\.supabase\.co/
    )?.[1];

    const authToken = JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    });

    response.cookies.set(`sb-${projectRef}-auth-token`, authToken, cookieBase);
    response.cookies.set("sb-access-token", data.access_token, cookieBase);
    response.cookies.set("sb-refresh-token", data.refresh_token, cookieBase);

    return response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
