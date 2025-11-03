import React from "react";
import Item from "./Items";
import { bestSeller } from "../assets/BestSellerData";

function BestSeller() {
  return (
    <section
      id="bestSeller"
      className="min-h-screen scroll-mt-20 place-items-center pt-20"
    >
      <div className="w-7xl space-y-10 px-5 pb-20">
        <header className="place-items-center space-y-3.5">
          <h2>Our Best Seller Products</h2>
          <hr className="w-40 border-[3px]" />
        </header>

        <div className="laptop:grid-cols-3 tablet:gap-x-6 grid w-fit grid-cols-2 gap-x-3 place-self-center">
          {bestSeller.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                newPrice={item.newPrice}
                oldPrice={item.oldPrice}
                category={item.category}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
