#inventory.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Products, Inventory

inventory_bp = Blueprint("inventory", __name__)

@inventory_bp.route("/admin/inventory", methods=["GET"])
def get_full_inventory():
    try:
        all_products = Products.query.all()
        
        inventory_report = []
        
        for p in all_products:
            stock_info = p.inventory 
            
            inventory_report.append({
                "product_id": p.product_id,
                "name": p.name,
                "price": p.price,
                "amount": stock_info.amount if stock_info else 0,
                "unit_type": stock_info.unit_type if stock_info else "n/a",
                "is_public": getattr(p, 'is_public', True) 
            })
            
        return jsonify(inventory_report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@inventory_bp.route("/admin/inventory/<int:product_id>", methods=["PUT"])
def update_inventory(product_id):
    try:
        data = request.get_json()
        new_amount = data.get("amount")
        new_unit = data.get("unit_type")

        # Hämta lager-raden för produkten
        stock = db.session.get(Inventory, product_id)

        if not stock:
            # Om produkten finns men ingen inventory-rad skapats än, skapar vi den nu
            stock = Inventory(product_id=product_id, amount=new_amount, unit_type=new_unit)
            db.session.add(stock)
        else:
            # Uppdatera befintliga värden om de skickats med i JSON
            if new_amount is not None:
                stock.amount = new_amount
            if new_unit is not None:
                stock.unit_type = new_unit

        db.session.commit()
        return jsonify({
            "message": "Inventory updated successfully",
            "product_id": product_id,
            "new_amount": stock.amount
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500