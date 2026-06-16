from core.config import OPENROUTER_API_KEY
import requests
import json

def analyzer(company_name, job_description, tavily_results, resume_chunks):
    tavily_results_str = str(tavily_results)
    resume_chunks_str = str(resume_chunks)
    example = str({
        "fit_score": 72,
        "fit_summary": "The candidate has strong Python skills and relevant internship experience that aligns well with the role. However, the overall experience level is below what the JD requires.",
        "gaps": [
            "No experience with Kubernetes or containerization",
            "Missing system design experience",
            "No mention of CI/CD pipelines"
        ],
        "suggestions": [
            "Add any Docker or containerization projects to your resume",
            "Highlight any team projects that involved system architecture decisions",
            "Take a short course on CI/CD and add it to your certifications"
        ]
        })
    prompt = f"""you are the hiring manager of the company {company_name}. and a new job has be posted in your company and the JD is {job_description}.
                and your company details are {tavily_results_str}. u can use websearch for more data.
                and this is a resume of candidate {resume_chunks_str}.
                now anaylse the resume and give me a fit_score(how much this resume fits the job -> integer),
                fit_sumamry(what things actually fits so well and what dont -> string), gaps(what important things are missing in the resume -> list), suggestion(how can i imporve my resume to crack this job -> list). 
                and YOU MUST GIVE THE OUTPUT IN A JSON STRUCTURE, NO EXTRA TEXTS
                example output formate - {example}
                respond with valid JSON using double quotes only, no single quotes"""
    
    headers = {"Authorization": "Bearer " + OPENROUTER_API_KEY}
    body = {
        "model": "nvidia/nemotron-3-super-120b-a12b:free",
        "messages": [
            {
            "role": "user",
            "content": prompt
            }
        ]
        }
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers = headers,
        json = body
    )
    output = response.json()
    
    return json.loads(output["choices"][0]["message"]["content"])