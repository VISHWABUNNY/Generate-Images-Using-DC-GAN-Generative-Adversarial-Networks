import os
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
from keras.models import load_model

app = Flask(__name__)
CORS(app)

model_path = os.path.join(os.path.dirname(__file__), "generator.h5")
# Load the trained generator model
generator = load_model(model_path)

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "DC-GAN backend is running.",
        "endpoints": ["/generate_image"]
    })

@app.route("/generate_image", methods=["GET"])
def generate_image():
    noise = np.random.normal(0, 1, size=(1, 100))
    generated_img = generator.predict(noise, verbose=0)
    generated_img = np.squeeze(generated_img, axis=0)
    generated_img = (generated_img + 1.0) / 2.0
    generated_img = np.clip(generated_img, 0.0, 1.0)
    return jsonify({"image": generated_img.tolist()})

if __name__ == "__main__":
    app.run(debug=True)
