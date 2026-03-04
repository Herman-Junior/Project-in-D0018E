import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const BRAND = '#5C1A1B';

const Confirmation = () => {
  const { orderId } = useParams();
  const { currency, isLoggedIn } = useContext(ShopContext);
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchConfirmation = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/confirmation/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Could not load order');
        } else {
          setReceipt(data.receipt);
        }
      } catch (err) {
        setError('Could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  }, [orderId, isLoggedIn]);

  if (loading) {
    return (
      <div className='text-center mt-20 opacity-50 uppercase tracking-widest'
        style={{ color: BRAND }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center mt-20 uppercase tracking-widest'
        style={{ color: BRAND }}>
        {error}
      </div>
    );
  }

  return (
    <div className='border-t pt-8 max-w-2xl mx-auto px-4 pb-16'>

      {/* HEADER */}
      <div className='text-2xl mb-2'>
        <Title text1={'ORDER'} text2={'CONFIRMED'} />
      </div>
      <p className='text-xs uppercase tracking-widest opacity-60 mb-8'
        style={{ color: BRAND }}>
        Thank you for your purchase!
      </p>

      {/* RECEIPT BOX */}
      <div className='border p-6 flex flex-col gap-4' style={{ borderColor: BRAND }}>

        {/* ORDER META */}
        <div className='flex justify-between text-xs uppercase tracking-widest opacity-60'
          style={{ color: BRAND }}>
          <span>Order #{receipt.order_id}</span>
          <span>{receipt.created_at}</span>
        </div>

        <hr style={{ borderColor: BRAND, opacity: 0.2 }} />

        {/* ITEMS */}
        <div className='flex flex-col'>
          {Array.isArray(receipt.items) && receipt.items.map((item, i) => (
            <div key={i}
              className='flex justify-between text-sm py-3 border-b'
              style={{ borderColor: BRAND + '33', color: BRAND }}>
              <span>{item.name} × {item.quantity}</span>
              <span>{item.subtotal} {currency}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className='flex justify-between text-sm font-bold uppercase tracking-widest'
          style={{ color: BRAND }}>
          <span>Total</span>
          <span>{receipt.total_price} {currency}</span>
        </div>

        <hr style={{ borderColor: BRAND, opacity: 0.2 }} />

        {/* ADDRESS */}
        {receipt.address && (
          <div>
            <p className='text-xs uppercase tracking-widest font-bold mb-1'
              style={{ color: BRAND }}>
              Delivery Address
            </p>
            <p className='text-sm opacity-70' style={{ color: BRAND }}>
              {receipt.address.address}, {receipt.address.city}, {receipt.address.country}
            </p>
          </div>
        )}

        {/* PAYMENT METHOD */}
        <div>
          <p className='text-xs uppercase tracking-widest font-bold mb-1'
            style={{ color: BRAND }}>
            Payment Method
          </p>
          <p className='text-sm opacity-70 uppercase' style={{ color: BRAND }}>
            {receipt.method || '—'}
          </p>
        </div>

      </div>

      {/* BUTTONS */}
      <div className='flex gap-4 mt-6'>
        <button
          onClick={() => navigate('/orders')}
          className='flex-1 py-3 text-xs uppercase tracking-widest font-bold border transition-all hover:opacity-60'
          style={{ borderColor: BRAND, color: BRAND }}>
          My Orders
        </button>
        <button
          onClick={() => navigate('/products')}
          className='flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-all hover:opacity-80'
          style={{ backgroundColor: BRAND, color: 'white' }}>
          Continue Shopping
        </button>
      </div>

    </div>
  );
};

export default Confirmation;