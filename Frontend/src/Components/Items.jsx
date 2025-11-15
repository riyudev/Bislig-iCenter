import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

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
    <Link to={`/${currentCategory}/${props.id}`} className="block">
      <div className="group tablet:w-40 laptop:max-w-[300px] laptop:w-full relative cursor-pointer rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-200">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 py-2 ring-1 ring-slate-200/60 ring-inset">
          <img
            src={props.image}
            alt={props.name}
            loading="lazy"
            className="mx-auto h-52 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-0 left-0 rounded-tl-xl rounded-br-xl bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="space-y-2 pt-4">
          <p className="laptop:text-base truncate text-sm text-slate-700 group-hover:text-slate-900">
            {props.name}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-productSansBold text-lg text-slate-900">
                {formatPHP(newP, props.newPrice)}
              </span>
              {hasDiscount && (
                <span className="font-productSansLight text-sm text-slate-400 line-through">
                  {formatPHP(oldP, props.oldPrice)}
                </span>
              )}
            </div>
            <button className="bg-myblack hover:bg-myblack/90 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200">
              <FaCartPlus className="h-4 w-4" />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Items;
