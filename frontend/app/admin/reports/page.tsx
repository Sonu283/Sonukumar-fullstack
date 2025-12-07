"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../libs/api";

type RevenueRow = {
  date: string;
  total_revenue: number;
};

type CategoryRow = {
  _id: string;
  totalProducts: number;
};

export default function ReportsPage() {
  const [dailyRevenue, setDailyRevenue] = useState<RevenueRow[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      window.location.href = "/auth/login";
    }
  }, []);

  const loadReportData = async () => {
    try {
      setErrorMsg("");
      setIsLoading(true);

      const reportData = await apiFetch("/api/reports", "GET");

      setDailyRevenue(reportData.sqlReport || []);
      setCategoryStats(reportData.mongoReport || []);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Revenue and product analytics overview
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-600">Loading reports...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Daily Revenue Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Daily Revenue Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total revenue by date from orders database
              </p>
            </div>

            <div className="overflow-x-auto">
              {dailyRevenue.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No revenue data available</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Date
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dailyRevenue.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-700">
                          ₹{row.total_revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Category Stats Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Product Distribution by Category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total products organized by category from product database
              </p>
            </div>

            <div className="overflow-x-auto">
              {categoryStats.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No product data available</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Category
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                        Products
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categoryStats.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {row._id}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                          {row.totalProducts.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
