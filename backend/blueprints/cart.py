from flask import Blueprint, jsonify, request
from extensions import db
from models import Cart
from flask_jwt_extended import jwt_required, get_jwt_identity


cart_bp = Blueprint("cart", __name__)

def cart_response(user_id):
        
    #gets every row form cart table where the user_id matches
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    total_price_cart = 0
    items_list = []

    for item in cart_items: 
        product = item.product

        if product:
            subtotal = product.price * item.quantity
            total_price_cart += subtotal

            items_list.append({
                "product_id": product.product_id,
                "name": product.name,
                "unit_price": product.price,
                "quantity": item.quantity,
                "subtotal": subtotal
            })
    return {
        "status": "success",
        "cart": items_list,
        "total_accumulation": total_price_cart,
        "item_count": len(items_list)
    }    

@cart_bp.route("/cart", methods=["GET"])
@jwt_required()
def view_cart():
    try: 
        user_id = get_jwt_identity()
        return jsonify(cart_response(user_id)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def updatecart(user_id):
    return cart_response(user_id)


@cart_bp.route("/cart/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    """Lägger till produkt eller ökar antal om den redan finns."""
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "product_id is required"}), 400

    item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if item:
        item.quantity += quantity
    else:
        item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify(cart_response(user_id)), 200


@cart_bp.route("/cart/remove", methods=["PUT"])
@jwt_required()
def remove_from_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "product_id is required"}), 400

    item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

    if not item:                                                     
        return jsonify({"error": "Product not found in cart"}), 404

    item.quantity -= quantity

    if item.quantity <= 0:                                         
        db.session.delete(item)                                       

    db.session.commit()
    return jsonify(cart_response(user_id)), 200
