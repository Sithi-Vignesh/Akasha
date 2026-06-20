from fastapi import APIRouter, UploadFile, File, Form
from services.rag_service import resume_processor, embeding
from services.websearch import research
from db.vector_store import retrive
from services.llm_service import analyzer, resume_generator
from core.file_validation import validate_file_type
import asyncio
from pydantic import BaseModel
from fastapi import HTTPException
from core.limiter import limiter
from fastapi import Request

class GenerateRequest(BaseModel):
    company_name: str
    job_description: str
    fit_score: int
    fit_summary: str
    gaps: list
    suggestions: list
    resume_chunks: list

router  = APIRouter()

@router.post("/analyze")
@limiter.limit("3/minute")
async def analyze(request: Request, company_name: str = Form(...), job_description: str = Form(...), resume_file: UploadFile = File(...)):
    file_bytes = await resume_file.read()

    error = validate_file_type(file_bytes)
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    output = await asyncio.gather(resume_processor(file_bytes, resume_file.filename), research(company_name))
    tavily_context = output[1]
    query = embeding(job_description)
    retrived_data = retrive(query, 100)

    results = analyzer(company_name, job_description, tavily_context, retrived_data)

    return {
        "fit_score": results["fit_score"],
        "fit_summary": results["fit_summary"],
        "gaps": results["gaps"],
        "suggestions": results["suggestions"],
        "resume_chunks": retrived_data["documents"][0]
    }

@router.post("/generate-resume")
async def generate_resume(request: GenerateRequest):
    latex = resume_generator(
        request.resume_chunks,
        request.company_name,
        request.job_description,
        request.fit_summary,
        request.gaps,
        request.suggestions,
        request.fit_score
    )
    return {"latex_code": latex}

@router.get("/health")
def health():
    return {"status":"ok"}