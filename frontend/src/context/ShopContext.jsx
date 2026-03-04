import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const currency = 'EUR';
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // new

    const logout = () => { // new
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false);
        setCartItems([]);
    };

    const clearCart = () => setCartItems([]);

    const addtoCart = async (product_id) => {
        const token = localStorage.getItem('token');
        if (!token) { alert("You need to be logged in to add items to cart."); return; }
        try {
            const response = await fetch('http://127.0.0.1:5000/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ product_id, quantity: 1 })
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.error || "Failed to add to cart"); }
            const data = await response.json();
            setCartItems(data.cart);
            alert("Added to cart!");
        } catch (error) { console.error("Add to cart error:", error); alert(error.message); }
    };

    const removeFromCart = async (product_id) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const item = cartItems.find(i => i.product_id === product_id);
            const response = await fetch('http://127.0.0.1:5000/api/cart/remove', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ product_id, quantity: item.quantity })
            });
            if (!response.ok) throw new Error("Failed to remove item");
            const data = await response.json();
            setCartItems(data.cart);
        } catch (error) { console.error("Remove error:", error); }
    };

    const updateQuantity = async (product_id, change) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const endpoint = change > 0 ? '/api/cart/add' : '/api/cart/remove';
        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: change > 0 ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ product_id, quantity: 1 })
            });
            if (!response.ok) throw new Error("Failed to update quantity");
            const data = await response.json();
            setCartItems(data.cart);
        } catch (error) { console.error("Update quantity error:", error); }
    };

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Fetch error:', err));
    }, []);

    // new - fetch cart on load if logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('/api/cart', {  // ← byt till relativ sökväg
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => { if (data.cart) setCartItems(data.cart); })
            .catch(err => console.error('Cart fetch error:', err));
    }, [isLoggedIn]);

    const value = { products, currency, cartItems, isLoggedIn, setIsLoggedIn, addtoCart, removeFromCart, updateQuantity, logout, clearCart };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};