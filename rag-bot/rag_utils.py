# rag-bot/rag_utils.py

from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document
import os

DB_PATH = 'embeddings/faiss_index'

# Create embedding model
embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

def save_vector_db(texts):
    """
    Takes a list of strings, embeds and saves to a FAISS vector DB.
    """
    docs = [Document(page_content=text) for text in texts]
    vectorstore = FAISS.from_documents(docs, embedding_model)
    vectorstore.save_local(DB_PATH)

def load_vector_db():
    """
    Loads the FAISS vector DB using LangChain.
    """
    if not os.path.exists(DB_PATH):
        return None

    vectorstore = FAISS.load_local(DB_PATH, embedding_model, allow_dangerous_deserialization=True)
    return vectorstore

def search(query, top_k=3):
    """
    Searches the vector store for relevant documents.
    """
    vectorstore = load_vector_db()
    if vectorstore is None:
        return ["No documents found."]

    docs = vectorstore.similarity_search(query, k=top_k)
    return [doc.page_content for doc in docs]
