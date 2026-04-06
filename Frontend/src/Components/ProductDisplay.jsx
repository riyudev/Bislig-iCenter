import React, { useContext, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FaCartPlus,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
  FaCheckCircle,
  FaRegHeart,
  FaHeart,
  FaMedal,
  FaLock,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import SpecsTable from "./SpecsTable";

/* ─── Perks ──────────────────────────────────────────────────────── */
const PERKS = [
  {
    icon: <FaTruck className="h-4 w-4" />,
    label: "Free Delivery",
    sub: "Orders over ₱2,000",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: <FaShieldAlt className="h-4 w-4" />,
    label: "12-Month Warranty",
    sub: "Official Apple Service",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: <FaUndo className="h-4 w-4" />,
    label: "7-Day Returns",
    sub: "Hassle-free policy",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: <FaHeadset className="h-4 w-4" />,
    label: "24/7 Support",
    sub: "Always here for you",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
];

/* ─── Social-proof trust strip (replaces star rating) ───────────── */
const TrustStrip = () => (
  <div className="hidden laptop:flex flex-wrap items-center gap-3">
    {/* Sold count */}
    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 ring-1 ring-amber-200">
      <span className="text-sm">🔥</span>
      <span className="font-productSansBold text-xs text-amber-700">
        500+ Sold
      </span>
    </div>
    {/* Restock alert */}
    <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 ring-1 ring-rose-200">
      <span className="text-sm">⚡</span>
      <span className="font-productSansBold text-xs text-rose-600">
        Fast-Moving Item
      </span>
    </div>
    {/* Bislig exclusive */}
    <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 ring-1 ring-blue-200">
      <FaMedal className="h-3 w-3 text-blue-500" />
      <span className="font-productSansBold text-xs text-blue-700">
        iCenter Exclusive
      </span>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedVariant, setSelectedVariant] = useState(
    product.stockItems?.[0]?.variant || product.variants?.[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState(
    product.stockItems?.[0]?.color || product.colors?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedPulse, setAddedPulse] = useState(false);

  // ── Fly-to-cart animation ──────────────────────────────────────────
  const [flyingIcons, setFlyingIcons] = useState([]);
  const flyIdRef = useRef(0);

  const launchFlyAnimation = useCallback((buttonEl) => {
    const navCartBtn = document.getElementById("navbar-cart-btn") || document.getElementById("mobile-navbar-cart-btn");
    if (!buttonEl || !navCartBtn) return;

    const from = buttonEl.getBoundingClientRect();
    const to   = navCartBtn.getBoundingClientRect();

    const startX = from.left + from.width  / 2;
    const startY = from.top  + from.height / 2;
    const dx = Math.round((to.left + to.width  / 2) - startX);
    const dy = Math.round((to.top  + to.height / 2) - startY);
    // Lift arc height: 40% of vertical travel
    const arc = Math.round(Math.abs(dy) * 0.4);

    const id = ++flyIdRef.current;
    const kfName = `ftc-${id}`;
    const kfCSS = `
      @keyframes ${kfName} {
        0%   { transform: translate(0px, 0px) scale(1);                                              opacity: 1; }
        20%  { transform: translate(${Math.round(dx*0.1)}px, ${Math.round(dy*0.1 - arc)}px) scale(1.45); opacity: 1; }
        65%  { transform: translate(${Math.round(dx*0.7)}px, ${Math.round(dy*0.7 - arc*0.25)}px) scale(0.85); opacity: 0.85; }
        100% { transform: translate(${dx}px, ${dy}px) scale(0.15);                                  opacity: 0; }
      }
    `;
    setFlyingIcons((prev) => [...prev, { id, startX, startY, kfName, kfCSS }]);
    setTimeout(() => setFlyingIcons((prev) => prev.filter((f) => f.id !== id)), 1100);
  }, []);


  // ── Formatter ──────────────────────────────────────────────────────
  const formatVariant = (variantStr) => {
    if (!variantStr) return "";
    const parts = variantStr.split("+").map(p => p.trim());
    if (parts.length === 2) {
      const match0 = parts[0].match(/^(\d+)(GB|TB)$/i);
      const match1 = parts[1].match(/^(\d+)(GB|TB)$/i);
      if (match0 && match1) {
        const val0 = parseInt(match0[1]);
        const unit0 = match0[2].toUpperCase();
        const val1 = parseInt(match1[1]);
        const unit1 = match1[2].toUpperCase();
        
        let isPart0Storage = false;
        if (unit0 === "TB") isPart0Storage = true;
        else if (unit1 === "TB") isPart0Storage = false;
        else if (val0 > val1 && val0 >= 32) isPart0Storage = true;
        
        if (isPart0Storage) {
          return `${parts[1]} + ${parts[0]}`;
        }
      }
    }
    return variantStr;
  };

  /* ─── Price Helpers ────────────────────────────────────────────── */
  const parsePrice = (val) => {
    if (val === null || val === undefined) return null;
    const num =
      typeof val === "number"
        ? val
        : Number(String(val).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : null;
  };

  const currentStockItem = (product.stockItems || []).find(
    (item) => item.variant === selectedVariant && item.color === selectedColor
  );
  const currentStock = currentStockItem ? currentStockItem.stock : (product.stocks || 0);

  const oldP = parsePrice(product.oldPrice);
  const baseNewP = parsePrice(product.newPrice);
  const effectiveNewP = parsePrice(currentStockItem?.newPrice) ?? baseNewP;
  const effectiveOldP = parsePrice(currentStockItem?.oldPrice) ?? oldP;

  const hasDiscount =
    Number.isFinite(effectiveOldP) &&
    Number.isFinite(effectiveNewP) &&
    effectiveOldP > effectiveNewP;
  const discountPercent = hasDiscount
    ? Math.round(((effectiveOldP - effectiveNewP) / effectiveOldP) * 100)
    : null;

  const formatPHP = (value, fallback) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(value)
      : (fallback ?? "");

  /* ─── Handlers ─────────────────────────────────────────────────── */
  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((p) => p + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = (buttonEl) => {
    addToCart(
      product._id || product.id,
      selectedVariant || "Default",
      selectedColor || "Default",
      quantity,
      effectiveNewP,
    );
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 600);
    if (buttonEl) launchFlyAnimation(buttonEl);
  };
  const hasSpecs =
    (product.specifications || []).filter((s) => s.value?.trim()).length > 0;

  /* ─── Render ────────────────────────────────────────────────────── */
  const flyPortal = flyingIcons.length > 0
    ? ReactDOM.createPortal(
        <>
          {flyingIcons.map(({ id, startX, startY, kfName, kfCSS }) => (
            <React.Fragment key={id}>
              <style>{kfCSS}</style>
              <div
                style={{
                  position: "fixed",
                  left: startX - 22,
                  top: startY - 22,
                  width: 44,
                  height: 44,
                  zIndex: 99999,
                  pointerEvents: "none",
                  animation: `${kfName} 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{
                  position: "absolute", inset: "-8px", borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(6,182,212,0.2) 55%, transparent 72%)",
                  filter: "blur(10px)",
                }} />
                <div style={{
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
                  borderRadius: "50%", width: 40, height: 40,
                  boxShadow: "0 0 0 3px #fff, 0 0 20px rgba(59,130,246,0.85), 0 4px 14px rgba(0,0,0,0.22)",
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </div>
              </div>
            </React.Fragment>
          ))}
        </>,
        document.body,
      )
    : null;

  return (
    <>
      {flyPortal}
      <div className="laptop:flex-row laptop:items-start laptop:gap-8 mb-6 flex w-full flex-col gap-6 rounded-3xl border border-slate-100 bg-white px-5 py-6 shadow-xl shadow-slate-100">
      {/* ══ Left: Image + Perks ════════════════════════════════════ */}
      <div className="laptop:max-w-[460px] relative w-full flex-shrink-0">
        {/* Image card */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-6 ring-1 ring-slate-200/80">
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : `${product.image || ""}`
            }
            alt={product.name}
            className="mx-auto h-[300px] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-rose-200">
              🔥 -{discountPercent}% OFF
            </span>
          )}

          {/* New badge */}
          {product.isNew && (
            <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-200">
              ✨ NEW
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted((w) => !w)}
            className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
            title="Add to Wishlist"
          >
            {wishlisted ? (
              <FaHeart className="h-5 w-5 text-rose-500" />
            ) : (
              <FaRegHeart className="h-5 w-5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Perks 2×2 */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {PERKS.map((perk, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-xl border ${perk.border} ${perk.bg} px-3 py-2.5`}
            >
              <span className={`mt-0.5 flex-shrink-0 ${perk.color}`}>
                {perk.icon}
              </span>
              <div>
                <p className={`font-productSansBold text-xs ${perk.color}`}>
                  {perk.label}
                </p>
                <p className="font-productSansLight text-[10px] text-slate-500">
                  {perk.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Description below perks (Desktop only) */}
        {product.description && (
          <div className="hidden laptop:block mt-3 rounded-2xl border-l-4 border-blue-500 bg-slate-50 px-4 py-3">
            <p className="font-productSansBold mb-1 text-[11px] uppercase tracking-wider text-slate-400">
              About this product
            </p>
            <p className="font-productSansLight text-sm leading-relaxed text-slate-700">
              {product.description}
            </p>
          </div>
        )}
      </div>

      {/* ══ Right: Details ═════════════════════════════════════════ */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* Brand row */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            <FaMedal className="h-3 w-3 text-amber-400" />
            Bislig iCenter
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-600">
            <MdVerified className="h-4 w-4" />
            Authorized Reseller
          </span>
        </div>

        {/* Product name */}
        <h3 className="leading-tight text-2xl font-bold">{product.name}</h3>

        {/* Social-proof trust strip */}
        <TrustStrip />

        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-productSansBold text-3xl text-slate-900">
            {formatPHP(effectiveNewP, product.newPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="font-productSansLight text-base text-slate-400 line-through">
                {formatPHP(effectiveOldP, product.oldPrice)}
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-rose-200">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Savings callout */}
        {hasDiscount && (
          <div className="flex w-fit items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-200">
            <span className="text-sm">💰</span>
            <p className="font-productSansBold text-xs text-amber-700">
              You save{" "}
              {formatPHP(
                Number.isFinite(effectiveOldP) && Number.isFinite(effectiveNewP)
                  ? effectiveOldP - effectiveNewP
                  : null,
                "",
              )}{" "}
              on this deal!
            </p>
          </div>
        )}

        {/* Available Variation */}
        {product.stockItems && product.stockItems.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-slate-800">Available Variation</h5>
            <div className="flex flex-wrap gap-2">
              {product.stockItems.map((item, index) => {
                const formattedVar = formatVariant(item.variant);
                const label = `${formattedVar} | ${item.color}`;
                const isSelected = selectedVariant === item.variant && selectedColor === item.color;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVariant(item.variant);
                      setSelectedColor(item.color);
                    }}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 ${
                      isSelected
                        ? "font-productSansBold border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "font-productSansReg border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product meta (category / availability) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-productSansBold text-xs text-slate-700">
              Category:
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 capitalize">
              {product.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-productSansBold text-xs text-slate-700">
              Stock:
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${currentStock > 0 ? (currentStock <= (product.lowStockThreshold || 5) ? 'text-amber-600' : 'text-emerald-600') : 'text-rose-600'}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${currentStock > 0 ? (currentStock <= (product.lowStockThreshold || 5) ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse') : 'bg-rose-500'}`} />
              {currentStock > 0 ? `${currentStock} items left` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-0 overflow-hidden rounded-full border-2 border-slate-200">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="font-robotoBold h-11 w-11 text-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="font-robotoBold w-10 text-center text-lg text-slate-900 select-none">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="font-robotoBold h-11 w-11 text-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
              disabled={quantity >= currentStock}
            >
              +
            </button>
          </div>

          <button
            id="product-add-to-cart-btn"
            onClick={(e) => handleAddToCart(e.currentTarget)}
            disabled={currentStock <= 0}
            className={`btn-black inline-flex flex-1 items-center justify-center gap-2.5 px-8 py-3.5 text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${addedPulse ? "scale-95 opacity-80" : ""}`}
          >
            <FaCartPlus className="h-5 w-5" />
            {currentStock > 0 ? "ADD TO CART" : "SOLD OUT"}
          </button>
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <FaLock className="h-3.5 w-3.5 text-slate-400" />
            Secure Checkout
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <FaCheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            Genuine Product Guaranteed
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <FaShieldAlt className="h-3.5 w-3.5 text-blue-400" />
            Buyer Protection
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

        {/* ── Specifications & Mobile Description ──────────────────── */}
        {product.description && (
          <div className="laptop:hidden mt-3 rounded-2xl border-l-4 border-blue-500 bg-slate-50 px-4 py-3">
            <p className="font-productSansBold mb-1 text-[11px] uppercase tracking-wider text-slate-400">
              About this product
            </p>
            <p className="font-productSansLight text-sm leading-relaxed text-slate-700">
              {product.description}
            </p>
          </div>
        )}

        {hasSpecs && (
          <SpecsTable specifications={product.specifications} />
        )}

      </div>
    </div>
    </>
  );
};

export default ProductDisplay;
