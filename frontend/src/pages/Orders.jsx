import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { currency, isLoggedIn } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }

    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:5000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Orders fetch error:', err));
  }, [isLoggedIn]);

  const viewReceipt = async (order_id) => {
    if (expandedOrder === order_id) {
      setExpandedOrder(null);
      setReceipt(null);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/receipt/${order_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setReceipt(data.receipt);
      setExpandedOrder(order_id);
    } catch (err) {
      console.error('Receipt fetch error:', err);
    }
  };

  return (
    <div className='border-t pt-8 max-w-5xl mx-auto px-4'>
      <div className='text-2xl mb-6'>
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orders.length === 0 ? (
        <p className='text-center uppercase tracking-widest opacity-50 mt-20'
          style={{ color: '#5C1A1B' }}>
          No orders yet
        </p>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map(order => (
            <div key={order.order_id}
              className='border p-4 flex flex-col gap-2'
              style={{ borderColor: '#5C1A1B' }}>

              {/* ORDER SUMMARY */}
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-sm font-bold uppercase tracking-widest'
                    style={{ color: '#5C1A1B' }}>
                    Order #{order.order_id}
                  </p>
                  <p className='text-xs opacity-60 mt-1' style={{ color: '#5C1A1B' }}>
                    {order.created_at} — {order.item_count} items
                  </p>
                </div>

                <div className='flex items-center gap-6'>
                  <p className='text-sm font-bold' style={{ color: '#5C1A1B' }}>
                    {order.total_price} {currency}
                  </p>
                  <button
                    onClick={() => viewReceipt(order.order_id)}
                    className='text-xs uppercase tracking-widest hover:opacity-60 transition-all'
                    style={{ color: '#5C1A1B' }}>
                    {expandedOrder === order.order_id ? 'Hide' : 'View Receipt'}
                  </button>
                </div>
              </div>

              {/* EXPANDED RECEIPT */}
              {expandedOrder === order.order_id && receipt && (
                <div className='mt-4 border-t pt-4' style={{ borderColor: '#5C1A1B' }}>

                  {receipt.address && (
                    <p className='text-xs mb-3 opacity-60 uppercase tracking-widest'
                      style={{ color: '#5C1A1B' }}>
                      Shipped to: {receipt.address.city}, {receipt.address.state}, {receipt.address.country}
                    </p>
                  )}

                  {receipt.items.map((item, i) => (
                    <div key={i} className='flex justify-between text-sm py-2 border-b'
                      style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>{item.subtotal} {currency}</span>
                    </div>
                  ))}

                  <div className='flex justify-between text-sm font-bold mt-3'
                    style={{ color: '#5C1A1B' }}>
                    <span>Total</span>
                    <span>{receipt.total_price} {currency}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;