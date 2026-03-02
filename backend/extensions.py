from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
cors = CORS(resources={r"/api/*": {"origins": "http://localhost:3000"}})