from flask import Flask
from flask_jwt_extended import JWTManager
from extensions import db, bcrypt, cors
from config import config_map
import os

def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "production")
    app.config.from_object(config_map[env])

    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)
    JWTManager(app)

    # Import all models here so SQLAlchemy registers them before any route runs
    with app.app_context():
        from models import User
        db.create_all()

    from blueprints.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app