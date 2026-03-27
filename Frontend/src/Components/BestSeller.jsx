import React, { useContext } from "react";
import Item from "./Items";
import { ShopContext } from "../context/ShopContext";
import ItemSkeleton from "../helpers/ItemSkeleton";

function BestSeller() {
  const { allProducts, productsLoading } = useContext(ShopContext);
  const bestSeller = allProducts?.filter((item) => item.isBestSeller) || [];
  const bestSellersToDisplay = bestSeller.slice(0, 3);
  const skeletonCount = Math.max(0, 3 - bestSellersToDisplay.length);

  return (
    <section id="bestSeller" className="scroll-mt-20 place-items-center py-20">
      <div className="w-7xl space-y-10 px-5">
        <header className="place-items-center space-y-4">
          <h2>This Month's Best Seller</h2>
          <hr />
        </header>

        <div className="laptop:grid-cols-3 tablet:gap-x-6 grid w-fit grid-cols-2 gap-x-3 place-self-center">
          {productsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ItemSkeleton key={`loading-${i}`} />)
          ) : (
            <>
              {bestSellersToDisplay.map((item, i) => (
                <Item
                  key={i}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  newPrice={item.newPrice}
                  oldPrice={item.oldPrice}
                  category={item.category}
                />
              ))}
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <ItemSkeleton key={`placeholder-${i}`} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
