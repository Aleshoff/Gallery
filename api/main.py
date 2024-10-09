import os
import requests
from flask import Flask, request, jsonify, redirect
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

gallery_db = mongo_client.gallery
images_collection = gallery_db.images
users_collection = gallery_db.users

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
DEBUG = bool(os.environ.get("DEBUG", True))

if not UNSPLASH_KEY:
    raise EnvironmentError("Couldn't find any Unsplash key!")

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "alesh"
jwt = JWTManager(app)

app.config["DEBUG"] = DEBUG

#@app.route("/")
#def initial():
#    return redirect("https://alolprojectspace.com/front", code=307)

@app.route("/login", methods=["POST"])
def login():
    user = request.get_json()
    username = user.get("username")
    password = user.get("password")
    db_user = users_collection.find_one({"username": username})
    if db_user and db_user["password"] == password:
        access_token = create_access_token(identity=username)
        return { "token": access_token }
    return {"error": "Incorrect username or password"}

@app.route("/signup", methods=["POST"])
def signup():
    user = request.get_json()
    username = user.get("username")
    if users_collection.find_one({"username": username}):
        return {"error": "Such user already exists!"}
    
    user["my_images"] = []
    result = users_collection.insert_one(user)
    inserted_id = str(result.inserted_id)
    return {"inserted_id": inserted_id}


@app.route("/new-photo")
def new_photo():
    word = request.args.get("query")
    
    headers = {
        "Accept-Version":  "v1",
        "Authorization": "Client-ID " + UNSPLASH_KEY
    }
    
    params = {
        "query": word
    }
    
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)
    
    data = response.json()
    
    return data

@app.route("/images", methods=["GET", "POST"])
@jwt_required()
def images():
    if request.method == "GET":
        #current_user = get_jwt_identity()
        images = images_collection.find({})
        #return jsonify[{"logged_in_as": current_user}]
        return jsonify([img for img in images])
    if request.method == "POST":
        image = request.get_json()
        image["_id"] = image.get("id")
        result = images_collection.insert_one(image)
        inserted_id = result.inserted_id
        return {"inserted_id": inserted_id}
    
@app.route("/images/<image_id>", methods=["DELETE"])
def delete_image(image_id):
    if(request.method == "DELETE"):
        result = images_collection.delete_one({"_id": image_id})
        if not result:
            return {"error": "Image was't deleted! Try again!"}, 500
        if result and not result.deleted_count:
            return {"error": "Image is NOT found!"}, 404
        return {"deleted_id": image_id}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051)