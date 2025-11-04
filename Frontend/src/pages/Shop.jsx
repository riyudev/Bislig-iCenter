import React from "react";
import Hero from "../Components/Hero";
import BestSeller from "../Components/BestSeller";
import LatestProduct from "../Components/LatestProduct";
import PromoBanner from "../Components/PromoBanner";

function Shop() {
  return (
    <div className="">
      <Hero />
      <LatestProduct />
      <BestSeller />
      <PromoBanner />
    </div>
  );
}

export default Shop;
