import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { currency, isLoggedIn } = useContext(ShopContext);
  const [orders, setOrders] = useState([]); // Initialiseras som tom array
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) { 
      navigate('/login'); 
      return; 
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        // Ändrad till relativ sökväg för att fungera med Nginx proxy på EC2
        const res = await fetch('/api/orders/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error(`Server svarade med status: ${res.status}`);
        }

        const data = await res.json();

        // Säkerställ att vi faktiskt fick en array innan vi sparar den
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Förväntade en array men fick:", data);
          setOrders([]); // Sätt till tom array om backend skickar ett objekt (t.ex. felmeddelande)
        }
      } catch (err) {
        console.error('Orders fetch error:', err);
        setOrders([]); // Förhindrar ".map is not a function" vid nätverksfel
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const viewReceipt = async (order_id) => {
    if (expandedOrder === order_id) {
      setExpandedOrder(null);
      setReceipt(null);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      // Ändrad till relativ sökväg
      const response = await fetch(`/api/receipt/${order_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Kunde inte hämta kvitto");
      
      const data = await response.json();
      setReceipt(data.receipt);
      setExpandedOrder(order_id);
    } catch (err) {
      console.error('Receipt fetch error:', err);
    }
  };

  if (loading) {
    return <div className='text-center mt-20 opacity-50'>Laddar ordrar...</div>;
  }

  return (
    <div className='border-t pt-8 max-w-5xl mx-auto px-4'>
      <div className='text-2xl mb-6'>
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Kontrollera att orders är en array och har innehåll */}
      {Array.isArray(orders) && orders.length === 0 ? (
        <p className='text-center uppercase tracking-widest opacity-50 mt-20'
          style={{ color: '#5C1A1B' }}>
          No orders yet
        </p>
      ) : (
        <div className='flex flex-col gap-4'>
          {/* Dubbelkoll med Array.isArray för att undvika krasch */}
          {Array.isArray(orders) && orders.map(order => (
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
                      Shipped to: {receipt.address.address}, {receipt.address.city}, {receipt.address.country}
                    </p>
                  )}

                  {Array.isArray(receipt.items) && receipt.items.map((item, i) => (
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