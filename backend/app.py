import os
import hashlib
import re
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
from typing import TypedDict, List, Dict, Tuple
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

# Optional LangChain and related imports. These libraries are heavy and may
# not be available in all development environments. Attempt imports and
# fall back to a demo mode if unavailable so the Flask app can still run.
SUPPORTS_LANGCHAIN = True
try:
    from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, BaseMessage
    from langchain_community.vectorstores import FAISS
    from langchain_community.document_loaders import PyMuPDFLoader
    from langchain_text_splitters import CharacterTextSplitter
    from langgraph.graph import StateGraph, END
    from langgraph.prebuilt import ToolNode
    from langchain_core.tools import tool
    from langchain_community.utilities import GoogleSearchAPIWrapper
    from langchain_core.runnables import RunnableLambda
    from langchain_groq import ChatGroq
    from langchain_huggingface import HuggingFaceEmbeddings
except Exception as e:
    SUPPORTS_LANGCHAIN = False
    FAISS = None
    PyMuPDFLoader = None
    CharacterTextSplitter = None
    GoogleSearchAPIWrapper = None
    ChatGroq = None
    HuggingFaceEmbeddings = None
    print(f"⚠️ LangChain (or related) imports failed — running in limited/demo mode: {e}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

UPLOAD_FOLDER = 'uploads'
VECTOR_DIR = 'vector_store'
ALLOWED_EXTENSIONS = {'pdf'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VECTOR_DIR, exist_ok=True)

API_KEYS = {
    # Read keys from environment only. Do NOT inject default/fake keys into
    # the environment; doing so causes the app to attempt auth with invalid
    # credentials and produce 401 errors. If a key is missing its value will
    # be None and the related functionality will be skipped.
    "GOOGLE_CSE_ID": os.environ.get("GOOGLE_CSE_ID"),
    "GOOGLE_API_KEY": os.environ.get("GOOGLE_API_KEY"),
    "GROQ_API_KEY": os.environ.get("GROQ_API_KEY")
}

models = {}
embedding_model = None
retrievers = {}
all_dbs = {}
LLM_AUTH_OK = False

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_pdf_hash(file_path):
    with open(file_path, "rb") as f:
        pdf_bytes = f.read()
    return hashlib.md5(pdf_bytes).hexdigest()

def create_embedding_model_with_retry(model_name="sentence-transformers/all-MiniLM-L6-v2", retries=3, backoff_factor=2):
    if not SUPPORTS_LANGCHAIN or HuggingFaceEmbeddings is None:
        print("⚠️ HuggingFaceEmbeddings not available — embedding model disabled")
        return None

    for attempt in range(retries):
        try:
            embedding_model = HuggingFaceEmbeddings(model_name=model_name)
            # quick probe to ensure the model initialized correctly
            _ = embedding_model.embed_query("connectivity probe")
            return embedding_model
        except Exception as e:
            if attempt < retries - 1:
                delay = backoff_factor ** attempt
                print(f"Embedding API attempt {attempt + 1} failed: {str(e)}. Retrying in {delay} sec...")
                time.sleep(delay)
            else:
                print(f"❌ Failed to initialize embedding model after {retries} attempts: {str(e)}")
                return None

def initialize_models():
    global models, embedding_model, LLM_AUTH_OK
    model_options = {
        "GPT-OSS-120B": "openai/gpt-oss-120b"
    }

    # Initialize chat/LLM models only if supported and an API key is provided
    LLM_AUTH_OK = False
    if SUPPORTS_LANGCHAIN and ChatGroq is not None:
        groq_key = API_KEYS.get("GROQ_API_KEY")
        if groq_key:
            for name, model_id in model_options.items():
                if name == "GPT-OSS-120B":
                    try:
                        models[name] = ChatGroq(
                            model_name=model_id,
                            api_key=groq_key,
                            temperature=0.3,
                            max_tokens=2048
                        )
                        LLM_AUTH_OK = True
                        print(f"Initialized LLM model: {name}")
                    except Exception as e:
                        LLM_AUTH_OK = False
                        print(f"Failed to initialize {name}: {e}")
        else:
            print("⚠️ GROQ_API_KEY not set; skipping Groq LLM initialization")
    else:
        print("⚠️ LLM/chat models not available in this environment")

    # Initialize embedding model if available
    embedding_model = create_embedding_model_with_retry()
    if embedding_model:
        print("Embedding model initialized successfully")
    else:
        print("⚠️ Embedding model not initialized; upload and search endpoints will be limited")

initialize_models()

@app.route('/api/models', methods=['GET'])
def get_available_models():
    return jsonify({
        'models': list(models.keys()),
        'embedding_available': embedding_model is not None,
        'llm_auth': LLM_AUTH_OK
    })

@app.route('/api/upload', methods=['POST'])
def upload_files():
    user_email = request.form.get('user_email')
    if not user_email:
        return jsonify({'error': 'User email is required'}), 400

    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No files selected'}), 400

    if not embedding_model:
        return jsonify({'error': 'Embedding model not available'}), 500

    processed_files = []
    user_dbs = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, f"{user_email}_{filename}")
            file.save(filepath)

            try:
                pdf_hash = get_pdf_hash(filepath)
                vector_path = os.path.join(VECTOR_DIR, f"{user_email}_{pdf_hash}")

                if os.path.exists(vector_path):
                    print(f"Reusing existing embeddings for {filename}")
                    db = FAISS.load_local(
                        vector_path,
                        embeddings=embedding_model,
                        allow_dangerous_deserialization=True
                    )
                else:
                    print(f"Creating new embeddings for {filename}")
                    loader = PyMuPDFLoader(filepath)
                    documents = loader.load()

                    for doc in documents:
                        doc.metadata.update({
                            "source": filename,
                            "user_email": user_email,
                            "hash": pdf_hash,
                            "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        })

                    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                    docs = splitter.split_documents(documents)
                    db = FAISS.from_documents(docs, embedding_model)
                    db.save_local(vector_path)

                user_dbs.append(db)
                processed_files.append(filename)

                os.remove(filepath)

            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                return jsonify({'error': f'Error processing {filename}: {str(e)}'}), 500

    if user_dbs:
        combined_db = user_dbs[0]
        for extra_db in user_dbs[1:]:
            combined_db.merge_from(extra_db)

        retrievers[user_email] = combined_db.as_retriever(search_kwargs={"k": 10})
        all_dbs[user_email] = combined_db

    return jsonify({
        'message': f'Successfully processed {len(processed_files)} files',
        'files': processed_files
    })

def get_combined_context(query: str, retriever, max_chunks=20) -> str:
    if not retriever:
        return ""
    docs = retriever.invoke(query)
    if not docs:
        return ""
    return "\n\n".join([f"[{doc.metadata.get('source','unknown')} p.{doc.metadata.get('page','?')}] {doc.page_content}" for doc in docs[:max_chunks]])

def get_web_context(query: str, num_results=5) -> str:
    # If Google Search API credentials are not available, avoid attempting
    # the API call and return a clear message so callers can handle limited
    # functionality gracefully.
    if not SUPPORTS_LANGCHAIN or GoogleSearchAPIWrapper is None:
        return "Web search unavailable: LangChain/google utilities not installed."
    if not API_KEYS.get("GOOGLE_API_KEY") or not API_KEYS.get("GOOGLE_CSE_ID"):
        return "Web search unavailable: missing Google Search API credentials."

    search = GoogleSearchAPIWrapper(
        google_api_key=API_KEYS["GOOGLE_API_KEY"],
        google_cse_id=API_KEYS["GOOGLE_CSE_ID"]
    )
    results = search.results(query, num_results=num_results)
    full_contents = []
    for res in results:
        try:
            response = requests.get(res['link'], timeout=5)
            soup = BeautifulSoup(response.text, 'html.parser')
            text = soup.get_text(separator='\n', strip=True)[:3000]
            full_contents.append(f"Title: {res.get('title', 'No title')}\nContent: {text}")
        except Exception as fetch_e:
            full_contents.append(f"Title: {res.get('title', 'No title')}\nSnippet: {res.get('snippet', 'No snippet')}")
    return "\n\n".join(full_contents)

def parse_exam_paper_params(query: str) -> Dict[str, any]:
    """
    Parse user query for exam paper generation parameters.
    Returns dict with: 
      - paper_count
      - questions_per_paper (if uniform) OR computed from sections
      - marks_per_question (uniform) OR handled via 'sections'
      - difficulty (fallback uniform distribution)
      - sections: optional list like [{count:2, marks:2, difficulties:["medium","hard"]}, ...]

    Behavior:
    - Use explicit user specifications when present
    - Otherwise fall back to defaults (5 papers, 5 questions, 10 marks, 2-2-1 diff)
    """
    number_words = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }

    def to_int(token: str) -> int:
        token = token.lower()
        return int(token) if token.isdigit() else number_words.get(token, 0)

    params = {
        'paper_count': 5,
        'questions_per_paper': 5,
        'marks_per_question': 10,
        'difficulty': {'easy': 2, 'medium': 2, 'hard': 1}
    }

    # Paper count (supports '1 paper', '1 exam', '1 question paper')
    paper_match = re.search(r'(\d+)\s*(?:question\s+paper|papers?|sets?|exams?)', query, re.IGNORECASE)
    if paper_match:
        params['paper_count'] = int(paper_match.group(1))

    # Questions per paper (uniform)
    question_match = re.search(r'(\d+)\s*(?:questions?|qs?|problems?)(?:\s+(?:each|per\s+paper))?', query, re.IGNORECASE)
    if question_match:
        params['questions_per_paper'] = int(question_match.group(1))

    # SECTION-BASED parsing like: "two 2 marks questions, two 4 marks questions, three 10 marks questions"
    section_pattern = re.compile(
        r'(?:(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+)'
        r'((?:one|two|three|four|five|six|seven|eight|nine|ten|\d+))\s*mark[s]?\s*(?:questions?)?',
        re.IGNORECASE
    )
    sections = [
        {'count': to_int(m.group(1)) or 0, 'marks': to_int(m.group(2)) or 0}
        for m in section_pattern.finditer(query)
    ]
    # If user omitted count before marks (rare), ignore those entries
    sections = [s for s in sections if s['count'] > 0]

    # Difficulty guidance like: "one medium and one hard in each section"
    per_section_medium_hard = bool(re.search(r'one\s+medium\s+and\s+one\s+hard\s+in\s+each\s+section', query, re.IGNORECASE))

    # Check for global difficulty override: "all hard", "all easy", "all medium"
    all_difficulty_override = None
    all_pattern = re.search(r'all\s+(easy|medium|hard)', query, re.IGNORECASE)
    if all_pattern:
        all_difficulty_override = all_pattern.group(1).lower()

    # Time override like 'duration is 30 minutes' or 'time 30 minutes'
    time_match = re.search(r'(?:time|duration)\s*(?:is\s*)?(\d+)\s*minutes?', query, re.IGNORECASE)
    if time_match:
        params['time_minutes'] = int(time_match.group(1))

    if sections:
        # Build difficulties per section
        detailed_sections = []
        for s in sections:
            diff_plan: list[str] = []
            
            # PRIORITY 1: Global difficulty override (e.g., "all hard questions")
            if all_difficulty_override:
                diff_plan = [all_difficulty_override] * s['count']
            # PRIORITY 2: Per-section medium/hard rule
            elif per_section_medium_hard:
                # Ensure at least one medium and one hard per section when possible
                if s['count'] >= 2:
                    diff_plan.extend(['medium', 'hard'])
                # Fill remaining with easy, then cycle medium, hard
                while len(diff_plan) < s['count']:
                    if 'easy' not in diff_plan:
                        diff_plan.append('easy')
                    else:
                        # Alternate medium/hard for the rest
                        diff_plan.append('medium' if (len(diff_plan) % 2 == 0) else 'hard')
            # PRIORITY 3: Default distribution based on marks
            else:
                # No specific guidance -> distribute roughly easy/medium/hard
                # Prioritize medium/hard for higher marks
                if s['marks'] >= 10:
                    base = ['easy', 'medium', 'hard']
                elif s['marks'] >= 4:
                    base = ['medium', 'hard', 'easy']
                else:
                    base = ['medium', 'easy', 'hard']
                i = 0
                while len(diff_plan) < s['count']:
                    diff_plan.append(base[i % len(base)])
                    i += 1

            detailed_sections.append({
                'count': s['count'],
                'marks': s['marks'],
                'difficulties': diff_plan[:s['count']]
            })

        params['sections'] = detailed_sections
        params['questions_per_paper'] = sum(s['count'] for s in detailed_sections)
        # marks_per_question is irrelevant when using sections but keep last marks for compatibility
        if detailed_sections:
            params['marks_per_question'] = detailed_sections[-1]['marks']
        return params

    # If no sections, continue with uniform parsing
    marks_match = re.search(r'(\d+)\s*marks?(?:\s+each)?', query, re.IGNORECASE)
    if marks_match:
        params['marks_per_question'] = int(marks_match.group(1))

    # Flexible difficulty overrides
    all_pattern = re.search(r'all\s+(?:(\d+)\s+)?(easy|medium|hard)', query, re.IGNORECASE)
    if all_pattern:
        count = int(all_pattern.group(1)) if all_pattern.group(1) else params['questions_per_paper']
        difficulty_level = all_pattern.group(2).lower()
        params['difficulty'] = {'easy': 0, 'medium': 0, 'hard': 0}
        params['difficulty'][difficulty_level] = count
        params['questions_per_paper'] = count
        return params

    single_difficulty = re.search(r'(\d+)\s+(easy|medium|hard)', query, re.IGNORECASE)
    if single_difficulty and not re.search(r'(\d+)\s+easy.*?(\d+)\s+medium.*?(\d+)\s+hard', query, re.IGNORECASE):
        count = int(single_difficulty.group(1))
        difficulty_level = single_difficulty.group(2).lower()
        params['difficulty'] = {'easy': 0, 'medium': 0, 'hard': 0}
        params['difficulty'][difficulty_level] = count
        params['questions_per_paper'] = count
        return params

    difficulty_pattern = r'(\d+)\s*easy.*?(\d+)\s*medium.*?(\d+)\s*hard'
    difficulty_match = re.search(difficulty_pattern, query, re.IGNORECASE)
    if difficulty_match:
        easy_count = int(difficulty_match.group(1))
        medium_count = int(difficulty_match.group(2))
        hard_count = int(difficulty_match.group(3))
        total = easy_count + medium_count + hard_count
        params['difficulty'] = {'easy': easy_count, 'medium': medium_count, 'hard': hard_count}
        params['questions_per_paper'] = total

    return params

def generate_exam_paper_prompt(query: str, context: str, params: Dict[str, any]) -> str:
    """
    Generate a comprehensive prompt for exam paper generation.
    Supports either uniform marks/difficulty or section-based variable marks.
    """
    paper_count = params['paper_count']
    questions_per_paper = params['questions_per_paper']
    sections = params.get('sections')

    if sections:
        # Compute total marks from sections using difficulties length as question count
        total_marks = sum(s['marks'] * len(s['difficulties']) for s in sections)
        section_desc = ", ".join([f"{len(s['difficulties'])}×{s['marks']} marks" for s in sections])
        time_override = params.get('time_minutes', 90)
        prompt = f"""You are an expert exam paper creator. Generate {paper_count} complete examination papers based STRICTLY on the provided study material context below.

**REQUIREMENTS:**
- Generate exactly {paper_count} examination papers
- Each paper must contain exactly {questions_per_paper} questions
- Marks per paper: {total_marks} (sections: {section_desc})
- Follow the specified difficulty per question as indicated in the template below
- Questions MUST be based on the provided context only
- Questions should be clear, unambiguous, and academically rigorous

**DIFFICULTY LEVELS:**
- Easy: Direct recall, definitions, basic concepts
- Medium: Application, analysis, comparisons
- Hard: Synthesis, critical evaluation, complex problem-solving

**FORMATTING:**
Use EXACTLY this format for each paper and for every question:
"""

        qn = 1
        for s in sections:
            for diff in s['difficulties']:
                prompt += f"\n**Question {qn} ({diff.capitalize()} - {s['marks']} marks)**\n[Question text here]\n"
                qn += 1

        prompt += f"""

At the very beginning of each paper include these lines:
---
**EXAMINATION PAPER [NUMBER]**
**Total Marks: {total_marks}**
**Time: {time_override} minutes**
---

Replace [NUMBER] with 1, 2, 3, ... for each paper.

**STUDY MATERIAL CONTEXT:**
{context}

**USER REQUEST:**
{query}

⚠️ CRITICAL INSTRUCTION: You MUST generate questions with EXACTLY the difficulty levels shown in the template above. 
- If a question shows "(Hard - 2 marks)", it MUST be a Hard question.
- If a question shows "(Easy - 2 marks)", it MUST be an Easy question.
- DO NOT change the difficulty levels under any circumstances.
- DO NOT mix difficulties - follow the template exactly.

Generate all {paper_count} exam papers now, following the format and difficulty requirements EXACTLY."""

        return prompt

    # Uniform case (backward compatible)
    marks_per_question = params['marks_per_question']
    difficulty = params['difficulty']
    total_marks = questions_per_paper * marks_per_question
    time_override = params.get('time_minutes', int(total_marks * 1.2))

    # Build difficulty distribution string
    difficulty_parts = []
    if difficulty['easy'] > 0:
        difficulty_parts.append(f"{difficulty['easy']} Easy")
    if difficulty['medium'] > 0:
        difficulty_parts.append(f"{difficulty['medium']} Medium")
    if difficulty['hard'] > 0:
        difficulty_parts.append(f"{difficulty['hard']} Hard")
    difficulty_str = ", ".join(difficulty_parts) if difficulty_parts else "As specified"

    prompt = f"""You are an expert exam paper creator. Generate {paper_count} complete examination papers based STRICTLY on the provided study material context below.

**REQUIREMENTS:**
- Generate exactly {paper_count} examination papers
- Each paper must have exactly {questions_per_paper} questions
- Each question carries {marks_per_question} marks (Total: {total_marks} marks per paper)
- Difficulty distribution PER PAPER: {difficulty_str} questions
- Questions MUST be based on the provided context - do not create questions on topics not covered in the context
- Questions should be clear, unambiguous, and academically rigorous
- Include a mix of question types: theoretical, analytical, application-based, and problem-solving

**DIFFICULTY LEVELS:**
- Easy: Direct recall, definitions, basic concepts
- Medium: Application of concepts, analysis, comparison, moderate problem-solving
- Hard: Synthesis, critical evaluation, complex problem-solving, advanced applications

**FORMATTING:**
For each paper, use this EXACT format:

---
**EXAMINATION PAPER [NUMBER]**
**Total Marks: {total_marks}**
**Time: {time_override} minutes**
"""

    # Generate question template dynamically based on difficulty distribution
    question_num = 1
    for _ in range(difficulty['easy']):
        prompt += f"\n**Question {question_num} (Easy - {marks_per_question} marks)**\n[Question text here]\n"
        question_num += 1
    for _ in range(difficulty['medium']):
        prompt += f"\n**Question {question_num} (Medium - {marks_per_question} marks)**\n[Question text here]\n"
        question_num += 1
    for _ in range(difficulty['hard']):
        prompt += f"\n**Question {question_num} (Hard - {marks_per_question} marks)**\n[Question text here]\n"
        question_num += 1

    prompt += f"""---

Replace [NUMBER] with 1, 2, 3, etc. for each paper.

**STUDY MATERIAL CONTEXT:**
{context}

**USER REQUEST:**
{query}

Generate all {paper_count} exam papers now, following the format exactly. Ensure questions are diverse, cover different aspects of the material, and maintain academic quality. 

IMPORTANT: You MUST follow the user's difficulty requirements exactly. If they request "all 5 hard questions", generate ALL questions as Hard difficulty. Do NOT refuse or suggest alternatives - generate exactly what is requested."""

    return prompt

def build_prompt(tool, query, context):
    if tool == "summarizer":
        return (
            f"Summarize the following strictly from the provided context (no outside knowledge). "
            f"Write a concise summary with examples if helpful.\n\nContext:\n{context}\n\nQuery: {query}"
        )
    elif tool == "mcq_generator":
        return (
            f"Generate multiple-choice questions (MCQs) from the following context. "
            f"Each MCQ should have a question, four options, correct answer, and explanation.\n\nContext:\n{context}\n\nQuery: {query}"
        )
    elif tool == "notes_maker":
        return (
            f"Create concise notes strictly from the provided context. Use side headings and short paragraphs.\n\nContext:\n{context}\n\nQuery: {query}"
        )
    elif tool == "exam_prep_agent":
        return (
            f"Prepare a study plan and revision notes strictly from this context:\n\n{context}\n\nQuery: {query}"
        )
    elif tool == "concept_explainer":
        return (
            f"Explain the concept '{query}' in simple terms using ONLY the following context:\n\n{context}"
        )
    elif tool == "exam_paper_generator":
        # Parse parameters and generate specialized exam paper prompt
        params = parse_exam_paper_params(query)
        return generate_exam_paper_prompt(query, context, params)
    elif tool == "ai_chat":
        # General AI chat - can answer anything with or without context
        if context and context.strip():
            return (
                f"You are a helpful AI assistant. Answer the following question comprehensively. "
                f"If the provided context is relevant, use it to enhance your answer. "
                f"If the context is not relevant or empty, answer based on your general knowledge.\n\n"
                f"Context (use if relevant):\n{context}\n\n"
                f"Question: {query}\n\n"
                f"Provide a clear, accurate, and helpful response."
            )
        else:
            return (
                f"You are a helpful AI assistant. Answer the following question comprehensively and accurately.\n\n"
                f"Question: {query}\n\n"
                f"Provide a clear, detailed, and helpful response."
            )
    else:
        return (
            f"Answer the following question using ONLY the provided context below. "
            f"If the context is not relevant, say so. "
            f"Question: {query}\n\nContext:\n{context}"
        )

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_email = data.get('user_email')
    query = data.get('query')
    selected_model_name = data.get('model', 'GPT-OSS-120B')
    tool = data.get('tool', 'concept_explainer')  # You can pass tool from frontend

    if not user_email or not query:
        return jsonify({'error': 'User email and query are required'}), 400

    # If LLM authentication is not OK, return a clear 401 so the frontend
    # can show a helpful message (instead of attempting to invoke the model).
    if not LLM_AUTH_OK:
        return jsonify({
            'error': 'LLM provider not authenticated (invalid or missing API key).',
            'auth_error': True,
            'hint': 'Set GROQ_API_KEY environment variable to a valid key or disable Groq usage.'
        }), 401

    if selected_model_name not in models:
        return jsonify({'error': 'Invalid model selected'}), 400

    selected_model = models[selected_model_name]
    user_retriever = retrievers.get(user_email)

    # Step 1: Try to get context from PDF
    context = get_combined_context(query, user_retriever)
    source = "pdf" if context else "web"

    # Step 2: Fallback to Google Search if no PDF context
    if not context:
        context = get_web_context(query)

    # Step 3: Build prompt for the selected tool
    prompt = build_prompt(tool, query, context)

    # Invoke the selected model, but guard against runtime errors (e.g. auth
    # failures from the remote provider). If the model call fails, return a
    # helpful fallback response instead of crashing the server.
    try:
        response = selected_model.invoke(prompt)
        answer = getattr(response, "content", str(response))

        return jsonify({
            'response': answer,
            'source': source,
            'tool': tool
        })
    except Exception as e:
        # Log the exception server-side for debugging
        print(f"❌ Model invocation failed: {e}")

        # Distinguish authentication errors from other failures to provide
        # a clearer response the frontend can act on.
        err_text = str(e)
        is_auth_error = False
        if 'invalid_api_key' in err_text.lower() or 'invalid api key' in err_text.lower() or '401' in err_text:
            is_auth_error = True

        # Try to provide a graceful fallback: return a short excerpt of the
        # available context so the frontend still receives useful information.
        fallback_excerpt = ""
        try:
            if context:
                fallback_excerpt = context[:4000]
            else:
                # If no local context, try fetching web context (best-effort)
                fallback_excerpt = get_web_context(query, num_results=3)[:4000]
        except Exception as ex:
            print(f"⚠️ Failed to generate fallback context: {ex}")

        if is_auth_error:
            # Return 401 so the client knows this is an authentication issue
            return jsonify({
                'error': 'Authentication with the LLM provider failed (invalid or missing API key).',
                'auth_error': True,
                'hint': 'Set GROQ_API_KEY environment variable to a valid key or remove/disable Groq usage in configuration.',
                'fallback_context': fallback_excerpt,
                'source': 'auth_error',
                'tool': tool
            }), 401

        # Generic failure: return 502 (bad gateway) with fallback context
        return jsonify({
            'response': f"Model invocation failed: {err_text}. Returning fallback context excerpt.",
            'fallback_context': fallback_excerpt,
            'error': err_text,
            'source': 'fallback',
            'tool': tool
        }), 502

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'models_loaded': len(models)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)