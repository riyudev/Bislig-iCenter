import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumbs = ({ product }) => {
  if (!product) return null;

  return (
    <div className="mb-1.5 flex w-full items-center text-sm text-gray-600">
      {/* Home */}
      <Link to="/" className="flex items-center transition hover:text-black">
        <FaHome className="mr-1 text-gray-500" />
        Shop
      </Link>

      {/* Divider */}
      <IoChevronForward className="mx-2 text-gray-400" />

      {/* Category */}
      <Link
        to={`/${product.category}`}
        className="capitalize transition hover:text-black"
      >
        {product.category}
      </Link>

      {/* Divider */}
      <IoChevronForward className="mx-2 text-gray-400" />

      {/* Product Name */}
      <span className="font-medium text-black">{product.name}</span>
    </div>
  );
};

export default Breadcrumbs;
