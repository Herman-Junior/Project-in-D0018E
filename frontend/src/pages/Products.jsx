import React, { useEffect } from 'react'
import { useContext } from "react";
import { useState } from "react";
import { ShopContext } from '../context/ShopContext';
import ProductItem from "../components/ProductItem";
import Title from '../components/Title';

const Products = () => {

  const { products } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    setFilterProducts(products)
  },[]);
  return (
    <div className= 'flex flex-col sm:flex-row gap-1 sm:gap-10 pt-8 border-t'>
      {/* Filter Options */}
      <div className= "min-w-60">
        <p className='my-2 text-x1 flex items-center cursor-pointer gap-2'> FILTERS </p>
      {/* Catogary Options */}
      <div className= {"hidden sm:block border border-gray-300  pl-5 py-4 mt-6 $(showFilters ? 'block' : 'hidden')} sm:block"}>
        <p className= "mb-3 text-sm font-medium">CATEGORIES</p>

        <div  className= "flex flex-col gap-2 text-sm font-light text-black">
          <p className ="flex gap-2">
            <input className= "w-3" type = "checkbox" id="charcuterie" name="charcuterie" value={'charcuterie'}/> Meat 
          </p>

          <p className ="flex gap-2">
            <input className= "w-3" type = "checkbox" id="cheese" name="cheese" value={'Cheese'}/> Cheese 
          </p>

          <p className ="flex gap-2">
            <input className= "w-3" type = "checkbox" id="sausage" name="sausage" value={'Sausage'}/>Sausage 
          </p>
        </div>
      </div>
      </div>
       {/* Right side */}
      <div className = "flex-1">

        <div className = "flex justify-between text-sm sm:text-base mb-4">
          < Title text1={"OUR"} text2={"PRODUCTS"}/>
        </div>
      </div>
       {/* MAP PRODUCTS */}
        <div className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6i">
          {filterProducts.map((item) => (
            <ProductItem
              key={item.product_id}
              product_id={item.product_id}
              image={item.image}
              name={item.name}
              price={item.price}
              category_name={item.category_name}
              stock={item.stock}
            />
          ))}
        
        </div>
    </div>
  )
}

export default Products