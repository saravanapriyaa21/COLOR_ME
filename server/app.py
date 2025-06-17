import os
import urllib.parse
import hashlib
import random
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
from pymongo import MongoClient
from google.cloud import vision
from io import BytesIO

# === Environment Setup ===
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath("colore-service-account.json")
vision_client = vision.ImageAnnotatorClient()

# === Flask Setup ===
app = Flask(__name__)
CORS(app)

# === MongoDB Setup ===
username = urllib.parse.quote_plus("saravanapriyaa")
password = urllib.parse.quote_plus("a4aSLfRNHRZE9:4")
MONGO_URI = f"mongodb+srv://{username}:{password}@paint-app.vgl8nua.mongodb.net/?retryWrites=true&w=majority&appName=paint-app"
client = MongoClient(MONGO_URI)
db = client["paint-app"]
collection = db["colors"]

# === File Paths ===
BASE_PATH = os.path.join(os.path.dirname(__file__), "image_data")
BASE_IMAGE = os.path.join(BASE_PATH, "base", "room-base.png")
MASK_IMAGE = os.path.join(BASE_PATH, "mask", "wall-mask.png")
OUTPUT_IMAGE = os.path.join(BASE_PATH, "output", "tinted-room.png")

# === Utilities ===
def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip("#")
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def generate_embedding_from_name(name):
    vec = np.zeros(512)
    for i in range(512):
        h = hashlib.md5((name + str(i)).encode()).hexdigest()
        vec[i] = int(h[:6], 16) % 1000 / 1000
    return vec.tolist()

def cosine_similarity(vec1, vec2):
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0.0
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# === Valid Vision Labels to Match ===
VALID_LABELS = [
    'Furniture', 'Couch', 'Living room', 'Interior design', 'Flooring',
    'Floor', 'Daybed', 'Home', 'Throw pillow', 'Wood flooring'
]

# === API: Suggest Colors ===

@app.route('/api/suggest-colors', methods=['POST'])
def suggest_colors():
    print("🔥 /api/suggest-colors was called")

    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    filename = image_file.filename.lower()
    allowed_extensions = ('.png', '.jpg', '.jpeg')

    if not filename.endswith(allowed_extensions):
        return jsonify({"error": "Unsupported file format. Please upload PNG, JPG, or JPEG files only."}), 400

    image_bytes = image_file.read()

    # Vision API
    try:
        vision_image = vision.Image(content=image_bytes)
        response = vision_client.label_detection(image=vision_image)
        labels = [label.description for label in response.label_annotations]
        print("Google Vision Labels:", labels)
    except Exception as e:
        return jsonify({"error": f"Vision API failed: {str(e)}"}), 500

    if not labels:
        return jsonify({"error": "No labels detected"}), 400

    try:
        best_label = next((lbl for lbl in labels if lbl in VALID_LABELS), None)
        if not best_label:
            return jsonify({"error": "No matching label found in valid list"}), 404

        print("Using label:", best_label)
        embedding = generate_embedding_from_name(best_label)
        print("Embedding sample:", embedding[:10])

        all_colors = list(collection.find({}, {"name": 1, "hex": 1, "embedding": 1}))
        scored_colors = []

        for doc in all_colors:
            score = cosine_similarity(embedding, doc["embedding"])
            scored_colors.append({
                "name": doc["name"],
                "hex": doc["hex"],
                "score": score
            })

        # Sort by score and get top matches
        scored_colors.sort(key=lambda x: x["score"], reverse=True)
        
        # Improved selection logic
        top_count = min(50, len(scored_colors))
        if top_count == 0:
            return jsonify({"error": "No matching colors found"}), 404
            
        # Create weighted probabilities (higher scores = higher chance)
        scores = np.array([x["score"] for x in scored_colors[:top_count]])
        # Apply softmax to create probabilities
        exp_scores = np.exp(scores - np.max(scores))  # for numerical stability
        probabilities = exp_scores / exp_scores.sum()
        
        # Select 3 unique colors using the probabilities
        selected_indices = np.random.choice(
            top_count, 
            size=min(3, top_count), 
            replace=False, 
            p=probabilities
        )
        
        suggestions = [scored_colors[i] for i in selected_indices]
        print("Selected Color Suggestions:", suggestions)

        return jsonify(suggestions), 200

    except Exception as e:
        print("Vector Search Error:", str(e))
        return jsonify({"error": f"Vector search failed: {str(e)}"}), 500

# === API: Tint Default Base Image (Colors Page) ===
@app.route("/api/tint-room", methods=["POST"])
def tint_room():
    try:
        color_hex = request.json.get("hex")
        if not color_hex:
            return {"error": "Missing hex color code"}, 400

        base_img = Image.open(BASE_IMAGE).convert("RGBA")
        mask_img = Image.open(MASK_IMAGE).convert("L")

        color_rgb = hex_to_rgb(color_hex)
        color_layer = Image.new("RGBA", base_img.size, color_rgb + (0,))
        color_layer.putalpha(mask_img)

        blended = Image.alpha_composite(base_img, color_layer)
        blended.save(OUTPUT_IMAGE)

        return send_file(OUTPUT_IMAGE, mimetype='image/png')

    except Exception as e:
        print("Tint error:", str(e))
        return {"error": str(e)}, 500

# === API: Tint Uploaded Image (Color Your House) ===
@app.route("/api/tint-room-upload", methods=["POST"])
def tint_uploaded_room():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        if 'hex' not in request.form:
            return jsonify({"error": "Missing hex color code"}), 400

        image_file = request.files['image']
        color_hex = request.form['hex']

        # Load the uploaded image and mask
        uploaded_img = Image.open(image_file.stream).convert("RGBA")
        mask_img = Image.open(MASK_IMAGE).convert("L")

        # Resize mask to match uploaded image size
        if mask_img.size != uploaded_img.size:
            mask_img = mask_img.resize(uploaded_img.size)

        # Prepare the color layer with the selected color
        color_rgb = hex_to_rgb(color_hex)
        color_layer = Image.new("RGBA", uploaded_img.size, color_rgb + (0,))
        color_layer.putalpha(mask_img)

        # Apply color tint to wall area
        blended = Image.alpha_composite(uploaded_img, color_layer)

        # Prepare output to send directly without saving
        output_io = BytesIO()
        blended.save(output_io, format='PNG')
        output_io.seek(0)

        return send_file(output_io, mimetype='image/png')

    except Exception as e:
        print("Uploaded Image Tint Error:", str(e))
        return jsonify({"error": str(e)}), 500

# === Run the Server ===
if __name__ == "__main__":
    app.run(port=5000, debug=True)