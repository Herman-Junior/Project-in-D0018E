import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { currency, cartItems, products, removeFromCart, updateQuantity } = useContext(ShopContext);
  const navigate = useNavigate();

  const getImage = (product_id) => {
    const product = products.find(p => p.product_id === product_id);
    return product?.image || 'https://placehold.co/100x100/png';
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className='border-t pt-8 max-w-5xl mx-auto px-4'>

      <div className='text-2xl mb-4'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartItems.length === 0 ? (
        <p className='text-center uppercase tracking-widest opacity-50 mt-20'
          style={{ color: '#5C1A1B' }}>
          Your cart is empty
        </p>
      ) : (
        <div className='flex flex-col gap-6'>

          {/* CART ITEMS */}
          <div className='flex flex-col'>
            {cartItems.map((item, index) => (
              <div key={index}
                className='flex items-center gap-6 py-3 border-t'
                style={{ borderColor: '#5C1A1B' }}>

                <img
                  src={getImage(item.product_id)}
                  alt={item.name}
                  className='w-16 h-16 object-cover flex-shrink-0'
                />

                <div className='flex-1'>
                  <p className='text-sm font-bold uppercase tracking-tight'
                    style={{ color: '#5C1A1B' }}>
                    {item.name}
                  </p>
                  <p className='text-xs opacity-60 mt-1'
                    style={{ color: '#5C1A1B' }}>
                    {item.unit_price} {currency}
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => updateQuantity(item.product_id, -1)}
                    className='w-6 h-6 border flex items-center justify-center font-bold hover:opacity-60 transition-all text-sm'
                    style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                    −
                  </button>
                  <span className='w-5 text-center text-sm' style={{ color: '#5C1A1B' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, 1)}
                    className='w-6 h-6 border flex items-center justify-center font-bold hover:opacity-60 transition-all text-sm'
                    style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                    +
                  </button>
                </div>

                <p className='w-20 text-right text-sm font-bold' style={{ color: '#5C1A1B' }}>
                  {item.subtotal} {currency}
                </p>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className='hover:opacity-40 transition-all text-sm'
                  style={{ color: '#5C1A1B' }}>
                  ✕
                </button>

              </div>
            ))}
            <div className='border-t' style={{ borderColor: '#5C1A1B' }} />
          </div>

          {/* CART TOTALS */}
          <div className='flex justify-end'>
            <div className='w-full sm:w-[380px] flex flex-col gap-2'>

              <div className='text-lg mb-1'>
                <Title text1={"CART"} text2={"TOTALS"} />
              </div>

              <div className='flex justify-between text-xs uppercase tracking-widest py-2 border-b'
                style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                <span>Subtotal</span>
                <span>{total} {currency}</span>
              </div>

              <div className='flex justify-between text-sm font-bold uppercase tracking-widest py-2 border-b'
                style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                <span>Total</span>
                <span>{total} {currency}</span>
              </div>

              <button
                onClick={() => navigate('/placeorder')}
                className='w-full py-3 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] hover:opacity-80 mt-1'
                style={{ backgroundColor: '#5C1A1B', color: '#fff' }}>
                Proceed to Checkout
              </button>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;