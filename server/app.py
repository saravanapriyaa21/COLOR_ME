from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image, ImageEnhance
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# --- File paths ---
BASE_PATH = os.path.join(os.path.dirname(__file__), "image_data")
BASE_IMAGE = os.path.join(BASE_PATH, "base", "room-base.png")
MASK_IMAGE = os.path.join(BASE_PATH, "mask", "wall-mask.png")
OUTPUT_IMAGE = os.path.join(BASE_PATH, "output", "tinted-room.png")


def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip("#")
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))


@app.route("/api/tint-room", methods=["POST"])
def tint_room():
    try:
        color_hex = request.json.get("hex")
        if not color_hex:
            return {"error": "Missing hex color code"}, 400

        # Load images
        base_img = Image.open(BASE_IMAGE).convert("RGBA")
        mask_img = Image.open(MASK_IMAGE).convert("L")  # grayscale mask

        # Convert color
        color_rgb = hex_to_rgb(color_hex)
        color_layer = Image.new("RGBA", base_img.size, color_rgb + (0,))

        # Apply mask
        color_layer.putalpha(mask_img)
        blended = Image.alpha_composite(base_img, color_layer)

        # Save output
        blended.save(OUTPUT_IMAGE)
        return send_file(OUTPUT_IMAGE, mimetype='image/png')

    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
