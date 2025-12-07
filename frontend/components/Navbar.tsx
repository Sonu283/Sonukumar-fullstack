"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadUser = () => {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    setUserName(name);
    setUserRole(role);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("authChange", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("authChange"));

    window.location.href = "/auth/login";
  };

  if (!isLoaded) return null;

  const isAdmin = userRole === "admin";

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        
        <Link href="/" className="text-lg font-semibold text-slate-900 hover:text-slate-700">
          MyShop
        </Link>

        <div className="flex items-center gap-3 text-sm sm:gap-5">

          {isAdmin && (
            <>
              <Link href="/admin/reports" className="hover:underline text-slate-700">
                Reports
              </Link>

              <Link href="/admin/products" className="hover:underline text-slate-700">
                Manage Products
              </Link>
            </>
          )}

          <Link href="/products" className="hover:underline text-slate-700">
            Products
          </Link>

          <Link href="/cart" className="hover:underline text-slate-700">
            Cart
          </Link>

          <Link href="/orders/history" className="hover:underline text-slate-700">
            History
          </Link>

          {userName ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-600">
                Hi, <span className="font-medium text-slate-800">{userName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="px-3 py-1 text-xs rounded-full hover:bg-slate-100">
                Login
              </Link>

              <Link href="/auth/signup" className="px-3 py-1 text-xs rounded-full bg-slate-900 text-white hover:bg-slate-800">
                Sign Up
              </Link>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
}
