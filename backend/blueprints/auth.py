from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from extensions import db, bcrypt
from models import User

auth_bp = Blueprint("auth", __name__)


# --- REGISTER ---
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # Validate required fields
    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Username, email and password are required"}), 400

    # Check for duplicates
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 409
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        username=data["username"],
        email=data["email"],
        team=data.get("team", False)
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created", "user": user.to_dict()}), 201


# --- LOGIN ---
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=user.user_id)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200


# --- GET PROFILE ---
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200


# --- EDIT PROFILE ---
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def edit_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Only update fields that were actually sent
    if "username" in data:
        existing = User.query.filter_by(username=data["username"]).first()
        if existing and existing.user_id != user_id:
            return jsonify({"error": "Username already taken"}), 409
        user.username = data["username"]

    if "email" in data:
        existing = User.query.filter_by(email=data["email"]).first()
        if existing and existing.user_id != user_id:
            return jsonify({"error": "Email already registered"}), 409
        user.email = data["email"]

    if "team" in data:
        user.team = data["team"]

    db.session.commit()

    return jsonify({"message": "Profile updated", "user": user.to_dict()}), 200


# --- CHANGE PASSWORD ---
@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not data or not all(k in data for k in ("current_password", "new_password")):
        return jsonify({"error": "Current and new password are required"}), 400

    if not user.check_password(data["current_password"]):
        return jsonify({"error": "Current password is incorrect"}), 401

    if len(data["new_password"]) < 8:
        return jsonify({"error": "New password must be at least 8 characters"}), 400

    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200


# --- DELETE ACCOUNT ---
@auth_bp.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Require password confirmation before deleting
    if not data or not user.check_password(data.get("password", "")):
        return jsonify({"error": "Password confirmation required"}), 401

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted"}), 200