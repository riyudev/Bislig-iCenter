import React from "react";
import { latestItem } from "../assets/data/LatestItem";
import Items from "./Items";

function LatestProduct() {
  return (
    <section className="place-items-center py-20">
      <div className="w-7xl space-y-10 px-5">
        <header className="place-items-center space-y-4">
          <h2>See What's New</h2>
          <hr className="w-40 border-[3px] border-blue-500" />
        </header>

        <div className="laptop:grid-cols-4 tablet:gap-x-6 grid w-fit grid-cols-2 gap-x-3 place-self-center">
          {latestItem.map((item, i) => {
            return (
              <Items
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

export default LatestProduct;
