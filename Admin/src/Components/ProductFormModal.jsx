import React from "react";

const ProductFormModal = ({
  open,
  editing,
  form,
  saving,
  uploading,
  error,
  onClose,
  onSubmit,
  onChange,
  onImageUpload,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-myblack">
              {editing ? "Edit product" : "Add product"}
            </h3>
            <p className="text-xs text-myblack/60">
              Basic details and flags only. Inventory is adjusted on the
              Inventory page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-myblack/70">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-myblack/70">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              >
                <option value="">Select category</option>
                <option value="iphone">iPhone</option>
                <option value="ipad">iPad</option>
                <option value="android">Android</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-myblack/70">Product image</label>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="text-xs"
              />
              {uploading && (
                <span className="text-xs text-myblack/60">Uploading...</span>
              )}
            </div>
            <input
              name="image"
              value={form.image}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-xs"
              placeholder="/uploads/12345-iphone17porange.png or external URL"
            />
            {form.image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={
                    form.image?.startsWith("http")
                      ? form.image
                      : `http://localhost:5000${form.image || ""}`
                  }
                  alt="Preview"
                  className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/5"
                />
                <span className="truncate text-xs text-myblack/60">
                  {form.image}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs text-myblack/70">New price (₱)</label>
              <input
                name="newPrice"
                type="number"
                min="0"
                value={form.newPrice}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-myblack/70">Old price (₱)</label>
              <input
                name="oldPrice"
                type="number"
                min="0"
                value={form.oldPrice}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-myblack/70">Stocks</label>
              <input
                name="stocks"
                type="number"
                min="0"
                value={form.stocks}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-myblack/70">
                Low stock threshold
              </label>
              <input
                name="lowStockThreshold"
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-myblack/70">
                Variants (comma-separated)
              </label>
              <input
                name="variants"
                value={form.variants}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
                placeholder="128GB, 256GB, 512GB"
              />
            </div>
            <div>
              <label className="text-xs text-myblack/70">
                Colors (comma-separated)
              </label>
              <input
                name="colors"
                value={form.colors}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
                placeholder="Black, White, Blue"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-myblack/70">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs text-myblack/80">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                className="h-4 w-4 rounded border-myblack/20"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-xs text-myblack/80">
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={onChange}
                className="h-4 w-4 rounded border-myblack/20"
              />
              Mark as new
            </label>
            <label className="flex items-center gap-2 text-xs text-myblack/80">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={onChange}
                className="h-4 w-4 rounded border-myblack/20"
              />
              Best seller
            </label>
            <label className="flex items-center gap-2 text-xs text-myblack/80">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
                className="h-4 w-4 rounded border-myblack/20"
              />
              Featured
            </label>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-myblack/10 hover:ring-slate-400"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving
                ? editing
                  ? "Saving..."
                  : "Creating..."
                : editing
                ? "Save changes"
                : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;

