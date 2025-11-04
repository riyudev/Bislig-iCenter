import React from "react";
import Hero from "../Components/Hero";
import BestSeller from "../Components/BestSeller";
import LatestProduct from "../Components/LatestProduct";
import PromoBanner from "../Components/PromoBanner";
import NewsletterSignup from "../Components/NewsLetter";

function Shop() {
  return (
    <div className="">
      <Hero />
      <LatestProduct />
      <PromoBanner />
      <BestSeller />
      <NewsletterSignup />
    </div>
  );
}

export default Shop;
