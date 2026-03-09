import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/products", label: "Products", icon: FaBox },
    { path: "/orders", label: "Orders", icon: FaShoppingCart },
    { path: "/inventory", label: "Inventory", icon: FaChartLine },
    { path: "/users", label: "Users", icon: FaUsers },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-ghostWhite">
      <aside className="w-72 bg-white shadow-sm">
        <div className="p-6 border-b">
          <h4 className="text-myblack">Admin Panel</h4>
          <p className="text-myblack/60 text-sm">Bislig iCenter</p>
        </div>

        <nav className="p-3 space-y-1">
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

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-myblack/10 bg-white px-4 py-3 text-myblack hover:border-blue-500"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
