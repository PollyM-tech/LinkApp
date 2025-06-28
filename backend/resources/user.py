from flask_restful import Resource, reqparse
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from models import User, db

class SignUpResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument ("username", required = True, type=str, help="Username is required")
    parser.add_argument ("email", required=True, type=str, help="Email is required")
    parser.add_argument("password", required=True, type=str, help="Password is required")

    def post(self):
        data = self.parser.parse_args()

        if User.query.filter_by(email=data["email"]).first():
            return {"message":"Email is already registered"}, 422
        
        hashed_password = generate_password_hash(data["password"]).decode("utf-8")

        new_user = User(
            username=data["username"],
            email=data["email"],
            password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)

        return {
            "message": "Account created successfully",
            "access_token": access_token,
            "user": new_user.to_dict()
        }, 201


class LoginResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("email", required=True, type=str, help="Email address is required")
    parser.add_argument("password", required=True, type=str, help="Password is required")

    def post(self):
        data = self.parser.parse_args()

        #check if the user exists
        user = User.query.filter_by(email=data["email"]).first()

        if user is None:
            return {"message": "Invalid email or password"}, 403
        
        # check if password is correct
        if check_password_hash(user.password_hash, data["password"]):
            #generate token
            access_token = create_access_token(identity=user.id)

            return {
                "message": "Login successful",
                "user": user.to_dict(),
                "access_token": access_token
            }, 200
        else:
            return {"message": "Invalid email or password"}, 403 
