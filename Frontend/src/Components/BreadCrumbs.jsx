import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

const BreadCrumbs = ({ product }) => {
  if (!product) return null;

  return (
    <div className="mb-2 laptop:mb-1.5 flex w-full items-center text-[11px] laptop:text-sm text-gray-600">
      {/* Home */}
      <Link to="/" className="flex items-center transition hover:text-black shrink-0">
        <FaHome className="mr-1 mb-0.5 text-gray-500" />
        Shop
      </Link>

      {/* Divider */}
      <IoChevronForward className="mx-1 laptop:mx-2 text-gray-400 shrink-0" />

      {/* Category */}
      <Link
        to={`/${product.category}`}
        className="capitalize transition hover:text-black shrink-0"
      >
        {product.category}
      </Link>

      {/* Divider */}
      <IoChevronForward className="mx-1 laptop:mx-2 text-gray-400 shrink-0" />

      {/* Product Name */}
      <span className="font-medium text-black truncate">{product.name}</span>
    </div>
  );
};

export default BreadCrumbs;
