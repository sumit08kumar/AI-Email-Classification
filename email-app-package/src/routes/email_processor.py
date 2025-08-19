from flask import Blueprint, request, jsonify
import openai
import re
import json
import os
email_bp = Blueprint('email', __name__)
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client for Google Gemini API
client = openai.OpenAI(
    api_key=os.getenv("GOOGLE_GEMINI_API_KEY"), 
    base_url="https://generativelanguage.googleapis.com/v1beta/models/"
)

def extract_sender_name(email_text):
    """Extract sender name from email text using AI"""
    try:
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an advanced extraction tool. Only pull out the relevant details from the text. If you're unsure about the value of any requested attribute, leave it as an empty string. Extract the sender name from the email. If no name then return empty string."
                },
                {
                    "role": "user", 
                    "content": f"Extract sender name from this email: {email_text}"
                }
            ],
            max_tokens=100,
            temperature=0
        )
        
        sender_name = response.choices[0].message.content.strip()
        # Clean up the response - remove quotes and extra text
        sender_name = re.sub(r'^["\']|["\']$', '', sender_name)
        if sender_name.lower() in ['empty', 'none', 'n/a', 'not found']:
            sender_name = ""
        
        return sender_name
    except Exception as e:
        print(f"Error extracting sender name: {e}")
        return ""

def classify_email(email_snippet):
    """Classify email into categories using AI"""
    categories = {
        "Service Requests": "Requesting assistance for [issue/service]. Please review the details and provide support at the earliest convenience.",
        "Consultation Requests": "Requesting a consultation regarding [topic/project]. Kindly confirm availability and suggest a suitable time.",
        "Payments": "Requesting confirmation and processing of payment for [invoice/service]. Kindly update on the payment status.",
        "Others": "Email the don't come is other categories should be here."
    }
    
    try:
        categories_text = "\n".join([f"- {cat}: {desc}" for cat, desc in categories.items()])
        
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[
                {
                    "role": "system", 
                    "content": f"Please classify the text provided by the user into one of the following categories:\n{categories_text}\n\nPlease always choose only one label. Don't explain, and only output the category name."
                },
                {
                    "role": "user", 
                    "content": email_snippet
                }
            ],
            max_tokens=50,
            temperature=0
        )
        
        classification = response.choices[0].message.content.strip()
        
        # Ensure the classification matches one of our categories
        for category in categories.keys():
            if category.lower() in classification.lower():
                return category
        
        return "Others"  # Default fallback
        
    except Exception as e:
        print(f"Error classifying email: {e}")
        return "Others"

def generate_greeting(sender_name):
    """Generate personalized greeting based on sender name"""
    if sender_name and sender_name.strip():
        return f"Dear {sender_name.strip()}"
    else:
        return "Hi,"

@email_bp.route('/process', methods=['POST'])
def process_email():
    """Main endpoint to process email content"""
    try:
        data = request.get_json()
        
        if not data or 'email_content' not in data:
            return jsonify({'error': 'Email content is required'}), 400
        
        email_content = data['email_content']
        
        # Extract sender name
        sender_name = extract_sender_name(email_content)
        
        # Classify email
        email_category = classify_email(email_content)
        
        # Generate greeting
        greeting = generate_greeting(sender_name)
        
        # Prepare response
        response_data = {
            'sender_name': sender_name,
            'email_category': email_category,
            'greeting': greeting,
            'suggested_response': f"{greeting}\n\nThank you for your email. This has been classified as: {email_category}.\n\nWe will process your request and get back to you soon.\n\nBest regards,\nYour Team"
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error processing email: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@email_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get available email categories"""
    categories = {
        "Service Requests": "Requesting assistance for [issue/service]. Please review the details and provide support at the earliest convenience.",
        "Consultation Requests": "Requesting a consultation regarding [topic/project]. Kindly confirm availability and suggest a suitable time.",
        "Payments": "Requesting confirmation and processing of payment for [invoice/service]. Kindly update on the payment status.",
        "Others": "Email the don't come is other categories should be here."
    }
    return jsonify(categories)

