import React, { useEffect, useState } from "react";
import ProductFormModal from "../Components/ProductFormModal";

const emptyForm = {
  name: "",
  category: "",
  image: "",
  oldPrice: "",
  newPrice: "",
  variants: "",
  colors: "",
  description: "",
  isActive: true,
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  lowStockThreshold: 5,
};

const Products = () => {
  const [state, setState] = useState({
    loading: true,
    products: [],
    pages: 1,
    page: 1,
  });
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    status: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async (page = 1) => {
    const token = localStorage.getItem("admin_token");
    const query = new URLSearchParams({
      page,
      limit: 20,
      ...(filter.search && { search: filter.search }),
      ...(filter.category && { category: filter.category }),
      ...(filter.status && { status: filter.status }),
    }).toString();

    setState((p) => ({ ...p, loading: true }));
    const res = await fetch(`/api/admin/products?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json().catch(() => ({}));
    setState({
      loading: false,
      products: data.products || [],
      pages: data.pages || 1,
      page: data.page || page,
    });
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category, filter.status]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setError("");
    setForm({
      name: p.name || "",
      category: p.category || "",
      image: p.image || "",
      oldPrice: p.oldPrice ?? "",
      newPrice: p.newPrice ?? "",
      variants: (p.variants || []).join(", "),
      colors: (p.colors || []).join(", "),
      description: p.description || "",
      isActive: p.isActive ?? true,
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isFeatured: p.isFeatured ?? false,
      lowStockThreshold: p.lowStockThreshold ?? 5,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const adminToken = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        setError(data?.message || "Image upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const adminToken = localStorage.getItem("admin_token");

    const body = {
      name: form.name.trim(),
      category: form.category,
      image: form.image.trim(),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      newPrice: form.newPrice ? Number(form.newPrice) : 0,
      variants: form.variants
        ? form.variants
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : [],
      colors: form.colors
        ? form.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      description: form.description.trim(),
      isActive: form.isActive,
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isFeatured: form.isFeatured,
      lowStockThreshold: Number(form.lowStockThreshold || 5),
    };

    try {
      const url = editing
        ? `/api/admin/products/${editing._id}`
        : "/api/admin/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || `Save failed (${res.status})`);
        return;
      }
      closeForm();
      fetchProducts(editing ? state.page : 1);
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p) => {
    const adminToken = localStorage.getItem("admin_token");
    const confirmMessage = p.isActive
      ? "Deactivate this product?"
      : "Reactivate this product?";
    if (!confirm(confirmMessage)) return;
    await fetch(`/api/admin/products/${p._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    fetchProducts(state.page);
  };

  const hardDeactivate = async (id) => {
    if (!confirm("Deactivate this product?")) return;
    const adminToken = localStorage.getItem("admin_token");
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    });
    fetchProducts(state.page);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2>Products</h2>
          <p className="text-myblack/70">Manage your catalog.</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Add product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchProducts(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.category}
          onChange={(e) => setFilter((p) => ({ ...p, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="iphone">iPhone</option>
          <option value="ipad">iPad</option>
          <option value="laptop">Laptop</option>
          <option value="android">Android</option>
        </select>
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.status}
          onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {state.loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : state.products.length === 0 ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  No products found.
                </td>
              </tr>
            ) : (
              state.products.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-10 w-10 rounded-xl object-cover"
                        src={
                          p.image?.startsWith("http")
                            ? p.image
                            : `http://localhost:5000${p.image || ""}`
                        }
                        alt={p.name}
                      />
                      <div>
                        <p className="font-productSansReg text-myblack">
                          {p.name}
                        </p>
                        <p className="text-xs text-myblack/60">{p._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-myblack/70">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-myblack">
                    ₱{Number(p.newPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-full border border-myblack/10 bg-white px-4 py-2 text-sm hover:border-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(p)}
                      className="rounded-full border border-myblack/10 bg-white px-4 py-2 text-sm hover:border-emerald-500"
                    >
                      {p.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => hardDeactivate(p._id)}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-600 hover:border-rose-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: state.pages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts(i + 1)}
            className={`rounded-full px-4 py-2 ${
              state.page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white ring-1 ring-myblack/10 hover:ring-blue-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ProductFormModal
        open={formOpen}
        editing={editing}
        form={form}
        saving={saving}
        uploading={uploading}
        error={error}
        onClose={closeForm}
        onSubmit={submitForm}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default Products;
