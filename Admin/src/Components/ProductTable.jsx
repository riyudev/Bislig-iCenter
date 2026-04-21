import React from "react";
import ActionMenu from "./ActionMenu";

const ProductTable = ({ loading, products, onEdit, onToggle, onRemove }) => {
  const formatVariant = (variantStr) => {
    if (!variantStr) return "";
    const parts = variantStr.split("+").map((p) => p.trim());
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

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="border-b border-myblack/10 bg-slate-50 text-xs uppercase text-myblack/60">
          <tr>
            <th className="px-6 py-4 font-productSansBold text-left">Product</th>
            <th className="px-6 py-4 font-productSansBold text-center">Category</th>
            <th className="px-6 py-4 font-productSansBold text-left">Color</th>
            <th className="px-6 py-4 font-productSansBold text-left">Variation</th>
            <th className="px-6 py-4 font-productSansBold text-center">Stock</th>
            <th className="px-6 py-4 font-productSansBold text-center">Price</th>
            <th className="px-6 py-4 font-productSansBold text-center">Status</th>
            <th className="px-6 py-4 font-productSansBold text-center">Total Sold</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td className="px-6 py-6" colSpan={6}>
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td className="px-6 py-6" colSpan={6}>
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => {
              const items =
                p.stockItems && p.stockItems.length > 0
                  ? p.stockItems
                  : [
                      {
                        color: "-",
                        variant: "-",
                        stock: "-",
                        newPrice: p.newPrice,
                      },
                    ];

              return (
                <React.Fragment key={p._id}>
                  {items.map((item, idx) => (
                    <tr
                      key={`${p._id}-${idx}`}
                      className={`hover:bg-slate-50 transition-colors ${idx !== items.length - 1 ? "border-b-0" : ""}`}
                    >
                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={items.length}
                            className="px-6 py-4 align-top"
                          >
                            <div className="flex items-center gap-3">
                              <ActionMenu
                                product={p}
                                onEdit={onEdit}
                                onToggle={onToggle}
                                onRemove={onRemove}
                              />
                              <img
                                className="h-10 w-10 object-contain"
                                src={
                                  p.image?.startsWith("http")
                                    ? p.image
                                    : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${p.image || ""}`
                                }
                                alt={p.name}
                              />
                              <div>
                                <p className="font-productSansReg text-myblack shrink-0 max-w-[150px] truncate">
                                  {p.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            rowSpan={items.length}
                            className="px-6 py-2 text-center text-sm text-myblack/70 align-middle"
                          >
                            {p.category === "iphone" ? "iPhone" : p.category === "ipad" ? "iPad" : p.category === "android" ? "Android" : p.category === "laptop" ? "Laptop" : p.category || ""}
                          </td>
                        </>
                      )}

                      <td className="px-6 py-2 text-sm text-myblack/70 font-medium">
                        {item.color}
                      </td>
                      <td className="px-6 py-2 text-sm text-myblack/70">
                        {item.variant !== "-"
                          ? formatVariant(item.variant)
                          : "-"}
                      </td>
                      <td className="px-6 py-2 text-center text-sm">
                        {item.stock !== "-" ? (
                          <span
                            className={`font-semibold ${
                              item.stock <= (p.lowStockThreshold || 5)
                                ? "text-rose-500"
                                : "text-emerald-600"
                            }`}
                          >
                            {item.stock}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-2 text-center text-sm font-semibold text-myblack">
                        ₱{Number(item.newPrice || 0).toLocaleString()}
                      </td>

                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={items.length}
                            className="px-6 py-2 text-center align-middle"
                          >
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold inline-block ${
                                p.isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {p.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td
                            rowSpan={items.length}
                            className="px-6 py-2 text-center text-sm text-myblack align-middle"
                          >
                            {Number(p.totalSales || 0).toLocaleString()}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
