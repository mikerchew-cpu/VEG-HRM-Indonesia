import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Get session from request cookies
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
      /https:\/\/(.+)\.supabase\.co/
    )?.[1];

    const authCookie = req.cookies.get(`sb-${projectRef}-auth-token`);
    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(authCookie.value);
    const accessToken = session.access_token;

    // First verify current password by attempting to sign in
    // Get user email from session
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userData = await userRes.json();
    if (!userRes.ok) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Verify current password
    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          email: userData.email,
          password: currentPassword,
        }),
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Update password using admin API
    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return NextResponse.json(
        { error: err.msg || "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
