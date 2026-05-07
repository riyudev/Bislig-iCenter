import React, { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaStore,
  FaUsers,
  FaSignOutAlt,
  FaEnvelope,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import { fetchJSON } from "../utils/fetchWithRetry";
import LowStockAlertModal from "./LowStockAlertModal";

const LOW_STOCK_SESSION_KEY = "admin_low_stock_shown";

const AdminLayout = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Low-stock modal state ───────────────────────────────────────────────
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);

  const loadLowStock = useCallback(async () => {
    // Show once per login session — flag is cleared on logout
    if (sessionStorage.getItem(LOW_STOCK_SESSION_KEY)) return;

    setLowStockLoading(true);
    try {
      const { ok, data } = await fetchJSON("/api/admin/products/low-stock");
      if (ok && Array.isArray(data)) {
        setLowStockProducts(data);
      }
    } catch (e) {
      console.error("Low stock fetch error:", e);
    } finally {
      setLowStockLoading(false);
      setShowLowStockModal(true);
      sessionStorage.setItem(LOW_STOCK_SESSION_KEY, "1");
    }
  }, []);

  useEffect(() => {
    loadLowStock();
  }, [loadLowStock]);

  const handleGoToInventory = () => {
    setShowLowStockModal(false);
    navigate("/products");
  };
  // ───────────────────────────────────────────────────────────────────────

  const menuItems = [
    { path: "/", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/shop", label: "Shop", icon: FaStore },
    { path: "/products", label: "Inventory", icon: FaBox },
    { path: "/orders", label: "Orders", icon: FaShoppingCart },
    { path: "/sales-report", label: "Sales Report", icon: FaChartBar },
    { path: "/revenue-breakdown", label: "Revenue Breakdown", icon: FaChartPie },
    { path: "/users", label: "Users", icon: FaUsers },
    { path: "/newsletters", label: "News Letters", icon: FaEnvelope },
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ghostWhite">
      {/* ── Low Stocks Alert Modal — fires once per login, on every page ── */}
      <LowStockAlertModal
        isOpen={showLowStockModal}
        onClose={() => setShowLowStockModal(false)}
        onGoToInventory={handleGoToInventory}
        products={lowStockProducts}
        loading={lowStockLoading}
      />

      <aside className="z-10 flex h-full w-72 flex-shrink-0 flex-col bg-white shadow-sm">
        <div className="border-b p-6">
          <h4 className="text-myblack">Admin Panel</h4>
          <p className="text-sm text-myblack/60">Bislig iCenter</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-myblack hover:bg-slate-50"
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-productSansReg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-myblack/10 bg-white px-4 py-3 text-myblack transition-colors hover:border-blue-500 hover:text-blue-600"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
