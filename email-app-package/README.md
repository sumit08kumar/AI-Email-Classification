# AI-powered Email Classification and Information Extraction

This web application replicates the functionality of your n8n workflow for email processing and classification.

## Features

- **Email Content Input**: Paste email content for processing
- **AI-Powered Information Extraction**: Extracts sender names using Google Gemini AI
- **Email Classification**: Categorizes emails into 4 types:
  - Service Requests
  - Consultation Requests  
  - Payments
  - Others
- **Personalized Greetings**: Generates "Dear [Name]" or "Hi," based on sender info
- **Modern UI**: Responsive React interface with Tailwind CSS

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd email-app-package
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**:
   Create a `.env` file in the root directory with your Google Gemini API key:
   ```
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

3. **Run the Application**:
   ```bash
   python src/main.py
   ```

4. **Access the Web Interface**:
   Open http://localhost:5001 in your browser

## API Endpoints

- `POST /api/email/process` - Process email content
- `GET /api/email/categories` - Get available categories

## Architecture

- **Backend**: Flask with Google Gemini AI integration
- **Frontend**: React with Tailwind CSS and shadcn/ui components
- **AI**: Google Gemini 1.5 Flash for text processing

## Workflow Replication

This application replicates your n8n workflow:
1. ✅ Information extraction from email content
2. ✅ Conditional greeting generation
3. ✅ Email classification into categories
4. ✅ Results display with suggested labels

The web interface provides the same functionality as your n8n workflow but in a user-friendly web application format.
