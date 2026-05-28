"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect back to original path or dashboard
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-charcoal">Sign In</h2>
        <p className="text-sm text-gray-500 mt-1">
          Masuk ke dashboard HRM Anda
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-tiffany focus:border-transparent
                     placeholder:text-gray-400"
          placeholder="admin@perusahaan-tambang.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-tiffany focus:border-transparent
                     placeholder:text-gray-400"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-sm text-danger bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
          {error === "Invalid login credentials"
            ? "Email atau password salah. Silakan coba lagi."
            : error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-tiffany text-white font-medium rounded-lg text-sm 
                   hover:bg-tiffany-dark transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memproses...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
