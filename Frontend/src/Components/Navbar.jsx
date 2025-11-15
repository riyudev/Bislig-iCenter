import React, { useContext } from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import { FaFacebookF, FaInstagram, FaRegUser, FaTiktok } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const navLinks = [
    { path: "/", label: "Shop" },
    { path: "/laptop", label: "Laptop" },
    { path: "/iphone", label: "iPhone" },
    { path: "/ipad", label: "iPad" },
    { path: "/android", label: "Android" },
  ];

  const { getTotalCartItems } = useContext(ShopContext);

  return (
    <nav className="bg-ghostWhite/80 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-8">
          <a href="/" className="inline-flex items-center gap-2">
            <img src={Logo} alt="Bislig iCenter Logo" className="w-16" />
            <h4>BiSLIG iCENTER</h4>
          </a>

          <div className="group relative flex w-[420px] max-w-md items-center overflow-hidden rounded-full border bg-white/70 ring-1 ring-slate-200/70 ring-inset focus-within:ring-sky-300">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-5 text-sm outline-none placeholder:text-slate-400"
            />
            <button className="btn-black rounded-full px-5 py-2.5">
              <CiSearch className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <p className="tracking-wider">Follow us on</p>
          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaFacebookF className="text-sm text-white" />
          </a>

          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaInstagram className="text-sm text-white" />
          </a>

          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaTiktok className="text-sm text-white" />
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-7xl items-center justify-between gap-2 py-2">
        <p className="ml-[280px] space-x-2.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full px-4 py-2 text-sm tracking-wide transition ${
                  isActive
                    ? "bg-myblack text-white shadow"
                    : "hover:text-myblack text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </p>

        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <FaRegUser className="text-myblack text-2xl" />
          </NavLink>
          <NavLink
            to="/cart"
            className="relative rounded-full p-2 transition hover:bg-slate-100"
          >
            <BsCart className="text-myblack text-2xl" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] text-white shadow">
              {getTotalCartItems()}
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
