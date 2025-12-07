"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../libs/api";

type Product = {
  _id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
};

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [formSku, setFormSku] = useState("");
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState<number | string>("");
  const [formCategory, setFormCategory] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("role");
      if (userRole !== "admin") {
        window.location.href = "/auth/login";
      }
    }
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const data = await apiFetch("/api/products", "GET");
      setProductList(data.products || []);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/products/create", "POST", {
        sku: formSku,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
      });
      alert("Product created successfully!");
      resetForm();
      loadProducts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const removeProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/api/products/delete/${productId}`, "DELETE");
      loadProducts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product._id);
    setFormSku(product.sku);
    setFormName(product.name);
    setFormPrice(product.price);
    setFormCategory(product.category);
  };

  const saveChanges = async () => {
    try {
      await apiFetch(`/api/products/update/${editingId}`, "PUT", {
        sku: formSku,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
      });
      alert("Product updated successfully!");
      cancelEdit();
      loadProducts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormSku("");
    setFormName("");
    setFormPrice("");
    setFormCategory("");
  };

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Product Management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add, edit, and manage your product catalog
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-600">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Add Product Form */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-8">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
            </div>
            <form onSubmit={editingId ? saveChanges : createProduct} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter SKU"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter product name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="0.00"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2 space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {editingId ? "Save Changes" : "Create Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Product Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                {productList.length} products total
              </p>
            </div>
            
            {productList.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-500">No products found. Add your first product above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">SKU</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productList.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-slate-900 max-w-64 truncate">{product.name}</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-700">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => startEditing(product)}
                              className="px-3 py-1.5 rounded-md bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeProduct(product._id)}
                              className="px-3 py-1.5 rounded-md bg-red-600 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
