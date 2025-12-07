"use client";

export default function OrdersPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white px-6 py-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
          <span className="text-sm font-semibold text-emerald-700">OK</span>
        </div>

        <h1 className="text-xl font-semibold text-emerald-800">
          Order placed successfully
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Thank you for shopping with us. Your order has been received and is now being processed.
        </p>

        <a
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Continue shopping
        </a>
      </div>
    </section>
  );
}
  