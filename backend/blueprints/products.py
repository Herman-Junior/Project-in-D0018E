<<<<<<< HEAD
# NEW - Blueprint for product routes
from flask import Blueprint, jsonify
from models import Products

products_bp = Blueprint("products", __name__)

# NEW - Route to get all products from the database
@products_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

=======
#Products.py
>>>>>>> 88f94dcd1611a48551995ff6dc00b6a3d1b28f21
from flask import Blueprint, request, jsonify
from extensions import db
from models import Products

products_bp = Blueprint("products", __name__)

@products_bp.route("/products", methods=["GET"])
def view_products():
    try:
        print(f"DEBUG: Ansluten till URI: {db.engine.url}")
<<<<<<< HEAD

=======
        
>>>>>>> 88f94dcd1611a48551995ff6dc00b6a3d1b28f21
        count = db.session.query(Products).count()
        print(f"DEBUG: Antal rader i PRODUCTS: {count}")

        products = Products.query.filter_by(is_public=True).all()
        return jsonify([p.to_dict() for p in products if p.inventory and p.inventory.amount > 0]), 200
    except Exception as e:
        print(f"DEBUG: Fel uppstod: {e}")
        return jsonify({"error": str(e)}), 500

@products_bp.route("/product/<int:product_id>", methods=["GET"])
def get_product(product_id:int):
    try:
        product = Products.query.get(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404
        else:
            return jsonify(product.to_dict()), 200
    except Exception as e:
        print(f"DEBUG: Fel uppstod: {e}")
<<<<<<< HEAD
        return jsonify({"error": str(e)}), 500
=======
        return jsonify({"error": str(e)}), 500
>>>>>>> 88f94dcd1611a48551995ff6dc00b6a3d1b28f21
