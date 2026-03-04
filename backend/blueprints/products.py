from flask import Blueprint, request, jsonify
from extensions import db
from models import Products, Category

products_bp = Blueprint("products", __name__)


@products_bp.route("/products", methods=["GET"])
def view_products():
    try:
        print(f"DEBUG: Ansluten till URI: {db.engine.url}")
        count = db.session.query(Products).count()
        print(f"DEBUG: Antal rader i PRODUCTS: {count}")

        products = Products.query.filter_by(is_public=True).all()
        result = []
        for p in products:
            d = p.to_dict()
            d["stock"] = p.inventory.amount if p.inventory else 0  # new - include stock
            result.append(d)
        return jsonify(result), 200
    except Exception as e:
        print(f"DEBUG: Fel uppstod: {e}")
        return jsonify({"error": str(e)}), 500


@products_bp.route("/product/<int:product_id>", methods=["GET"])
def get_product(product_id: int):
    try:
        product = Products.query.get(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404
        d = product.to_dict()
        d["stock"] = product.inventory.amount if product.inventory else 0  # new - include stock
        return jsonify(d), 200
    except Exception as e:
        print(f"DEBUG: Fel uppstod: {e}")
        return jsonify({"error": str(e)}), 500


# new - return all categories from database for admin dropdown
@products_bp.route("/categories", methods=["GET"])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([{
            "category_id": c.category_id,
            "category_name": c.category_name
        } for c in categories]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500