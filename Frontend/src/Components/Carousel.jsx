import React, { useState, useEffect, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Carousel = () => {
  const { allProducts } = useContext(ShopContext);
  const slides = allProducts.filter((item) => item.isFeatured);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, []); // ✅ added dependency array

  // const prevSlide = () => {
  //   setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  // };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-2xl overflow-hidden rounded-4xl bg-transparent pb-5">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.length > 0 ? (
          slides.map((product, idx) => (
            <div
              key={idx}
              className="flex w-full flex-shrink-0 items-center justify-center"
            >
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image || ""}`
                }
                alt={product.name}
                className="w-80 object-contain"
              />
            </div>
          ))
        ) : (
          <div className="flex w-full flex-shrink-0 items-center justify-center">
            <p className="py-20 text-slate-500">No featured products.</p>
          </div>
        )}
      </div>

      {/* Left Arrow */}
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60"
      >
        <FaChevronLeft size={20} />
      </button> */}

      {/* Right Arrow */}
      {/* <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-black/40 p-3 text-white transition hover:bg-black/60"
      >
        <FaChevronRight size={20} />
      </button> */}

      {/* Dots */}
      <div className="absolute right-0 bottom-0 left-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index
                ? "bg-myblack"
                : "hover:bg-myblack/30 bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
