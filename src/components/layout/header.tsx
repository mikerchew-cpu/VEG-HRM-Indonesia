"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-sm font-medium text-gray-600">
        Welcome back, Admin
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">PT Tambang Indonesia</span>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-500 hover:text-danger transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
