from flask import Blueprint, jsonify
from extensions import db
from models import Orders, OrderItems, Cart, Products
from flask_jwt_extended import jwt_required, get_jwt_identity
from blueprints.cart import cart_response
from blueprints.inventory import apply_inventory_change


order_items_bp = Blueprint("order_items", __name__)



def create_order_items(order_id, user_id):
    """Skapar order items, uppdaterar lager och tömmer cart."""
    cart_data = cart_response(user_id)

    for item in cart_data["cart"]:
        order_item = OrderItems(
            order_id=order_id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            snapshot_price=item["unit_price"]   # Locked price at order time
        )
        db.session.add(order_item)
        apply_inventory_change(item["product_id"], item["quantity"])

    Cart.query.filter_by(user_id=user_id).delete()  # emptys the cart

def render_checkout_success(order_id):
    """Bygger success-response med kvittodata."""
    order = Orders.query.get(order_id)
    if not order:
        return None

    items_list = []
    for item in order.items:
        product = Products.query.get(item.product_id)
        items_list.append({
            "product_id": item.product_id,
            "name": product.name if product else "unknown product",
            "quantity": item.quantity,
            "snapshot_price": item.snapshot_price,
            "subtotal": item.snapshot_price * item.quantity
        })

    return {
        "status": "success",
        "message": "Thank you for your purchase!",
        "receipt": {
            "order_id": order.order_id,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "method": order.method,
            "items": items_list,
            "total_price": order.total_price,
            "address": {                           
                "country": order.address.country,
                "state": order.address.state,
                "city": order.address.city
            } if order.address else None
        }
    }

@order_items_bp.route("/confirmation/<int:order_id>", methods=["GET"])
@jwt_required()
def confirmation(order_id):
    user_id = get_jwt_identity()
    order = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(render_checkout_success(order_id)), 200    

def get_receipt(order_id, user_id):
    """Hämtar ett sparat kvitto — verifierar att det tillhör rätt användare."""
    order = Orders.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order:
        return None, "Order not found"
    return render_checkout_success(order_id), None


@order_items_bp.route("/receipt/<int:order_id>", methods=["GET"])
@jwt_required()
def receipt(order_id):
    user_id = get_jwt_identity()
    data, error = get_receipt(order_id, user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(data), 200


@order_items_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_user_orders():
    """Hämtar alla ordrar för inloggad användare."""
    user_id = get_jwt_identity()
    orders = Orders.query.filter_by(user_id=user_id).order_by(Orders.created_at.desc()).all()

    return jsonify([
        {
            "order_id": o.order_id,
            "created_at": o.created_at.strftime("%Y-%m-%d %H:%M"),
            "total_price": o.total_price,
            "method": o.method,
            "item_count": len(o.items)
        }
        for o in orders
    ]), 200