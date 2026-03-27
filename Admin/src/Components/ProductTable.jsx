import React from "react";
import ActionMenu from "./ActionMenu";

const ProductTable = ({ loading, products, onEdit, onToggle, onRemove }) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
              Product
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
              Category
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
              Price
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">
              Total Sold
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td className="px-6 py-6" colSpan={5}>
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td className="px-6 py-6" colSpan={5}>
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4">
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
                          : `http://localhost:5000${p.image || ""}`
                      }
                      alt={p.name}
                    />
                    <div>
                      <p className="font-productSansReg text-myblack">
                        {p.name}
                      </p>
                      <p className="text-xs text-myblack/60">
                        stocks: {p.stocks || 0}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-myblack/70">
                  {p.category}
                </td>
                <td className="px-6 py-4 text-center text-sm text-myblack">
                  ₱{Number(p.newPrice || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-myblack">
                  {Number(p.totalSales || 0).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
