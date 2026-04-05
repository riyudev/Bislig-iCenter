import React from "react";

const ItemSkeleton = () => (
  <div className="w-full rounded-2xl border border-slate-200 bg-white p-3 laptop:p-4 shadow-sm animate-pulse">
    <div className="h-36 laptop:h-52 w-full rounded-xl bg-slate-200 mb-4"></div>
    <div className="h-3 laptop:h-4 w-3/4 rounded bg-slate-200 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 laptop:h-5 w-1/3 rounded bg-slate-200"></div>
      <div className="h-7 laptop:h-8 w-20 laptop:w-24 rounded-full bg-slate-200"></div>
    </div>
  </div>
);

export default ItemSkeleton;
