import pdfplumber
from docx import Document
import io
from sentence_transformers import SentenceTransformer
from db.vector_store import store, retrieve

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def parse_file(file_bytes, filename):
    raw_text = []
    if ".pdf" in filename:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                raw_text.append(page.extract_text() or "")
        raw_text = "\n".join(raw_text)
    else:
        doc = Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            raw_text.append(para.text)
        raw_text = "\n".join(raw_text)

    return raw_text

def chunking(raw_text):
    chunked_list = []
    chunk_size = 500
    chunk_overlap = 100
    i = 0
    while i < len(raw_text):
        if (i+chunk_size < len(raw_text)):
            chunked_list.append(raw_text[i:i+chunk_size])
            i = i + (chunk_size-chunk_overlap)
        else:
            chunked_list.append(raw_text[i:])
            break

    return chunked_list

def embeding(chunked_list):
    embeddings = model.encode(chunked_list)

    return embeddings

async def resume_processor(file_byte, filename):
    parse = parse_file(file_byte, filename)
    chunk = chunking(parse)
    embed = embeding(chunk)
    store(chunk, embed)
