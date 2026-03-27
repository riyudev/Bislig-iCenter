import React from "react";

const ItemSkeleton = () => (
  <div className="tablet:w-40 laptop:max-w-[300px] laptop:w-full w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="h-52 w-full rounded-xl bg-slate-200 mb-4"></div>
    <div className="h-4 w-3/4 rounded bg-slate-200 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-5 w-1/3 rounded bg-slate-200"></div>
      <div className="h-8 w-24 rounded-full bg-slate-200"></div>
    </div>
  </div>
);

export default ItemSkeleton;
