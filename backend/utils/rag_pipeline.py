import argparse
from pdfParser import extract_text_from_pdf
from embedder import get_embeddings
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Setup
parser = argparse.ArgumentParser()
parser.add_argument('--file', type=str, required=True)
parser.add_argument('--question', type=str, required=True)
args = parser.parse_args()

pdf_path = args.file
question = args.question

# Step 1: Extract text
text = extract_text_from_pdf(pdf_path)
chunks = [text[i:i+500] for i in range(0, len(text), 500)]

# Step 2: Get embeddings
embeddings = get_embeddings(chunks)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

# Step 3: Embed the question
model = SentenceTransformer('all-MiniLM-L6-v2')
q_emb = model.encode([question])
D, I = index.search(np.array(q_emb), k=3)

# Step 4: Retrieve top relevant chunks
retrieved = [chunks[i] for i in I[0]]
context = "\n".join(retrieved)

# Step 5: Simulated answer (replace with LLM if desired)
print(f"Answer based on context:\n{context[:100]}...\n→ This is a placeholder. Integrate GPT/OpenAI for real answer.")
