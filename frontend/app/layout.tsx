import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Full-stack E-Commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen from-slate-50 via-slate-100 to-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 bg-amber-50 border-5 border-double border-red-500 rounded-4xl m-7">
          {children}
        </main>
      </body>
    </html>
  );
}
