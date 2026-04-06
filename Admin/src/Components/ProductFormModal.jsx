import React, { useEffect } from "react";
import { FaTimes, FaToggleOff, FaToggleOn } from "react-icons/fa";

const mobileTemplate = [
  "Processor (Chipset)",
  "Graphics (GPU)",
  "Display",
  "Rear Camera",
  "Front Camera",
  "Memory (RAM)",
  "Storage",
  "Operating System (OS)",
  "Battery",
  "Charging",
  "Build & Design",
  "Dimensions & Weight",
  "Connectivity",
  "SIM & Network",
  "Sensors & Security",
  "Audio",
  "Other Features",
];

const laptopTemplate = [
  "Processor (CPU)",
  "Graphics (GPU)",
  "Display",
  "Memory (RAM)",
  "Storage",
  "Operating System (OS)",
  "Battery",
  "Build & Design",
  "Ports & Connectivity",
  "Camera & Audio",
  "Keyboard & Input",
  "Other Features",
];

const allTemplates = [...mobileTemplate, ...laptopTemplate];

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
  onSpecChange,
  addSpec,
  removeSpec,
  handleStockItemChange,
  addStockItem,
  removeStockItem,
  disableBestSeller,
  disableFeatured,
  disableNew,
}) => {
  useEffect(() => {
    if (!form.category) return;
    const expectedTemplate =
      form.category === "laptop"
        ? laptopTemplate
        : ["iphone", "ipad", "android"].includes(form.category)
        ? mobileTemplate
        : null;
    if (!expectedTemplate) return;

    const currentSpecs = form.specifications || [];
    const currentKeys = currentSpecs.map((s) => s.key);

    let hasChanges = false;
    const newSpecs = [...currentSpecs];

    expectedTemplate.forEach((key) => {
      if (!currentKeys.includes(key)) {
        newSpecs.push({ key, value: "" });
        hasChanges = true;
      }
    });

    if (hasChanges && onChange) {
      onChange({ target: { name: "specifications", value: newSpecs } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h3 className="font-productSansReg text-myblack text-lg">
            {editing ? "Edit product" : "Add product"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <FaTimes className="text-myblack/60" />
          </button>
        </div>

        <div className="p-6 pb-0">
          <p className="mb-4 mt-[-10px] text-xs text-myblack/60">
            Basic details and flags only. Inventory is adjusted on the Inventory
            page.
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 px-6 pb-6">
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
                        : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${form.image || ""}`
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-myblack/80">
                  Variations & Stock
                </label>
                <button
                  type="button"
                  onClick={addStockItem}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add Variation
                </button>
              </div>

              {(form.stockItems || []).length === 0 ? (
                <p className="text-xs text-myblack/50 italic">
                  No variations added.
                </p>
              ) : (
                <div className="space-y-2">
                  {(form.stockItems || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl ring-1 ring-slate-100"
                    >
                      <input
                        placeholder="Color"
                        value={item.color}
                        onChange={(e) =>
                          handleStockItemChange(index, "color", e.target.value)
                        }
                        required
                        className="flex-1 min-w-[80px] rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                      />
                      <div className="relative flex-1 min-w-[80px]">
                        <input
                          type="number"
                          min="0"
                          placeholder="RAM"
                          value={item.ram}
                          onChange={(e) =>
                            handleStockItemChange(index, "ram", e.target.value)
                          }
                          className="w-full rounded-xl border border-myblack/10 bg-white px-3 py-1.5 pr-8 text-xs"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-myblack/50 pointer-events-none">
                          GB
                        </span>
                      </div>
                      <div className="relative flex-1 min-w-[110px]">
                        <input
                          type="number"
                          min="0"
                          placeholder="Storage"
                          value={item.storage}
                          onChange={(e) =>
                            handleStockItemChange(
                              index,
                              "storage",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-myblack/10 bg-white px-3 py-1.5 pr-12 text-xs"
                        />
                        <select
                          value={item.storageUnit || "GB"}
                          onChange={(e) =>
                            handleStockItemChange(
                              index,
                              "storageUnit",
                              e.target.value
                            )
                          }
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent text-[11px] text-slate-500 cursor-pointer outline-none border-none pr-1 focus:ring-0"
                        >
                          <option value="GB">GB</option>
                          <option value="TB">TB</option>
                        </select>
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={item.stock}
                        onChange={(e) =>
                          handleStockItemChange(index, "stock", e.target.value)
                        }
                        required
                        className="flex-[0.5] min-w-[70px] rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={item.newPrice}
                        onChange={(e) =>
                          handleStockItemChange(
                            index,
                            "newPrice",
                            e.target.value
                          )
                        }
                        required
                        className="flex-1 min-w-[100px] rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Old price"
                        value={item.oldPrice}
                        onChange={(e) =>
                          handleStockItemChange(
                            index,
                            "oldPrice",
                            e.target.value
                          )
                        }
                        className="flex-1 min-w-[100px] rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeStockItem(index)}
                        className="text-rose-500 hover:text-rose-700 shrink-0 p-1"
                        title="Remove Variation"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-myblack/70">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                className="mt-1 w-full font-productSansLight tracking-wide rounded-xl border border-myblack/10 bg-white px-4 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-myblack/80">
                  Specifications (based on category)
                </label>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add Custom Spec
                </button>
              </div>

              {(form.specifications || []).length === 0 ? (
                <p className="text-xs text-myblack/50 italic">
                  Select a category to load predefined specifications.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(form.specifications || []).map((spec, index) => {
                    const isPredefined = allTemplates.includes(spec.key);
                    return (
                      <div key={index} className="flex gap-2 items-center">
                        {isPredefined ? (
                          <div
                            className="w-1/3 truncate text-xs text-myblack/70 font-productSansBold"
                            title={spec.key}
                          >
                            {spec.key}
                          </div>
                        ) : (
                          <input
                            placeholder="Custom Spec"
                            value={spec.key}
                            onChange={(e) =>
                              onSpecChange(index, "key", e.target.value)
                            }
                            required
                            className="w-1/3 rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                          />
                        )}
                        <input
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            onSpecChange(index, "value", e.target.value)
                          }
                          required
                          className="w-full rounded-xl border border-myblack/10 bg-white px-3 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="text-rose-500 hover:text-rose-700 shrink-0 p-1"
                          title="Remove Spec"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-col justify-end">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    target: {
                      name: "isActive",
                      type: "checkbox",
                      checked: !form.isActive,
                    },
                  })
                }
                className={`flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {form.isActive ? (
                  <FaToggleOn className="text-xl text-emerald-500" />
                ) : (
                  <FaToggleOff className="text-xl text-slate-400" />
                )}
                {form.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 rounded-b-2xl border-t bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
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
