import React, { useEffect, useRef } from "react";
import { FaBoxOpen, FaExclamationTriangle, FaTimes } from "react-icons/fa";

/**
 * LowStockAlertModal
 *
 * Props:
 *  - isOpen   {boolean}          – whether the modal is visible
 *  - onClose  {() => void}       – called when admin dismisses the modal
 *  - products {Array}            – array of low-stock product objects from /api/admin/products/low-stock
 *  - loading  {boolean}          – true while fetching
 */
const LowStockAlertModal = ({ isOpen, onClose, onGoToInventory, products = [], loading }) => {
  const closeRef = useRef(null);

  // Trap focus on the close button when opened
  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * Calculate the lowest stock value for a product.
   * Uses stockItems variants if present, otherwise falls back to stocks field.
   */
  const getLowestStock = (product) => {
    if (product.stockItems && product.stockItems.length > 0) {
      return Math.min(...product.stockItems.map((s) => s.stock ?? 0));
    }
    return product.stocks ?? 0;
  };

  /**
   * Build a readable stock label.
   * If the product has variants, list each variant/color pair with its stock.
   */
  const getStockDetails = (product) => {
    if (product.stockItems && product.stockItems.length > 0) {
      return product.stockItems.map((s) => ({
        label: `${s.variant} / ${s.color}`,
        stock: s.stock ?? 0,
        low: (s.stock ?? 0) <= (product.lowStockThreshold ?? 5),
      }));
    }
    return [
      {
        label: "In stock",
        stock: product.stocks ?? 0,
        low: (product.stocks ?? 0) <= (product.lowStockThreshold ?? 5),
      },
    ];
  };

  const criticalProducts = products.filter((p) => getLowestStock(p) === 0);
  const warningProducts = products.filter((p) => getLowestStock(p) > 0);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="low-stock-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "85vh" }}
        >
          {/* ── Header ── */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center ring-1 ring-amber-200">
                <FaExclamationTriangle className="text-amber-500 text-base" />
              </div>
              <div>
                <h2
                  id="low-stock-modal-title"
                  className="text-base font-semibold text-gray-900 leading-tight"
                >
                  Low Stocks Alert
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {loading
                    ? "Checking inventory…"
                    : products.length === 0
                    ? "All products are sufficiently stocked."
                    : `${products.length} product${products.length !== 1 ? "s" : ""} need${
                        products.length === 1 ? "s" : ""
                      } your attention`}
                </p>
              </div>
            </div>

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close low stock alert"
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <FaBoxOpen className="text-4xl text-emerald-400" />
                <p className="text-sm font-medium text-gray-700">All good! Stock levels are healthy.</p>
                <p className="text-xs text-gray-400">No products are below the low-stock threshold.</p>
              </div>
            )}

            {/* Out of stock section */}
            {!loading && criticalProducts.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2 px-1">
                  Out of Stock ({criticalProducts.length})
                </p>
                <div className="space-y-2">
                  {criticalProducts.map((product) => (
                    <ProductRow key={product._id} product={product} getStockDetails={getStockDetails} />
                  ))}
                </div>
              </div>
            )}

            {/* Low stock section */}
            {!loading && warningProducts.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2 px-1">
                  Low Stock ({warningProducts.length})
                </p>
                <div className="space-y-2">
                  {warningProducts.map((product) => (
                    <ProductRow key={product._id} product={product} getStockDetails={getStockDetails} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              Threshold: products with ≤ 5 units are flagged.
            </p>
            <button
              onClick={onGoToInventory}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Go to Inventory
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Sub-component: single product row ─────────────────────────────────────── */
const ProductRow = ({ product, getStockDetails }) => {
  const details = getStockDetails(product);
  const isOutOfStock = details.every((d) => d.stock === 0);

  return (
    <div
      className={`rounded-xl border p-3.5 transition-colors ${
        isOutOfStock
          ? "bg-rose-50 border-rose-100"
          : "bg-amber-50 border-amber-100"
      }`}
    >
      {/* Product name + badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">
          {product.name}
        </p>
        <span
          className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            isOutOfStock
              ? "bg-rose-100 text-rose-600"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isOutOfStock ? "Out of stock" : "Low stock"}
        </span>
      </div>

      {/* Category */}
      <p className="text-[11px] text-gray-400 mb-2 capitalize">{product.category}</p>

      {/* Variant stock breakdown */}
      <div className="flex flex-wrap gap-1.5">
        {details.map((d, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              d.stock === 0
                ? "bg-rose-100 text-rose-700"
                : "bg-white text-gray-600 ring-1 ring-gray-200"
            }`}
          >
            <span className="opacity-70">{d.label}:</span>
            <span className={d.stock === 0 ? "font-bold" : ""}>
              {d.stock === 0 ? "None" : `${d.stock} left`}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlertModal;
