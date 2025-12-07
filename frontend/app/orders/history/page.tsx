"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../libs/api";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
};

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
};

export default function OrderHistoryPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      window.location.href = "/auth/login";
      return;
    }
  }, []);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const orderResponse = await apiFetch("/api/orders", "GET");
      const userOrders = orderResponse.orders || [];
      setOrdersList(userOrders);

      const productIds: string[] = [];
      userOrders.forEach((order: Order) => {
        order.items.forEach((item) => productIds.push(item.productId));
      });

      const uniqueProductIds = [...new Set(productIds)];

      if (uniqueProductIds.length > 0) {
        const productResponse = await fetch(`${baseApiUrl}/api/products/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: uniqueProductIds }),
        });

        const productPayload = await productResponse.json();
        const productLookup: Record<string, Product> = {};
        productPayload.products.forEach((product: Product) => {
          productLookup[product._id] = product;
        });
        setProductDetails(productLookup);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <section className="py-8">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Order History
        </h1>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-600">Loading your orders...</p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {!isLoading && ordersList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-600">You haven't placed any orders yet.</p>
        </div>
      )}

      {!isLoading && ordersList.length > 0 && (
        <div className="space-y-6">
          {ordersList.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Order #{order.id}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const productInfo = productDetails[item.productId];
                    if (!productInfo) return null;

                    const itemTotal = productInfo.price * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {productInfo.name}
                            </p>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">
                              {productInfo.category}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            ₹{productInfo.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">× {item.quantity}</p>
                          <p className="font-semibold text-slate-900 mt-1">
                            ₹{itemTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-600 font-medium">Order Total</span>
                    <span className="text-xl font-bold text-slate-900">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
