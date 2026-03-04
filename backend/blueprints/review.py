#review.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Review, OrderItems, Orders, Products
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func


review_bp = Blueprint("review", __name__)



def has_purchased_product(user_id, product_id):
    """Checks if the user has bought the product."""
    purchased = OrderItems.query.join(Orders).filter(
        Orders.user_id == user_id,                      # Checks if the order belongs to the user
        OrderItems.product_id == product_id         # Checks if the order contains the product
    ).first()
    return purchased is not None


def has_reviewed_product(user_id, product_id):
    existing = Review.query.filter_by(
        user_id = user_id,                      # Checks if the review belongs to the user
        product_id = product_id                # Checks if the review is for the targeted product
    ).first()
    return existing is not None

def get_average_rating(product_id):
    """Räknar ut genomsnittsbetyg för en produkt."""
    result = db.session.query(func.avg(Review.rating)).filter(
        Review.product_id == product_id
    ).scalar()
    return round(float(result), 1) if result else None
    

@review_bp.route("/products/<int:product_id>/reviews", methods=["POST"])
@jwt_required()
def add_review(product_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    rating = data.get("rating")
    comment = data.get("comment", "")

    if not rating or not (1 <= rating <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    if not has_purchased_product(user_id, product_id):
        return jsonify({"error": "You must purchase the product before reviewing"}), 403

    if has_reviewed_product(user_id, product_id):
        return jsonify({"error": "You have already reviewed this product"}), 409

    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "message": "Review added successfully",
        "average_rating": get_average_rating(product_id)
    }), 201


@review_bp.route("/products/<int:product_id>/reviews", methods=["GET"])
def get_reviews(product_id):
    """Hämtar alla reviews + genomsnittsbetyg för en produkt."""
    if not Products.query.get(product_id):
        return jsonify({"error": "Product not found"}), 404

    reviews = Review.query.filter_by(product_id=product_id).all()
    reviews_list = [
        {
            "review_id": r.review_id,
            "user_id": r.user_id,
            "rating": r.rating,
            "comment": r.comment
        }
        for r in reviews
    ]

    return jsonify({
        "product_id": product_id,
        "average_rating": get_average_rating(product_id),
        "review_count": len(reviews_list),
        "reviews": reviews_list
    }), 200


@review_bp.route("/reviews/<int:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    """Kunden kan bara ta bort sina egna reviews."""
    user_id = get_jwt_identity()

    review = Review.query.filter_by(
        review_id=review_id,
        user_id=user_id        # ← säkerställer att det är kundens egen review
    ).first()

    db.session.delete(review)
    db.session.commit()

    return jsonify({
        "message": "Review deleted",
        "average_rating": get_average_rating(review.product_id)
    }), 200