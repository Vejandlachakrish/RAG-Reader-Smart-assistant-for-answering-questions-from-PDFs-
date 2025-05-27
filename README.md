
# 📘 RAG-PDF-DoubtSolver

## 💡 About the Project

**RAG-PDF-DoubtSolver** is an intelligent chatbot that allows users to ask **questions (via text or voice)** about the content in a **PDF document** and get context-aware answers. It uses **Retrieval-Augmented Generation (RAG)** principles — specifically, **document retrieval** with sentence embeddings — to provide relevant responses from the uploaded PDF.

Users can:
- Upload a PDF
- Ask questions about it via **text or voice**
- Get accurate, semantically matched responses from the document

---

## 🧰 Tech Stack & Libraries Used

### 🔤 **Languages**
- Python 3.11

### 🧠 **Models & Machine Learning**
- [SentenceTransformers - `all-MiniLM-L6-v2`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) – for embedding text chunks
- [FAISS](https://github.com/facebookresearch/faiss) – for similarity search on document embeddings

### 🗣️ **Voice Input**
- `speech_recognition` – for converting voice to text
- `pyaudio` – microphone access

### 🖼️ **Web Framework**
- [Streamlit](https://streamlit.io/) – for building the web-based interface

---

## 📦 Installation – What You Need

Before running the project, install the following dependencies:

```bash
pip install streamlit
pip install faiss-cpu
pip install sentence-transformers
pip install numpy
pip install speechrecognition
pip install pyaudio
```
⚠️ Note: If you face issues installing PyAudio, especially on Windows, run:

```
pip install pipwin
pipwin install pyaudio
```

▶️ How to Run the Project

Clone the Repository or download the project folder.

Ensure you have your virtual environment activated (optional but recommended).

Navigate to the project directory in your terminal:

```
cd rag-bot
Start the Streamlit app:
```
```
streamlit run chatbot_app.py
```
Once the app opens in your browser:

Upload a PDF file

Use the text box or microphone icon to ask a question

Get your answer retrieved from the document content

📁 Project Structure
graphql
```
rag-bot/
├── chatbot_app.py         # Main Streamlit app
├── rag_utils.py           # Functions for embedding, saving, searching
├── pdf_utils.py           # PDF reading and chunking logic
├── embeddings/            # Stores FAISS index and docs
│   ├── faiss_index        # FAISS vector database file
│   └── docs.pkl           # Stored document text chunks
```

💬 Example Use Case
Upload a course material PDF

Ask: "What is RAG in NLP?"

The app searches and shows the most relevant answer from the document

🧠 Future Improvements
Add GPT or LLaMA to generate answers from retrieved content (true RAG)

Add file type support beyond PDF (e.g., DOCX, TXT)

Provide summarized answers instead of raw text snippets

👨‍💻 Author
Built by Vejandla Chakrish – B.Tech 3rd Year, VIT-AP
Feel free to fork, contribute, or suggest improvements.

