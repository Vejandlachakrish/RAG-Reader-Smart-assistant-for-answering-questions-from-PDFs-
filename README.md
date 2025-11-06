# 🎓 RAG Study Assistant# RAG Study Assistant



> **An AI-powered study companion that transforms your PDF materials into interactive learning experiences**An intelligent AI-powered study assistant that uses Retrieval-Augmented Generation (RAG) to help students learn from their study materials.



A full-stack web application that leverages Retrieval-Augmented Generation (RAG) to help students study smarter. Upload PDFs, ask questions, generate exam papers, create MCQs, and get personalized study assistance—all powered by advanced AI.## Features



---### Core Capabilities

1. **PDF Upload & Processing** - Upload multiple PDF study materials

## 📑 Table of Contents2. **Intelligent Chat Interface** - Ask questions about your materials

3. **Multiple AI Tools**:

- [Features](#-features)   - **AI Chat (General)** ⭐ NEW - Ask anything, PDF-related or not

- [Technology Stack](#-technology-stack)   - **Explain Concept** - Get detailed explanations of concepts

- [Architecture](#-architecture)   - **Summarize** - Create concise summaries

- [Prerequisites](#-prerequisites)   - **Generate MCQs** - Create practice multiple-choice questions

- [Installation](#-installation)   - **Make Notes** - Generate structured study notes

- [Configuration](#-configuration)   - **Exam Prep** - Prepare study plans and revision notes

- [Running the Application](#-running-the-application)   - **Exam Paper Preparation** - Generate complete exam papers

- [Usage Guide](#-usage-guide)

- [AI Tools Explained](#-ai-tools-explained)### 🆕 Exam Paper Preparation Tool

- [Exam Paper Generator Guide](#-exam-paper-generator-guide)Automatically generates complete, academically rigorous examination papers based on your study materials.

- [Project Structure](#-project-structure)

- [API Documentation](#-api-documentation)**Default Configuration:**

- [Troubleshooting](#-troubleshooting)- 5 examination papers

- [Contributing](#-contributing)- 5 questions per paper (2 Easy, 2 Medium, 1 Hard)

- [License](#-license)- 10 marks per question (50 marks total per paper)



---**Custom Options:**

- Specify number of papers, questions, and marks

## ✨ Features- Define custom difficulty distributions

- Natural language parsing: "Create 3 papers with 8 questions each, 5 marks"

### 🔐 **User Management**

- **Secure Authentication:** Email/password-based registration and login[View detailed documentation](./EXAM_PAPER_FEATURE.md)

- **User Profiles:** Personalized dashboards with editable profiles

- **Password Recovery:** Forgot password functionality with email-based reset## Technology Stack

- **Session Management:** Persistent login sessions with secure token handling

### Backend

### 📚 **Document Processing**- **Python 3.11+**

- **PDF Upload:** Multi-file upload with drag-and-drop support- **Flask** - Web framework

- **Smart Chunking:** Automatic text extraction with optimal chunk sizes (1000 chars, 200 overlap)- **LangChain** - RAG framework

- **Vector Storage:** Per-user isolated vector databases using FAISS- **FAISS** - Vector database

- **Efficient Retrieval:** Fast semantic search with HuggingFace embeddings (all-MiniLM-L6-v2)- **HuggingFace Embeddings** - Text embeddings

- **Groq** - LLM provider

### 🤖 **AI-Powered Study Tools**- **PyMuPDF** - PDF processing



#### **1. AI Chat (General)** ⭐ *New*### Frontend

- **Universal Assistant:** Answer any question, PDF-related or not- **Node.js & Express** - Web server

- **Smart Context Switching:** Uses PDF content when relevant, general knowledge otherwise- **Vanilla JavaScript** - Client-side logic

- **No Limitations:** Overcome the "PDF-only" restriction of other tools- **HTML5/CSS3** - Modern UI

- **Marked.js** - Markdown rendering

#### **2. Explain Concept**

- Deep explanations of complex topics from your study materials## Installation

- Step-by-step breakdowns with examples

- Strictly based on uploaded PDF content### Prerequisites

- Python 3.11 or higher

#### **3. Summarize**- Node.js 18 or higher

- Concise summaries of lengthy documents or chapters- Valid API keys:

- Key points extraction with structured formatting  - Groq API key (for LLM)

- Configurable summary length  - Google Search API key (optional, for web search)



#### **4. Generate MCQs**### Backend Setup

- Auto-generate multiple-choice questions from PDFs```bash

- Includes 4 options per question with correct answerscd backend

- Explanations for each answerpip install -r requirements.txt

- Perfect for self-testing```



#### **5. Make Notes**Create a `.env` file in the backend directory:

- Structured study notes with headings and bullet points```env

- Organized by topics and subtopicsGROQ_API_KEY=your_groq_api_key_here

- Export-ready formatted notesGOOGLE_API_KEY=your_google_api_key_here

GOOGLE_CSE_ID=your_google_cse_id_here

#### **6. Exam Prep**```

- Comprehensive study plans and revision schedules

- Topic prioritization based on content importance### Frontend Setup

- Exam-focused content organization```bash

cd frontend

#### **7. Exam Paper Preparation** 🎯 *Featured*npm install

- **Flexible Paper Generation:** Create 1 to 100+ exam papers```

- **Variable Marks:** Support for different mark distributions (2, 4, 5, 10 marks, etc.)

- **Difficulty Control:** Easy, Medium, Hard, or custom distributions## Running the Application

- **Time Management:** Custom duration settings (15 min to 3+ hours)

- **Beautiful Display:** Color-coded questions with professional formatting### Start Backend

- **Natural Language Input:** "Give me 3 papers with 5 questions, all hard, 30 minutes"```bash

cd backend

### 🎨 **User Interface**python app.py

- **Modern Design:** Glassmorphism UI with smooth animations```

- **Dark/Light Mode:** Toggle between themes for comfortable studyingBackend runs on: http://localhost:5000

- **Responsive Layout:** Works on desktop, tablet, and mobile

- **Real-time Chat:** WebSocket-like experience with typing indicators### Start Frontend

- **Markdown Support:** Rich text formatting in AI responses```bash

- **Exam Paper Cards:** Professional exam layout with badges and separatorscd frontend

node server.js

### 🔒 **Security & Privacy**```

- **User Isolation:** Each user's PDFs and vectors are completely separateFrontend runs on: http://localhost:3000

- **Secure Storage:** Email-based hashing for vector store organization

- **No Data Leaks:** Per-user retrieval ensures privacy## Usage Guide

- **Session Security:** HTTP-only cookies and CORS protection

### 1. Sign Up / Login

---- Navigate to http://localhost:3000

- Create an account or login

## 🛠️ Technology Stack- Fill in your profile details



### **Backend**### 2. Upload Study Materials

| Technology | Purpose | Version |- Go to the chatbot page

|------------|---------|---------|- Upload PDF files (drag & drop or click to browse)

| **Python** | Core language | 3.11+ |- Wait for processing confirmation

| **Flask** | Web framework | 2.3.0+ |

| **LangChain** | LLM orchestration | 0.1.0+ |### 3. Select a Tool

| **FAISS** | Vector similarity search | 1.7.4+ |Choose from the Task/Tool dropdown:

| **HuggingFace** | Embeddings (all-MiniLM-L6-v2) | - |- **Explain Concept** - For understanding specific topics

| **Groq API** | LLM provider (GPT-OSS-120B) | - |- **Summarize** - For quick content summaries

| **PyMuPDF (fitz)** | PDF text extraction | 1.23.0+ |- **Generate MCQs** - For practice questions

| **BeautifulSoup4** | HTML parsing for web search | 4.12.0+ |- **Make Notes** - For structured notes

| **Flask-CORS** | Cross-origin resource sharing | 4.0.0+ |- **Exam Prep** - For study planning

- **Exam Paper Preparation** - For complete exam papers ⭐

### **Frontend**

| Technology | Purpose | Version |### 4. Ask Questions

|------------|---------|---------|Type your query in the chat interface:

| **Node.js** | Runtime environment | 16.0+ |- "Explain the concept of machine learning"

| **Express.js** | Web server | 4.18.0+ |- "Summarize chapter 5"

| **Vanilla JavaScript** | Client-side logic | ES6+ |- "Generate MCQs on neural networks"

| **HTML5/CSS3** | Structure and styling | - |- "Generate 3 exam papers on database systems"

| **Marked.js** | Markdown rendering | 9.0.0+ |

| **Font Awesome** | Icons | 6.4.0+ |### 5. Review Responses

The AI will generate responses based on your uploaded materials, formatted in clear markdown.

### **Storage**

- **FAISS Vector Store:** For embedding storage and similarity search## Project Structure

- **JSON Files:** User credentials and session data```

- **File System:** Temporary PDF storage during processingrag-auth-app/

├── backend/

---│   ├── app.py              # Main Flask application

│   ├── requirements.txt    # Python dependencies

## 🏗️ Architecture│   ├── uploads/           # Temporary PDF storage

│   └── vector_store/      # FAISS vector databases

### **System Architecture**│

├── frontend/

```│   ├── server.js          # Express server

┌─────────────────────────────────────────────────────────────────┐│   ├── package.json       # Node dependencies

│                         FRONTEND (Port 3000)                     ││   ├── users.json         # User database (demo)

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          ││   └── public/

│  │   Login/     │  │   Chatbot    │  │   Profile    │          ││       ├── chatbot.html   # Main chat interface

│  │   Signup     │  │   Interface  │  │   Management │          ││       ├── login.html     # Login page

│  └──────────────┘  └──────────────┘  └──────────────┘          ││       ├── signup.html    # Registration page

└─────────────────────────────────────────────────────────────────┘│       ├── profile.html   # User profile

                              ↓ HTTP/REST API│       ├── css/

┌─────────────────────────────────────────────────────────────────┐│       │   └── style.css  # Styles

│                         BACKEND (Port 5000)                      ││       └── js/

│  ┌──────────────────────────────────────────────────────────┐   ││           └── script.js  # Client-side logic

│  │                    Flask Application                      │   ││

│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │└── EXAM_PAPER_FEATURE.md  # Exam paper tool documentation

│  │  │   Auth   │  │  Upload  │  │   Chat   │  │  Models │  │   │```

│  │  │   API    │  │   API    │  │   API    │  │   API   │  │   │

│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │   │## API Endpoints

│  └──────────────────────────────────────────────────────────┘   │

│  ┌──────────────────────────────────────────────────────────┐   │### Backend (Flask - Port 5000)

│  │                    LangChain Layer                        │   │

│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │#### `GET /api/models`

│  │  │  Document    │  │  Embeddings  │  │   Retriever  │   │   │Get available AI models

│  │  │  Processing  │  │  Generator   │  │   (FAISS)    │   │   │```json

│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │{

│  └──────────────────────────────────────────────────────────┘   │  "models": ["GPT-OSS-120B"],

└─────────────────────────────────────────────────────────────────┘  "embedding_available": true,

                              ↓ API Calls  "llm_auth": true

┌─────────────────────────────────────────────────────────────────┐}

│                      EXTERNAL SERVICES                           │```

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │

│  │   Groq API   │  │  HuggingFace │  │ Google Search│          │#### `POST /api/upload`

│  │  (LLM Model) │  │  (Embeddings)│  │   (Optional) │          │Upload PDF files

│  └──────────────┘  └──────────────┘  └──────────────┘          │```json

└─────────────────────────────────────────────────────────────────┘{

```  "user_email": "user@example.com",

  "files": [File, File, ...]

### **Data Flow: Upload & Chat**}

```

```

1. User uploads PDF#### `POST /api/chat`

   ↓Chat with AI assistant

2. PyMuPDF extracts text```json

   ↓{

3. Text split into chunks (1000 chars, 200 overlap)  "user_email": "user@example.com",

   ↓  "query": "Your question here",

4. HuggingFace generates embeddings (384-dim vectors)  "model": "GPT-OSS-120B",

   ↓  "tool": "exam_paper_generator"

5. Vectors stored in FAISS (per-user database)}

   ↓```

6. User asks question

   ↓### Frontend (Express - Port 3000)

7. Question embedded → FAISS retrieves top-k similar chunks

   ↓- `GET /` - Home page (redirects to login)

8. Chunks + Question → Groq LLM (GPT-OSS-120B)- `GET /login` - Login page

   ↓- `GET /signup` - Registration page

9. LLM generates answer- `POST /api/signup` - Create account

   ↓- `POST /api/login` - User login

10. Markdown-formatted response → User- `GET /home` - Dashboard (protected)

```- `GET /chatbot` - Chat interface (protected)

- `GET /profile` - User profile (protected)

---

## Features in Detail

## 📋 Prerequisites

### RAG (Retrieval-Augmented Generation)

### **System Requirements**- Uploads are processed and split into chunks

- **Operating System:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)- Embeddings are created using HuggingFace models

- **RAM:** 4GB minimum, 8GB recommended- FAISS vector database stores embeddings per user

- **Disk Space:** 2GB free space- Queries retrieve relevant context before LLM generation

- **Internet:** Required for API calls (Groq, HuggingFace)- Ensures responses are grounded in actual study materials



### **Software Requirements**### User Management

- **Python:** 3.11 or higher ([Download](https://www.python.org/downloads/))- Email-based authentication

- **Node.js:** 16.0 or higher ([Download](https://nodejs.org/))- Profile management

- **Git:** For cloning the repository ([Download](https://git-scm.com/))- Secure password handling

- Session management

### **API Keys Required**- Per-user document isolation

1. **Groq API Key** (Required)

   - Sign up at: https://console.groq.com/### Smart Context Handling

   - Free tier available with generous limits- PDF context preferred

   - Falls back to web search if no PDFs

2. **Google Search API** (Optional - for web search fallback)- Combines multiple sources intelligently

   - Google API Key: https://console.cloud.google.com/- Error handling for API failures

   - Custom Search Engine ID: https://programmablesearchengine.google.com/

## Configuration

---

### Customizing AI Behavior

## 📥 InstallationEdit `backend/app.py` to adjust:

- Model temperature (default: 0.3)

### **Step 1: Clone the Repository**- Max tokens (default: 2048)

- Chunk size (default: 1000)

```bash- Chunk overlap (default: 200)

git clone https://github.com/yourusername/rag-study-assistant.git- Number of retrieved documents (default: 10)

cd rag-study-assistant

```### Customizing Exam Papers

Edit the `parse_exam_paper_params()` function to change:

### **Step 2: Backend Setup**- Default paper count

- Default questions per paper

```bash- Default marks per question

# Navigate to backend folder- Default difficulty distribution

cd backend

## Troubleshooting

# Create virtual environment (recommended)

python -m venv venv### Backend won't start

- Check Python version (3.11+)

# Activate virtual environment- Verify all dependencies installed: `pip install -r requirements.txt`

# Windows:- Ensure `.env` file exists with valid API keys

venv\Scripts\activate

# macOS/Linux:### Frontend won't start

source venv/bin/activate- Check Node.js version (18+)

- Run `npm install` to install dependencies

# Install dependencies- Check if port 3000 is available

pip install -r requirements.txt

```### PDF upload fails

- Ensure files are valid PDFs

**Backend Dependencies (`requirements.txt`):**- Check file size (large files may timeout)

```txt- Verify `uploads/` directory exists and is writable

flask==2.3.0

flask-cors==4.0.0### Chat responses are generic

langchain==0.1.0- Upload relevant PDF materials first

langchain-community==0.0.13- Be specific in your queries

langchain-groq==0.0.1- Check if PDFs were processed successfully

faiss-cpu==1.7.4

sentence-transformers==2.2.2### Exam papers lack variety

pymupdf==1.23.0- Upload more comprehensive study materials

beautifulsoup4==4.12.0- Request more papers

requests==2.31.0- Try different topics/queries

python-dotenv==1.0.0

```## Security Notes



### **Step 3: Frontend Setup**⚠️ **This is a development application**

- User data stored in plain JSON (not production-ready)

```bash- No password encryption implemented

# Navigate to frontend folder (from root)- CORS enabled for localhost only

cd frontend- API keys in `.env` (keep secure)



# Install dependenciesFor production use:

npm install- Implement proper authentication (JWT, OAuth)

```- Use a real database (PostgreSQL, MongoDB)

- Add password hashing (bcrypt)

**Frontend Dependencies (`package.json`):**- Implement rate limiting

```json- Add HTTPS/SSL

{- Sanitize all inputs

  "dependencies": {- Add proper session management

    "express": "^4.18.2",

    "marked": "^9.0.0"## Future Enhancements

  }

}- [ ] Answer key generation for exam papers

```- [ ] Marking scheme/rubric creation

- [ ] Export exam papers to PDF

---- [ ] Question bank management

- [ ] Topic-wise filtering

## ⚙️ Configuration- [ ] Multi-language support

- [ ] Voice input/output

### **Backend Configuration**- [ ] Mobile app

- [ ] Collaborative study groups

Create `.env` file in `backend/` directory:- [ ] Progress tracking

- [ ] Spaced repetition system

```bash

# Required: Groq API Key## Contributing

GROQ_API_KEY=your_groq_api_key_hereContributions welcome! Please:

1. Fork the repository

# Optional: Google Search (for web fallback)2. Create a feature branch

GOOGLE_API_KEY=your_google_api_key3. Commit your changes

GOOGLE_CSE_ID=your_custom_search_engine_id4. Push to the branch

5. Open a Pull Request

# Server Configuration

FLASK_ENV=development## License

FLASK_DEBUG=TrueMIT License - feel free to use for educational purposes

```

## Support

**Getting API Keys:**For issues or questions:

- Check the documentation

1. **Groq API Key:**- Review existing issues

   - Visit https://console.groq.com/- Create a new issue with detailed description

   - Sign up / Log in

   - Navigate to API Keys section## Acknowledgments

   - Create new API key- LangChain community

   - Copy and paste into `.env`- Groq for LLM API

- HuggingFace for embeddings

2. **Google Search API (Optional):**- FAISS for vector search

   - Enable Custom Search API in Google Cloud Console

   - Create API credentials---

   - Set up Custom Search Engine

   - Add keys to `.env`**Version**: 1.0  

**Last Updated**: November 6, 2025  

### **Frontend Configuration****Status**: Active Development


**File:** `frontend/server.js`

```javascript
const PORT = 3000; // Frontend port
const BACKEND_URL = 'http://localhost:5000'; // Backend URL
```

**File:** `frontend/public/js/script.js`

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🚀 Running the Application

### **Method 1: Using Two Terminals (Recommended)**

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
Expected output:
```
Initialized LLM model: GPT-OSS-120B
Embedding model initialized successfully
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.0.102:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
node server.js
```
Expected output:
```
Server running on http://localhost:3000
```

### **Method 2: Using Start Scripts**

**Windows (PowerShell):**
```powershell
# Start both servers
.\start.ps1
```

**macOS/Linux (Bash):**
```bash
# Make script executable
chmod +x start.sh

# Start both servers
./start.sh
```

### **Accessing the Application**

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page

**Default Test Account:**
- Email: `test@example.com`
- Password: `password123`

---

## 📖 Usage Guide

### **1. Getting Started**

#### **Sign Up**
1. Navigate to http://localhost:3000/signup
2. Enter your name, email, and password
3. Click "Sign Up"
4. You'll be redirected to the chatbot page

#### **Login**
1. Navigate to http://localhost:3000/login
2. Enter your credentials
3. Click "Login"

### **2. Upload Study Materials**

1. **Drag & Drop:**
   - Drag PDF files into the upload area
   - Multiple files supported

2. **Browse Files:**
   - Click "Choose Files" button
   - Select one or more PDFs
   - Click "Open"

3. **Wait for Processing:**
   - Files are uploaded and processed
   - Green checkmarks indicate success
   - Embeddings are created automatically

### **3. Using AI Tools**

#### **Select Tool:**
Click the "Task/Tool" dropdown and choose:

| Tool | Best For | Example Use |
|------|----------|-------------|
| **AI Chat (General)** | Any question | "Explain quantum computing" |
| **Explain Concept** | Deep dives | "Explain photosynthesis from my biology PDF" |
| **Summarize** | Quick overviews | "Summarize chapter 5" |
| **Generate MCQs** | Self-testing | "Create 10 MCQs on topic X" |
| **Make Notes** | Study guides | "Make notes on machine learning" |
| **Exam Prep** | Revision plans | "Help me prepare for finals" |
| **Exam Paper Preparation** | Practice exams | "Generate 3 exam papers" |

#### **Ask Questions:**
1. Type your question in the input box
2. Press Enter or click Send
3. AI processes and responds with formatted answer

### **4. Generating Exam Papers**

**Basic Example:**
```
generate exam papers
```
Result: 5 papers, 5 questions each, 10 marks, default difficulty

**Custom Example:**
```
give me 3 exam papers, each contains 7 questions: two 2 marks, two 4 marks, 
three 10 marks. one medium and one hard in each section. duration is 90 minutes
```

**All Hard Questions:**
```
give me 1 question paper with 8 two mark questions, duration is 30 minutes, all hard
```

**See [Exam Paper Generator Guide](#-exam-paper-generator-guide) for complete syntax**

### **5. Managing Your Profile**

1. Click **Profile** button in header
2. View your account details
3. Click **Edit Profile** to update:
   - Name
   - Email
   - Password
4. Save changes

---

## 🎯 AI Tools Explained

### **1. AI Chat (General)** 🌐

**What it does:**
- Universal AI assistant that answers ANY question
- Uses PDF context when relevant
- Falls back to general knowledge when needed

**When to use:**
- General questions not in your PDFs
- Quick answers on any topic
- Exploratory learning

**Example:**
```
Q: How does photosynthesis work?
A: [General biology explanation]

Q: What does my biology PDF say about photosynthesis?
A: [Answer from your specific PDF]
```

**Technical Details:**
- Model: GPT-OSS-120B via Groq
- Context-aware prompting
- No strict PDF requirements

---

### **2. Explain Concept** 📚

**What it does:**
- Deep, detailed explanations of topics from your PDFs
- Breaks down complex concepts into understandable parts
- Provides examples and analogies

**When to use:**
- Struggling with difficult concepts
- Need step-by-step explanations
- Want to understand "why" not just "what"

**Example:**
```
Q: Explain the OSI model
A: The OSI (Open Systems Interconnection) model is a conceptual framework...
   [Detailed explanation with 7 layers, examples, and analogies]
```

**Prompting Strategy:**
```python
f"Explain the concept '{query}' in simple terms using ONLY the following context:\n\n{context}"
```

---

### **3. Summarize** 📝

**What it does:**
- Creates concise summaries of long documents
- Extracts key points and main ideas
- Maintains important details while reducing length

**When to use:**
- Quick revision before exams
- Overview of new material
- Time-constrained studying

**Example:**
```
Q: Summarize chapter 3 on networking protocols
A: **Key Points:**
   1. TCP ensures reliable delivery...
   2. UDP prioritizes speed over reliability...
   3. HTTP operates on port 80...
```

**Features:**
- Bullet-point formatting
- Structured sections
- Emphasis on main ideas

---

### **4. Generate MCQs** ✅

**What it does:**
- Creates multiple-choice questions from your study material
- Generates 4 options per question
- Provides correct answers and explanations

**When to use:**
- Self-testing and practice
- Identifying knowledge gaps
- Exam preparation

**Example Output:**
```
**Question 1:** What is the primary function of TCP?
A) Speed optimization
B) Reliable data delivery ✓
C) Encryption
D) Routing

**Explanation:** TCP (Transmission Control Protocol) ensures reliable delivery 
through acknowledgments and retransmissions.
```

**Customization:**
- Specify number of questions
- Target specific topics
- Adjust difficulty level

---

### **5. Make Notes** 📒

**What it does:**
- Generates structured study notes with headings
- Organized by topics and subtopics
- Bullet points and numbered lists

**When to use:**
- Creating revision materials
- Organizing scattered information
- Building study guides

**Example Output:**
```
# Network Protocols

## 1. Transport Layer
### TCP (Transmission Control Protocol)
- Connection-oriented protocol
- Ensures reliable delivery
- Uses three-way handshake

### UDP (User Datagram Protocol)
- Connectionless protocol
- Faster but less reliable
- Used for streaming
```

**Features:**
- Markdown formatting
- Hierarchical structure
- Copy-paste ready

---

### **6. Exam Prep** 🎓

**What it does:**
- Creates comprehensive study plans
- Prioritizes topics based on importance
- Suggests revision schedules

**When to use:**
- Preparing for final exams
- Long-term study planning
- Systematic revision

**Example Output:**
```
**Study Plan for Data Structures Exam**

**Week 1: Fundamentals**
- Day 1-2: Arrays and Linked Lists
- Day 3-4: Stacks and Queues
- Day 5: Practice problems

**Week 2: Advanced Topics**
- Day 1-2: Trees (Binary, BST)
- Day 3-4: Graphs and traversals
- Day 5: Mock exam
```

---

### **7. Exam Paper Preparation** 📄

**What it does:**
- Generates complete examination papers
- Flexible marks distribution (2, 4, 5, 10 marks)
- Customizable difficulty levels
- Professional formatting with color-coded display

**When to use:**
- Practice exams
- Mock tests
- Self-assessment

**Features:**
- Variable marks per question
- Difficulty control (Easy/Medium/Hard)
- Custom time limits
- Beautiful card-based UI

**See dedicated section below for complete guide**

---

## 📝 Exam Paper Generator Guide

### **Understanding the Syntax**

#### **Components:**

1. **Paper Count:** How many exam papers to generate
   ```
   1 question paper
   3 exam papers
   5 papers
   ```

2. **Questions:** How many questions per paper
   ```
   8 questions
   10 questions each
   7 questions per paper
   ```

3. **Marks (Uniform):** Same marks for all questions
   ```
   5 marks each
   10 marks per question
   ```

4. **Marks (Variable):** Different sections with different marks
   ```
   two 2 marks questions          → 2 questions × 2 marks
   three 5 marks questions         → 3 questions × 5 marks
   four 10 mark questions          → 4 questions × 10 marks
   ```
   
   You can use:
   - Number words: one, two, three, four, five, six, seven, eight, nine, ten
   - Digits: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10+

5. **Difficulty Levels:**
   - **All same:** `all hard`, `all medium`, `all easy`
   - **Custom distribution:** `2 easy 2 medium 1 hard`
   - **Per-section rules:** `one medium and one hard in each section`

6. **Duration:** Time limit for the exam
   ```
   duration is 30 minutes
   time 90 minutes
   duration 120 minutes
   ```

### **Difficulty Level Guidelines**

| Level | Characteristics | Action Verbs | Marks Range |
|-------|----------------|--------------|-------------|
| **Easy** | Direct recall, definitions | Define, List, Name, State, Identify, What is | 1-5 marks |
| **Medium** | Application, explanation | Explain, Describe, Compare, Illustrate, How does | 4-10 marks |
| **Hard** | Analysis, evaluation | Analyze, Evaluate, Critically assess, Justify | 10+ marks |

### **Example Prompts**

#### **1. Quick Quiz (All Easy)**
```
create 1 paper with 10 questions, 2 marks each, all easy, duration is 20 minutes
```
**Output:**
- 1 paper
- 10 questions × 2 marks = 20 total marks
- All Easy questions (definitions, recall)
- Time: 20 minutes

---

#### **2. Standard Exam (Mixed Difficulty)**
```
generate 5 exam papers, 5 questions per paper, 10 marks each, 2 easy 2 medium 1 hard
```
**Output:**
- 5 papers
- 5 questions × 10 marks = 50 total marks per paper
- Difficulty: 2 Easy, 2 Medium, 1 Hard
- Time: 60 minutes (auto-calculated)

---

#### **3. Variable Marks Exam**
```
give me 3 papers, each contains 7 questions: two 2 marks, two 4 marks, three 10 marks,
one medium and one hard in each section, duration is 90 minutes
```
**Output:**
- 3 papers
- 7 questions per paper:
  - 2 questions × 2 marks = 4 marks (1 Medium, 1 Hard)
  - 2 questions × 4 marks = 8 marks (1 Medium, 1 Hard)
  - 3 questions × 10 marks = 30 marks (1 Easy, 1 Medium, 1 Hard)
- Total: 42 marks per paper
- Time: 90 minutes

---

#### **4. All Hard Questions**
```
give me 1 question paper with 8 two mark questions, duration is 30 minutes, all hard
```
**Output:**
- 1 paper
- 8 questions × 2 marks = 16 total marks
- All Hard questions (critical analysis, evaluation)
- Time: 30 minutes

---

#### **5. Professional Certification Style**
```
create 2 papers with four 5 mark questions and six 10 mark questions, all hard, duration is 180 minutes
```
**Output:**
- 2 papers
- 10 questions per paper:
  - 4 questions × 5 marks = 20 marks
  - 6 questions × 10 marks = 60 marks
  - Total: 80 marks per paper
- All Hard questions
- Time: 180 minutes (3 hours)

---

### **UI Display Features**

When exam papers are generated, they're displayed with:

✨ **Beautiful Card Layout:**
- Each paper in a separate card
- Color-coded difficulty badges:
  - 🟢 Easy (Green)
  - 🟠 Medium (Orange)
  - 🔴 Hard (Red)
  - ⚪ Unspecified (Gray)
- Marks badges with gradient backgrounds
- Smooth animations and hover effects

📊 **Paper Header:**
- Paper number
- Total marks
- Time limit
- Question count

🎨 **Dark Mode Support:**
- Automatic theme adaptation
- High contrast for readability

📋 **Summary Section:**
- Total papers generated
- Total questions across all papers
- Average marks per paper
- Helpful tips

---

### **Advanced Features**

#### **1. Natural Language Flexibility**

The parser understands variations:
```
✅ "give me 3 papers"
✅ "create 3 exam papers"
✅ "generate 3 question papers"
✅ "I need 3 exam sets"
```

All produce the same result!

#### **2. Number Word Support**

```
✅ "eight two mark questions"    → 8 × 2 marks
✅ "5 five mark questions"       → 5 × 5 marks
✅ "ten questions"               → 10 questions
```

#### **3. Intelligent Defaults**

If you don't specify something, sensible defaults are used:

| Parameter | Default |
|-----------|---------|
| Paper count | 5 |
| Questions per paper | 5 |
| Marks per question | 10 |
| Difficulty | 2 Easy, 2 Medium, 1 Hard |
| Time | 1.2 × total marks (minutes) |

#### **4. Validation & Error Handling**

The system validates:
- ✅ At least 1 paper, max 100
- ✅ At least 1 question per paper
- ✅ Marks must be positive integers
- ✅ Difficulty distribution matches question count
- ✅ Time must be reasonable (5-300 minutes)

---

### **Best Practices**

1. **Be Specific:** Clear requirements produce better results
   ```
   ❌ "make some papers"
   ✅ "create 3 papers with 5 questions each, all medium, 60 minutes"
   ```

2. **Match Difficulty to Marks:**
   - Easy: 1-5 marks (quick recall)
   - Medium: 4-10 marks (explanation)
   - Hard: 10+ marks (analysis)

3. **Set Realistic Time:**
   - Rule of thumb: 1-1.5 minutes per mark
   - 50 marks paper → 60-75 minutes

4. **Use Sections for Variety:**
   ```
   "two 2 marks, two 5 marks, one 10 marks"
   ```
   This creates a balanced paper with short and long questions.

5. **Test Before Exams:**
   - Generate practice papers early
   - Identify weak areas
   - Adjust difficulty as needed

---

## 📁 Project Structure

```
rag-study-assistant/
│
├── backend/                          # Python Flask backend
│   ├── app.py                       # Main Flask application
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables (create this)
│   ├── uploads/                     # Temporary PDF storage
│   ├── vector_store/                # FAISS vector databases (per user)
│   │   ├── user1@email.com_hash1/
│   │   │   └── index.faiss
│   │   └── user2@email.com_hash2/
│   │       └── index.faiss
│   └── test_*.py                    # Test files
│
├── frontend/                         # Node.js Express frontend
│   ├── server.js                    # Express server
│   ├── package.json                 # Node dependencies
│   ├── users.json                   # User credentials storage
│   └── public/                      # Static files
│       ├── login.html               # Login page
│       ├── signup.html              # Registration page
│       ├── chatbot.html             # Main chat interface
│       ├── profile.html             # User profile page
│       ├── home.html                # Home/dashboard
│       ├── forgot.html              # Password recovery
│       ├── reset.html               # Password reset
│       ├── css/
│       │   └── style.css            # Global styles
│       └── js/
│           └── script.js            # Client-side logic
│
├── README.md                         # This file
├── .gitignore                       # Git ignore rules
└── docs/                            # Additional documentation
    ├── EXAM_PAPER_FEATURE.md
    ├── DISPLAY_ENHANCEMENT.md
    ├── AI_CHAT_FEATURE.md
    └── UI_IMPROVEMENTS.md
```

---

## 🔌 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Endpoints**

#### **1. Get Available Models**
```http
GET /api/models
```

**Response:**
```json
{
  "models": [
    {
      "id": "GPT-OSS-120B",
      "name": "GPT-OSS-120B (Groq)",
      "description": "High-performance open-source model"
    }
  ]
}
```

---

#### **2. Upload PDFs**
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request Body:**
```
files: [PDF files]
email: user@example.com
```

**Response:**
```json
{
  "message": "Successfully processed 2 files",
  "files": ["document1.pdf", "document2.pdf"]
}
```

**Error Response:**
```json
{
  "error": "No files uploaded"
}
```

---

#### **3. Chat with AI**
```http
POST /api/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Explain quantum computing",
  "email": "user@example.com",
  "model": "GPT-OSS-120B",
  "selectedTool": "ai_chat"
}
```

**Response:**
```json
{
  "response": "Quantum computing is...",
  "agent": "RAG Agent",
  "tool": "ai_chat",
  "source": "pdf"
}
```

**Available Tools:**
- `ai_chat`: General AI assistant
- `concept_explainer`: Explain concepts
- `summarizer`: Summarize content
- `mcq_generator`: Generate MCQs
- `notes_maker`: Create notes
- `exam_prep_agent`: Exam preparation
- `exam_paper_generator`: Generate exam papers

---

### **Frontend API Endpoints**

#### **1. User Registration**
```http
POST /signup
Content-Type: application/json
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Registration successful"
}
```

---

#### **2. User Login**
```http
POST /login
Content-Type: application/json
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### **3. Get User Profile**
```http
GET /profile
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

#### **4. Update Profile**
```http
POST /update-profile
Content-Type: application/json
```

**Request:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123"
}
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Backend Won't Start**

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Ensure virtual environment is activated
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

---

#### **2. "Groq API Key Missing" Error**

**Error:** `ERROR: GROQ_API_KEY not found`

**Solution:**
1. Create `.env` file in `backend/` folder
2. Add: `GROQ_API_KEY=your_actual_key_here`
3. Restart backend server

---

#### **3. Frontend Can't Connect to Backend**

**Error:** `Failed to connect to the AI service`

**Solution:**
1. Check backend is running (http://localhost:5000)
2. Verify CORS is enabled in `app.py`:
   ```python
   CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
   ```
3. Check firewall isn't blocking ports 3000 or 5000

---

#### **4. PDF Upload Fails**

**Error:** `Error processing file.pdf`

**Solution:**
- Ensure PDF is not password-protected
- Check PDF file size (< 50MB recommended)
- Verify `uploads/` folder exists in backend directory
- Check file permissions

---

#### **5. Embeddings Error**

**Error:** `OSError: Can't load tokenizer`

**Solution:**
```bash
# Reinstall sentence-transformers
pip uninstall sentence-transformers
pip install sentence-transformers==2.2.2
```

---

#### **6. Port Already in Use**

**Error:** `Address already in use`

**Solution:**

**Windows:**
```powershell
# Find process on port 3000 or 5000
netstat -ano | findstr :3000
# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

---

#### **7. Exam Papers Not Displaying Correctly**

**Issue:** Plain text instead of formatted cards

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Ensure `chatbot.html` has latest `parseExamPapers()` function
4. Check browser console for JavaScript errors

---

#### **8. Dark Mode Not Working**

**Solution:**
1. Check `localStorage` is enabled in browser
2. Clear browser storage
3. Reload page and toggle theme manually

---

### **Performance Optimization**

#### **1. Slow PDF Processing**

**Tips:**
- Upload smaller PDFs (< 20MB)
- Process files one at a time
- Use simpler PDFs (text-based, not scanned images)

#### **2. Slow AI Responses**

**Tips:**
- Reduce chunk retrieval count (edit `app.py`, line ~223):
  ```python
  retriever = combined_db.as_retriever(search_kwargs={"k": 5})  # Reduce from 10
  ```
- Use shorter queries
- Consider upgrading to paid Groq API tier for faster responses

#### **3. High Memory Usage**

**Tips:**
- Clear old vector stores: Delete unused folders in `backend/vector_store/`
- Limit concurrent users
- Restart backend periodically

---

### **Debugging Tools**

#### **Enable Verbose Logging**

**Backend (`app.py`):**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend (Browser Console):**
```javascript
// Open DevTools (F12)
// Check Console, Network, and Storage tabs
```

#### **Test API Endpoints**

Use `curl` or Postman:

```bash
# Test models endpoint
curl http://localhost:5000/api/models

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "email": "test@example.com",
    "model": "GPT-OSS-120B",
    "selectedTool": "ai_chat"
  }'
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Getting Started**

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit with clear messages:
   ```bash
   git commit -m "Add: New exam paper difficulty filter"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request

### **Code Style**

**Python (Backend):**
- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings to functions
- Maximum line length: 100 characters

**JavaScript (Frontend):**
- Use ES6+ syntax
- Consistent indentation (2 spaces)
- Meaningful variable names
- Comment complex logic

### **Testing**

Before submitting:
1. Test all existing features
2. Add tests for new functionality
3. Ensure no breaking changes
4. Test in both light and dark modes

### **Documentation**

Update documentation when adding:
- New features
- API endpoints
- Configuration options
- Dependencies

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 RAG Study Assistant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### **Technologies**
- [LangChain](https://github.com/langchain-ai/langchain) - LLM orchestration framework
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [Groq](https://groq.com/) - High-performance LLM API
- [HuggingFace](https://huggingface.co/) - Embeddings models
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [Express.js](https://expressjs.com/) - Node.js web framework

### **Inspiration**
- RAG (Retrieval-Augmented Generation) architecture
- Modern education technology trends
- Student feedback and requirements

---

## 📞 Support

### **Get Help**

- **Issues:** [GitHub Issues](https://github.com/yourusername/rag-study-assistant/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/rag-study-assistant/discussions)
- **Email:** support@ragstudy.com (if applicable)

### **FAQ**

**Q: Is this free to use?**
A: Yes! The application is open-source. You only need a Groq API key (free tier available).

**Q: Can I use it offline?**
A: No, the app requires internet for API calls to Groq and HuggingFace.

**Q: What file formats are supported?**
A: Currently only PDF files. Support for DOCX, TXT, and EPUB is planned.

**Q: Is my data private?**
A: Yes! All user data is stored locally. Vector stores are isolated per user.

**Q: Can I deploy this in production?**
A: The current setup is for development. For production:
- Use a production WSGI server (Gunicorn, uWSGI)
- Use a proper database (PostgreSQL, MongoDB)
- Implement proper authentication (JWT, OAuth)
- Add SSL/TLS encryption
- Use environment-specific configurations

**Q: How many PDFs can I upload?**
A: No hard limit, but performance depends on your system resources.

**Q: Can multiple users use it simultaneously?**
A: Yes, but ensure your server has adequate resources. Consider using a production setup.

---

## 🗺️ Roadmap

### **Version 2.0 (Planned)**

**Features:**
- [ ] Support for DOCX, TXT, EPUB files
- [ ] Audio transcription (MP3 → text → embeddings)
- [ ] Flashcard generator
- [ ] Spaced repetition algorithm
- [ ] Study groups and collaboration
- [ ] Mobile app (React Native)
- [ ] Offline mode (local LLM)

**Improvements:**
- [ ] PostgreSQL database for users
- [ ] JWT authentication
- [ ] Redis caching for faster responses
- [ ] WebSocket real-time chat
- [ ] Advanced analytics dashboard
- [ ] Export notes to PDF/DOCX
- [ ] Voice input/output
- [ ] Multi-language support

**Technical Debt:**
- [ ] Comprehensive unit tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Load balancing
- [ ] Monitoring and logging

---

## 📊 Statistics

- **Total Lines of Code:** ~5,000+
- **Languages:** Python, JavaScript, HTML, CSS
- **API Endpoints:** 10+
- **AI Tools:** 7
- **Supported Difficulty Levels:** 3 (Easy, Medium, Hard)
- **Max Papers per Request:** 100+
- **Average Response Time:** 2-5 seconds
- **Embedding Dimensions:** 384

---

## 🎓 Educational Use

This project is perfect for:

- **Students:** Study smarter with AI assistance
- **Educators:** Create practice materials quickly
- **Researchers:** Analyze documents efficiently
- **Developers:** Learn RAG architecture implementation
- **AI Enthusiasts:** Explore LangChain and embeddings

---

## ⚠️ Disclaimer

This is an educational project. While we strive for accuracy, AI-generated content should be:
- Verified against original sources
- Used as a study aid, not a replacement for learning
- Reviewed by educators for exam preparation

Always check AI responses for accuracy, especially in critical areas like medical, legal, or financial topics.

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by the RAG Study Assistant Team**

**Last Updated:** November 7, 2025

**Version:** 1.0.0
