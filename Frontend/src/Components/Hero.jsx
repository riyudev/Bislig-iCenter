import React from "react";
import Wavehand from "../assets/hero/wavehand.png";
import Carousel from "./Carousel.jsx";
import { Button } from "flowbite-react";

function Hero() {
  return (
    <div className="to-ghostWhite flex min-h-screen w-full justify-center bg-gradient-to-b from-sky-200/50 via-sky-100/50">
      <div className="flex w-7xl items-center justify-between pt-20 pl-20">
        <figure>
          <h5 className="mb-6">New Arrivals Only</h5>
          <div className="flex flex-col space-y-3">
            <h1 className="font-productSansBold">High Quality</h1>
            <h1>Products</h1>
            <span className="flex space-x-3.5">
              <h1>For Everyone</h1>
              <img src={Wavehand} alt="Wave" className="w-16" />
            </span>

            <a href="#bestSeller">
              <button className="btn-black laptop:w-fit mt-8 w-full cursor-pointer place-self-start px-8 py-3">
                View Best Seller →
              </button>
            </a>
          </div>
        </figure>

        <Carousel />
      </div>
    </div>
  );
}

export default Hero;
