import React, { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:5000";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [carts, setCarts] = useState([]); // new - active carts
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("orders"); // new - toggle between orders and carts

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${BASE}/api/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setOrders(Array.isArray(data.orders) ? data.orders : []); // new
            setCarts(Array.isArray(data.carts) ? data.carts : []); // new
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, []);

    // new - color based on order status
    const statusColor = (status) => {
        if (status === "confirmed") return "#16a34a";
        if (status === "cancelled") return "#dc2626";
        return "#d97706";
    };

    if (loading) return (
        <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#5C1A1B' }}></div>
        </div>
    );

    return (
        <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ color: '#5C1A1B' }}>
            Orders & Carts
            </h2>

            {/* new - toggle between orders and active carts */}
            <div className="flex gap-2">
            <button onClick={() => setActiveView("orders")}
                className="text-xs font-bold uppercase px-4 py-2 border transition-all"
                style={{
                backgroundColor: activeView === "orders" ? '#5C1A1B' : 'transparent',
                color: activeView === "orders" ? '#fff' : '#5C1A1B',
                borderColor: '#5C1A1B'
                }}>
                Orders ({orders.length})
            </button>
            <button onClick={() => setActiveView("carts")}
                className="text-xs font-bold uppercase px-4 py-2 border transition-all"
                style={{
                backgroundColor: activeView === "carts" ? '#5C1A1B' : 'transparent',
                color: activeView === "carts" ? '#fff' : '#5C1A1B',
                borderColor: '#5C1A1B'
                }}>
                In Cart ({carts.length})
            </button>
            </div>
        </div>

        {/* ORDERS VIEW */}
        {activeView === "orders" && (
            orders.length === 0 ? (
            <div className="border p-12 text-center" style={{ borderColor: '#5C1A1B' }}>
                <p className="text-sm uppercase tracking-widest opacity-40" style={{ color: '#5C1A1B' }}>
                No orders yet
                </p>
            </div>
            ) : (
            <div className="flex flex-col gap-4">
                {orders.map(order => (
                <div key={order.order_id} className="border" style={{ borderColor: '#5C1A1B' }}>

                    {/* ORDER HEADER */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4"
                    style={{ backgroundColor: '#5C1A1B' }}>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Order</p>
                        <p className="font-bold text-white">#{order.order_id}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Customer</p>
                        <p className="font-bold uppercase text-sm text-white">{order.user?.username || "Unknown"}</p>
                        <p className="text-[10px] opacity-70 text-white">{order.user?.email}</p>
                    </div>
                    {/* new - purchase timestamp */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Purchased</p>
                        <p className="text-xs text-white">{order.created_at}</p>
                    </div>
                    {/* new - colored status badge */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Status</p>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 text-white"
                        style={{ backgroundColor: statusColor(order.status) }}>
                        {order.status}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Total</p>
                        <p className="font-bold text-lg text-white">{order.total_price} EUR</p>
                    </div>
                    </div>

                    {/* ORDER ITEMS */}
                    <div className="p-4 flex flex-col gap-2">
                    {order.items && order.items.length > 0 ? order.items.map(item => (
                        <div key={item.order_item_id}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                        style={{ borderColor: 'rgba(92,26,27,0.15)' }}>
                        <p className="uppercase font-medium" style={{ color: '#5C1A1B' }}>{item.product_name}</p>
                        <div className="flex gap-6 text-xs opacity-70" style={{ color: '#5C1A1B' }}>
                            <span>Qty: {item.quantity}</span>
                            <span>{item.snapshot_price} EUR/pcs</span>
                            <span className="font-bold">= {item.quantity * item.snapshot_price} EUR</span>
                        </div>
                        </div>
                    )) : (
                        <p className="text-xs opacity-40 uppercase tracking-widest" style={{ color: '#5C1A1B' }}>No items</p>
                    )}
                    </div>

                </div>
                ))}
            </div>
            )
        )}

        {/* new - IN CART VIEW */}
        {activeView === "carts" && (
            carts.length === 0 ? (
            <div className="border p-12 text-center" style={{ borderColor: '#5C1A1B' }}>
                <p className="text-sm uppercase tracking-widest opacity-40" style={{ color: '#5C1A1B' }}>
                No active carts
                </p>
            </div>
            ) : (
            <div className="flex flex-col gap-4">
                {carts.map((cart, idx) => (
                <div key={idx} className="border" style={{ borderColor: '#5C1A1B' }}>

                    {/* new - cart header with in cart badge */}
                    <div className="p-4 flex justify-between items-center"
                    style={{ backgroundColor: '#5C1A1B' }}>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Customer</p>
                        <p className="font-bold uppercase text-sm text-white">{cart.username}</p>
                        <p className="text-[10px] opacity-70 text-white">{cart.email}</p>
                    </div>
                    {/* new - in cart status badge */}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 text-white"
                        style={{ backgroundColor: '#d97706' }}>
                        In Cart
                    </span>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                    {cart.items.map((item, i) => (
                        <div key={i}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                        style={{ borderColor: 'rgba(92,26,27,0.15)' }}>
                        <p className="uppercase font-medium" style={{ color: '#5C1A1B' }}>{item.product_name}</p>
                        <div className="flex gap-6 text-xs opacity-70" style={{ color: '#5C1A1B' }}>
                            <span>Qty: {item.quantity}</span>
                            <span>{item.price} EUR/pcs</span>
                            <span className="font-bold">= {item.quantity * item.price} EUR</span>
                        </div>
                        </div>
                    ))}
                    </div>

                </div>
                ))}
            </div>
            )
        )}
        </div>
    );
    };

export default AdminOrders;