import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaCartPlus } from "react-icons/fa";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);

  const parsePrice = (val) => {
    if (val === null || val === undefined) return null;
    const num =
      typeof val === "number"
        ? val
        : Number(String(val).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : null;
  };

  const getDerivedVariantPrice = (variant, basePrice) => {
    if (!variant || !Number.isFinite(basePrice)) return basePrice;
    const v = String(variant).trim().toUpperCase();

    const gbMatch = v.match(/(\d+)\s*GB/);
    const tbMatch = v.match(/(\d+(?:\.\d+)?)\s*TB/);
    const sizeGb = gbMatch
      ? Number(gbMatch[1])
      : tbMatch
        ? Number(tbMatch[1]) * 1024
        : null;

    // If we can't parse sizes, just step prices by index.
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const idx = Math.max(
      0,
      variants.findIndex((x) => x === variant),
    );

    if (!Number.isFinite(sizeGb)) {
      const step = 3000;
      return basePrice + idx * step;
    }

    // Common storage tiers. Increase price as storage increases.
    // This is a fallback when the product doesn't define explicit variantPrices.
    // Assumption: the product.newPrice is the 128GB (or similar) base.
    if (sizeGb <= 64) return basePrice - 3000;
    if (sizeGb <= 128) return basePrice;
    if (sizeGb <= 256) return basePrice + 7000;
    if (sizeGb <= 512) return basePrice + 14000;
    if (sizeGb <= 1024) return basePrice + 22000;
    return basePrice + 30000;
  };
  const oldP = parsePrice(product.oldPrice);
  const baseNewP = parsePrice(product.newPrice);
  const selectedNewP = parsePrice(product?.variantPrices?.[selectedVariant]);
  const effectiveNewP =
    selectedNewP ?? getDerivedVariantPrice(selectedVariant, baseNewP);
  const hasDiscount =
    Number.isFinite(oldP) &&
    Number.isFinite(effectiveNewP) &&
    oldP > effectiveNewP;
  const discountPercent = hasDiscount
    ? Math.round(((oldP - effectiveNewP) / oldP) * 100)
    : null;
  const formatPHP = (value, fallback) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(value)
      : (fallback ?? "");

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product._id || product.id,
      selectedVariant || "Default",
      selectedColor || "Default",
      quantity,
      effectiveNewP,
    );
  };

  return (
    <div className="laptop:flex-row laptop:items-start laptop:gap-10 mb-5 flex w-full flex-col gap-8 border px-5 py-8 shadow-sm">
      {/* Image Gallery */}
      <div className="laptop:max-w-lg w-full max-w-md">
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-slate-50 to-slate-100 py-6 ring-1 ring-slate-200/60 ring-inset">
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : `http://localhost:5000${product.image || ""}`
            }
            alt={product.name}
            className="mx-auto h-[400px] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute top-0 left-0 rounded-tl-xl rounded-br-xl bg-rose-600 px-3 py-1 text-sm font-semibold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-4 right-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              New
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-full space-y-6">
        <h3 className="leading-tight">{product.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-productSansBold text-3xl text-slate-900">
            {formatPHP(effectiveNewP, product.newPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="font-productSansLight text-base text-slate-400 line-through">
                {formatPHP(oldP, product.oldPrice)}
              </span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 ring-inset">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {/* <div className="border-l-4 border-blue-500 pl-4">
          <p className="text-myblack/80 leading-relaxed">
            {product.description ||
              "Experience cutting-edge technology with this premium gadget from Bislig iCenter. Featuring top-tier specifications and reliable performance for all your digital needs."}
          </p>
        </div> */}

        {/* Specifications/Variants (Storage, RAM, etc.) */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <h5>Select Configuration</h5>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant, index) => (
                <div
                  key={index}
                  onClick={() => handleVariantSelect(variant)}
                  className={`cursor-pointer rounded-xl border-2 p-3 px-4 transition-all duration-200 ${
                    selectedVariant === variant
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-myblack/20 hover:border-blue-400"
                  }`}
                >
                  <p className="font-productSansReg text-sm">{variant}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-3">
            <h5>Select Color</h5>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`cursor-pointer rounded-xl border-2 p-3 px-5 transition-all duration-200 ${
                    selectedColor === color
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-myblack/20 hover:border-blue-400"
                  }`}
                >
                  <p className="font-productSansReg text-sm">{color}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h5>Quantity</h5>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="border-myblack/20 font-robotoBold h-10 w-10 rounded-full border-2 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
            >
              -
            </button>
            <span className="font-robotoBold w-12 text-center text-xl">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="border-myblack/20 font-robotoBold h-10 w-10 rounded-full border-2 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="btn-black inline-flex items-center gap-3 px-6 py-3"
        >
          <FaCartPlus className="h-5 w-5" />
          ADD TO CART
        </button>

        {/* Product Info */}
        <div className="border-myblack/10 space-y-2 border-t-2 pt-4">
          <p className="text-base">
            <span className="font-productSansBold">Category:</span>{" "}
            <span className="text-myblack/70">{product.category}</span>
          </p>
          <p className="text-base">
            <span className="font-productSansBold">Availability:</span>{" "}
            <span className="font-productSansReg text-green-600">
              In Stock at Bislig iCenter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
