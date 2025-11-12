import React, { useContext } from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import { CiSearch } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
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
    <nav className="bg-creamyWhite fixed z-50 flex w-full flex-col items-center justify-center border-b pb-2">
      <div className="flex w-7xl items-center justify-between py-2">
        <div className="flex items-center space-x-60">
          <a href="/">
            <div className="flex items-center gap-x-2">
              <img src={Logo} alt="" className="w-16" />
              <h4>Bislig iCenter</h4>
            </div>
          </a>

          <div className="border-myblack flex w-[385px] justify-between rounded-full border">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-5 outline-none"
            />
            <button className="bg-myblack rounded-r-full p-1 px-4">
              <CiSearch className="text-3xl text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-3.5">
          <NavLink to="/login">
            <FaRegUser className="text-myblack text-2xl hover:text-blue-600" />
          </NavLink>
          <NavLink to="/cart" className="relative cursor-pointer p-2">
            <BsCart className="text-myblack text-2xl hover:text-blue-600" />
            <p className="absolute top-0 ml-3 rounded-full bg-red-500/90 px-2 text-[12px] text-white">
              {getTotalCartItems()}
            </p>
          </NavLink>
        </div>
      </div>

      <ul className="font-productSansReg flex w-7xl justify-center gap-10 p-2 tracking-wider">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 underline underline-offset-8"
                : "hover:text-blue-500"
            }
          >
            <li>{link.label}</li>
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
