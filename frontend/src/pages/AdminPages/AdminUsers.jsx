import React, { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:5000";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${BASE}/api/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUsers(Array.isArray(data) ? data : []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (user_id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
        const res = await fetch(`${BASE}/api/admin/user/${user_id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
        setUsers(users.filter(u => u.user_id !== user_id));
        } catch (err) {
        alert("Error: " + err.message);
        }
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
            Customers
            </h2>
            <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: '#5C1A1B' }}>
            {users.length} accounts
            </p>
        </div>

        {users.length === 0 ? (
            <p className="text-sm uppercase tracking-widest opacity-40" style={{ color: '#5C1A1B' }}>
            No users found.
            </p>
        ) : (
            <div className="flex flex-col gap-2">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] uppercase tracking-widest opacity-50"
                style={{ color: '#5C1A1B' }}>
                <span>Username</span>
                <span>Email</span>
                <span>Orders</span>
                <span>Role</span>
            </div>

            {users.map(u => (
                <div key={u.user_id}
                className="grid grid-cols-4 gap-4 items-center p-4 border"
                style={{ borderColor: '#5C1A1B' }}>

                <p className="font-bold uppercase text-sm" style={{ color: '#5C1A1B' }}>
                    {u.username}
                </p>

                <p className="text-xs opacity-70" style={{ color: '#5C1A1B' }}>
                    {u.email}
                </p>

                <p className="text-sm" style={{ color: '#5C1A1B' }}>
                    {u.order_count} order{u.order_count !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center justify-between">
                    {u.team ? (
                    <span className="text-[10px] px-2 py-1 uppercase tracking-widest font-bold text-white"
                        style={{ backgroundColor: '#5C1A1B' }}>
                        Admin
                    </span>
                    ) : (
                    <span className="text-[10px] uppercase tracking-widest opacity-50"
                        style={{ color: '#5C1A1B' }}>
                        Customer
                    </span>
                    )}

                    {/* don't show delete for admin accounts */}
                    {!u.team && (
                    <button onClick={() => handleDelete(u.user_id)}
                        className="text-[10px] font-bold uppercase px-2 py-1 bg-red-700 text-white hover:bg-red-900 transition-all">
                        Delete
                    </button>
                    )}
                </div>

                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default AdminUsers;