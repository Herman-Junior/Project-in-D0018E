from extensions import db, bcrypt
from datetime import datetime

# NEW - Added Category model because PRODUCTS references it
class Category(db.Model):
    __tablename__ = "CATEGORY"
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(50), unique=True, nullable=False)

class User(db.Model):
    __tablename__ = "USERS"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    team = db.Column(db.Boolean, default=False)

    def set_password(self, plain_password):
        self.password_hash = bcrypt.generate_password_hash(plain_password).decode("utf-8")

    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password_hash, plain_password)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "team": self.team,
        }
    
class Product(db.Model):
    __tablename__ = "PRODUCTS"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True)
    price = db.Column(db.Integer)
    description = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('CATEGORY.category_id'))

    def to_dict(self):
        # NEW - Added image key so LatestCollection/ProductItem can render it
        return {
            "product_id": self.product_id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category_id": self.category_id,
            "image": "https://placehold.co/400" 
        }