import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

const Items = (props) => {
  const params = useParams();
  const currentCategory = params.category || props.category?.toLowerCase();

  const parsePrice = (val) => {
    if (val === null || val === undefined) return null;
    const num =
      typeof val === "number"
        ? val
        : Number(String(val).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : null;
  };

  const oldP = parsePrice(props.oldPrice);
  const newP = parsePrice(props.newPrice);
  const hasDiscount =
    Number.isFinite(oldP) && Number.isFinite(newP) && oldP > newP;
  const discountPercent = hasDiscount
    ? Math.round(((oldP - newP) / oldP) * 100)
    : null;

  const formatPHP = (value, fallback) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(value)
      : (fallback ?? "");

  return (
    <Link to={`/${currentCategory}/${props.id}`} className="block w-full">
      <div className="group w-full relative cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 laptop:p-4 shadow-md ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-blue-200/70">

        {/* ── Image area ── */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 py-2 ring-1 ring-slate-200/60 ring-inset">
          <img
            src={
              props.image?.startsWith("http")
                ? props.image
                : `${props.image || ""}`
            }
            alt={props.name}
            loading="lazy"
            className="mx-auto h-36 laptop:h-52 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-1.5 laptop:px-2.5 py-0.5 laptop:py-1 text-[9px] laptop:text-[11px] font-bold text-white shadow-md shadow-rose-200">
              -{discountPercent}%
            </span>
          )}

          {/* "New" badge (passed from LatestProduct) */}
          {props.badge === "New" && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 laptop:gap-1 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-1.5 laptop:px-2.5 py-0.5 laptop:py-1 text-[9px] laptop:text-[11px] font-bold text-white shadow-md shadow-blue-200">
              <FiStar className="h-2.5 w-2.5 laptop:h-3 laptop:w-3 fill-white text-white" />
              NEW
            </span>
          )}

          {/* Shine overlay on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* ── Info area ── */}
        <div className="space-y-2 pt-3 laptop:pt-4">
          <p className="truncate text-xs laptop:text-sm font-medium text-slate-700 transition-colors duration-200 group-hover:text-slate-900">
            {props.name}
          </p>

          {/* Price + button — stacked on mobile, row on laptop */}
          <div className="flex flex-col laptop:flex-row laptop:items-center laptop:justify-between gap-1.5 laptop:gap-2">
            {/* Price column */}
            <div className="flex flex-col">
              {/* Old price on top */}
              {hasDiscount && (
                <span className="font-productSansLight text-[10px] laptop:text-xs text-slate-400 line-through leading-none">
                  {formatPHP(oldP, props.oldPrice)}
                </span>
              )}
              {/* New price below */}
              <span className="font-productSansBold text-sm laptop:text-base text-slate-900 leading-snug">
                {formatPHP(newP, props.newPrice)}
              </span>
            </div>

            {/* Add-to-cart button */}
            <button className="inline-flex w-full laptop:w-auto shrink-0 cursor-pointer items-center justify-center gap-1 laptop:gap-1.5 rounded-full bg-gradient-to-r from-[#2b2a28] via-[#3a3937] to-[#222220] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
              <FaCartPlus className="h-3 w-3 laptop:h-3.5 laptop:w-3.5 shrink-0" />
              <span className="hidden laptop:inline">Add to cart</span>
              <span className="laptop:hidden">Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Glow edge at bottom on hover */}
        <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-blue-400 to-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
      </div>
    </Link>
  );
};

export default Items;
