import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaStore,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/products", label: "Products", icon: FaBox },
    { path: "/orders", label: "Orders", icon: FaShoppingCart },
    { path: "/shop", label: "Shop", icon: FaStore },
    { path: "/users", label: "Users", icon: FaUsers },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ghostWhite">
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
