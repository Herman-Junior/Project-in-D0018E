from flask import Blueprint, jsonify
from models import Category

category_bp = Blueprint("category", __name__)


def get_products_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return None, "Category not found"

    products = [p.to_dict() for p in category.products if p.is_public]
    return {
        "category_id": category.category_id,
        "category_name": category.category_name,
        "products": products
    }, None


@category_bp.route("/categories/<int:category_id>/products", methods=["GET"])
def products_by_category(category_id):
    """Filtrerar produkter på kategori när användaren klickar en checkbox."""
    data, error = get_products_by_category(category_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(data), 200


@category_bp.route("/categories", methods=["GET"])
def list_categories():
    """Listar alla kategorier."""
    categories = Category.query.all()
    return jsonify([
        {
            "category_id": c.category_id,
            "category_name": c.category_name
        }
        for c in categories
    ]), 200