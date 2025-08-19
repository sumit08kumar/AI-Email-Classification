# N8N Workflow Analysis

## Workflow Overview
The provided n8n workflow is an email processing automation system that:
1. Monitors Gmail for new emails
2. Extracts sender information 
3. Classifies emails into categories
4. Applies appropriate Gmail labels

## Key Components

### 1. Email Triggers
- **Gmail Trigger**: Monitors Gmail every minute for new emails
- **Webhook**: Alternative trigger via HTTP POST to `/classify-email`

### 2. Information Extraction
- **Information Extractor**: Uses Google Gemini AI to extract sender name from email
- **System Prompt**: "You are an advanced extraction tool. Only pull out the relevant details from the text. If you're unsure about the value of any requested attribute, leave it as an empty string."

### 3. Conditional Logic
- **If Node**: Checks if sender name is not empty
- **Edit Fields**: Creates personalized greeting ("Dear [Name]" vs "Hi,")
- **Merge**: Combines the conditional outputs

### 4. Email Classification
- **Text Classifier**: Categorizes emails using Google Gemini into:
  - Service Requests: "Requesting assistance for [issue/service]. Please review the details and provide support at the earliest convenience."
  - Consultation Requests: "Requesting a consultation regarding [topic/project]. Kindly confirm availability and suggest a suitable time."
  - Payments: "Requesting confirmation and processing of payment for [invoice/service]. Kindly update on the payment status."
  - Others: "Email the don't come is other categories should be here."

### 5. Gmail Label Application
- **Service Request**: Applies Label_3243196874267422524
- **Consultation Requests**: Applies Label_1816435084225678283  
- **Payments**: Applies Label_7690767831594721923
- **Others**: Applies Label_6561439374225279

## Web Application Requirements

To replicate this functionality, the web application needs:

1. **Email Input Interface**: Allow users to paste or input email content
2. **AI Integration**: Connect to Google Gemini or similar AI service for:
   - Information extraction (sender names)
   - Text classification
3. **Processing Pipeline**: Implement the conditional logic and data flow
4. **Results Display**: Show extracted information, classification, and suggested actions
5. **Optional Gmail Integration**: For actual label application (requires OAuth)

## Technical Architecture

### Backend (Flask)
- API endpoints for email processing
- AI service integration
- Data processing logic
- Optional Gmail API integration

### Frontend (React)
- Email input form
- Processing status display
- Results visualization
- Modern, responsive UI

### Key Features to Implement
1. Email content input
2. Sender name extraction
3. Email classification
4. Personalized greeting generation
5. Results display with categories
6. Processing history/log

