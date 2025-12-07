"use client";

import { useState } from "react";
import { apiFetch } from "../../../libs/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/auth/login", "POST", {
        email: userEmail,
        password: userPassword,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("role", response.user.role);
        window.dispatchEvent(new Event("authChange"));
      }

      router.push("/products");
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to your account
            </p>
          </div>

          {authError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <a href="/auth/signup" className="font-medium text-slate-900 hover:text-slate-700">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
