import React, { useEffect, useState, useCallback } from "react";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import ProductFormModal from "../Components/ProductFormModal";
import ProductTable from "../Components/ProductTable";
import { FaFilter, FaTimes } from "react-icons/fa";

const emptyForm = {
  name: "",
  category: "",
  image: "",
  oldPrice: "",
  newPrice: "",
  description: "",
  isActive: true,
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  lowStockThreshold: 5,
  stockItems: [],
  specifications: [],
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

  // ── Low-stock variant filter ──────────────────────────────────────────
  const [showLowStockFilter, setShowLowStockFilter] = useState(false);
  const [lowStockRows, setLowStockRows] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);

  const fetchLowStockRows = useCallback(async () => {
    setLowStockLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/products/low-stock", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const products = Array.isArray(data) ? data : [];
      // Flatten to only the specific variants that are at/below threshold
      const rows = products.flatMap((p) =>
        (p.stockItems || []).flatMap((s, idx) => {
          const threshold = p.lowStockThreshold ?? 5;
          if (s.stock <= threshold) {
            return [
              { key: `${p._id}-${idx}`, product: p, stockItem: s, threshold },
            ];
          }
          return [];
        })
      );
      setLowStockRows(rows);
    } catch (e) {
      console.error("Low-stock fetch error:", e);
    } finally {
      setLowStockLoading(false);
    }
  }, []);

  const toggleLowStockFilter = () => {
    if (!showLowStockFilter) fetchLowStockRows();
    setShowLowStockFilter((prev) => !prev);
  };
  // ─────────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(
    async (page = 1) => {
      const query = new URLSearchParams({
        page,
        limit: 20,
        ...(filter.search && { search: filter.search }),
        ...(filter.category && { category: filter.category }),
        ...(filter.status && { status: filter.status }),
      }).toString();

      setState((p) => ({ ...p, loading: true }));
      try {
        const res = await fetchWithRetry(`/api/admin/products?${query}`);
        const data = await res.json().catch(() => ({}));
        setState({
          loading: false,
          products: data.products || [],
          pages: data.pages || 1,
          page: data.page || page,
        });
      } catch {
        setState((p) => ({ ...p, loading: false }));
      }
    },
    [filter.search, filter.category, filter.status]
  );

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
      description: p.description || "",
      isActive: p.isActive ?? true,
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isFeatured: p.isFeatured ?? false,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      stockItems: (p.stockItems || []).map((s) => {
        const [ramRaw, ...storageParts] = (s.variant || "").split(" + ");
        let ramVal = (ramRaw || "").trim().replace(/GB$/i, "");
        let storageRawStr = storageParts.join(" + ");
        let storageVal = (storageRawStr || "").trim();
        let storageUnit = "GB";
        if (storageVal.toUpperCase().endsWith("TB")) {
          storageUnit = "TB";
          storageVal = storageVal.replace(/TB$/i, "").trim();
        } else {
          storageVal = storageVal.replace(/GB$/i, "").trim();
        }
        return {
          color: s.color || "",
          storage: storageVal || "",
          storageUnit: storageUnit,
          ram: ramVal || "",
          stock: s.stock || 0,
          newPrice: s.newPrice ?? "",
          oldPrice: s.oldPrice ?? "",
        };
      }),
      specifications: p.specifications || [],
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

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index][field] = value;
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleStockItemChange = (index, field, value) => {
    setForm((prev) => {
      const newItems = [...(prev.stockItems || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, stockItems: newItems };
    });
  };

  const addStockItem = () => {
    setForm((prev) => ({
      ...prev,
      stockItems: [
        ...(prev.stockItems || []),
        {
          color: "",
          storage: "",
          storageUnit: "GB",
          ram: "",
          stock: 0,
          newPrice: "",
          oldPrice: "",
        },
      ],
    }));
  };

  const removeStockItem = (index) => {
    setForm((prev) => {
      const newItems = [...(prev.stockItems || [])];
      newItems.splice(index, 1);
      return { ...prev, stockItems: newItems };
    });
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: "", value: "" }],
    }));
  };

  const removeSpec = (index) => {
    setForm((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs.splice(index, 1);
      return { ...prev, specifications: newSpecs };
    });
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
      const res = await fetchWithRetry("/api/admin/products/upload-image", {
        method: "POST",
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

    const hasEmptySpec = (form.specifications || []).some(
      (s) => !s.key.trim() || !s.value.trim()
    );
    if (hasEmptySpec) {
      setError("Please fill in all specification fields before saving.");
      return;
    }

    setSaving(true);
    setError("");
    const adminToken = localStorage.getItem("admin_token");

    const validStockItems = (form.stockItems || []).filter(
      (s) =>
        s.color.trim() !== "" &&
        (s.storage?.trim() !== "" || s.ram?.trim() !== "")
    );

    const body = {
      name: form.name.trim(),
      category: form.category,
      image: form.image.trim(),
      oldPrice:
        validStockItems.length > 0
          ? undefined
          : form.oldPrice
          ? Number(form.oldPrice)
          : undefined,
      newPrice:
        validStockItems.length > 0
          ? Math.min(
              ...validStockItems.map((s) => Number(s.newPrice) || Infinity)
            )
          : form.newPrice
          ? Number(form.newPrice)
          : 0,
      description: form.description.trim(),
      isActive: form.isActive,
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      isFeatured: form.isFeatured,
      lowStockThreshold: Number(form.lowStockThreshold || 5),
      stockItems: validStockItems.map((s) => ({
        color: s.color.trim(),
        variant: [
          s.ram?.toString().trim() ? `${s.ram.toString().trim()}GB` : "",
          s.storage?.toString().trim()
            ? `${s.storage.toString().trim()}${s.storageUnit || "GB"}`
            : "",
        ]
          .filter(Boolean)
          .join(" + "),
        stock: Number(s.stock || 0),
        newPrice: Number(s.newPrice || 0),
        oldPrice: s.oldPrice ? Number(s.oldPrice) : undefined,
      })),
      variants: [
        ...new Set(
          validStockItems.map((s) =>
            [
              s.ram?.toString().trim() ? `${s.ram.toString().trim()}GB` : "",
              s.storage?.toString().trim()
                ? `${s.storage.toString().trim()}${s.storageUnit || "GB"}`
                : "",
            ]
              .filter(Boolean)
              .join(" + ")
          )
        ),
      ],
      colors: [...new Set(validStockItems.map((s) => s.color.trim()))],
      stocks: validStockItems.reduce((sum, s) => sum + Number(s.stock || 0), 0),
      specifications: (form.specifications || []).filter(
        (s) => s.key.trim() !== "" && s.value.trim() !== ""
      ),
    };

    try {
      const url = editing
        ? `/api/admin/products/${editing._id}`
        : "/api/admin/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetchWithRetry(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
    await fetchWithRetry(`/api/admin/products/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    fetchProducts(state.page);
  };

  const hardDeactivate = async (id) => {
    await fetchWithRetry(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts(state.page);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2>Inventory</h2>
          <p className="text-myblack/70">Manage your catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* ── Low Stock Variant Filter toggle ── */}
          <button
            onClick={toggleLowStockFilter}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ring-1 ${
              showLowStockFilter
                ? "bg-rose-600 text-white ring-rose-600 shadow-md shadow-rose-200"
                : "bg-white text-slate-600 ring-slate-200 hover:ring-rose-400 hover:text-rose-600"
            }`}
          >
            {showLowStockFilter ? (
              <FaTimes className="text-xs" />
            ) : (
              <FaFilter className="text-xs" />
            )}
            {showLowStockFilter ? "Clear Filter" : "Low Stock Variants"}
            {!showLowStockFilter && lowStockRows.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">
                {lowStockRows.length}
              </span>
            )}
          </button>

          <button
            onClick={openCreate}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Add product
          </button>
        </div>
      </div>

      {/* ── Low Stock Variant Panel ─────────────────────────────────── */}
      {showLowStockFilter && (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-rose-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-rose-50 border-b border-rose-100">
            <p className="text-sm font-semibold text-rose-700">
              {lowStockLoading
                ? "Loading low-stock variants…"
                : `${lowStockRows.length} low-stock variant${
                    lowStockRows.length !== 1 ? "s" : ""
                  } (stock ≤ threshold)`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Threshold
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockLoading ? (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-slate-400"
                      colSpan={5}
                    >
                      Loading…
                    </td>
                  </tr>
                ) : lowStockRows.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-6 text-sm text-slate-400 text-center"
                      colSpan={5}
                    >
                      No low-stock variants found.
                    </td>
                  </tr>
                ) : (
                  lowStockRows.map(
                    ({ key, product: p, stockItem: s, threshold }) => (
                      <tr
                        key={key}
                        className="bg-rose-50/30 hover:bg-rose-50/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-10 w-10 rounded-xl object-cover"
                              src={p.image}
                              alt={p.name}
                            />
                            <p className="font-productSansReg text-myblack text-sm">
                              {p.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-myblack/70">
                          {s.variant}
                        </td>
                        <td className="px-6 py-4 text-sm text-myblack/70">
                          {s.color}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-rose-600 font-semibold text-sm">
                            {s.stock}
                          </span>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">
                            {s.stock === 0 ? "Out" : "Low"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          ≤ {threshold}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            fetchProducts(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.category}
          onChange={(e) =>
            setFilter((p) => ({ ...p, category: e.target.value }))
          }
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
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <ProductTable
        loading={state.loading}
        products={state.products}
        onEdit={openEdit}
        onToggle={toggleActive}
        onRemove={hardDeactivate}
      />

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
        onSpecChange={handleSpecChange}
        addSpec={addSpec}
        removeSpec={removeSpec}
        handleStockItemChange={handleStockItemChange}
        addStockItem={addStockItem}
        removeStockItem={removeStockItem}
      />
    </div>
  );
};

export default Products;
