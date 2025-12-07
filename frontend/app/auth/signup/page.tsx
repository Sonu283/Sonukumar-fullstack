"use client";

import { useState } from "react";
import { apiFetch } from "../../../libs/api";

export default function SignupPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      await apiFetch("/api/auth/signup", "POST", {
        name: userName,
        email: userEmail,
        password: userPassword,
        adminKey: adminCode || undefined,
      });

      setFormSuccess("Account created successfully. You can now login.");
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setAdminCode("");
    } catch (error: any) {
      setFormError(error.message);
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
              Create Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join us today and start shopping
            </p>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{formError}</p>
            </div>
          )}

          {formSuccess && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">{formSuccess}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="user-name"
                type="text"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="user-email"
                type="email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="user-password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="user-password"
                type="password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-code" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Code (optional)
              </label>
              <input
                id="admin-code"
                type="password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                placeholder="Leave empty for customer account"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
