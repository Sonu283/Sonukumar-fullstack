"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../libs/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const cartData = await apiFetch("/api/cart", "GET");
      const cart = cartData.items || [];
      setCartItems(cart);

      const productIds = cart.map((item: any) => item.productId);

      if (productIds.length > 0) {
        const productRes = await fetch(`${API_URL}/api/products/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: productIds }),
        });

        const productData = await productRes.json();

        const map: any = {};
        (productData.products || []).forEach((p: any) => {
          map[p._id] = p;
        });

        setProductsMap(map);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id: number) => {
    try {
      await apiFetch(`/api/cart/${id}`, "DELETE");
      fetchCart();
    } catch (err: any) {
      alert(err.message || "Unable to remove item.");
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const prod = productsMap[item.productId];
    return prod ? sum + prod.price * item.quantity : sum;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto bg-white text-black">
      <h1 className="text-2xl font-semibold mb-6">My Cart</h1>

      {loading && <p>Loading cart...</p>}

      {error && (
        <p className="text-red-700 border border-red-300 bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}

      {!loading && cartItems.length === 0 && (
        <p className="text-gray-700">Your cart is empty.</p>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => {
              const prod = productsMap[item.productId];
              if (!prod) return null;

              return (
                <div
                  key={item.id}
                  className="border rounded shadow-sm bg-white p-4 flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-medium text-black">{prod.name}</h2>
                    <p className="text-sm text-gray-600">{prod.category}</p>
                    <p className="text-lg font-bold mt-1 text-black">
                      ₹{prod.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-5 border rounded shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-3 text-black">Summary</h3>

            <p className="text-black">Total Items: {totalItems}</p>

            <p className="mt-1 text-black">
              Total Amount:
              <span className="font-bold"> ₹{totalAmount.toLocaleString()}</span>
            </p>

            <button
              onClick={checkout}
              className="w-full mt-5 bg-black text-white py-3 rounded hover:bg-gray-900 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

async function checkout() {
  try {
    await apiFetch("/api/checkout", "POST");
    alert("Order placed successfully!");
    window.location.href = "/orders";
  } catch (err: any) {
    alert(err.message || "Checkout failed.");
  }
}
