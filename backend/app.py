import os
from datetime import timedelta

from flask import Flask
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Import models and database
from models import db
from resources.user import SignUpResource, LoginResource
from resources.link import LinkResource
from resources.category import CategoryResource


load_dotenv()

app = Flask(__name__)
CORS(app)
api = Api(app)


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///linksaver.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "super-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["BUNDLE_ERRORS"] = True

db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class Index(Resource):
    def get(self):
        return {"message": "Welcome to the LinkSaver API"}


api.add_resource(Index, "/")
api.add_resource(SignUpResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(LinkResource, "/links", "/links/<int:id>")
api.add_resource(CategoryResource, "/categories", "/categories/<int:id>")

if __name__ == "__main__":
    app.run(debug=True, port=5555)
