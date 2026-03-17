import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const cartProducts = getCartProducts();
  const totalAmount = getTotalCartAmount();
  const allChecked = areAllItemsChecked();
  const selectedCount = cartProducts.filter(
    (p) => checkedItems[p.cartItemId],
  ).length;

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
    <div className="bg-ghostWhite laptop:px-8 laptop:py-40 laptop:pb-36 min-h-screen px-4 py-8 pb-32">
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
            <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm ring-1 ring-slate-200/60 ring-inset">
              <div className="laptop:grid laptop:grid-cols-12 laptop:items-center hidden px-5 py-3 text-sm font-semibold text-slate-600">
                <div className="col-span-1 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => toggleAllChecks(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Product</span>
                </div>
                <div className="col-span-5"></div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
            </div>

            {/* Cart Items */}
            {cartProducts.map((product) => {
              const cartItemId = product.cartItemId;
              const isChecked = checkedItems[cartItemId];
              const unit = parsePrice(product.newPrice) || 0;
              const lineTotal = unit * product.quantity;

              return (
                <div
                  key={cartItemId}
                  className={`group overflow-hidden rounded-2xl border bg-white/80 shadow-sm transition-all duration-300 ${
                    isChecked
                      ? "border-2 border-blue-400 shadow-blue-100 ring-blue-200"
                      : "ring-slate-300 ring-inset hover:ring-1"
                  }`}
                >
                  <div className="laptop:p-5 p-4">
                    <div className="laptop:grid laptop:grid-cols-12 laptop:items-center gap-4">
                      <div className="laptop:col-span-1 flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleItemCheck(cartItemId)}
                          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="laptop:hidden text-sm font-semibold text-slate-700">
                          Product
                        </div>
                      </div>

                      <div className="laptop:col-span-5 flex gap-4">
                        <div className="shrink-0">
                          <div className="laptop:h-24 laptop:w-24 h-20 w-20 overflow-hidden rounded-xl bg-linear-to-b from-slate-50 to-slate-100 p-2 ring-1 ring-slate-200/60 ring-inset">
                            <img
                              src={
                                product.image?.startsWith("http")
                                  ? product.image
                                  : `http://localhost:5000${product.image || ""}`
                              }
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="laptop:text-lg mb-1 truncate text-base font-bold text-gray-900">
                            {product.name}
                          </h4>
                          <div className="space-y-0.5 text-sm text-gray-600">
                            {product.storage &&
                              product.storage !== "Default" && (
                                <p>
                                  <span className="font-semibold">
                                    Storage:
                                  </span>{" "}
                                  {product.storage}
                                </p>
                              )}
                            {product.color && product.color !== "Default" && (
                              <p>
                                <span className="font-semibold">Color:</span>{" "}
                                {product.color}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="laptop:col-span-2 text-center">
                        <p className="font-productSansBold text-lg text-slate-900">
                          {formatPrice(unit)}
                        </p>
                        {product.oldPrice && (
                          <p className="font-productSansLight text-xs text-slate-400 line-through">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}
                      </div>

                      <div className="laptop:col-span-2 flex items-center justify-center">
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
                                  product._id || product.id,
                                  product.storage,
                                  product.color,
                                )
                              }
                            className="border-myblack/20 text-myblack/80 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="laptop:col-span-2 text-center">
                        <p className="font-productSansBold text-lg text-slate-900">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>

                      <div className="laptop:col-span-12 laptop:col-start-auto laptop:row-start-auto laptop:mt-0 mt-3 flex items-center justify-end gap-3">
                        <button
                          onClick={() => removeFromCart(cartItemId)}
                          className="flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Order Summary */}
        <div className="sticky right-0 bottom-0 left-0 z-40 mt-10 border border-slate-200 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center gap-4 py-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAllChecks(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700">Select All</span>
              </label>
              <div className="ml-auto flex items-center gap-6">
                <div className="text-sm text-slate-600">
                  <span className="mr-2">
                    Total ({selectedCount}{" "}
                    {selectedCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-productSansBold text-xl text-slate-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <button
                  disabled={totalAmount === 0}
                  onClick={() => navigate("/checkout")}
                  className="btn-black flex items-center gap-2 px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Check Out
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
