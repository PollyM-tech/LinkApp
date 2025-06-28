from flask import jsonify
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Category, db

class CategoryResource(Resource):
    # creating a validation method as a class instance to use in patch and post
    parser = reqparse.RequestParser()
    parser.add_argument("name", required=True, help="Category name is required")

    @jwt_required()
    def get(self, id=None):
        user_id = get_jwt_identity()

        if id is None:
            categories = Category.query.filter_by(user_id=user_id).all()
            return jsonify([category.to_dict() for category in categories])
        else:
            category = Category.query.filter_by(id=id, user_id=user_id).first()
            
            if category is None:
                return {"message": "Category not found"}, 404
            return jsonify(category.to_dict())
        
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = self.parser.parse_args()
       
        # validate input 
        if not data.get("name"):
            return {"message": "Category name is required"}, 400

        # create our instance 
        category = Category(**data, user_id=user_id)

        #commit changes to our db
        db.session.add(category)
        db.session.commit()

        return {"message": "Category created successfully"}, 201
    
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        data = self.parser.parse_args()

        # get the record
        category = Category.query.filter_by(id=id, user_id=user_id).first()

        if category is None:
            return {"message": "Category not found"}, 404
        
        # validate input 
        if not data.get("name"):
            return {"message": "Category name is required"}, 400
        
        # update the instance with new values 
        category.name = data["name"]

        # commit to the db
        db.session.commit()

        return {"message": "Category updated successfully",
                "category": category.to_dict()}, 200 # Returns the updated resource 
    
    @jwt_required() 
    def delete(self, id):
        #retrieve the user's id from JWT
        user_id = get_jwt_identity()

        # get the category if it belongs to the user 
        category = Category.query.filter_by(id=id, user_id=user_id).first()

        if category is None:
            return {"message": "Category not found"}, 404
        
        #delete category
        db.session.delete(category)
        # commit changes to the database 
        db.session.commit()

        return {"message": "Category deleted successfully"}, 200