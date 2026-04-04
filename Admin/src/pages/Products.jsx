import React, { useEffect, useState } from "react";
import ProductFormModal from "../Components/ProductFormModal";
import ProductTable from "../Components/ProductTable";

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
      description: p.description || "",
      isActive: p.isActive ?? true,
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isFeatured: p.isFeatured ?? false,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      stockItems: (p.stockItems || []).map(s => {
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
      stockItems: [...(prev.stockItems || []), { color: "", storage: "", storageUnit: "GB", ram: "", stock: 0, newPrice: "", oldPrice: "" }],
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
    
    const hasEmptySpec = (form.specifications || []).some(s => !s.key.trim() || !s.value.trim());
    if (hasEmptySpec) {
      setError("Please fill in all specification fields before saving.");
      return;
    }

    setSaving(true);
    setError("");
    const adminToken = localStorage.getItem("admin_token");

    const validStockItems = (form.stockItems || []).filter(
      (s) => s.color.trim() !== "" && (s.storage?.trim() !== "" || s.ram?.trim() !== "")
    );

    const body = {
      name: form.name.trim(),
      category: form.category,
      image: form.image.trim(),
      oldPrice: validStockItems.length > 0 ? undefined : form.oldPrice ? Number(form.oldPrice) : undefined,
      newPrice: validStockItems.length > 0 ? Math.min(...validStockItems.map(s => Number(s.newPrice) || Infinity)) : (form.newPrice ? Number(form.newPrice) : 0),
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
          s.storage?.toString().trim() ? `${s.storage.toString().trim()}${s.storageUnit || 'GB'}` : ""
        ].filter(Boolean).join(" + "),
        stock: Number(s.stock || 0),
        newPrice: Number(s.newPrice || 0),
        oldPrice: s.oldPrice ? Number(s.oldPrice) : undefined,
      })),
      variants: [...new Set(validStockItems.map((s) => [
        s.ram?.toString().trim() ? `${s.ram.toString().trim()}GB` : "",
        s.storage?.toString().trim() ? `${s.storage.toString().trim()}${s.storageUnit || 'GB'}` : ""
      ].filter(Boolean).join(" + ")))],
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
          <option value="">All</option>
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
