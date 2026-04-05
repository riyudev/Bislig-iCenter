import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Items from "../Components/Items";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { allProducts, productsLoading, productsError } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (allProducts && query) {
      const lowerQuery = query.toLowerCase();
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
      );

      // If there's an exact match or close match at the beginning, sort it first
      results.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1;
        if (!aName.startsWith(lowerQuery) && bName.startsWith(lowerQuery)) return 1;
        return 0;
      });

      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [allProducts, query]);

  if (productsLoading) {
    return (
      <div className="flex h-screen items-center justify-center pt-[100px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex h-screen items-center justify-center pt-[100px] text-red-500">
        {productsError}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-[140px] pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          Search Results for "{query}"
        </h1>
        <p className="mt-2 text-gray-500">
          Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {filteredProducts.map((item) => (
            <Items
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.images?.[0] || item.image}
              newPrice={item.stockItems?.[0]?.newPrice ?? item.newPrice}
              oldPrice={item.stockItems?.[0]?.oldPrice ?? item.oldPrice}
              rating={item.rating || 5}
              reviews={item.reviews || 0}
              category={item.category}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 px-6 text-center shadow-sm">
          <div className="mb-4 text-6xl text-gray-300">🔍</div>
          <h2 className="mb-2 text-xl font-bold text-[#1a1a2e]">No results found</h2>
          <p className="mb-6 text-gray-500">
            We couldn't find any products matching "{query}".
          </p>
          <Link
            to="/"
            className="rounded-full bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
