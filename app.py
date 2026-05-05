# app.py - Flask Backend
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Class name mapping to match frontend
CLASS_MAP = {
    'MildDemented':     'Mild Dementia',
    'ModerateDemented': 'Moderate Dementia',
    'NonDemented':      'Non-Demented',
    'VeryMildDemented': 'Very Mild Dementia'
}

CLASSES = ['MildDemented', 'ModerateDemented', 'NonDemented', 'VeryMildDemented']

# Load TFLite model
print("Loading model...")
interpreter = tf.lite.Interpreter(model_path='best_model_2.tflite')
interpreter.allocate_tensors()

input_details  = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print("Model loaded successfully!")

def prepare_image(image):
    img       = image.resize((256, 256))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        img           = Image.open(io.BytesIO(file.read())).convert('RGB')
        processed_img = prepare_image(img)

        interpreter.set_tensor(input_details[0]['index'], processed_img)
        interpreter.invoke()
        predictions = interpreter.get_tensor(output_details[0]['index'])

        score      = float(np.max(predictions))
        raw_label  = CLASSES[np.argmax(predictions)]
        label      = CLASS_MAP[raw_label]

        # Map all probabilities to frontend class names
        probabilities = {
            CLASS_MAP[CLASSES[i]]: float(predictions[0][i]) * 100
            for i in range(len(CLASSES))
        }

        return jsonify({
            'prediction':    label,
            'confidence':    score * 100,
            'probabilities': probabilities
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)