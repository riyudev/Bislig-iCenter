import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendar,
  FaShoppingCart,
  FaBoxOpen,
  FaSortAmountDown,
  FaSortAmountUp,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";
import { fetchJSON } from "../utils/fetchWithRetry";

// ─── Helpers ────────────────────────────────────────────────────────────────
const currency = (v) => {
  const n = Number(v || 0);
  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₱${n.toLocaleString()}`;
  }
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 rounded w-56 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-80 animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl p-5 bg-white shadow-sm">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3 animate-pulse" />
          <div className="h-7 bg-gray-200 rounded w-36 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      ))}
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-5">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── Product Table (with expandable variant rows) ─────────────────────────────
const ProductTable = ({ items, period }) => {
  const [sortKey, setSortKey] = useState("totalSales");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (productId) =>
    setExpanded((e) => ({ ...e, [productId]: !e[productId] }));

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...items].sort((a, b) => {
    const mul = sortDir === "desc" ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  const SortIcon = ({ k }) => {
    if (sortKey !== k)
      return <FaSortAmountDown className="opacity-20 text-xs" />;
    return sortDir === "desc" ? (
      <FaSortAmountDown className="text-xs text-blue-600" />
    ) : (
      <FaSortAmountUp className="text-xs text-blue-600" />
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FaBoxOpen className="text-4xl mb-2 opacity-30" />
        <p className="text-sm">No sales recorded {period}</p>
      </div>
    );
  }

  const grandTotal = items.reduce((s, i) => s + i.totalSales, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-2.5 px-3 text-gray-500 font-medium w-8" />
            <th className="text-left py-2.5 px-3 text-gray-500 font-medium">#</th>
            <th className="text-left py-2.5 px-3 text-gray-500 font-medium">
              Product / Variant
            </th>
            <th className="text-center py-2.5 px-3 text-gray-500 font-medium">
              Color
            </th>
            <th
              className="text-right py-2.5 px-3 text-gray-500 font-medium cursor-pointer hover:text-blue-600 select-none"
              onClick={() => toggleSort("totalQty")}
            >
              <span className="inline-flex items-center gap-1 justify-end">
                Qty Sold <SortIcon k="totalQty" />
              </span>
            </th>
            <th
              className="text-right py-2.5 px-3 text-gray-500 font-medium cursor-pointer hover:text-blue-600 select-none"
              onClick={() => toggleSort("totalSales")}
            >
              <span className="inline-flex items-center gap-1 justify-end">
                Total Sales <SortIcon k="totalSales" />
              </span>
            </th>
            <th className="text-right py-2.5 px-3 text-gray-500 font-medium">
              % Share
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((product, idx) => {
            const pct =
              grandTotal > 0
                ? ((product.totalSales / grandTotal) * 100).toFixed(1)
                : 0;
            const isOpen = !!expanded[product.productId + product.name];
            const hasVariants = product.variants && product.variants.length > 0;

            return (
              <React.Fragment key={product.productId + product.name}>
                {/* ── Product row ─────────────────────────────────────── */}
                <tr
                  className={`border-b border-gray-100 transition-colors ${
                    hasVariants
                      ? "cursor-pointer hover:bg-blue-50/40"
                      : "hover:bg-gray-50"
                  } ${isOpen ? "bg-blue-50/30" : ""}`}
                  onClick={() =>
                    hasVariants && toggleExpand(product.productId + product.name)
                  }
                >
                  {/* expand toggle */}
                  <td className="py-3 px-3 text-gray-400 w-8">
                    {hasVariants ? (
                      isOpen ? (
                        <FaChevronDown className="text-blue-500 text-xs" />
                      ) : (
                        <FaChevronRight className="text-gray-400 text-xs" />
                      )
                    ) : null}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-800">
                      {product.name}
                    </span>
                    {hasVariants && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({product.variants.length} variant
                        {product.variants.length !== 1 ? "s" : ""})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-400 text-xs">—</td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-700">
                    {product.totalQty}
                    <span className="text-gray-400 font-normal text-xs ml-1">
                      units
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    {currency(product.totalSales)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* ── Variant rows (expanded) ─────────────────────────── */}
                {isOpen &&
                  product.variants.map((v, vi) => {
                    const vPct =
                      product.totalSales > 0
                        ? ((v.totalSales / product.totalSales) * 100).toFixed(1)
                        : 0;
                    return (
                      <tr
                        key={`${v.variant}-${v.color}-${vi}`}
                        className="bg-blue-50/20 border-b border-blue-50 hover:bg-blue-50/40 transition-colors"
                      >
                        {/* indent */}
                        <td className="py-2 px-3" />
                        <td className="py-2 px-3" />
                        <td className="py-2 px-3 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                            <span className="text-gray-600 text-xs font-medium">
                              {v.variant || "—"}
                            </span>
                            {v.unitPrice != null && (
                              <span className="text-gray-400 text-xs">
                                · {currency(v.unitPrice)} each
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {v.color ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                              {/* colour swatch — best-effort CSS colour name */}
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-gray-300 shrink-0"
                                style={{ backgroundColor: v.color.toLowerCase() }}
                                title={v.color}
                              />
                              {v.color}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right text-gray-600 text-xs font-medium">
                          {v.totalQty}
                          <span className="text-gray-400 font-normal ml-1">
                            units
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-600 text-xs font-semibold">
                          {currency(v.totalSales)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-12 bg-blue-100 rounded-full h-1">
                              <div
                                className="bg-blue-400 h-1 rounded-full"
                                style={{ width: `${vPct}%` }}
                              />
                            </div>
                            <span className="text-gray-400 text-xs w-10 text-right">
                              {vPct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Period Section ───────────────────────────────────────────────────────────
const PeriodSection = ({
  title,
  subtitle,
  icon: Icon,
  accentClass,
  badgeClass,
  items,
  summary,
  period,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={`px-5 py-4 flex items-center justify-between ${accentClass}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${badgeClass}`}>
            <Icon className="text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Orders</p>
            <p className="font-bold text-gray-700">{summary.orders}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="font-bold text-emerald-700">
              {currency(summary.revenue)}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Products</p>
            <p className="font-bold text-gray-700">{items.length}</p>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs text-blue-600 hover:underline ml-2 whitespace-nowrap"
          >
            {open ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 mb-3">
            Click a product row to expand its variant breakdown.
          </p>
          <ProductTable items={items} period={period} />
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const RevenueBreakdown = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data: d } = await fetchJSON(
        "/api/admin/dashboard/revenue-breakdown"
      );
      if (!ok) throw new Error(d?.message || "Failed to load revenue breakdown");
      setData(d);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-rose-600 font-medium">{error}</p>
          <button onClick={load} className="btn-black px-6 py-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, todayItems, weekItems, monthItems, periods } = data;

  const summaryCards = [
    {
      label: "Today's Revenue",
      value: currency(summary.today.revenue),
      orders: summary.today.orders,
      products: todayItems.length,
      icon: FaCalendarDay,
      color: "bg-emerald-50 ring-1 ring-emerald-100",
      textColor: "text-emerald-800",
      iconBg: "bg-emerald-100 text-emerald-600",
      from: fmtDate(periods.today),
    },
    {
      label: "This Week's Revenue",
      value: currency(summary.week.revenue),
      orders: summary.week.orders,
      products: weekItems.length,
      icon: FaCalendarWeek,
      color: "bg-blue-50 ring-1 ring-blue-100",
      textColor: "text-blue-800",
      iconBg: "bg-blue-100 text-blue-600",
      from: `Since ${fmtDate(periods.weekStart)}`,
    },
    {
      label: "This Month's Revenue",
      value: currency(summary.month.revenue),
      orders: summary.month.orders,
      products: monthItems.length,
      icon: FaCalendar,
      color: "bg-violet-50 ring-1 ring-violet-100",
      textColor: "text-violet-800",
      iconBg: "bg-violet-100 text-violet-600",
      from: `Since ${fmtDate(periods.monthStart)}`,
    },
  ];

  const periodSections = [
    {
      title: "Today's Sales",
      subtitle: fmtDate(periods.today),
      icon: FaCalendarDay,
      accentClass: "bg-emerald-50/60 border-b border-emerald-100",
      badgeClass: "bg-emerald-100 text-emerald-600",
      items: todayItems,
      summary: summary.today,
      period: "today",
    },
    {
      title: "This Week's Sales",
      subtitle: `${fmtDate(periods.weekStart)} – Today`,
      icon: FaCalendarWeek,
      accentClass: "bg-blue-50/60 border-b border-blue-100",
      badgeClass: "bg-blue-100 text-blue-600",
      items: weekItems,
      summary: summary.week,
      period: "this week",
    },
    {
      title: "This Month's Sales",
      subtitle: `${fmtDate(periods.monthStart)} – Today`,
      icon: FaCalendar,
      accentClass: "bg-violet-50/60 border-b border-violet-100",
      badgeClass: "bg-violet-100 text-violet-600",
      items: monthItems,
      summary: summary.month,
      period: "this month",
    },
  ];

  const downloadCSV = () => {
    if (!data) return;

    const rows = [];
    rows.push(["Date", "Product Name", "Variant", "Color", "Unit Price", "Qty Sold", "Total Sales"]);

    const formatRowDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    if (data.csvItems && data.csvItems.length > 0) {
      data.csvItems.forEach((item) => {
        rows.push([
          `"${formatRowDate(item.date)}"`,
          `"${(item.name || "").replace(/"/g, '""')}"`,
          `"${(item.variant || "").replace(/"/g, '""')}"`,
          `"${(item.color || "").replace(/"/g, '""')}"`,
          item.unitPrice || 0,
          item.totalQty || 0,
          item.totalSales || 0,
        ]);
      });

      // Add overall total row
      const totalQty = data.csvItems.reduce((acc, item) => acc + (item.totalQty || 0), 0);
      rows.push(["", "", "", "", "", "", ""]);
      rows.push([
        '"OVERALL TOTAL"',
        '""',
        '""',
        '""',
        '""',
        totalQty,
        summary.month.revenue || 0,
      ]);
    }

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `revenue_breakdown_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-myblack">
            Revenue Breakdown
          </h2>
          <p className="text-sm text-myblack/60">
            Product &amp; variant-level breakdown of revenue — Today · This Week
            · This Month
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            ← Dashboard
          </Link>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            <FaDownload /> Download CSV
          </button>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`rounded-xl p-5 ${c.color} flex items-start gap-4`}
            >
              <div className={`p-2.5 rounded-xl ${c.iconBg} shrink-0`}>
                <Icon className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium opacity-70 ${c.textColor}`}>
                  {c.label}
                </p>
                <p className={`text-2xl font-bold mt-0.5 ${c.textColor}`}>
                  {c.value}
                </p>
                <div className="flex gap-3 mt-1.5 text-xs opacity-60">
                  <span className="flex items-center gap-1">
                    <FaShoppingCart className="text-[10px]" />
                    {c.orders} orders
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBoxOpen className="text-[10px]" />
                    {c.products} products
                  </span>
                </div>
                <p className={`text-xs mt-1 opacity-50 ${c.textColor}`}>
                  {c.from}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PERIOD SECTIONS */}
      <div className="flex flex-col gap-5">
        {periodSections.map((p) => (
          <PeriodSection key={p.title} {...p} />
        ))}
      </div>
    </div>
  );
};

export default RevenueBreakdown;
