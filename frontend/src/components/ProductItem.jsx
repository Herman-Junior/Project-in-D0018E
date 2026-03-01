import React, { useContext } from 'react' // NEW - added useContext
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext' // NEW - import ShopContext

const ProductItem = ({ product_id, name, price, image }) => { // NEW - fixed props with {}
  const { currency } = useContext(ShopContext); // NEW - get currency from context

    return (
        <Link className='text-gray-800 cursor-pointer' to={`/product/${product_id}`}>
            <div className='aspect-square overflow-hidden bg-gray-200'>
            <img
                className='hover:scale-110 transition ease-in-out object-cover w-full h-full'
                src={image || 'https://placehold.co/300x300/png'} // NEW - fallback image if none
                alt={name}
            />
    
        </div>
        <p className='pt-0.5 text-sm font-medium'>{name}</p>
        <p className='text-sm font-bold'>{price} {currency}</p> {/* NEW - added currency */}
    </Link>
 )
}

export default ProductItem