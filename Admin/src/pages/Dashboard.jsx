import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaChartLine,
  FaExclamationTriangle,
  FaBox,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch("/api/admin/dashboard/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load dashboard stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currency = (value) => {
    const n = Number(value || 0);
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

  const monthLabel = (monthNumber) =>
    new Date(2000, Math.max(0, Number(monthNumber || 1) - 1), 1).toLocaleString(
      "en-US",
      { month: "short" }
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
        {/* HEADER SKELETON */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* REVENUE CARDS SKELETON */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT SKELETON */}
        <div className="grid grid-cols-3 gap-6 flex-1">
          {/* CHART SKELETON */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="flex-1 bg-gray-100 rounded animate-pulse"></div>
          </div>

          {/* SIDE STATS SKELETON */}
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const s = stats || {
    totalOrders: 0,
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0,
    revenueByMonth: [],
  };

  const revenueCards = [
    {
      label: "Today's Revenue",
      value: currency(s.revenueToday),
      icon: FaChartLine,
      color: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    },
    {
      label: "This Week",
      value: currency(s.revenueWeek),
      icon: FaChartLine,
      color: "bg-blue-50 text-blue-800 ring-1 ring-blue-100",
    },
    {
      label: "This Month",
      value: currency(s.revenueMonth),
      icon: FaChartLine,
      color: "bg-violet-50 text-violet-800 ring-1 ring-violet-100",
    },
  ];

  const opsCards = [
    {
      label: "Total Orders",
      value: s.totalOrders,
      icon: FaShoppingCart,
      color: "bg-slate-50 text-slate-800 ring-1 ring-slate-200",
    },
    {
      label: "Today's Orders",
      value: s.todayOrders,
      icon: FaShoppingCart,
      color: "bg-amber-50 text-amber-900 ring-1 ring-amber-100",
    },
    {
      label: "Pending",
      value: s.pendingOrders,
      icon: FaExclamationTriangle,
      color: "bg-rose-50 text-rose-800 ring-1 ring-rose-100",
    },
    {
      label: "Low Stock Products",
      value: s.lowStockProducts,
      icon: FaBox,
      color: "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100",
    },
  ];

  const revenueSeries = (s.revenueByMonth || []).map((m) => ({
    name: monthLabel(m.month),
    total: Number(m.total || 0),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-myblack">Dashboard</h2>
          <p className="text-sm text-myblack/60">
            Overview of your store performance
          </p>
        </div>

        <div className="flex gap-3">
          <Link className="btn-black px-5 py-2" to="/products">
            Products
          </Link>
          <Link className="btn-black px-5 py-2" to="/orders">
            Orders
          </Link>
        </div>
      </div>

      {/* REVENUE CARDS */}
      <div className="grid grid-cols-3 gap-4">
        {revenueCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`rounded-xl p-4 flex items-center justify-between ${c.color}`}
            >
              <div>
                <p className="text-xs opacity-70">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>

              <Icon className="text-2xl opacity-40" />
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* CHART */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold">Sales Performance</h4>
              <p className="text-xs text-myblack/60">
                Monthly revenue ({new Date().getFullYear()})
              </p>
            </div>

            <p className="font-bold text-lg text-myblack">
              {currency(s.totalRevenue)}
            </p>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.08)"
                />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip formatter={(value) => currency(value)} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDE STATS */}
        <div className="flex flex-col gap-4">
          {opsCards.map((c) => {
            const Icon = c.icon;

            return (
              <div
                key={c.label}
                className={`rounded-xl p-4 flex items-center justify-between ${c.color}`}
              >
                <div>
                  <p className="text-xs opacity-70">{c.label}</p>
                  <p className="text-xl font-bold">{c.value}</p>
                </div>

                <Icon className="text-xl opacity-40" />
              </div>
            );
          })}

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h4 className="font-semibold text-sm mb-2">Orders Snapshot</h4>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>This week</span>
                <span className="font-semibold">{s.weekOrders}</span>
              </div>

              <div className="flex justify-between">
                <span>This month</span>
                <span className="font-semibold">{s.monthOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
