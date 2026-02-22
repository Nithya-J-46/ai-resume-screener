# 🤖 AI Resume Screener

An AI-powered Resume Screening system that matches resumes against job descriptions using NLP and provides detailed skill gap analysis.

## 🚀 Features

- 📄 **PDF Resume Upload** — Drag & drop or click to upload
- 🔍 **NLP Skill Extraction** — Extracts 100+ technical skills from resume and JD
- 📊 **Match Score** — Calculates % match between your resume and job description
- ✅ **Matched Skills** — Shows skills you already have
- ❌ **Missing Skills** — Identifies skill gaps
- 💡 **AI Recommendations** — Personalized learning suggestions for missing skills
- 🎨 **Beautiful Dark UI** — Modern dashboard built with React

---

## 🛠️ Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Frontend   | React.js + Vite    |
| Backend    | FastAPI (Python)   |
| NLP        | Keyword Matching + Skills Dataset |
| PDF Parser | pdfplumber         |
| Styling    | Pure CSS (custom)  |
| API        | REST via Axios     |

---

## 📁 Project Structure

```
resume-screener/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── resume_parser.py     # PDF text extraction
│   ├── skill_extractor.py   # NLP skill extraction
│   ├── matcher.py           # Match score algorithm
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── models/
    └── skills_dataset.json  # 100+ skills database
```

---

## ⚙️ Setup & Run

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# API runs at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint   | Description              |
|--------|------------|--------------------------|
| GET    | /          | Health check             |
| POST   | /analyze   | Analyze resume vs JD     |

### POST /analyze
**Form Data:**
- `file` — PDF file (resume)
- `job_description` — String (job description text)

**Response:**
```json
{
  "resume_skills": ["Python", "React", "SQL"],
  "jd_skills": ["Python", "Docker", "AWS"],
  "match_score": 33.3,
  "matched_skills": ["Python"],
  "missing_skills": ["Docker", "AWS"],
  "suggestions": ["Learn Docker via Play with Docker...", "..."]
}
```

---

## 🚢 Deployment

- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)
- **Frontend** → [Vercel](https://vercel.com)

---

## 📸 Screenshots

Upload your resume → Get instant AI-powered match analysis → See skill gaps and get learning recommendations.

---

## 🤝 Contributing

Feel free to fork and improve this project! Ideas:
- Add spaCy / Hugging Face NLP for better extraction
- Support DOCX resumes
- Add multi-resume comparison
- Add resume scoring vs multiple JDs

---

## 📄 License

MIT License — free to use and modify.

---

Built with ❤️ for the AIML community
