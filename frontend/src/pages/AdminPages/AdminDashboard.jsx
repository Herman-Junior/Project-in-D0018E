import React, { useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";

const tabs = [
    { key: "products", label: "Manage Products" },
    { key: "orders", label: "All Orders" },
    { key: "users", label: "Customers" },
    ];

    const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="min-h-[80vh] -mx-4">

        {/* HEADER */}
        <div className="px-8 py-4" style={{ backgroundColor: '#5C1A1B' }}>
            <p className="text-white text-xs uppercase tracking-widest opacity-60 mb-1">Meet 4 Meat</p>
            <h1 className="text-white font-bold uppercase tracking-widest text-xl">Admin Panel</h1>
        </div>

        {/* TAB BAR */}
        <div className="flex border-b" style={{ borderColor: '#5C1A1B' }}>
            {tabs.map(tab => (
            <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2"
                style={{
                borderColor: activeTab === tab.key ? '#5C1A1B' : 'transparent',
                color: activeTab === tab.key ? '#5C1A1B' : '#aaa',
                }}>
                {tab.label}
            </button>
            ))}
        </div>

        {/* CONTENT */}
        <div className="p-8">
            {activeTab === "products" && <AdminProducts />}
            {activeTab === "orders" && <AdminOrders />}
            {activeTab === "users" && <AdminUsers />}
        </div>

        </div>
    );
};

export default AdminDashboard;