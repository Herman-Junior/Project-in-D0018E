import React, { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import ProductItem from "../components/ProductItem";
import Title from '../components/Title';

const Products = () => {
  const { products } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterProducts, setFilterProducts] = useState([]);

  // Hämtar kategorier från backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Category fetch error:', err));
  }, []);

  // Visar alla eller filtrerade produkter
  useEffect(() => {
    if (selectedCategory === null) {
      setFilterProducts(products);
    } else {
      fetch(`http://127.0.0.1:5000/api/categories/${selectedCategory}/products`)
        .then(res => res.json())
        .then(data => setFilterProducts(data.products || []))
        .catch(err => console.error('Filter fetch error:', err));
    }
  }, [selectedCategory, products]);

  const handleCategoryClick = (category_id) => {
    setSelectedCategory(prev => prev === category_id ? null : category_id);
  };

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-8 border-t'>

      {/* FILTER */}
      <div className="min-w-60">
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS</p>

        <div className="border border-gray-300 pl-5 py-4 mt-6">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-black">
            {categories.map(cat => (
              <p key={cat.category_id} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  checked={selectedCategory === cat.category_id}
                  onChange={() => handleCategoryClick(cat.category_id)}
                />
                {cat.category_name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">
        <div className="flex justify-center text-sm sm:text-base mb-4">
          <Title text1={"OUR"} text2={"PRODUCTS"} />
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem
              key={item.product_id}
              product_id={item.product_id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>

        {filterProducts.length === 0 && (
          <p className='text-center uppercase tracking-widest opacity-50 mt-20'
            style={{ color: '#5C1A1B' }}>
            No products found
          </p>
        )}
      </div>

    </div>
  );
};

export default Products;