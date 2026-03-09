import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaChartLine,
  FaExclamationTriangle,
  FaBox,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch("/api/admin/dashboard/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const s =
    stats ||
    ({
      totalOrders: 0,
      todayOrders: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
    });

  const cards = [
    {
      label: "Total Orders",
      value: s.totalOrders,
      icon: FaShoppingCart,
      color: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    },
    {
      label: "Today's Orders",
      value: s.todayOrders,
      icon: FaChartLine,
      color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    },
    {
      label: "Pending",
      value: s.pendingOrders,
      icon: FaExclamationTriangle,
      color: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    },
    {
      label: "Low Stock Products",
      value: s.lowStockProducts,
      icon: FaBox,
      color: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2>Dashboard</h2>
          <p className="text-myblack/70">Quick overview of your store.</p>
        </div>
        <div className="flex gap-3">
          <Link className="btn-black px-6 py-3" to="/products">
            Manage Products
          </Link>
          <Link className="btn-black px-6 py-3" to="/orders">
            View Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`rounded-2xl p-5 ${c.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-productSansReg">{c.label}</p>
                  <p className="text-3xl font-robotoBold">{c.value}</p>
                </div>
                <Icon className="text-3xl opacity-50" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
