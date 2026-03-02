#models.py
from extensions import db, bcrypt
from datetime import datetime


class User(db.Model):
    __tablename__ = "USERS"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), unique=True)
    team = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    addresses = db.relationship("Address", backref="user", lazy=True)
    orders = db.relationship("Orders", backref="user", lazy=True)
    cart_items = db.relationship("Cart", backref="user", lazy=True)
    reviews = db.relationship("Review", backref="user", lazy=True)

    def set_password(self, plain_password: str):
        self.password_hash = bcrypt.generate_password_hash(plain_password).decode("utf-8")

    def check_password(self, plain_password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, plain_password)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "team": self.team
        }

class Address(db.Model):
    __tablename__ = "ADDRESS"
    address_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"))
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))

class Category(db.Model):
    __tablename__ = "CATEGORY"
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(50), unique=True)
    products = db.relationship("Products", backref="category", lazy=True)

class Products(db.Model):
    __tablename__ = "PRODUCTS"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_id = db.Column(db.Integer, db.ForeignKey("CATEGORY.category_id"))
    name = db.Column(db.String(100), unique=True)
    price = db.Column(db.Integer)
    description = db.Column(db.String(255))
    is_public = db.Column(db.Boolean, default=True)

    inventory = db.relationship("Inventory", backref="product", uselist=False, lazy=True)
    cart_items = db.relationship("Cart", backref="product", lazy=True)
    reviews = db.relationship("Review", backref="product", lazy=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "is_public": self.is_public
        }

class Inventory(db.Model):
    __tablename__ = "INVENTORY"
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"), primary_key=True)
    amount = db.Column(db.Float)
    unit_type = db.Column(db.String(50))

class Orders(db.Model):
    __tablename__ = "ORDERS"
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"))
    method = db.Column(db.String(50))
    total_price = db.Column(db.Integer)
    payment_details = db.Column(db.String(255))
    items = db.relationship("OrderItems", backref="order", lazy=True)

class Cart(db.Model):
    __tablename__ = "CART"
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"))
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"))
    quantity = db.Column(db.Float)

class OrderItems(db.Model):
    __tablename__ = "ORDER_ITEMS"
    order_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("ORDERS.order_id"))
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"))
    quantity = db.Column(db.Float)

class Review(db.Model):
    __tablename__ = "REVIEW"
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"))
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"))
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(255))