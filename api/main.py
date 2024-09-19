import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client

gallery_db = mongo_client.gallery
images_collection = gallery_db.images

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
DEBUG = bool(os.environ.get("DEBUG", True))

if not UNSPLASH_KEY:
    raise EnvironmentError("Couldn't find any Unsplash key!")

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = DEBUG

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
def images():
    if request.method == "GET":
        images = images_collection.find({})
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
    app.run(host="164.92.238.136", port=5050)