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
    # NEW - Explicitly allow the frontend port
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    JWTManager(app)

    with app.app_context():
        from models import User, Products, Category 
        db.create_all()

    #from blueprints.inventory import inventory_bp
    from blueprints.auth import auth_bp
    from blueprints.products import products_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api")
    #app.register_blueprint(inventory_bp, url_prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)