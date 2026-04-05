import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Items from "./Items";
import ItemSkeleton from "../helpers/ItemSkeleton";
import { FiArrowRight, FiZap } from "react-icons/fi";

function LatestProduct() {
  const { allProducts, productsLoading } = useContext(ShopContext);
  const latestItem = allProducts?.filter((item) => item.isNew) || [];
  const latestItemsToDisplay = latestItem.slice(0, 4);
  const skeletonCount = Math.max(0, 4 - latestItemsToDisplay.length);

  return (
    <section className="relative place-items-center overflow-hidden py-12 laptop:py-24">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/50" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-100/40 opacity-70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl space-y-8 laptop:space-y-12 px-4 laptop:px-5">
        {/* ── Section header ── */}
        <header className="place-items-center space-y-6 text-center">
          {/* eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-200/50 bg-cyan-50/50 px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-cyan-700 uppercase shadow-sm backdrop-blur-sm">
            <FiZap className="h-3.5 w-3.5 fill-cyan-500 text-cyan-500" />
            Just Arrived
          </div>

          <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            See What&apos;s{" "}
            <span className="relative inline-block px-2">
              <span className="relative z-10 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                New
              </span>
              <span
                className="absolute right-0 -bottom-2 left-0 h-[6px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 opacity-30 blur-[2px]"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="font-productSansLight max-w-xl text-[16px] leading-relaxed text-slate-500 xl:text-[18px]">
            Fresh drops, just stocked — explore the latest additions to our
            collection before they sell out.
          </p>

          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        </header>

        {/* ── Product grid ── */}
        <div className="grid w-full grid-cols-2 gap-3 laptop:grid-cols-4 laptop:gap-x-6">
          {productsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <ItemSkeleton key={`loading-${i}`} />
            ))
          ) : (
            <>
              {latestItemsToDisplay.map((item, i) => (
                <Items
                  key={i}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  newPrice={item.stockItems?.[0]?.newPrice ?? item.newPrice}
                  oldPrice={item.stockItems?.[0]?.oldPrice ?? item.oldPrice}
                  category={item.category}
                  badge="New"
                />
              ))}
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <ItemSkeleton key={`placeholder-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="flex justify-center pt-8">
          <a
            href="/"
            className="group relative inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/25"
          >
            <span>Browse all products</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
              <FiArrowRight className="h-3.5 w-3.5 text-white" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default LatestProduct;
