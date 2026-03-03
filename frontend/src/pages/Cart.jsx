import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Cart = () => {
  const { currency, cartItems, products, removeFromCart, updateQuantity } = useContext(ShopContext);

  // get image from products array since backend doesn't return it
  const getImage = (product_id) => {
    const product = products.find(p => p.product_id === product_id);
    return product?.image || 'https://placehold.co/100x100/png';
  };

  return (
    <div className='border-t pt-14 max-w-4xl mx-auto px-4'>

      <div className='text-2xl mb-6'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartItems.length === 0 ? (
        <p className='text-center uppercase tracking-widest opacity-50 mt-20'
          style={{ color: '#5C1A1B' }}>
          Your cart is empty
        </p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index}
              className='py-4 border-t border-b grid grid-cols-[auto_3fr_1fr_1fr] gap-6 items-center'>

              {/* Image */}
              <img
                src={getImage(item.product_id)}
                alt={item.name}
                className='w-20 h-20 object-cover'
              />

              {/* Name + price */}
              <div>
                <p className='text-base font-semibold uppercase tracking-tight'
                  style={{ color: '#5C1A1B' }}>
                  {item.name}
                </p>
                <p className='text-sm opacity-60 mt-1'
                  style={{ color: '#5C1A1B' }}>
                  {item.unit_price} {currency} each
                </p>
              </div>

              {/* Quantity controls */}
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => updateQuantity(item.product_id, -1)}
                  className='w-7 h-7 border flex items-center justify-center text-lg font-bold hover:opacity-60'
                  style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}
                >−</button>

                <span style={{ color: '#5C1A1B' }}>{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.product_id, 1)}
                  className='w-7 h-7 border flex items-center justify-center text-lg font-bold hover:opacity-60'
                  style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}
                >+</button>
              </div>

              {/* Subtotal + delete */}
              <div className='flex flex-col items-end gap-2'>
                <p className='font-bold' style={{ color: '#5C1A1B' }}>
                  {item.subtotal} {currency}
                </p>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className='text-xs uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-red-600 transition-all'
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          {/* Total */}
          <div className='flex justify-end mt-8 border-t pt-4'>
            <p className='text-xl font-bold' style={{ color: '#5C1A1B' }}>
              Total: {cartItems.reduce((sum, item) => sum + item.subtotal, 0)} {currency}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;