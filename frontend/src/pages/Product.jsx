import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { currency, products, addtoCart, isLoggedIn } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(item => String(item.product_id) === String(productId));
      setProductData(found || null);
    }
  }, [productId, products]);

  // Hämtar reviews från backend
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setAverageRating(data.average_rating);
      })
      .catch(err => console.error('Reviews fetch error:', err));
  }, [productId]);

  const submitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert("You need to be logged in to leave a review."); return; }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();
      if (response.ok) {
        setReviewMessage("Review added!");
        setComment("");
        setRating(5);
        setAverageRating(data.average_rating);
        // Lägg till review i listan direkt utan att ladda om
        setReviews(prev => [...prev, { rating, comment, review_id: Date.now() }]);
      } else {
        setReviewMessage(data.error || "Could not add review");
      }
    } catch (err) {
      setReviewMessage("Could not connect to server");
    }
  };

  const deleteReview = async (review_id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/reviews/${review_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setReviews(prev => prev.filter(r => r.review_id !== review_id));
        setReviewMessage("Review deleted");
      }
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  if (!productData)
    return (
      <div className="p-10 text-center font-light uppercase tracking-widest opacity-50"
        style={{ color: '#5C1A1B' }}>
        Loading Product...
      </div>
    );

  const isOutOfStock = productData.stock !== undefined && productData.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto p-5 sm:p-10 mt-10">
      <div className="flex flex-col sm:flex-row gap-12">

        {/* LEFT: IMAGE */}
        <div className="w-full sm:w-1/2">
          <img
            src={productData.image || 'https://placehold.co/300x300/png'}
            alt={productData.name}
            className="w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* RIGHT: INFO */}
        <div className="w-full sm:w-1/2 flex flex-col">

          <nav className="text-xs uppercase mb-4 tracking-widest opacity-60"
            style={{ color: '#5C1A1B' }}>
            Products / {productData.name}
          </nav>

          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight"
            style={{ color: '#5C1A1B', fontStyle: 'italic' }}>
            {productData.name}
          </h1>

          {/* Average rating */}
          {averageRating && (
            <p className="text-sm mb-2" style={{ color: '#5C1A1B' }}>
              ⭐ {averageRating} / 5
            </p>
          )}

          <p className="text-3xl font-light mb-6" style={{ color: '#5C1A1B' }}>
            {productData.price} {currency}
          </p>

          <p className="text-sm uppercase mb-4 tracking-widest"
            style={{ color: '#5C1A1B', opacity: 0.6 }}>
            Category: {productData.category_name}
          </p>

          <hr style={{ borderColor: '#5C1A1B', opacity: 0.3 }} className="mb-6" />

          <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#5C1A1B' }}>
            Description
          </h3>
          <p className="leading-relaxed text-sm sm:text-base mb-8" style={{ color: '#5C1A1B' }}>
            {productData.description}
          </p>

          <button
            onClick={() => addtoCart(productData.product_id)}
            disabled={isOutOfStock}
            className="w-full py-4 px-10 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            style={{
              backgroundColor: isOutOfStock ? '#aaa' : '#5C1A1B',
              color: '#fff',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!isOutOfStock) e.target.style.opacity = '0.8' }}
            onMouseLeave={e => { e.target.style.opacity = '1' }}
          >
            {isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
          </button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-16 border-t pt-10" style={{ borderColor: '#5C1A1B' }}>
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6"
          style={{ color: '#5C1A1B' }}>
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {/* EXISTING REVIEWS */}
        {reviews.length === 0 ? (
          <p className="text-sm opacity-50 uppercase tracking-widest" style={{ color: '#5C1A1B' }}>
            No reviews yet
          </p>
        ) : (
          <div className="flex flex-col gap-4 mb-10">
            {reviews.map((r) => (
              <div key={r.review_id} className="border-b pb-4" style={{ borderColor: '#5C1A1B' }}>
                <p className="text-sm font-bold" style={{ color: '#5C1A1B' }}>
                  {"⭐".repeat(r.rating)}
                </p>
                <p className="text-sm mt-1" style={{ color: '#5C1A1B' }}>{r.comment}</p>
                {isLoggedIn && (
                  <button
                    onClick={() => deleteReview(r.review_id)}
                    className="text-xs opacity-40 hover:opacity-100 mt-1 uppercase tracking-widest"
                    style={{ color: '#5C1A1B' }}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADD REVIEW FORM */}
        {isLoggedIn && (
          <div className="flex flex-col gap-4 max-w-lg">
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#5C1A1B' }}>
              Leave a Review
            </h3>

            <div className="flex gap-2 items-center">
              <label className="text-xs uppercase tracking-widest" style={{ color: '#5C1A1B' }}>
                Rating:
              </label>
              <select
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="border px-2 py-1 text-sm"
                style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </select>
            </div>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              className="border p-3 text-sm resize-none outline-none"
              style={{ borderColor: '#5C1A1B', color: '#5C1A1B' }}
            />

            <button
              onClick={submitReview}
              className="py-3 text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-all"
              style={{ backgroundColor: '#5C1A1B', color: '#fff' }}>
              Submit Review
            </button>

            {reviewMessage && (
              <p className="text-xs uppercase tracking-widest opacity-70" style={{ color: '#5C1A1B' }}>
                {reviewMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;