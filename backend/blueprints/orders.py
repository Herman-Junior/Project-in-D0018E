from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Cart, Products, Inventory, Orders, OrderItems

orders_bp = Blueprint("orders", __name__)


def validate_cart_items(cart_items):
    errors = []
    for item in cart_items:
        inventory = Inventory.query.filter_by(product_id=item.product_id).first()
        if not inventory:
            errors.append(f"{item.product.name} is no longer available")
            continue
        if inventory.amount < item.quantity:
            errors.append(
                f"{item.product.name}: only {inventory.amount} {inventory.unit_type} available, "
                f"you requested {item.quantity}"
            )
    return errors


def initiate_checkout(user_id, total_price):
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        raise ValueError("Cart is empty")

    errors = validate_cart_items(cart_items)
    if errors:
        raise ValueError(errors)

    Orders = Orders(user_id=user_id, total_price=total_price, status="pending")
    db.session.add(Orders)
    db.session.flush()

    for item in cart_items:
        order_item = OrderItems(order_id=Orders.order_id, product_id=item.product_id, quantity=item.quantity)
        db.session.add(order_item)
        inventory = Inventory.query.filter_by(product_id=item.product_id).first()
        inventory.amount -= item.quantity

    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return Orders


@orders_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty"}), 400

    total_price = sum(item.quantity * item.product.price for item in cart_items if item.product)

    try:
        Orders = initiate_checkout(user_id, total_price)
    except ValueError as e:
        error = e.args[0]
        if isinstance(error, list):
            return jsonify({"errors": error}), 400
        return jsonify({"error": error}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Orders created successfully", "Orders": Orders.to_dict()}), 201


@orders_bp.route("/<int:order_id>/payment", methods=["PUT"])
@jwt_required()
def update_payment(order_id):
    user_id = get_jwt_identity()
    Orders = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not Orders:
        return jsonify({"error": "Orders not found"}), 404
    if Orders.status == "cancelled":
        return jsonify({"error": "Cannot update a cancelled Orders"}), 400

    data = request.get_json()
    if not data or "method" not in data:
        return jsonify({"error": "Payment method is required"}), 400
    if data["method"] not in ("card", "billing"):
        return jsonify({"error": "method must be card or billing"}), 400

    Orders.method = data["method"]
    Orders.payment_details = data.get("payment_details", "")
    Orders.status = "confirmed"
    db.session.commit()

    return jsonify({"message": "Payment method updated", "Orders": Orders.to_dict()}), 200


@orders_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Orders.query.filter_by(user_id=user_id).all()
    return jsonify([Orders.to_dict() for Orders in orders]), 200


@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    Orders = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not Orders:
        return jsonify({"error": "Orders not found"}), 404

    items = [{
        "product_id": item.product_id,
        "product_name": item.product.name if item.product else None,
        "quantity": item.quantity,
        "price": item.product.price if item.product else None,
    } for item in Orders.items]

    return jsonify({**Orders.to_dict(), "items": items}), 200


@orders_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()
    Orders = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not Orders:
        return jsonify({"error": "Orders not found"}), 404
    if Orders.status in ("shipped", "delivered"):
        return jsonify({"error": f"Cannot cancel an Orders that is already {Orders.status}"}), 400
    if Orders.status == "cancelled":
        return jsonify({"error": "Orders is already cancelled"}), 400

    for item in Orders.items:
        inventory = Inventory.query.filter_by(product_id=item.product_id).first()
        if inventory:
            inventory.amount += item.quantity

    Orders.status = "cancelled"
    db.session.commit()

    return jsonify({"message": "Orders cancelled", "Orders": Orders.to_dict()}), 200