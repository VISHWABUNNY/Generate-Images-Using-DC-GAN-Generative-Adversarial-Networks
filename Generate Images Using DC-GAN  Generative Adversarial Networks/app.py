from flask import Flask, jsonify,render_template
import numpy as np
from keras.models import load_model

app = Flask(__name__)

# Load the trained generator model
generator = load_model("generator.h5")

# Define the endpoint for image generation
@app.route('/generate_image', methods=['GET'])
def generate_image():
    # Generate random noise
    noise = np.random.normal(0, 1, size=(1, 100))
    # Generate image using the generator model
    generated_img = generator.predict(noise)
    # Assuming the generated_img is in the range [-1, 1], convert it to [0, 1]
    generated_img = (generated_img + 1) / 2
    # Return the generated image data
    return jsonify({'image': generated_img.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
