from flask import jsonify
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Link, db

class LinkResource(Resource):
    # parser for POST and PATCH
    parser = reqparse.RequestParser()
    parser.add_argument("title", required=True, help="Link title is required")
    parser.add_argument("url", required=True, help="Link URL is required")
    parser.add_argument("description", required=False)
    parser.add_argument("category_id", required=False, type=int)

    @jwt_required()
    def get(self, id=None):
        user_id = get_jwt_identity()

        if id is None:
            links = Link.query.filter_by(user_id=user_id).all()
            return jsonify([link.to_dict() for link in links])
        else:
            link = Link.query.filter_by(id=id, user_id=user_id).first()
            if link is None:
                return {"message": "Link not found"}, 404
            return jsonify(link.to_dict())

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = self.parser.parse_args()

        new_link = Link(
            title=data["title"],
            url=data["url"],
            description=data.get("description"),
            category_id=data.get("category_id"),
            user_id=user_id
        )
        db.session.add(new_link)
        db.session.commit()

        return {"message": "Link created successfully"}, 201

    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        data = self.parser.parse_args()

        link = Link.query.filter_by(id=id, user_id=user_id).first()
        if link is None:
            return {"message": "Link not found"}, 404

        link.title = data.get("title", link.title)
        link.url = data.get("url", link.url)
        link.description = data.get("description", link.description)
        link.category_id = data.get("category_id", link.category_id)

        db.session.commit()
        return {"message": "Link updated successfully", "link": link.to_dict()}, 200

    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()

        link = Link.query.filter_by(id=id, user_id=user_id).first()
        if link is None:
            return {"message": "Link not found"}, 404

        db.session.delete(link)
        db.session.commit()
        return {"message": "Link deleted successfully"}, 200

