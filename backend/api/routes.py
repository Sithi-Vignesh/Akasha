from fastapi import APIRouter, UploadFile, File, Form

router  = APIRouter()

@router.post("/analyze")
def analyze(company_name: str = Form(...), job_description: str = Form(...), resume_file: UploadFile = File(...)):
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
