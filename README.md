markdown
# 🎓 RAG Study Assistant

> **AI-Powered Study Companion | Transform PDFs into Interactive Learning**

A full-stack web application that uses Retrieval-Augmented Generation (RAG) to help students study smarter. Upload PDFs, ask questions, generate exam papers, and get personalized AI assistance.

## ✨ Features

### 🤖 AI Study Tools
- **AI Chat Assistant** - Ask any question, PDF-related or general
- **Explain Concepts** - Detailed explanations from your materials
- **Generate MCQs** - Create practice questions with answers
- **Make Notes** - Structured study notes automatically
- **Summarize Content** - Concise summaries of long documents
- **Exam Preparation** - Study plans and revision schedules
- **Exam Paper Generator** - Create complete exam papers with custom marks

### 📚 Document Processing
- Multi-PDF upload with drag & drop
- Smart text extraction and chunking
- Per-user vector database isolation
- Fast semantic search with FAISS

### 🎨 User Experience
- Modern glassmorphism UI
- Dark/Light mode toggle
- Real-time chat interface
- Responsive design for all devices
- Professional exam paper formatting

## 🛠️ Technology Stack

### Backend
- **Python 3.11+** with Flask
- **LangChain** for RAG pipeline
- **FAISS** for vector similarity search
- **HuggingFace** embeddings (all-MiniLM-L6-v2)
- **Groq API** for LLM (GPT-OSS-120B)
- **PyMuPDF** for PDF processing

### Frontend
- **Node.js & Express** server
- **Vanilla JavaScript** with modern ES6+
- **HTML5/CSS3** with responsive design
- **Marked.js** for markdown rendering

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rag-study-assistant.git
cd rag-study-assistant
Setup Backend

bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
Configure Environment
Create backend/.env:

env
GROQ_API_KEY=your_groq_api_key_here
Setup Frontend

bash
cd frontend
npm install
Running the Application
Terminal 1 - Backend:

bash
cd backend
python app.py
# Server starts on http://localhost:5000
Terminal 2 - Frontend:

bash
cd frontend
node server.js
# Server starts on http://localhost:3000
Visit http://localhost:3000 and start studying!

📖 Usage Guide
1. Create Account & Login
