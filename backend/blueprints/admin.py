@products_bp.route("/adminprod", methods=["POST"])
def add_product():
    try:
        data = request.get_json()
        
        new_product = Products(
            name=data.get("name"),
            price=data.get("price"),
            description=data.get("description"),
            category_id=data.get("category_id")
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400