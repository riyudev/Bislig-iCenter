import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

const Items = (props) => {
  // const params = useParams();
  // const currentCategory = params.category || props.category?.toLowerCase();

  return (
    <div className="tablet:w-40 laptop:max-w-[300px] laptop:w-full to-creamyWhite w-fit cursor-pointer space-y-3 border border-gray-800/20 bg-gradient-to-b from-sky-200/50 via-sky-50 p-2 pt-5 hover:border-blue-500">
      <div className="">
        <img
          src={props.image}
          alt={props.name}
          className="size-60 object-contain"
        />
      </div>
      <p className="laptop:text-lg truncate px-2 text-sm">{props.name}</p>
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="line-through">₱{props.oldPrice}</p>
          <h5 className="">₱{props.newPrice}</h5>
        </div>
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-t from-blue-400/80 via-blue-600/80 to-blue-700/80 p-2 px-5 text-white transition-all duration-150 hover:opacity-80 active:scale-85">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Items;
