import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, {
      variant: selectedVariant,
      color: selectedColor,
      quantity: quantity,
    });
  };

  return (
    <div className="laptop:flex-row laptop:space-x-10 laptop:space-y-0 flex flex-col items-center justify-center space-y-8 px-5 py-8">
      {/* Image Gallery */}
      <div className="laptop:h-fit w-fit gap-4">
        <div className="border-myblack/20 col-span-4 row-span-4 overflow-hidden rounded-lg border-2 p-5">
          <img
            src={product.image}
            alt={product.name}
            className="size-96 object-contain"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="laptop:max-w-lg max-w-full space-y-6">
        <h3 className="leading-tight">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center space-x-4">
          {product.oldPrice && (
            <p className="text-myblack/50 text-xl line-through">
              ₱{product.oldPrice}
            </p>
          )}
          <h4 className="font-robotoBold text-blue-600">₱{product.newPrice}</h4>
        </div>

        {/* Description */}
        {/* <div className="border-l-4 border-blue-500 pl-4">
          <p className="text-myblack/80 leading-relaxed">
            {product.description ||
              "Experience cutting-edge technology with this premium gadget from Bislig iCenter. Featuring top-tier specifications and reliable performance for all your digital needs."}
          </p>
        </div> */}

        {/* Specifications/Variants (Storage, RAM, etc.) */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <h5>Select Configuration</h5>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant, index) => (
                <div
                  key={index}
                  onClick={() => handleVariantSelect(variant)}
                  className={`cursor-pointer rounded-lg border-2 p-3 px-4 transition-all duration-200 ${
                    selectedVariant === variant
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-myblack/20 hover:border-blue-400"
                  }`}
                >
                  <p className="font-productSansReg text-sm">{variant}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-3">
            <h5>Select Color</h5>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`cursor-pointer rounded-lg border-2 p-3 px-5 transition-all duration-200 ${
                    selectedColor === color
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-myblack/20 hover:border-blue-400"
                  }`}
                >
                  <p className="font-productSansReg text-sm">{color}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h5>Quantity</h5>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="border-myblack/20 font-robotoBold h-10 w-10 rounded-lg border-2 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
            >
              -
            </button>
            <span className="font-robotoBold w-12 text-center text-xl">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="border-myblack/20 font-robotoBold h-10 w-10 rounded-lg border-2 transition-all duration-200 hover:border-blue-500 hover:text-blue-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="btn-blue font-productSansBold px-10 py-4 text-lg tracking-wide uppercase"
        >
          Add to Cart
        </button>

        {/* Product Info */}
        <div className="border-myblack/10 space-y-2 border-t-2 pt-4">
          <p className="text-base">
            <span className="font-productSansBold">Category:</span>{" "}
            <span className="text-myblack/70">{product.category}</span>
          </p>
          <p className="text-base">
            <span className="font-productSansBold">Availability:</span>{" "}
            <span className="font-productSansReg text-green-600">
              In Stock at Bislig iCenter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
