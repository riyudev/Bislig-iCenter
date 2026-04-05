import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Items from "../Components/Items";
import ItemSkeleton from "../helpers/ItemSkeleton";

const ShopCategory = (props) => {
  const { allProducts } = useContext(ShopContext);
  const [showAll, setShowAll] = useState(false);

  const categoryLower = props.category.toLowerCase();

  const categoryProducts = allProducts.filter(
    (item) => String(item.category || "").toLowerCase() === categoryLower
  );

  const itemsToDisplay = showAll ? categoryProducts : categoryProducts.slice(0, 8);
  const skeletonCount = (!showAll && itemsToDisplay.length < 8) ? 8 - itemsToDisplay.length : 0;

  return (
    <div className="mb-20 flex flex-col items-center">
      {/* Top spacer to account for fixed navbar */}
      <div className="mb-4 pt-20 laptop:mb-10 laptop:pt-[120px]"></div>

      <div className="laptop:mb-24 mb-16 w-full max-w-7xl px-5">
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-3xl laptop:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 capitalize">
            The {props.category} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">Collection</span>
          </h2>
          <p className="text-gray-500 max-w-xl text-sm laptop:text-base leading-relaxed">
            Discover our curated selection of premium {categoryLower} devices. 
            Engineered for excellence and designed to elevate your digital lifestyle.
          </p>
        </div>

        <div className="laptop:grid-cols-4 laptop:gap-x-6 grid grid-cols-2 gap-5 place-items-center">
          {itemsToDisplay.map((item, i) => (
            <Items
              key={item._id || i}
              id={item._id || item.id}
              name={item.name}
              image={item.image}
              newPrice={item.stockItems?.[0]?.newPrice ?? item.newPrice}
              oldPrice={item.stockItems?.[0]?.oldPrice ?? item.oldPrice}
              category={categoryLower}
            />
          ))}
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ItemSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>

      {!showAll && categoryProducts.length > 8 && (
        <button 
          onClick={() => setShowAll(true)}
          className="btn-black cursor-pointer place-self-center px-8 py-3"
        >
          Explore More
        </button>
      )}
    </div>
  );
};

export default ShopCategory;
