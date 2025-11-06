# RAG Study Assistant

An AI-powered study companion that transforms your PDF materials into interactive learning experiences. Upload PDFs, ask contextual questions, generate exam papers, create MCQs, make notes, and prepare for exams using Retrieval-Augmented Generation (RAG).

## Table of Contents
1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Usage Guide](#usage-guide)
8. [AI Tools Explained](#ai-tools-explained)
9. [Exam Paper Generator Guide](#exam-paper-generator-guide)
10. [Project Structure](#project-structure)
11. [API Documentation](#api-documentation)
12. [Troubleshooting](#troubleshooting)
13. [Security Notes](#security-notes)
14. [Roadmap](#roadmap)
15. [Contributing](#contributing)
16. [License](#license)

---
## Features

| Category | Highlights |
|----------|-----------|
| Document Ingestion | Multi-PDF upload, smart chunking (1000 chars / 200 overlap) |
| Vector Storage | Per-user isolated FAISS stores |
| Intelligent Retrieval | HuggingFace embeddings (all-MiniLM-L6-v2) |
| General AI Chat | Ask anything (PDF-aware if context exists) |
| Concept Explainer | Deep, structured explanations from PDFs |
| Summarizer | Concise, key-point summaries |
| MCQ Generator | 4-option questions + answer explanations |
| Notes Maker | Hierarchical markdown notes |
| Exam Prep | Study plan + topic prioritization |
| Exam Paper Generator | Flexible difficulty, marks, duration control |
| UI | Dark/Light mode, responsive, card-based exam display |

---
## Technology Stack

**Backend:** Python, Flask, LangChain, FAISS, HuggingFace Sentence Transformers, Groq LLM, PyMuPDF, BeautifulSoup4, python-dotenv.

**Frontend:** Node.js (Express), HTML5, CSS3, Vanilla JavaScript, Marked.js.

**Storage:** Local filesystem (uploads), per-user FAISS index folders, JSON demo user store.

---
## Architecture Overview

1. User uploads PDFs → Text extracted (PyMuPDF) → Chunked → Embeddings generated → Stored in per-user FAISS index.
2. Query → Embedded → Top-k vector retrieval → Prompt composed with relevant context → Groq LLM generates response.
3. Optional fallback to general AI when no documents or for broad/open queries.

```
User → Upload PDFs → Chunk + Embed → FAISS (per user)
   ↓                                             ↑
 Query → Retrieve context → Build prompt → Groq LLM → Response (Markdown)
```

---
## Installation

### Prerequisites
| Requirement | Minimum |
|-------------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| RAM | 4 GB (8 GB recommended) |
| OS | Windows/macOS/Linux |

### Clone
```bash
git clone https://github.com/yourusername/rag-study-assistant.git
cd rag-study-assistant
```

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

---
## Configuration

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
# Optional web search fallback
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_google_cse_id_here
```

Frontend endpoints are configured in `frontend/server.js` and `frontend/public/js/script.js`.

---
## Running the Application

### Start Backend
```bash
cd backend
python app.py
```

### Start Frontend
```bash
cd frontend
node server.js
```

Visit: `http://localhost:3000`

---
## Usage Guide

1. Sign up / log in.
2. Upload PDFs (drag & drop or file picker) and wait for processing.
3. Select a tool from the dropdown.
4. Enter a query and send.
5. Review formatted AI response (Markdown rendered).
6. Generate exam papers with flexible natural language prompts.

---
## AI Tools Explained

| Tool | Purpose | Example Query |
|------|---------|---------------|
| AI Chat | General or PDF-aware Q&A | "Explain entropy" |
| Explain Concept | Structured deep dive | "Explain OSI model" |
| Summarize | Condensed overview | "Summarize chapter 3" |
| Generate MCQs | Practice questions | "10 MCQs on polymers" |
| Make Notes | Hierarchical notes | "Make notes on recursion" |
| Exam Prep | Study schedule | "Prepare for networking exam" |
| Exam Paper Generator | Full mock exam | "Generate 3 papers all hard" |

---
## Exam Paper Generator Guide

Supports natural language for: paper count, questions per paper, marks (uniform or per section), difficulty distribution, duration.

**Defaults:** 5 papers · 5 questions each · 10 marks per question · Difficulty: 2 Easy, 2 Medium, 1 Hard.

**Examples:**
```text
generate exam papers
give me 1 paper with 8 two mark questions, all hard, duration 30 minutes
create 3 papers, each 7 questions: two 2 marks, two 4 marks, three 10 marks; one medium and one hard in each section; duration 90 minutes
```

**Difficulty Guidance:**
| Level | Typical verbs | Marks |
|-------|---------------|-------|
| Easy | Define, List, Identify | 1–5 |
| Medium | Explain, Compare, Illustrate | 4–10 |
| Hard | Analyze, Evaluate, Justify | 10+ |

The frontend displays papers as cards with badges (Easy, Medium, Hard, Unspecified) and total marks/time.

---
## Project Structure
```
rag-study-assistant/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── uploads/
│   └── vector_store/{user_hash}/index.faiss
├── frontend/
│   ├── server.js
│   ├── package.json
│   ├── users.json
│   └── public/
│       ├── *.html, css/, js/
├── README.md
└── docs/
    ├── EXAM_PAPER_FEATURE.md
    └── UI_IMPROVEMENTS.md
```

---
## API Documentation

**Base URL:** `http://localhost:5000/api`

### `GET /api/models`
Returns available LLM models.

### `POST /api/upload`
Multipart PDF upload (`files[]`, `email`).

### `POST /api/chat`
JSON body: `message`, `email`, `model`, `selectedTool`.

`selectedTool` values: `ai_chat`, `concept_explainer`, `summarizer`, `mcq_generator`, `notes_maker`, `exam_prep_agent`, `exam_paper_generator`.

---
## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing Flask module | Activate venv, reinstall requirements |
| GROQ_API_KEY error | Add key to `.env` and restart backend |
| Frontend cannot reach backend | Ensure backend running; check CORS origin set to `http://localhost:3000` |
| PDF upload fails | Validate PDF (not password-protected); check `uploads/` exists |
| Slow responses | Reduce retriever k (in `app.py`), limit PDF size |
| Port in use | Free port (Windows: `netstat -ano | findstr :5000`) |
| Exam paper formatting missing | Hard refresh browser; update `chatbot.html` |

---
## Security Notes

Development only: plain JSON user store, no password hashing, no rate limiting. For production add: secure DB (PostgreSQL/MongoDB), hashed passwords (bcrypt), JWT/OAuth auth, HTTPS, input sanitization, logging & monitoring.

---
## Roadmap

Planned enhancements:
- Additional file formats (DOCX/TXT/EPUB)
- Flashcards & spaced repetition
- Export to PDF/DOCX
- Real database + JWT auth
- WebSocket real-time chat
- Docker & CI/CD pipeline
- Multi-language support

---
## Contributing
1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add: exam paper difficulty filter"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

**Code Style:** PEP 8 + type hints (Python); ES6, 2-space indent (JS). Add docstrings/comments for non-trivial logic.

---
## License

MIT License © 2025 RAG Study Assistant

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...

Full text in repository.

---
## Disclaimer
AI outputs should be validated against original sources. Do not rely on generated content for critical medical/legal/financial decisions without expert review.

---
**Made with ❤️ for learners and educators.**
