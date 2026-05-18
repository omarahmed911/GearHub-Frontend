import { useEffect, useState } from "react";
import { getProducts } from "./ProductsApi";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts("")
      .then((data) => {
        console.log("API Response:", data); // DEBUG LOG
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product, index) => (
          <div key={product.id || index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {/* Product Image */}
          <img 
            src={product.image || "https://via.placeholder.com/300"} 
            alt={product.name || "Product"} 
            className="w-full h-48 object-cover"
          />
          
          <div className="p-4 flex flex-col flex-grow">
            {/* Product Name */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
              {product.name || "Product Name"}
            </h3>
            
            {/* Product Description */}
            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
              {product.description || "Product description goes here. It provides details about the product."}
            </p>
            
            {/* Product Price */}
            <div className="text-xl font-semibold text-gray-900 mb-4">
              ${product.price || "0.00"}
            </div>
            
            {/* Add to Cart Button */}
            <button 
              className="w-full text-white py-2 px-4 rounded transition-opacity hover:opacity-90 mt-auto font-medium"
              style={{ backgroundColor: "#EE3E55" }}
            >
              Add to cart
            </button>
          </div>
        </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10">
          No products found.
        </div>
      )}
    </div>
  );
}