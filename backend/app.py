from flask import Flask
from flask_jwt_extended import JWTManager
from extensions import db, bcrypt
from flask_cors import CORS
from config import config_map
import os

def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "production")
    app.config.from_object(config_map[env])

    db.init_app(app)
    bcrypt.init_app(app)

    CORS(app)
    JWTManager(app)

    with app.app_context():
        from models import User, Products, Category 
        db.create_all()


    from blueprints.admin import admin_bp
    from blueprints.inventory import inventory_bp
    from blueprints.auth import auth_bp
    from blueprints.products import products_bp
    from blueprints.cart import cart_bp
    from blueprints.order_items import order_items_bp
    from blueprints.category import category_bp
    from blueprints.review import review_bp
    from blueprints.address import address_bp
    from blueprints.orders import orders_bp


    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(cart_bp, url_prefix="/api")
    app.register_blueprint(inventory_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(category_bp, url_prefix="/api")
    app.register_blueprint(review_bp, url_prefix="/api")
    app.register_blueprint(address_bp, url_prefix="/api")
    app.register_blueprint(order_items_bp, url_prefix="/api")


    return app

app = create_app()

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)

    