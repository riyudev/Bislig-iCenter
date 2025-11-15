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

  const parsePrice = (val) => {
    if (val === null || val === undefined) return null;
    const num =
      typeof val === "number"
        ? val
        : Number(String(val).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : null;
  };
  // Format price with commas
  const formatPrice = (value) => {
    const num = parsePrice(value);
    return Number.isFinite(num)
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(num)
      : value;
  };

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-ghostWhite rounded-full p-6">
              <ShoppingCart className="text-myblack h-16 w-16" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h3>
          <p className="max-w-md text-gray-600">
            Looks like you haven't added any items to your cart yet. Start
            shopping to find amazing gadgets!
          </p>
          <Link
            to="/"
            className="btn-black inline-flex items-center gap-2 px-8 py-3"
          >
            Start Shopping
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ghostWhite laptop:px-8 laptop:py-40 min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h2 className="text-myblack text-4xl font-bold">Shopping Cart</h2>
          <p className="text-myblack/70">
            {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"}{" "}
            in your cart
          </p>
        </div>

        <div className="laptop:flex laptop:gap-8">
          {/* Cart Items Section */}
          <div className="laptop:flex-1 space-y-4">
            {/* Select All */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm ring-1 ring-slate-200/60 ring-inset">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAllChecks(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-800">
                  Select All Items
                </span>
              </label>
            </div>

            {/* Cart Items */}
            {cartProducts.map((product) => {
              const cartItemId = product.cartItemId;
              const isChecked = checkedItems[cartItemId];

              return (
                <div
                  key={cartItemId}
                  className={`group overflow-hidden rounded-2xl border bg-white/80 shadow-sm transition-all duration-300 ${
                    isChecked
                      ? "border-2 border-blue-400 shadow-blue-100 ring-blue-200"
                      : "ring-slate-300 ring-inset hover:ring-1"
                  }`}
                >
                  <div className="laptop:p-6 p-4">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleItemCheck(cartItemId)}
                          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="shrink-0">
                        <div className="laptop:h-32 laptop:w-32 h-24 w-24 overflow-hidden rounded-xl bg-linear-to-b from-slate-50 to-slate-100 p-2 ring-1 ring-slate-200/60 ring-inset">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="laptop:text-xl mb-2 truncate text-lg font-bold text-gray-900">
                          {product.name}
                        </h4>

                        <div className="mb-3 space-y-1">
                          {product.storage && product.storage !== "Default" && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Storage:</span>{" "}
                              {product.storage}
                            </p>
                          )}
                          {product.color && product.color !== "Default" && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Color:</span>{" "}
                              {product.color}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          {/* Price */}
                          <div className="space-y-1">
                            <p className="font-productSansBold text-2xl text-slate-900">
                              {formatPrice(product.newPrice)}
                            </p>
                            {product.oldPrice && (
                              <p className="font-productSansLight text-sm text-slate-400 line-through">
                                {formatPrice(product.oldPrice)}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 rounded-full bg-slate-50 p-2">
                            <button
                              onClick={() => removeOneFromCart(cartItemId)}
                              className="border-myblack/20 text-myblack/80 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-robotoBold w-8 text-center text-lg">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                addToCart(
                                  product.id,
                                  product.storage,
                                  product.color,
                                )
                              }
                              className="border-myblack/20 text-myblack/80 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(cartItemId)}
                            className="ml-auto flex items-center gap-2 font-semibold text-red-600 transition-colors hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="laptop:inline hidden">Remove</span>
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
          <div className="laptop:w-96 laptop:mt-0 mt-6">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/60 ring-inset">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Order Summary
              </h3>

              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-productSansBold text-slate-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="font-productSansBold text-2xl text-slate-900">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={totalAmount === 0}
                className="btn-black flex w-full items-center justify-center gap-2 px-6 py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {totalAmount === 0 && (
                <p className="mt-3 text-center text-sm text-gray-500">
                  Select items to checkout
                </p>
              )}

              <div className="mt-6 border-t border-gray-200 pt-6">
                <Link
                  to="/"
                  className="text-myblack hover:text-myblack/80 flex items-center justify-center gap-2 font-semibold transition-colors"
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
