import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import ProductDisplay from "../Components/ProductDisplay";
import Breadcrumbs from "../Components/BreadCrumbs";

function Product() {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  const product = allProducts.find((e) => String(e.id) === productId);

  return (
    <div className="flex w-full flex-col items-center justify-center px-[5%] pt-36">
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
    </div>
  );
}

export default Product;
