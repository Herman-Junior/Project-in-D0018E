import React, { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:5000";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${BASE}/api/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#5C1A1B' }}></div>
        </div>
    );

    return (
        <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ color: '#5C1A1B' }}>
            All Orders
            </h2>
            <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: '#5C1A1B' }}>
            {orders.length} total
            </p>
        </div>

        {orders.length === 0 ? (
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4"
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
                    <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Status</p>
                    <p className="text-sm font-bold uppercase text-white">{order.status || "—"}</p>
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
                        <p className="uppercase font-medium" style={{ color: '#5C1A1B' }}>
                        {item.product_name}
                        </p>
                        <div className="flex gap-6 text-xs opacity-70" style={{ color: '#5C1A1B' }}>
                        <span>Qty: {item.quantity}</span>
                        <span>{item.snapshot_price} EUR/pcs</span>
                        <span className="font-bold">= {item.quantity * item.snapshot_price} EUR</span>
                        </div>
                    </div>
                    )) : (
                    <p className="text-xs opacity-40 uppercase tracking-widest" style={{ color: '#5C1A1B' }}>
                        No items
                    </p>
                    )}
                </div>

                </div>
            ))}
            </div>
        )}
        </div>
    );
    };

export default AdminOrders;