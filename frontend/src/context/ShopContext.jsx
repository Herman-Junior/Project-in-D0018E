import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext({ products: [], currency: 'EUR' });

export const ShopContextProvider = ({ children }) => {
    const currency = 'EUR';
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // NEW - Fetching via proxy
        fetch('http://127.0.0.1:5000/api/products')
        .then(res => res.json())
        .then(data => {
            console.log('Fetched Products:', data); // NEW - Check your console!
            setProducts(data);
        })
        .catch(err => console.error('Fetch error:', err));
    }, []);

    const value = { products, currency };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
}