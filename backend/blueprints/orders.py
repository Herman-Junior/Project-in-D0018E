from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Cart, Inventory, Orders, OrderItems
from blueprints.order_items import create_order_items, render_checkout_success

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


def initiate_checkout(user_id, total_price, address_id):
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        raise ValueError("Cart is empty")

    errors = validate_cart_items(cart_items)
    if errors:
        raise ValueError(errors)

    order = Orders(
        user_id=user_id,
        total_price=total_price,
        address_id=address_id,  # ← från frontend
        status="pending"
    )
    db.session.add(order)
    db.session.flush()

    create_order_items(order.order_id, user_id)  # ← ersätter hela loopen
    db.session.commit()
    return Orders


@orders_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    address_id = data.get("address_id")

    if not address_id:
        return jsonify({"error": "address_id is required"}), 400

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty"}), 400

    total_price = sum(item.quantity * item.product.price for item in cart_items if item.product)

    try:
        order = initiate_checkout(user_id, total_price, address_id)
    except ValueError as e:
        error = e.args[0]
        if isinstance(error, list):
            return jsonify({"errors": error}), 400
        return jsonify({"error": error}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify(render_checkout_success(order.order_id)), 201


@orders_bp.route("/<int:order_id>/payment", methods=["PUT"])
@jwt_required()
def update_payment(order_id):
    user_id = get_jwt_identity()
    order = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    if order.status == "cancelled":
        return jsonify({"error": "Cannot update a cancelled order"}), 400

    data = request.get_json()
    if not data or "method" not in data:
        return jsonify({"error": "Payment method is required"}), 400
    if data["method"] not in ("card", "billing"):
        return jsonify({"error": "method must be card or billing"}), 400

    Orders.method = data["method"]
    Orders.payment_details = data.get("payment_details", "")
    Orders.status = "confirmed"
    db.session.commit()

    return jsonify({"message": "Payment updated", "order": order.to_dict()}), 200


@orders_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Orders.query.filter_by(user_id=user_id).order_by(Orders.created_at.desc()).all()
    return jsonify([
        {
            "order_id": o.order_id,
            "created_at": o.created_at.strftime("%Y-%m-%d %H:%M"),
            "total_price": o.total_price,
            "method": o.method,
            "status": o.status,
            "item_count": len(o.items)
        }
        for o in orders
    ]), 200


@orders_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()
    order = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    if order.status in ("shipped", "delivered"):
        return jsonify({"error": f"Cannot cancel an order that is already {order.status}"}), 400
    if order.status == "cancelled":
        return jsonify({"error": "Order is already cancelled"}), 400

    for item in order.items:
        inventory = Inventory.query.filter_by(product_id=item.product_id).first()
        if inventory:
            inventory.amount += item.quantity

    Orders.status = "cancelled"
    db.session.commit()

    return jsonify({"message": "Orders cancelled", "Orders": Orders.to_dict()}), 200