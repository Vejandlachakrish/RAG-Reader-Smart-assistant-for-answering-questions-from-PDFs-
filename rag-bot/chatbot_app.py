# rag-bot/chatbot_app.py

import os
import shutil
import streamlit as st
import speech_recognition as sr
import pyttsx3

# ✅ Updated Imports as per LangChain v0.2+
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

from rag_utils import search

# Streamlit UI configuration
st.set_page_config(page_title="RAG PDF DoubtSolver", layout="centered")
st.title("📄💬 RAG PDF DoubtSolver")

# Constants
UPLOAD_DIR = "uploads"
EMBEDDING_DIR = "embeddings"
DB_PATH = os.path.join(EMBEDDING_DIR, "faiss_index")

# Voice to Text
def voice_to_text():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("🎤 Listening... Speak now.")
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio)
            st.success(f"✅ Recognized: {text}")
            return text
        except sr.UnknownValueError:
            st.error("❌ Could not understand audio.")
        except sr.RequestError:
            st.error("❌ Speech recognition service failed.")
    return ""

# Text to Speech
def text_to_speech(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

# Generate embeddings from uploaded PDF
def generate_embeddings_from_pdf(uploaded_file):
    if uploaded_file is not None:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        filepath = os.path.join(UPLOAD_DIR, uploaded_file.name)

        # Save uploaded file
        with open(filepath, "wb") as f:
            f.write(uploaded_file.getbuffer())

        # Process PDF and create FAISS index
        loader = PyPDFLoader(filepath)
        documents = loader.load_and_split()
        
        # ✅ Use explicit model name
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        db = FAISS.from_documents(documents, embeddings)

        # ✅ Handle existing directory to prevent WinError 183
        if os.path.exists(DB_PATH):
            if os.path.isfile(DB_PATH):
                os.remove(DB_PATH)
            else:
                shutil.rmtree(DB_PATH)

        os.makedirs(EMBEDDING_DIR, exist_ok=True)
        db.save_local(DB_PATH)
        return True
    return False

# Sidebar: Upload PDF
st.sidebar.header("📄 Upload Your PDF")
uploaded_file = st.sidebar.file_uploader("Choose a PDF file", type="pdf")

if uploaded_file is not None:
    with st.spinner("⏳ Processing and indexing PDF..."):
        if generate_embeddings_from_pdf(uploaded_file):
            st.sidebar.success("✅ PDF processed and indexed successfully!")
        else:
            st.sidebar.error("❌ Failed to process PDF.")

# Check if FAISS index exists
if not os.path.exists(DB_PATH):
    st.warning("⚠️ Please upload a PDF to activate the chatbot.")
    st.stop()

# Input: Text or Voice
query_mode = st.radio("Choose Input Mode:", ["Text", "Voice"])
query = ""

if query_mode == "Text":
    query = st.text_input("💬 Ask your doubt:")
else:
    if st.button("🎙️ Start Voice Input"):
        query = voice_to_text()

# Run Query
if query:
    with st.spinner("🔍 Searching for answers..."):
        results = search(query)

    st.subheader("📚 Retrieved Context:")
    if results:
        for idx, result in enumerate(results, 1):
            st.markdown(f"**{idx}.** {result}")
    else:
        st.info("No relevant context found.")

    # Speak result
    if st.button("🔊 Speak Answer"):
        answer = results[0] if results else "No answer found."
        text_to_speech(answer)
