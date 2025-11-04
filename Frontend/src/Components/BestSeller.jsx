import React from "react";
import Item from "./Items";
import { bestSeller } from "../assets/data/BestSellerData";

function BestSeller() {
  return (
    <section id="bestSeller" className="scroll-mt-20 place-items-center py-20">
      <div className="w-7xl space-y-10 px-5">
        <header className="place-items-center space-y-4">
          <h2>This Month's Best Seller</h2>
          <hr className="w-40 border-[3px] border-blue-500" />
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
