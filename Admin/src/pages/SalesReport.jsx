import React, { useEffect, useState, useCallback } from "react";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const SalesReport = () => {
  const [state, setState] = useState({
    loading: true,
    products: [],
    pages: 1,
    page: 1,
  });
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    sort: "", // best selling filter
  });

  const fetchSalesReport = useCallback(
    async (page = 1) => {
      const query = new URLSearchParams({
        page,
        limit: 20,
        ...(filter.search && { search: filter.search }),
        ...(filter.category && { category: filter.category }),
        ...(filter.sort === "bestseller" && { status: "bestseller" }),
      }).toString();

      setState((p) => ({ ...p, loading: true }));
      try {
        const res = await fetchWithRetry(`/api/admin/products?${query}`);
        const data = await res.json().catch(() => ({}));
        setState({
          loading: false,
          products: data.products || [],
          pages: data.pages || 1,
          page: data.page || page,
        });
      } catch {
        setState((p) => ({ ...p, loading: false }));
      }
    },
    [filter.search, filter.category, filter.sort]
  );

  useEffect(() => {
    // eslint-disable-next-line
    fetchSalesReport(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category, filter.sort]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatVariant = (variantStr) => {
    if (!variantStr) return "";
    const parts = variantStr.split("+").map((p) => p.trim());
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2>Sales Report</h2>
          <p className="text-myblack/70">
            Overview of product sales and stock records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search products..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchSalesReport(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.category}
          onChange={(e) =>
            setFilter((p) => ({ ...p, category: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          <option value="iphone">iPhone</option>
          <option value="ipad">iPad</option>
          <option value="laptop">Laptop</option>
          <option value="android">Android</option>
        </select>
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.sort}
          onChange={(e) => setFilter((p) => ({ ...p, sort: e.target.value }))}
        >
          <option value="">All Sorting</option>
          <option value="bestseller">Best Selling</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-myblack/10 bg-white">
        <table className="w-full text-left text-sm text-myblack/80">
          <thead className="border-b border-myblack/10 bg-slate-50 text-xs uppercase text-myblack/60">
            <tr>
              <th className="px-6 py-4 font-productSansBold text-left">Product Name</th>
              <th className="px-6 py-4 font-productSansBold text-center">Category</th>
              <th className="px-6 py-4 font-productSansBold text-left">Color</th>
              <th className="px-6 py-4 font-productSansBold text-center">Variation</th>
              <th className="px-6 py-4 font-productSansBold text-center">Total Stocks Added</th>
              <th className="px-6 py-4 font-productSansBold text-center">Total Sold</th>
              <th className="px-6 py-4 font-productSansBold text-center">Total Sales (Revenue)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {state.loading ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-myblack/50">
                  Loading...
                </td>
              </tr>
            ) : state.products.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-myblack/50">
                  No records found.
                </td>
              </tr>
            ) : (
              state.products.map((p) => {
                const overallSold = p.totalSales || 0;
                const overallStocksAdded = (p.stocks || 0) + overallSold;
                const basePrice = p.newPrice || 0;
                
                let mutableItems = p.stockItems && p.stockItems.length > 0
                  ? p.stockItems.map(i => ({ ...i }))
                  : [
                      {
                        color: "-",
                        variant: "-",
                        stock: p.stocks || 0,
                        totalSales: overallSold,
                        newPrice: basePrice,
                      },
                    ];

                let sumVariantSold = mutableItems.reduce((acc, i) => acc + (i.totalSales || 0), 0);
                let unassignedSold = overallSold - sumVariantSold;
                if (unassignedSold > 0 && mutableItems.length > 0) {
                    mutableItems[0].totalSales = (mutableItems[0].totalSales || 0) + unassignedSold;
                }

                let sumVariantStock = mutableItems.reduce((acc, i) => acc + (i.stock || 0), 0);
                let unassignedStock = (p.stocks || 0) - sumVariantStock;
                if (unassignedStock > 0 && mutableItems.length > 0) {
                    mutableItems[0].stock = (mutableItems[0].stock || 0) + unassignedStock;
                }

                let overallRevenue = mutableItems.reduce((sum, item) => sum + ((item.totalSales || 0) * (item.newPrice || basePrice)), 0);
                if (overallRevenue === 0 && overallSold > 0) {
                    overallRevenue = overallSold * basePrice;
                }

                return (
                  <React.Fragment key={p._id}>
                    {mutableItems.map((item, idx) => {
                      const itemSold = item.totalSales || 0;
                      const itemStockAdded = (item.stock || 0) + itemSold;
                      const itemPrice = item.newPrice || basePrice;
                      const itemRevenue = itemSold * itemPrice;

                      return (
                        <tr
                          key={`${p._id}-${idx}`}
                          className="hover:bg-slate-50 border-b border-myblack/5"
                        >
                          <td className="px-6 py-4 align-top w-64">
                            {idx === 0 && (
                              <div className="flex items-center gap-3">
                                <img
                                  className="h-10 w-10 object-contain"
                                  src={
                                    p.image?.startsWith("http")
                                      ? p.image
                                      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${p.image || ""}`
                                  }
                                  alt={p.name}
                                />
                                <div>
                                  <p className="font-productSansReg text-myblack shrink-0 max-w-[150px] truncate">
                                    {p.name}
                                  </p>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center capitalize align-top">
                            {idx === 0 ? p.category : null}
                          </td>
                          <td className="px-6 py-4 font-medium text-myblack/70 align-middle">
                            {item.color}
                          </td>
                          <td className="px-6 py-4 text-center text-myblack/70 align-middle">
                            {item.variant !== "-" ? formatVariant(item.variant) : "-"}
                          </td>
                          <td className="px-6 py-4 text-center align-middle">
                            {itemStockAdded}
                          </td>
                          <td className="px-6 py-4 text-center align-middle">
                            {itemSold}
                          </td>
                          <td className="px-6 py-4 text-center text-emerald-600 font-semibold align-middle">
                            {formatCurrency(itemRevenue)}
                          </td>
                        </tr>
                      );
                    })}

                    <tr
                      key={`${p._id}-total`}
                      className="bg-slate-50/60 hover:bg-slate-100 border-b-[3px] border-slate-200"
                    >
                      <td className="px-6 py-4 font-semibold text-myblack">
                        <span className="ml-[52px]">Total</span>
                      </td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-center font-bold text-myblack">
                        {overallStocksAdded}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-myblack">
                        {overallSold}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">
                        {formatCurrency(overallRevenue)}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!state.loading && state.pages > 1 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: state.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchSalesReport(i + 1)}
              className={`rounded-full px-4 py-2 ${
                state.page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white ring-1 ring-myblack/10 hover:ring-blue-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesReport;
