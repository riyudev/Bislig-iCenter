import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
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

  // Calculate total savings
  let totalSavings = 0;
  cartProducts.forEach((product) => {
    const isChecked = checkedItems[product.cartItemId];
    if (isChecked && product.oldPrice) {
      const oldP = parsePrice(product.oldPrice) || 0;
      const newP = parsePrice(product.newPrice) || 0;
      if (oldP > newP) {
        totalSavings += (oldP - newP) * product.quantity;
      }
    }
  });

  const formatVariant = (variantStr) => {
    if (!variantStr) return "";
    const parts = variantStr.split("+").map(p => p.trim());
    if (parts.length === 2) {
      const match0 = parts[0].match(/^(\d+)(GB|TB)$/i);
      const match1 = parts[1].match(/^(\d+)(GB|TB)$/i);
      if (match0 && match1) {
        const val0 = parseInt(match0[1]);
        const unit0 = match0[2].toUpperCase();
        const val1 = parseInt(match1[1]);
        const unit1 = match1[2].toUpperCase();
        
        let isPart0Storage = false;
        if (unit0 === "TB") isPart0Storage = true;
        else if (unit1 === "TB") isPart0Storage = false;
        else if (val0 > val1 && val0 >= 32) isPart0Storage = true;
        
        if (isPart0Storage) {
          return `${parts[1]} + ${parts[0]}`;
        }
      }
    }
    return variantStr;
  };

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-white px-4 py-16">
        <div className="max-w-lg space-y-8 text-center">
          <div className="flex justify-center">
            <div className="relative rounded-full border border-slate-100 bg-white p-8 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 rounded-full bg-blue-50/50 blur-xl"></div>
              <ShoppingCart
                className="relative z-10 h-20 w-20 text-blue-500"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Your Cart is Empty
            </h3>
            <p className="font-productSansLight text-lg leading-relaxed text-slate-500">
              Looks like you haven't added any items to your cart yet. Discover
              cutting-edge tech and amazing deals today.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/"
              className="group relative inline-flex items-center gap-3 rounded-full bg-slate-900 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-blue-500/25"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="laptop:px-8 laptop:py-40 laptop:pb-32 relative min-h-screen bg-slate-50/50 px-4 py-28">
      {/* Background Decor isolated to prevent breaking sticky */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-40 -left-20 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h2>
          <p className="font-medium tracking-wide text-slate-500">
            {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"}{" "}
            in your cart
          </p>
        </div>

        <div className="laptop:flex laptop:gap-8">
          {/* Cart Items Section */}
          <div className="laptop:flex-1 space-y-5">
            <div className="rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/80 ring-inset">
              <div className="laptop:grid laptop:grid-cols-12 laptop:items-center hidden px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                <div className="col-span-1 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => toggleAllChecks(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  />
                  <span>Product</span>
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
              const oldUnit = parsePrice(product.oldPrice) || 0;
              const lineTotal = unit * product.quantity;
              const unitSaving = oldUnit > unit ? oldUnit - unit : 0;

              return (
                <div
                  key={cartItemId}
                  className={`group relative overflow-hidden rounded-[20px] bg-white ring-1 ring-inset ${
                    isChecked
                      ? "shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-blue-400/80"
                      : "shadow-sm ring-slate-200/80 hover:ring-blue-200"
                  }`}
                >
                  {isChecked && (
                    <div className="pointer-events-none absolute inset-0 bg-blue-50/30" />
                  )}

                  <div className="laptop:p-6 relative z-10 p-5">
                    <div className="laptop:grid laptop:grid-cols-12 laptop:items-center gap-5">
                      <div className="laptop:col-span-1 flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleItemCheck(cartItemId)}
                          className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:mt-0"
                        />
                        <div className="laptop:hidden mt-1 text-sm font-bold tracking-wider text-slate-500 uppercase">
                          Product
                        </div>
                      </div>

                      <div className="laptop:col-span-5 flex gap-5">
                        <div className="shrink-0">
                          <div className="laptop:h-28 laptop:w-28 relative h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/50 p-3 ring-1 ring-slate-200/50">
                            <img
                              src={
                                product.image?.startsWith("http")
                                  ? product.image
                                  : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${product.image || ""}`
                              }
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <h4 className="laptop:text-lg mb-1.5 line-clamp-2 text-base font-extrabold text-slate-900 transition-colors group-hover:text-blue-700">
                            {product.name}
                          </h4>
                          <div className="space-y-1 text-[13px] font-medium text-slate-500">
                            {product.storage &&
                              product.storage !== "Default" && (
                                <p className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                  <span className="text-slate-400">
                                    Variation:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {formatVariant(product.storage)}
                                  </span>
                                </p>
                              )}
                            {product.color && product.color !== "Default" && (
                              <p className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400">Color:</span>{" "}
                                <span className="text-slate-700">
                                  {product.color}
                                </span>
                              </p>
                            )}
                          </div>
                          {unitSaving > 0 && (
                            <div className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                              <Tag className="h-3 w-3" />
                              Save {formatPrice(unitSaving)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="laptop:col-span-2 laptop:mt-0 laptop:flex-col laptop:justify-center mt-4 flex items-center justify-between text-center">
                        <span className="laptop:hidden text-xs font-bold tracking-widest text-slate-500 uppercase">
                          Price
                        </span>
                        <div>
                          <p className="font-productSansBold text-xl text-slate-900">
                            {formatPrice(unit)}
                          </p>
                          {product.oldPrice && (
                            <p className="font-productSansLight mt-0.5 text-sm text-slate-400 line-through decoration-slate-300">
                              {formatPrice(product.oldPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="laptop:col-span-2 laptop:mt-0 mt-4 flex items-center justify-center">
                        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/50 p-1 shadow-inner">
                          <button
                            onClick={() => removeOneFromCart(cartItemId)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-500 hover:text-white hover:ring-blue-500 active:scale-95"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-productSansBold w-10 text-center text-lg text-slate-800">
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
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-500 hover:text-white hover:ring-blue-500 active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="laptop:col-span-2 laptop:mt-0 laptop:flex-col laptop:justify-center mt-4 flex items-center justify-between text-center">
                        <span className="laptop:hidden text-xs font-bold tracking-widest text-slate-500 uppercase">
                          Total
                        </span>
                        <p className="font-productSansBold text-xl text-blue-600">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>

                      <div className="laptop:col-span-12 laptop:col-start-auto laptop:row-start-auto laptop:mt-0 laptop:border-t-0 laptop:pt-0 mt-5 flex items-center justify-end border-t border-slate-100 pt-3">
                        <button
                          onClick={() => removeFromCart(cartItemId)}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
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

        {/* Premium Order Summary Sticky Footer */}
        <div className="sticky right-0 bottom-0 left-0 z-40 mt-10 border-t border-slate-200/80 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md pb-safe">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 laptop:py-4">
            <div className="flex flex-col gap-3 laptop:flex-row laptop:items-center laptop:justify-between">
              
              {/* Top Row on Mobile: Select All, Badges & Total */}
              <div className="flex items-center justify-between laptop:justify-start laptop:gap-6">
                
                {/* Left side: Checkbox & Badges */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <label className="flex shrink-0 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => toggleAllChecks(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold tracking-widest text-slate-700 uppercase select-none">
                      All
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5 ml-1">
                    <div className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-bold tracking-wide text-blue-600 sm:px-3 sm:text-[10px]">
                      <Truck className="h-3 w-3 text-blue-500" />
                      <span>Free Ship</span>
                    </div>
                  </div>
                </div>

                {/* Right side (Mobile Top row): Total text (only if not laptop) */}
                <div className="flex flex-col items-end text-right laptop:hidden">
                  <div className="text-[9px] sm:text-[10px] font-medium text-slate-500 leading-tight">
                    Total ({selectedCount} items)
                  </div>
                  {totalSavings > 0 && (
                    <span className="flex animate-pulse items-center gap-1 mt-0.5 mb-0.5 rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-rose-500 uppercase shadow-sm">
                      <Tag className="h-2.5 w-2.5" />
                      Save {formatPrice(totalSavings)}
                    </span>
                  )}
                  <div className="font-productSansBold text-[17px] sm:text-lg text-slate-900 leading-none mt-0.5">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
              </div>

              {/* Bottom Row on Mobile / Right Side on Laptop */}
              <div className="flex flex-col laptop:flex-row laptop:items-center gap-3">
                {/* Desktop Total Text */}
                <div className="hidden laptop:flex flex-col items-end justify-center text-right mr-4">
                  <div className="mb-1 text-sm font-medium text-slate-500">
                    Total ({selectedCount} items)
                  </div>
                  <div className="flex items-center gap-3">
                    {totalSavings > 0 && (
                      <span className="flex animate-pulse items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-black tracking-wide text-rose-500 uppercase shadow-sm">
                        <Tag className="h-4 w-4" />
                        Save {formatPrice(totalSavings)}!
                      </span>
                    )}
                    <span className="font-productSansBold text-3xl leading-none tracking-tight text-slate-900">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Desktop and Mobile Button */}
                <button
                  disabled={totalAmount === 0}
                  onClick={() => navigate("/checkout")}
                  className="group flex w-full laptop:w-auto items-center justify-center gap-1.5 laptop:gap-2 rounded-full bg-slate-900 px-4 py-2.5 laptop:px-8 laptop:py-4 text-[13px] laptop:text-base font-bold tracking-wide text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-blue-500/25 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  Checkout
                  <ArrowRight className="h-3.5 w-3.5 laptop:h-5 laptop:w-5 transition-transform group-hover:translate-x-1" />
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
