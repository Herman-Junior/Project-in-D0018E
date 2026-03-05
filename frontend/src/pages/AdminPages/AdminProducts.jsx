import React, { useEffect, useState } from "react";

const BASE = "http://127.0.0.1:5000";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "",
    category_name: "",  // new - text input instead of dropdown
    stock: "", unit_type: "st", is_public: true
  });
  const [priceError, setPriceError] = useState("");

  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // new - removed loadCategories, no longer needed

  useEffect(() => {
    loadProducts();
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setPriceError("");
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: "", description: "", price: "",
      category_name: "", stock: "", unit_type: "st", is_public: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setPriceError("");
    setImageFile(null);
    setImagePreview(product.image && !product.image.includes("placehold") ? product.image : null);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_name: "",  // new - not needed when editing
      stock: product.stock || 0,
      unit_type: "st",
      is_public: product.is_public
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    setPriceError(val < 0 ? "Price must be a positive number" : "");
    setFormData({ ...formData, price: val });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.price) <= 0 || formData.price === "") {
      setPriceError("Price must be a positive number");
      return;
    }

    try {
      if (editingProduct) {
        await fetch(`${BASE}/api/admin/product/${editingProduct.product_id}/price`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ price: parseFloat(formData.price) })
        });

        await fetch(`${BASE}/api/admin/product/${editingProduct.product_id}/visibility`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ is_public: formData.is_public })
        });

        await fetch(`${BASE}/api/admin/inventory/${editingProduct.product_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ amount: parseFloat(formData.stock), unit_type: formData.unit_type })
        });

        if (imageFile) {
          const imgForm = new FormData();
          imgForm.append("image", imageFile);
          await fetch(`${BASE}/api/admin/product/${editingProduct.product_id}/image`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: imgForm
          });
        }

      } else {
        // new - send category_name as plain text, backend finds or creates it automatically
        const body = new FormData();
        body.append("name", formData.name);
        body.append("description", formData.description);
        body.append("price", parseFloat(formData.price));
        body.append("category_name", formData.category_name);
        body.append("is_public", formData.is_public);
        if (imageFile) body.append("image", imageFile);

        const res = await fetch(`${BASE}/api/admin/product`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body
        });
        if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
        const newProduct = await res.json();

        if (formData.stock !== "") {
          await fetch(`${BASE}/api/admin/inventory/${newProduct.product_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ amount: parseFloat(formData.stock), unit_type: formData.unit_type })
          });
        }
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (product_id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      const res = await fetch(`${BASE}/api/admin/product/${product_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      loadProducts();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ color: '#5C1A1B' }}>
          Manage Products
        </h2>
        <button onClick={openAdd}
          className="text-xs font-bold uppercase px-4 py-2 text-white hover:opacity-80 transition-all"
          style={{ backgroundColor: '#5C1A1B' }}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#5C1A1B' }}></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm uppercase tracking-widest opacity-50 text-center mt-10" style={{ color: '#5C1A1B' }}>
          No products found.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map(p => (
            <div key={p.product_id}
              className="flex items-center justify-between p-4 border"
              style={{ borderColor: '#5C1A1B' }}>

              <div className="flex items-center gap-4">
                <img
                  src={p.image && !p.image.includes("placehold") ? p.image : 'https://placehold.co/60x60/png'}
                  alt={p.name}
                  className="w-14 h-14 object-cover"
                />
                <div>
                  <p className="font-bold uppercase text-sm" style={{ color: '#5C1A1B' }}>{p.name}</p>
                  <p className="text-xs opacity-60" style={{ color: '#5C1A1B' }}>
                    {p.price} EUR — Stock: {p.stock ?? 0} —
                    <span style={{ color: p.is_public ? 'green' : 'red' }}>
                      {p.is_public ? " Public" : " Hidden"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="text-xs font-bold uppercase px-3 py-1 border hover:opacity-60 transition-all"
                  style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p.product_id)}
                  className="text-xs font-bold uppercase px-3 py-1 bg-red-700 text-white hover:bg-red-900 transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(92,26,27,0.75)' }}>
          <div className="bg-white p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold uppercase text-lg" style={{ color: '#5C1A1B' }}>
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: '#5C1A1B' }}>✕</button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">

              {!editingProduct && (
                <>
                  <input type="text" placeholder="PRODUCT NAME" required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="border-b p-2 text-sm outline-none uppercase tracking-widest bg-transparent"
                    style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }} />

                  <textarea placeholder="DESCRIPTION" required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="border p-2 text-sm h-20 outline-none bg-transparent resize-none"
                    style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }} />

                  {/* new - type category name directly, auto-created on backend if new */}
                  <input type="text" placeholder="CATEGORY (e.g. Beef, Pork)" required
                    value={formData.category_name}
                    onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                    className="border-b p-2 text-sm outline-none uppercase tracking-widest bg-transparent"
                    style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }} />
                </>
              )}

              {/* image upload for both adding and editing */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold opacity-60" style={{ color: '#5C1A1B' }}>
                  {editingProduct ? "Change Image (optional)" : "Product Image"}
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview"
                    className="w-full h-36 object-cover border"
                    style={{ borderColor: '#5C1A1B' }} />
                )}
                <label className="flex items-center gap-3 cursor-pointer border p-2 text-xs uppercase tracking-widest font-bold hover:opacity-70 transition-all"
                  style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }}>
                  <span>Choose File</span>
                  <span className="opacity-50 normal-case font-normal text-xs">
                    {imageFile ? imageFile.name : "No file chosen"}
                  </span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <input type="number" placeholder="PRICE (EUR)" required min="0.01" step="0.01"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className="border-b p-2 text-sm outline-none bg-transparent"
                  style={{ borderColor: priceError ? 'red' : '#5C1A1B', color: '#5C1A1B' }} />
                {priceError && (
                  <p className="text-red-500 text-xs uppercase tracking-widest">{priceError}</p>
                )}
              </div>

              <input type="number" placeholder="STOCK AMOUNT" min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="border-b p-2 text-sm outline-none bg-transparent"
                style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }} />

              <input type="text" placeholder="UNIT TYPE (e.g. st, kg)"
                value={formData.unit_type}
                onChange={e => setFormData({ ...formData, unit_type: e.target.value })}
                className="border-b p-2 text-sm outline-none uppercase tracking-widest bg-transparent"
                style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }} />

              <label className="flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
                style={{ color: '#5C1A1B' }}>
                <input type="checkbox" checked={formData.is_public}
                  onChange={e => setFormData({ ...formData, is_public: e.target.checked })} />
                Public (visible to customers)
              </label>

              <div className="flex gap-2 mt-4">
                <button type="submit"
                  className="flex-1 py-3 text-xs font-bold uppercase text-white hover:opacity-80 transition-all"
                  style={{ backgroundColor: '#5C1A1B' }}>
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-xs font-bold uppercase border hover:opacity-60 transition-all"
                  style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;