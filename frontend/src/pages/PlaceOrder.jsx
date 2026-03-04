import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const BRAND = '#5C1A1B';

const PlaceOrder = () => {
  const { currency, isLoggedIn, cartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // ── Address state ──────────────────────────────────────────
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ country: '', city: '', address: '' });

  // ── Payment state ──────────────────────────────────────────
  const [method, setMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState('');

  // ── UI state ───────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // ── Cart summary — cartItems is array of {name, unit_price, quantity, subtotal}
  const cartSummary = Array.isArray(cartItems) ? cartItems : [];
  const totalPrice = cartSummary.reduce((sum, item) => sum + item.subtotal, 0);

  // ── Redirect if not logged in ──────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isLoggedIn]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/address', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].address_id);
        else setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error('Address fetch error:', err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddAddress = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors([data.error || 'Failed to save address']);
        return null;
      }
      await fetchAddresses();
      setSelectedAddressId(data.address_id);
      setShowNewAddressForm(false);
      setNewAddress({ country: '', city: '', address: '' });
      return data.address_id;
    } catch (err) {
      setErrors(['Failed to save address']);
      return null;
    }
  };

  const handlePlaceOrder = async () => {
    setErrors([]);

    if (!selectedAddressId && !showNewAddressForm) {
      setErrors(['Please select or add a delivery address']);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Step 1: Save new address if needed
      let addressId = selectedAddressId;
      if (showNewAddressForm) {
        addressId = await handleAddAddress();
        if (!addressId) { setLoading(false); return; }
      }

      // Step 2: Checkout — create the order
      const checkoutRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address_id: addressId }),
      });
      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        const errs = checkoutData.errors || [checkoutData.error] || ['Checkout failed'];
        setErrors(errs);
        setLoading(false);
        return;
      }

      const orderId = checkoutData.receipt?.order_id;


      // Step 3: Update payment
      const paymentRes = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method, payment_details: paymentDetails }),
      });
      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        setErrors([paymentData.error || 'Payment failed']);
        setLoading(false);
        return;
      }

      // Step 4: Done
      clearCart();
      navigate(`/confirmation/${orderId}`);
    } catch (err) {
      setErrors(['Something went wrong. Please try again.']);
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className='border-t pt-8 max-w-5xl mx-auto px-4 pb-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'PLACE'} text2={'ORDER'} />
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>

        {/* ── LEFT: ADDRESS ─────────────────────────────────── */}
        <div className='flex-1'>
          <p className='text-xs uppercase tracking-widest font-bold mb-4' style={{ color: BRAND }}>
            Delivery Address
          </p>

          {addressLoading ? (
            <p className='text-xs opacity-50 uppercase tracking-widest' style={{ color: BRAND }}>
              Loading addresses...
            </p>
          ) : (
            <>
              {/* Saved addresses */}
              {addresses.map(addr => (
                <div
                  key={addr.address_id}
                  onClick={() => { setSelectedAddressId(addr.address_id); setShowNewAddressForm(false); }}
                  className='border p-4 mb-3 cursor-pointer transition-all'
                  style={{
                    borderColor: selectedAddressId === addr.address_id && !showNewAddressForm ? BRAND : '#ddd',
                    backgroundColor: selectedAddressId === addr.address_id && !showNewAddressForm ? '#fdf5f5' : 'white',
                  }}
                >
                  <p className='text-sm' style={{ color: BRAND }}>
                    {addr.address}, {addr.city}, {addr.country}
                  </p>
                </div>
              ))}

              {/* Add new address toggle */}
              <button
                onClick={() => { setShowNewAddressForm(!showNewAddressForm); setSelectedAddressId(null); }}
                className='text-xs uppercase tracking-widest hover:opacity-60 transition-all mt-1'
                style={{ color: BRAND }}
              >
                {showNewAddressForm ? '− Cancel' : '+ Add New Address'}
              </button>

              {/* New address form */}
              {showNewAddressForm && (
                <div className='mt-4 flex flex-col gap-3'>
                  {['country', 'city', 'address'].map(field => (
                    <input
                      key={field}
                      type='text'
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={newAddress[field]}
                      onChange={e => setNewAddress(prev => ({ ...prev, [field]: e.target.value }))}
                      className='border px-4 py-2 text-sm w-full outline-none focus:border-current transition-all'
                      style={{ borderColor: '#ddd', color: BRAND }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIGHT: PAYMENT + SUMMARY ──────────────────────── */}
        <div className='flex-1 flex flex-col gap-6'>

          {/* Payment method */}
          <div>
            <p className='text-xs uppercase tracking-widest font-bold mb-4' style={{ color: BRAND }}>
              Payment Method
            </p>
            <div className='flex gap-3'>
              {['card', 'billing'].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className='flex-1 border py-3 text-xs uppercase tracking-widest transition-all'
                  style={{
                    borderColor: BRAND,
                    backgroundColor: method === m ? BRAND : 'white',
                    color: method === m ? 'white' : BRAND,
                  }}
                >
                  {m === 'card' ? '💳 Card' : '🧾 Billing'}
                </button>
              ))}
            </div>

            <input
              type='text'
              placeholder={method === 'card' ? 'Card number / details (optional)' : 'Billing reference (optional)'}
              value={paymentDetails}
              onChange={e => setPaymentDetails(e.target.value)}
              className='border px-4 py-2 text-sm w-full mt-3 outline-none transition-all'
              style={{ borderColor: '#ddd', color: BRAND }}
            />
          </div>

          {/* Order summary */}
          <div>
            <p className='text-xs uppercase tracking-widest font-bold mb-4' style={{ color: BRAND }}>
              Order Summary
            </p>
            <div className='border' style={{ borderColor: BRAND }}>
              {cartSummary.length === 0 ? (
                <p className='text-xs opacity-50 uppercase tracking-widest p-4' style={{ color: BRAND }}>
                  Your cart is empty
                </p>
              ) : (
                <>
                  {cartSummary.map((item, i) => (
                    <div
                      key={i}
                      className='flex justify-between text-sm px-4 py-3 border-b'
                      style={{ borderColor: '#eee', color: BRAND }}
                    >
                      <span>{item.name} × {item.quantity}</span>
                      <span>{item.subtotal} {currency}</span>
                    </div>
                  ))}
                  <div className='flex justify-between px-4 py-3 text-sm font-bold' style={{ color: BRAND }}>
                    <span>Total</span>
                    <span>{totalPrice.toFixed(2)} {currency}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className='border border-red-300 bg-red-50 px-4 py-3'>
              {errors.map((err, i) => (
                <p key={i} className='text-xs text-red-600 uppercase tracking-widest'>{err}</p>
              ))}
            </div>
          )}

          {/* Place order button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || cartSummary.length === 0}
            className='w-full py-4 text-xs uppercase tracking-widest font-bold transition-all hover:opacity-80 disabled:opacity-40'
            style={{ backgroundColor: BRAND, color: 'white' }}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;