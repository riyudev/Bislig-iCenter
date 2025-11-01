import React from "react";
import Wavehand from "../assets/images/wavehand.png";
import Carousel from "./Carousel.jsx";
import { Button } from "flowbite-react";

function Hero() {
  return (
    <div className="to-creamyWhite flex min-h-screen w-full justify-center bg-gradient-to-b from-sky-200/50 via-sky-100/50">
      <div className="flex w-7xl items-center justify-between pl-20">
        <figure>
          <h5 className="mb-6">New Arrivals Only</h5>
          <div className="flex flex-col space-y-3">
            <h1 className="font-productSansBold">High Quality</h1>
            <h1>Products</h1>
            <span className="flex space-x-3.5">
              <h1>For Everyone</h1>
              <img src={Wavehand} alt="Wave" className="w-16" />
            </span>

            <button className="mt-8 cursor-pointer place-self-start rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-700 px-7 py-3 text-white hover:bg-gradient-to-t">
              View Latest iPhones →
            </button>
          </div>
        </figure>

        <Carousel />
      </div>
    </div>
  );
}

export default Hero;
