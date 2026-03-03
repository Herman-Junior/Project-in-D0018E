import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { currency, products } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(item => String(item.product_id) === String(productId));
      setProductData(found || null);
    }
  }, [productId, products]);

  if (!productData)
    return (
      <div className="p-10 text-center font-light uppercase tracking-widest opacity-50">
        Loading Product...
      </div>
    );

  const isOutOfStock = !productData.stock || productData.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto p-5 sm:p-10 mt-10">
      <div className="flex flex-col sm:flex-row gap-12">

        {/* LEFT: IMAGE */}
        <div className="w-full sm:w-1/2">
          <img
            src={productData.image || 'https://placehold.co/300x300/png'}
            alt={productData.name}
            className="w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* RIGHT: INFO */}
        <div className="w-full sm:w-1/2 flex flex-col">
          <nav className="text-xs uppercase mb-4 tracking-widest opacity-60">
            Products / {productData.name}
          </nav>

          <h1 className="text-4xl font-semibold mb-2 uppercase italic tracking-tighter">
            {productData.name}
          </h1>

          <p className="text-3xl font-light mb-6">
            {productData.price} {currency}
          </p>

          <p className="text-sm uppercase opacity-60 mb-4">
            Category: {productData.category_name}
          </p>

          <hr className="mb-6" />

          <h3 className="text-sm font-bold uppercase mb-2">Description</h3>
          <p className="leading-relaxed text-sm sm:text-base mb-8">
            {productData.description}
          </p>

          <button
            disabled={isOutOfStock}
            className={`w-full py-4 px-10 text-sm font-bold transition-all 
              ${isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:opacity-80 active:scale-[0.98]"
              }`}
          >
            {isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
          </button>

          <p className="text-[10px] text-center uppercase tracking-widest opacity-60 mt-4">
            Free shipping on all orders • 30-day return policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;