from extensions import db, bcrypt
from datetime import datetime


class User(db.Model):
    __tablename__ = "USERS"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    team = db.Column(db.Boolean, default=False)  # True = wholesale/business buyer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships — makes it easy to access a user's orders, cart etc later
    addresses = db.relationship("Address", backref="user", lazy=True)
    orders = db.relationship("Order", backref="user", lazy=True)
    cart_items = db.relationship("Cart", backref="user", lazy=True)
    reviews = db.relationship("Review", backref="user", lazy=True)

    # --- Password helpers ---

    def set_password(self, plain_password: str):
        """Hashes and stores the password. Never store plain text."""
        self.password_hash = bcrypt.generate_password_hash(plain_password).decode("utf-8")

    def check_password(self, plain_password: str) -> bool:
        """Returns True if the given password matches the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, plain_password)

    def to_dict(self):
        """Safe public representation — never expose password_hash."""
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "team": self.team,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.username}>"


# ---------------------------------------------------------------------------
# Supporting models — mapped to your existing SQL schema
# ---------------------------------------------------------------------------

class Address(db.Model):
    __tablename__ = "ADDRESS"

    address_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"), nullable=False)
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))

    def to_dict(self):
        return {
            "address_id": self.address_id,
            "country": self.country,
            "state": self.state,
            "city": self.city,
        }


class Category(db.Model):
    __tablename__ = "CATEGORY"

    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(50), unique=True)

    products = db.relationship("Product", backref="category", lazy=True)


class Product(db.Model):
    __tablename__ = "PRODUCTS"

    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_id = db.Column(db.Integer, db.ForeignKey("CATEGORY.category_id"))
    name = db.Column(db.String(100), unique=True)
    price = db.Column(db.Integer)
    description = db.Column(db.String(255))

    inventory = db.relationship("Inventory", backref="product", uselist=False, lazy=True)
    cart_items = db.relationship("Cart", backref="product", lazy=True)
    reviews = db.relationship("Review", backref="product", lazy=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "category_id": self.category_id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
        }


class Inventory(db.Model):
    __tablename__ = "INVENTORY"

    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"), primary_key=True)
    amount = db.Column(db.Float)
    unit_type = db.Column(db.String(50))


class Order(db.Model):
    __tablename__ = "ORDERS"

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"), nullable=False)
    method = db.Column(db.String(50))
    payment_details = db.Column(db.String(255))

    items = db.relationship("OrderItem", backref="order", lazy=True)


class Cart(db.Model):
    __tablename__ = "CART"

    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"), nullable=False)
    quantity = db.Column(db.Float)


class OrderItem(db.Model):
    __tablename__ = "ORDER_ITEMS"

    order_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("ORDERS.order_id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"), nullable=False)
    quantity = db.Column(db.Float)


class Review(db.Model):
    __tablename__ = "REVIEW"

    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey("PRODUCTS.product_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("USERS.user_id"), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(255))