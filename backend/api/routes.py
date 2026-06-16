from fastapi import APIRouter, UploadFile, File, Form
from services.rag_service import resume_processor, embeding
from services.websearch import research
from db.vector_store import retrive
from services.llm_service import analyzer, resume_generator
import asyncio

router  = APIRouter()

@router.post("/analyze")
async def analyze(company_name: str = Form(...), job_description: str = Form(...), resume_file: UploadFile = File(...)):
    file_bytes = await resume_file.read()
    output = await asyncio.gather(resume_processor(file_bytes, resume_file.filename), research(company_name))
    tavily_context = output[1]
    query = embeding(job_description)
    retrived_data = retrive(query, 6)

    results = analyzer(company_name, job_description, tavily_context, retrived_data)

    return results

@router.post("/generate-resume")
async def generate_resume(resume_file: UploadFile = File(...), company_name: str = Form(...), job_description: str = Form(...)):
    file_bytes = await resume_file.read()
    output = await asyncio.gather(resume_processor(file_bytes, resume_file.filename), research(company_name))
    tavily_context = output[1]
    query = embeding(job_description)
    retrived_data = retrive(query, 6)

    results = analyzer(company_name, job_description, tavily_context, retrived_data)

    fit_score = results["fit_score"]
    fit_summary = results["fit_summary"]
    gaps = results["gaps"]
    suggestions = results["suggestions"]

    latex = resume_generator(retrived_data, company_name, job_description, fit_summary, gaps, suggestions, fit_score)
    print(latex)
    return {"latex_code": latex}
