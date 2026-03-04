from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Products, Inventory, Cart, Orders

admin_bp = Blueprint("admin", __name__)


def admin_required():
    """Helper to check if the logged in user is an admin."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.team:
        return None, jsonify({"error": "Admin access required"}), 403
    return user, None, None


# --- ADD PRODUCT ---
@admin_bp.route("/product", methods=["POST"])
@jwt_required()
def add_product():
    user, err, status = admin_required()
    if err:
        return err, status

    try:
        data = request.get_json()

        new_product = Products(
            name=data.get("name"),
            price=data.get("price"),
            description=data.get("description"),
            category_id=data.get("category_id"),
            is_public=data.get("is_public", True)
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# --- CHANGE PRODUCT PRICE ---
@admin_bp.route("/product/<int:product_id>/price", methods=["PUT"])
@jwt_required()
def change_price(product_id):
    user, err, status = admin_required()
    if err:
        return err, status

    product = Products.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    if "price" not in data:
        return jsonify({"error": "Price is required"}), 400

    if float(data["price"]) <= 0:
        return jsonify({"error": "Price must be a positive number"}), 400

    product.price = data["price"]
    db.session.commit()

    return jsonify({"message": "Price updated", "product": product.to_dict()}), 200


# --- REMOVE PRODUCT ---
@admin_bp.route("/product/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_product(product_id):
    user, err, status = admin_required()
    if err:
        return err, status

    product = Products.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if inventory:
            db.session.delete(inventory)

        Cart.query.filter_by(product_id=product_id).delete()

        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# --- TOGGLE PRODUCT VISIBILITY ---
@admin_bp.route("/product/<int:product_id>/visibility", methods=["PUT"])
@jwt_required()
def toggle_visibility(product_id):
    user, err, status = admin_required()
    if err:
        return err, status

    product = Products.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    if "is_public" not in data:
        return jsonify({"error": "is_public field is required"}), 400

    product.is_public = data["is_public"]
    db.session.commit()

    status_str = "public" if product.is_public else "hidden"
    return jsonify({"message": f"Product is now {status_str}", "product": product.to_dict()}), 200


# --- DELETE USER ---
@admin_bp.route("/user/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user, err, status = admin_required()
    if err:
        return err, status

    target_user = User.query.get(user_id)
    if not target_user:
        return jsonify({"error": "User not found"}), 404

    if target_user.team:
        return jsonify({"error": "Cannot delete an admin user"}), 403

    db.session.delete(target_user)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


# --- MAKE USER ADMIN ---
@admin_bp.route("/user/<int:user_id>/make-admin", methods=["PUT"])
@jwt_required()
def make_admin(user_id):
    user, err, status = admin_required()
    if err:
        return err, status

    target_user = User.query.get(user_id)
    if not target_user:
        return jsonify({"error": "User not found"}), 404

    target_user.team = True
    db.session.commit()

    return jsonify({"message": f"{target_user.username} is now an admin"}), 200


# --- VIEW INVENTORY ---
@admin_bp.route("/inventory", methods=["GET"])
@jwt_required()
def view_inventory():
    user, err, status = admin_required()
    if err:
        return err, status

    inventory = Inventory.query.all()

    return jsonify([{
        "product_id": item.product_id,
        "product_name": item.product.name if item.product else None,
        "amount": item.amount,
        "unit_type": item.unit_type
    } for item in inventory]), 200


# --- UPDATE OR CREATE INVENTORY FOR A PRODUCT ---
@admin_bp.route("/inventory/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_inventory(product_id):
    user, err, status = admin_required()
    if err:
        return err, status

    data = request.get_json()
    amount = data.get("amount")
    unit_type = data.get("unit_type", "st")

    if amount is None:
        return jsonify({"error": "amount is required"}), 400

    product = Products.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    inventory = Inventory.query.filter_by(product_id=product_id).first()

    if inventory:
        inventory.amount = amount
        inventory.unit_type = unit_type
    else:
        inventory = Inventory(product_id=product_id, amount=amount, unit_type=unit_type)
        db.session.add(inventory)

    db.session.commit()
    return jsonify({
        "message": "Inventory updated",
        "product_id": product_id,
        "amount": amount,
        "unit_type": unit_type
    }), 200


# --- GET ALL ORDERS with customer info and items ---
@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_all_orders():
    user, err, status = admin_required()
    if err:
        return err, status

    orders = Orders.query.order_by(Orders.order_id.desc()).all()
    result = []
    for order in orders:
        result.append({
            "order_id": order.order_id,
            "total_price": order.total_price,
            "method": order.method,
            "status": getattr(order, 'status', 'N/A'),
            "payment_details": order.payment_details,
            "user": {
                "user_id": order.user.user_id,
                "username": order.user.username,
                "email": order.user.email
            } if order.user else None,
            "items": [{
                "order_item_id": item.order_item_id,
                "product_name": item.product.name if item.product else "Deleted product",
                "quantity": item.quantity,
                "snapshot_price": item.snapshot_price
            } for item in order.items]
        })
    return jsonify(result), 200


# --- GET ALL USERS with account info ---
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    user, err, status = admin_required()
    if err:
        return err, status

    users = User.query.order_by(User.user_id.asc()).all()
    return jsonify([{
        "user_id": u.user_id,
        "username": u.username,
        "email": u.email,
        "team": u.team,
        "order_count": len(u.orders)
    } for u in users]), 200


# new - GET ALL PRODUCTS including hidden ones for admin view
@admin_bp.route("/products", methods=["GET"])
@jwt_required()
def get_all_products():
    user, err, status = admin_required()
    if err:
        return err, status

    products = Products.query.all()
    result = []
    for p in products:
        d = p.to_dict()
        d["stock"] = p.inventory.amount if p.inventory else 0
        result.append(d)
    return jsonify(result), 200