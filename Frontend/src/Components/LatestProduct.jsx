import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Items from "./Items";
import ItemSkeleton from "../helpers/ItemSkeleton";

function LatestProduct() {
  const { allProducts, productsLoading } = useContext(ShopContext);
  const latestItem = allProducts?.filter((item) => item.isNew) || [];
  const latestItemsToDisplay = latestItem.slice(0, 4);
  const skeletonCount = Math.max(0, 4 - latestItemsToDisplay.length);

  return (
    <section className="place-items-center py-20">
      <div className="w-7xl space-y-10 px-5">
        <header className="place-items-center space-y-4">
          <h2>See What's New</h2>
          <hr />
        </header>

        <div className="laptop:grid-cols-4 tablet:gap-x-6 grid w-fit grid-cols-2 gap-x-3 place-self-center">
          {productsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ItemSkeleton key={`loading-${i}`} />)
          ) : (
            <>
              {latestItemsToDisplay.map((item, i) => {
                return (
                  <Items
                    key={i}
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    newPrice={item.newPrice}
                    oldPrice={item.oldPrice}
                    category={item.category}
                  />
                );
              })}
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

export default LatestProduct;
