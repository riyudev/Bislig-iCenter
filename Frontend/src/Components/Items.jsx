import React from "react";
import { Link, useParams } from "react-router-dom";

const Items = (props) => {
  // const params = useParams();
  // const currentCategory = params.category || props.category?.toLowerCase();

  return (
    <card className="tablet:w-40 laptop:max-w-[300px] laptop:w-full w-fit space-y-3 border border-gray-800/20 bg-gray-800/10 p-2 pt-5 hover:border-blue-500">
      <div className="">
        <img
          src={props.image}
          alt={props.name}
          className="size-60 object-contain"
        />
      </div>
      <p className="laptop:text-lg text-sm text-wrap">{props.name}</p>
      <div>
        <p className="line-through">₱{props.oldPrice}</p>
        <h5 className="">₱{props.newPrice}</h5>
      </div>
    </card>
  );
};

export default Items;
