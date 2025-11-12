import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cartItems,
    checkedItems,
    getCartProducts,
    removeFromCart,
    addToCart,
    removeOneFromCart,
    toggleItemCheck,
    toggleAllChecks,
    areAllItemsChecked,
    getTotalCartAmount,
    generateCartItemId,
  } = useContext(ShopContext);

  const cartProducts = getCartProducts();
  const totalAmount = getTotalCartAmount();
  const allChecked = areAllItemsChecked();

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-creamyWhite p-6">
              <ShoppingCart className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h3>
          <p className="text-gray-600 max-w-md">
            Looks like you haven't added any items to your cart yet. Start shopping to find amazing gadgets!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold transition-all duration-200 hover:bg-blue-700 hover:scale-105"
          >
            Start Shopping
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creamyWhite px-4 py-8 laptop:px-8 laptop:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h2 className="text-4xl font-bold text-myblack">Shopping Cart</h2>
          <p className="text-myblack/70">
            {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="laptop:flex laptop:gap-8">
          {/* Cart Items Section */}
          <div className="laptop:flex-1 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAllChecks(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-semibold text-gray-800">Select All Items</span>
              </label>
            </div>

            {/* Cart Items */}
            {cartProducts.map((product) => {
              const cartItemId = product.cartItemId;
              const isChecked = checkedItems[cartItemId];

              return (
                <div
                  key={cartItemId}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${
                    isChecked
                      ? "border-blue-500 shadow-blue-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-4 laptop:p-6">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleItemCheck(cartItemId)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="shrink-0">
                        <div className="h-24 w-24 laptop:h-32 laptop:w-32 rounded-lg border-2 border-gray-100 bg-white p-2 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg laptop:text-xl font-bold text-gray-900 mb-2 truncate">
                          {product.name}
                        </h4>
                        
                        <div className="space-y-1 mb-3">
                          {product.storage && product.storage !== "Default" && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Storage:</span> {product.storage}
                            </p>
                          )}
                          {product.color && product.color !== "Default" && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Color:</span> {product.color}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          {/* Price */}
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-blue-600">
                              ₱{formatPrice(product.newPrice)}
                            </p>
                            {product.oldPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                ₱{formatPrice(product.oldPrice)}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                            <button
                              onClick={() => removeOneFromCart(cartItemId)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-bold text-lg w-8 text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(product.id, product.storage, product.color)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-400 active:scale-95"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(cartItemId)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors ml-auto"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="hidden laptop:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="laptop:w-96 mt-6 laptop:mt-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₱{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₱{formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={totalAmount === 0}
                className={`w-full rounded-lg px-6 py-4 text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  totalAmount === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-100"
                }`}
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {totalAmount === 0 && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  Select items to checkout
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
