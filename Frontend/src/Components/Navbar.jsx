import React from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import { CiSearch } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";

function Navbar() {
  return (
    <nav className="fixed flex w-full flex-col items-center justify-center border-b p-2">
      <div className="flex w-7xl items-center justify-between p-2">
        <div className="flex items-center space-x-56">
          <div className="flex items-center gap-x-2">
            <img src={Logo} alt="" className="w-16" />
            <h4>Bislig iCenter</h4>
          </div>

          <div className="border-myblack flex w-[400px] justify-between rounded-full border">
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
          <div className="flex items-center gap-x-3">
            <BsCart className="text-myblack text-2xl" />
          </div>

          <div>
            <FaRegUser className="text-myblack text-2xl" />
          </div>
        </div>
      </div>

      <ul className="font-productSansReg flex w-7xl justify-center gap-10 p-2 tracking-wider">
        <li className="decoration underline-offset-8 hover:underline">
          Laptop
        </li>
        <li className="decoration underline-offset-8 hover:underline">
          iPhone
        </li>
        <li className="decoration underline-offset-8 hover:underline">iPad</li>
        <li className="decoration underline-offset-8 hover:underline">
          Android
        </li>
        <li className="decoration underline-offset-8 hover:underline">
          PC Build
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
