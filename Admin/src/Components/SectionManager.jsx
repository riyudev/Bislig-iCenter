import React, { useState } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";

const SectionManager = ({
  title,
  description,
  flag,
  maxCount,
  products,
  onUpdateProduct,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const selectedProducts = products.filter((p) => p[flag]);

  const handleToggle = async (productId, currentState) => {
    await onUpdateProduct(productId, { [flag]: !currentState });
    setModalOpen(false);
  };

  const availableProducts = products.filter(
    (p) =>
      !p[flag] && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-myblack">{title}</h3>
          <p className="mt-0.5 text-sm text-myblack/60">{description}</p>
        </div>
        <button
          onClick={() => {
            setSearch("");
            setModalOpen(true);
          }}
          disabled={selectedProducts.length >= maxCount}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPlus className="text-xs" />
          Add Product ({selectedProducts.length}/{maxCount})
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {selectedProducts.map((p) => (
          <div
            key={p._id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <img
              src={
                p.image?.startsWith("http")
                  ? p.image
                  : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${p.image}`
              }
              alt={p.name}
              className="h-14 w-14 rounded-lg object-contain bg-slate-50"
            />
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate text-sm font-bold text-myblack">
                {p.name}
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                ₱{(p.newPrice || 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setConfirmRemoveId(p._id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <FaTrash className="text-[11px]" />
            </button>
          </div>
        ))}
        {selectedProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            No products selected for {title}.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="flex h-full max-h-[70vh] w-full max-w-lg flex-col rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between pb-2 border-b border-myblack/5">
              <h4 className="text-lg font-bold text-myblack">
                Select a Product
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full rounded-xl border border-myblack/10 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {availableProducts.length > 0 ? (
                availableProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <img
                        src={
                          p.image?.startsWith("http")
                            ? p.image
                            : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${p.image}`
                        }
                        alt={p.name}
                        className="h-12 w-12 rounded-lg object-contain bg-white ring-1 ring-slate-200"
                      />
                      <span className="truncate text-sm font-bold text-myblack">
                        {p.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle(p._id, false)}
                      className="rounded-xl bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors ml-4 shrink-0"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-slate-400 mt-8">
                  No match found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h4 className="font-bold text-myblack mb-2">Remove Product?</h4>
            <p className="mb-6 text-sm text-myblack/60">
              Are you sure you want to remove this product from the {title} section?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmRemoveId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleToggle(confirmRemoveId, true);
                  setConfirmRemoveId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager;
