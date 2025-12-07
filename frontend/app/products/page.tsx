"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../libs/api";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(8);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [errorMessage, setErrorMessage] = useState("");

  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const queryParams = new URLSearchParams({
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
        page: String(pageIndex),
        limit: String(pageSize),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams.toString()}`,
        {
          headers: {
            "x-sort": sortOrder,
          },
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load products");
      }

      const products = payload.products || [];

      if (products.length === 0) {
        setHasMore(false);

        if (pageIndex > 1) {
          setPageIndex((prev) => prev - 1);
        }

        return;
      }

      setHasMore(true);
      setItems(products);
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, pageIndex, sortOrder]);

  return (
    <section className="py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse and add items to your cart. Use filters to narrow down results.
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
        <input
          type="search"
          placeholder="Search products by name…"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-64"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPageIndex(1);
          }}
        />

        <input
          type="text"
          placeholder="Filter by category…"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-56"
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            setPageIndex(1);
          }}
        />

        <select
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-52"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value === "asc" ? "asc" : "desc")
          }
        >
          <option value="desc">Price: High to Low</option>
          <option value="asc">Price: Low to High</option>
        </select>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-600">Loading products…</p>
      ) : (
        <>
          {items.length === 0 && (
            <p className="text-sm text-slate-600">No products found.</p>
          )}

          {items.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((product) => (
                <article
                  key={product._id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {product.category || "Uncategorized"}
                  </p>
                  <p className="mt-3 text-lg font-bold text-emerald-700">
                    ₹{product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addToCart(product._id)}
                    className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              <button
                disabled={pageIndex <= 1}
                onClick={() => setPageIndex((prev) => prev - 1)}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs text-slate-500">Page {pageIndex}</span>

              <button
                onClick={() => {
                  if (hasMore) setPageIndex((prev) => prev + 1);
                  else alert("No more products");
                }}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

async function addToCart(productId: string) {
  try {
    await apiFetch("/api/cart/add", "POST", { productId, quantity: 1 });
    alert("Added to cart!");
  } catch (error: any) {
    alert(error.message || "Failed to add to cart");
  }
}
