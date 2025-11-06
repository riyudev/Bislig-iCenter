import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Items from "../Components/Items";
import { IoMdArrowDropdown } from "react-icons/io";

const ShopCategory = (props) => {
  const { allProducts } = useContext(ShopContext);

  const categoryLower = props.category.toLowerCase();

  return (
    <div className="mb-20 flex flex-col items-center">
      <div className="mb-10 pt-24"></div>

      <div className="laptop:mb-24 mb-16 w-full max-w-7xl px-5">
        <div className="mb-6 flex items-center justify-between">
          <p className="laptop:text-lg text-sm">
            <span className="font-sfproSemiBold">Showing 1-12</span> out of 36
            products
          </p>

          <button className="laptop:text-lg flex items-center rounded-full border-2 p-2 px-4 text-sm text-nowrap">
            Sort by <IoMdArrowDropdown />
          </button>
        </div>

        <div className="laptop:grid-cols-4 laptop:gap-x-6 grid grid-cols-2 gap-5">
          {allProducts.map((item, i) => {
            if (props.category === item.category) {
              return (
                <Items
                  key={i}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  newPrice={item.newPrice}
                  oldPrice={item.oldPrice}
                  category={categoryLower}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>

      <button className="btn-blue cursor-pointer place-self-center px-8 py-3">
        Explore More
      </button>
    </div>
  );
};

export default ShopCategory;
