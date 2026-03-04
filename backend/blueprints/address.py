from flask import Blueprint, jsonify, request
from extensions import db
from models import Address
from flask_jwt_extended import jwt_required, get_jwt_identity


address_bp = Blueprint("address", __name__)


def validate_address(data):
    """Validerar att alla adressfält finns och inte är tomma."""
    required_fields = ["country", "state", "city"]
    for field in required_fields:
        if not data.get(field):
            return False, f"{field} is required"
    return True, None


@address_bp.route("/address", methods=["POST"])
@jwt_required()
def add_address():
    user_id = get_jwt_identity()
    data = request.get_json()

    is_valid, error = validate_address(data)
    if not is_valid:
        return jsonify({"error": error}), 400

    address = Address(
        user_id=user_id,
        country=data.get("country"),
        state=data.get("state"),
        city=data.get("city")
    )
    db.session.add(address)
    db.session.commit()

    return jsonify({
        "message": "Address added successfully",
        "address_id": address.address_id
    }), 201


@address_bp.route("/address", methods=["GET"])
@jwt_required()
def get_addresses():
    """Hämtar alla adresser för användaren."""
    user_id = get_jwt_identity()
    addresses = Address.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "address_id": a.address_id,
            "country": a.country,
            "state": a.state,
            "city": a.city
        }
        for a in addresses
    ]), 200


@address_bp.route("/address/<int:address_id>", methods=["DELETE"])
@jwt_required()
def delete_address(address_id):
    user_id = get_jwt_identity()

    address = Address.query.filter_by(
        address_id=address_id,
        user_id=user_id
    ).first()

    if not address:
        return jsonify({"error": "Address not found or not yours"}), 404

    db.session.delete(address)
    db.session.commit()
    return jsonify({"message": "Address deleted"}), 200