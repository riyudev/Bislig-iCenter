import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import ProductDisplay from "../Components/ProductDisplay";
import Breadcrumbs from "../Components/BreadCrumbs";

function Product() {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  const product =
    allProducts.find((e) => String(e._id) === productId) ||
    allProducts.find((e) => String(e.id) === productId);

  if (!product) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-[9%] pt-36">
        <p className="text-myblack/70 text-lg">
          Product not found or is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 laptop:px-[9%] pt-20 laptop:pt-36 pb-20">
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
    </div>
  );
}

export default Product;
