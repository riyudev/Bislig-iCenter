import React, { useContext } from "react";
import Item from "./Items";
import { ShopContext } from "../context/ShopContext";
import ItemSkeleton from "../helpers/ItemSkeleton";
import { FiArrowRight } from "react-icons/fi";

/* Rank decorators for top-3 spots */
const RANK_META = [
  {
    label: "Top #1 Best Seller",
    ring: "ring-cyan-200/80",
    glow: "shadow-cyan-400/20",
    badge: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
  },
  {
    label: "Top #2 Trending",
    ring: "ring-blue-200/60",
    glow: "shadow-blue-400/20",
    badge: "bg-gradient-to-r from-blue-400 to-indigo-400 text-white",
  },
  {
    label: "Top #3 Fan Favorite",
    ring: "ring-indigo-200/50",
    glow: "shadow-indigo-400/20",
    badge: "bg-gradient-to-r from-indigo-400 to-violet-400 text-white",
  },
];

function BestSeller() {
  const { allProducts, productsLoading } = useContext(ShopContext);
  const bestSeller = allProducts?.filter((item) => item.isBestSeller) || [];
  const bestSellersToDisplay = bestSeller.slice(0, 3);
  const skeletonCount = Math.max(0, 3 - bestSellersToDisplay.length);

  return (
    <section
      id="bestSeller"
      className="relative scroll-mt-20 place-items-center overflow-hidden py-12 laptop:py-24"
    >
      {/* ── Subtle cool background ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/50" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-100/40 opacity-70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl space-y-8 laptop:space-y-12 px-4 laptop:px-5">
        {/* ── Section header ── */}
        <header className="place-items-center space-y-6 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-200/50 bg-cyan-50/50 px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-cyan-700 uppercase shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            Top Rated Collection
          </div>

          <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            This Month&apos;s{" "}
            <span className="relative inline-block px-2">
              <span className="relative z-10 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Best Sellers
              </span>
              <span
                className="absolute right-0 -bottom-2 left-0 h-[6px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 opacity-30 blur-[2px]"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="font-productSansLight max-w-xl text-[16px] leading-relaxed text-slate-500 xl:text-[18px]">
            Handpicked by our customers — discover the ultimate top 3 products
            that defined excellence this month. Uncompromising quality meets
            incredible demand.
          </p>

          <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        </header>

        {/* ── Product grid ── */}
        <div className="grid w-full grid-cols-2 gap-3 laptop:grid-cols-3 laptop:gap-6">
          {productsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`loading-${i}`}
                className={
                  i === 0
                    ? "col-span-2 mx-auto w-full max-w-[260px] laptop:col-span-1 laptop:max-w-none"
                    : "col-span-1"
                }
              >
                <ItemSkeleton />
              </div>
            ))
          ) : (
            <>
              {bestSellersToDisplay.map((item, i) => {
                const meta = RANK_META[i];
                return (
                  <div
                    key={i}
                    className={`group flex flex-col items-center gap-0 px-1 pt-2 w-full ${
                      i === 0
                        ? "col-span-2 mx-auto max-w-[280px] laptop:col-span-1 laptop:max-w-none"
                        : "col-span-1"
                    }`}
                  >
                    {/* Rank badge above the card */}
                    <div className="relative z-10 -mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] laptop:text-[11px] font-bold tracking-wider uppercase shadow-md ring-4 ring-white ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    {/* Card wrapped with ring highlight */}
                    <div
                      className={`w-full rounded-2xl bg-white shadow-xl ring-1 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl ${meta.ring} ${meta.glow}`}
                    >
                      <Item
                        id={item._id}
                        name={item.name}
                        image={item.image}
                        newPrice={item.newPrice}
                        oldPrice={item.oldPrice}
                        category={item.category}
                      />
                    </div>
                  </div>
                );
              })}
              {Array.from({ length: skeletonCount }).map((_, idx) => {
                const i = bestSellersToDisplay.length + idx;
                return (
                  <div
                    key={`placeholder-${i}`}
                    className={`w-full ${
                      i === 0
                        ? "col-span-2 mx-auto max-w-[280px] laptop:col-span-1 laptop:max-w-none"
                        : "col-span-1"
                    }`}
                  >
                    <ItemSkeleton />
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="flex justify-center pt-8">
          <a
            href="/iphone"
            className="group relative inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-cyan-500/25"
          >
            <span>Explore full collection</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
              <FiArrowRight className="h-3.5 w-3.5 text-white" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
