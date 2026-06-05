"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.extension import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/register", methods=["POST"])

def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg" : "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email = email, 
        password = hashed_password,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg" : "User created",
        "user" : new_user.serialize()
    }),201

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg" : "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg" : "You entered an invalid mail or password"}),401

    password_is_valid = bcrypt.check_password_hash(user.password, password)

    if not password_is_valid:
        return jsonify({"msg": "You entered an invalid mail or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "msg": "Login successful",
        "token": token,
        "user": user.serialize()
    }), 200

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Missing user"}), 404

    return jsonify({
        "msg": "Welcome",
        "user": user.serialize()
    }), 200
