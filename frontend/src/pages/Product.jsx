import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { currency, products, addtoCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(item => String(item.product_id) === String(productId));
      setProductData(found || null);
    }
  }, [productId, products]);

  if (!productData)
    return (
      <div className="p-10 text-center font-light uppercase tracking-widest opacity-50"
        style={{ color: '#5C1A1B' }}>
        Loading Product...
      </div>
    );

  //const isOutOfStock = !productData.inventory || productData.inventory.stock <= 0;
  const isOutOfStock = productData.stock !== undefined && productData.stock <= 0;

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

          {/* Breadcrumb */}
          <nav className="text-xs uppercase mb-4 tracking-widest opacity-60"
            style={{ color: '#5C1A1B' }}>
            Products / {productData.name}
          </nav>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight"
            style={{ color: '#5C1A1B', fontStyle: 'italic' }}>
            {productData.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-light mb-6"
            style={{ color: '#5C1A1B' }}>
            {productData.price} {currency}
          </p>

          {/* Category */}
          <p className="text-sm uppercase mb-4 tracking-widest"
            style={{ color: '#5C1A1B', opacity: 0.6 }}>
            Category: {productData.category_name}
          </p>

          <hr style={{ borderColor: '#5C1A1B', opacity: 0.3 }} className="mb-6" />

          {/* Description */}
          <h3 className="text-sm font-bold uppercase mb-2"
            style={{ color: '#5C1A1B' }}>
            Description
          </h3>
          <p className="leading-relaxed text-sm sm:text-base mb-8"
            style={{ color: '#5C1A1B' }}>
            {productData.description}
          </p>

          {/* Button */}
          <button
            onClick={() => addtoCart(productData.product_id)}
            disabled={isOutOfStock}
            className="w-full py-4 px-10 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            style={{
              backgroundColor: isOutOfStock ? '#aaa' : '#5C1A1B',
              color: '#fff',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!isOutOfStock) e.target.style.opacity = '0.8' }}
            onMouseLeave={e => { e.target.style.opacity = '1' }}
          >
            {isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
          </button>

          <p className="text-[10px] text-center uppercase tracking-widest mt-4"
            style={{ color: '#5C1A1B', opacity: 0.5 }}>
            Free shipping over 3 items • 30-day return policy
          </p>

        </div>
      </div>
    </div>
  );
};

export default Product;