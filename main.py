# backend/main_flask.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Import our utilities
from utils.pdf_processor import PDFProcessor
from utils.ai_generator import QuestionGenerator

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize processors
pdf_processor = PDFProcessor()
question_generator = QuestionGenerator()

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to AI Study Buddy API",
        "version": "1.0.0"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "gemini_api": "connected" if os.getenv('GEMINI_API_KEY') else "not configured"
    })

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Please upload a PDF file"}), 400
    
    try:
        # Read PDF content
        pdf_content = file.read()
        
        # Extract text
        extracted_text = pdf_processor.extract_text_from_pdf(pdf_content)
        
        if not extracted_text:
            return jsonify({"error": "Could not extract text from PDF"}), 400
        
        # Generate questions
        result = question_generator.generate_mcq_questions(extracted_text, 5)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8000)