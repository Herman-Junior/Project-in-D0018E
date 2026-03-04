import React, { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";

    const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="flex min-h-[80vh] -mx-4">

        {/* SIDEBAR */}
        <div className="w-48 sm:w-56 p-6 flex flex-col gap-4"
            style={{ backgroundColor: '#5C1A1B' }}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">
            Admin Panel
            </h2>

            <button onClick={() => setActiveTab("products")}
            className="text-left text-xs uppercase tracking-widest py-2 transition-all"
            style={{ color: activeTab === "products" ? '#f5c07a' : 'rgba(255,255,255,0.7)' }}>
            Manage Products
            </button>

            <button onClick={() => setActiveTab("orders")}
            className="text-left text-xs uppercase tracking-widest py-2 transition-all"
            style={{ color: activeTab === "orders" ? '#f5c07a' : 'rgba(255,255,255,0.7)' }}>
            All Orders
            </button>

            <button onClick={() => setActiveTab("users")}
            className="text-left text-xs uppercase tracking-widest py-2 transition-all"
            style={{ color: activeTab === "users" ? '#f5c07a' : 'rgba(255,255,255,0.7)' }}>
            Customers
            </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 bg-white">
            {activeTab === "products" && <AdminProducts />}
            {activeTab === "orders" && <AdminOrders />}
            {activeTab === "users" && <AdminUsers />}
        </div>

        </div>
    );
};

export default AdminDashboard;