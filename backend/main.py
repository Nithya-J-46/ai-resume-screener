from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from matcher import calculate_match
import uvicorn

app = FastAPI(title="AI Resume Screener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Resume Screener API is running!"}

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Step 1: Extract text from PDF
    content = await file.read()
    resume_text = extract_text_from_pdf(content)

    # Step 2: Extract skills from resume and JD
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    # Step 3: Calculate match
    result = calculate_match(resume_skills, jd_skills, resume_text, job_description)

    return {
        "resume_skills": list(resume_skills),
        "jd_skills": list(jd_skills),
        "match_score": result["score"],
        "matched_skills": result["matched"],
        "missing_skills": result["missing"],
        "suggestions": result["suggestions"],
        "resume_text_preview": resume_text[:500]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
