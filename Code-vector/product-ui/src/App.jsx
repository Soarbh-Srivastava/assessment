import React, { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [cursorStack, setCursorStack] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageCursor, setNextPageCursor] = useState(null);

  const categories = [
    "Electronics",
    "Clothing",
    "Home",
    "Toys",
    "Books",
  ];

  const fetchProducts = async (
    cursor = null,
    selectedCategory = category
  ) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.append("limit", "50");

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await fetch(
        `https://assessment-0q8g.onrender.com/api/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.data || []);
      setNextPageCursor(data.nextCursor || null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setNextPageCursor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCursorStack([null]);
    setCurrentPage(1);
    fetchProducts(null, category);
  }, [category]);

  const handleNextPage = () => {
    if (!nextPageCursor || loading) return;

    setCursorStack((prev) => [...prev, nextPageCursor]);
    setCurrentPage((prev) => prev + 1);

    fetchProducts(nextPageCursor);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || loading) return;

    const newStack = [...cursorStack];
    newStack.pop();

    const previousCursor = newStack[newStack.length - 1];

    setCursorStack(newStack);
    setCurrentPage((prev) => prev - 1);

    fetchProducts(previousCursor);
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between gap-4 py-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1 || loading}
        className="
          flex items-center gap-2
          px-6 py-3
          rounded-xl
          font-bold
          text-white
          bg-gradient-to-r from-emerald-500 to-green-600
          hover:from-emerald-600 hover:to-green-700
          shadow-lg hover:shadow-xl
          transition-all duration-200
          disabled:bg-slate-300
          disabled:text-slate-500
          disabled:shadow-none
          disabled:cursor-not-allowed
        "
      >
        ← Previous
      </button>

      <div className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <span className="font-semibold text-slate-700">
          Page {currentPage}
        </span>
      </div>

      <button
        onClick={handleNextPage}
        disabled={!nextPageCursor || loading}
        className="
          flex items-center gap-2
          px-6 py-3
          rounded-xl
          font-bold
          text-white
          bg-gradient-to-r from-blue-600 to-indigo-600
          hover:from-blue-700 hover:to-indigo-700
          shadow-lg hover:shadow-xl
          transition-all duration-200
          disabled:bg-slate-300
          disabled:text-slate-500
          disabled:shadow-none
          disabled:cursor-not-allowed
        "
      >
        Next →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">
                Product Catalog
              </h1>
              <p className="text-slate-500 mt-2">
                Browse products with cursor-based pagination
              </p>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                bg-white
                border-2 border-slate-300
                rounded-xl
                px-4 py-3
                font-medium
                focus:outline-none
                focus:ring-4
                focus:ring-blue-200
                focus:border-blue-500
              "
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Pagination */}
        <div className="bg-white rounded-2xl shadow-md px-4 mb-4">
          <PaginationControls />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-6 py-4 font-bold">
                    Product Name
                  </th>

                  <th className="text-left px-6 py-4 font-bold">
                    Category
                  </th>

                  <th className="text-right px-6 py-4 font-bold">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-12 text-slate-500 font-medium"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-12 text-slate-500 font-medium"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`
                        border-b border-slate-100
                        hover:bg-blue-50
                        transition-colors
                        ${
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50"
                        }
                      `}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {product.name}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-slate-200 text-slate-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        ${Number(product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="bg-white rounded-2xl shadow-md px-4 mt-4">
          <PaginationControls />
        </div>
      </div>
    </div>
  );
}

export default App;