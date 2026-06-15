from fastapi import APIRouter, UploadFile, File, Form
from services.rag_service import resume_processor
from backend.services.websearch import research
import asyncio

router  = APIRouter()

@router.post("/analyze")
async def analyze(company_name: str = Form(...), job_description: str = Form(...), resume_file: UploadFile = File(...)):
    output = await asyncio.gather(resume_processor(resume_file.read(), resume_file.filename), research(company_name))
    rag_content = output[0]
    perplexity_context = output[1]
    fit_score = ""
    fit_summary = ""
    gaps = []
    suggestions = []
    ans = {
        "fit_score":fit_score,
        "fit_summary":fit_summary,
        "gaps":gaps,
        "suggestions":suggestions
    }
    return ans

@router.post("/generate-resume")
def generate_resume(resume_file: UploadFile = File(...), company_name: str = Form(...), job_description: str = Form(...), fit_score: float = Form(...)):
    ans = {"latex_code": "..."}
    return ans
