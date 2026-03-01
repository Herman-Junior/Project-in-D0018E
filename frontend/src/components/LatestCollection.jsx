import React, { useContext } from 'react'
import Title from './Title'
import ProductItem from './ProductItem' // NEW - import ProductItem
import { ShopContext } from '../context/ShopContext' // NEW - import ShopContext

const LatestCollection = () => {
  const { products } = useContext(ShopContext); // NEW - get products from context
  console.log('Products in LatestCollection:', products); // NEW - console log to verify

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTION'}/>
                    <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-black'>
                        Elevate every day with our tastiest charcuterie boards.
                    </p>
            </div>

      {/* NEW - render products grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {products.slice(0, 4).map((item) => (
                <ProductItem
                    key={item.product_id}
                    product_id={item.product_id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    
                />
            ))}
        </div>
    </div>
    )
}

export default LatestCollection