from typing import Set

SKILL_SUGGESTIONS = {
    "Python": "Take Python courses on Coursera or freeCodeCamp",
    "Machine Learning": "Try Andrew Ng's ML course on Coursera",
    "React": "Learn React via official docs or Scrimba",
    "Node.js": "Build REST APIs with Node.js on The Odin Project",
    "SQL": "Practice SQL on LeetCode or HackerRank",
    "Docker": "Learn Docker via Play with Docker (labs.play-with-docker.com)",
    "AWS": "Start with AWS Free Tier and A Cloud Guru",
    "TensorFlow": "Try TensorFlow tutorials at tensorflow.org",
    "FastAPI": "Read FastAPI official documentation",
    "MongoDB": "Learn MongoDB University free courses",
    "Git": "Practice Git on learngitbranching.js.org",
    "TypeScript": "Learn TypeScript via typescriptlang.org",
    "Java": "Practice Java on HackerRank or Udemy",
    "Django": "Build projects using Django official tutorial",
    "Flutter": "Learn Flutter at flutter.dev/learn",
    "Kubernetes": "Try Kubernetes the Hard Way by Kelsey Hightower",
    "GraphQL": "Learn GraphQL at howtographql.com",
    "Redis": "Try Redis University at university.redis.com",
    "Spark": "Learn Apache Spark via Databricks free courses",
    "NLP": "Study NLP with Hugging Face courses",
}

def calculate_match(
    resume_skills: Set[str],
    jd_skills: Set[str],
    resume_text: str,
    jd_text: str
) -> dict:
    """Calculate match score between resume and job description."""

    if not jd_skills:
        return {
            "score": 0,
            "matched": [],
            "missing": [],
            "suggestions": ["Could not extract skills from job description. Try adding more specific technical keywords."]
        }

    matched = resume_skills.intersection(jd_skills)
    missing = jd_skills - resume_skills

    # Score: percentage of JD skills found in resume
    score = round((len(matched) / len(jd_skills)) * 100, 1) if jd_skills else 0

    # Generate suggestions for missing skills
    suggestions = []
    for skill in list(missing)[:5]:  # Top 5 missing skills
        if skill in SKILL_SUGGESTIONS:
            suggestions.append(f"Learn {skill}: {SKILL_SUGGESTIONS[skill]}")
        else:
            suggestions.append(f"Consider learning {skill} through online courses or tutorials")

    if score >= 80:
        suggestions.insert(0, "🎉 Excellent match! Your profile strongly aligns with this job.")
    elif score >= 60:
        suggestions.insert(0, "👍 Good match! A few more skills could make you a top candidate.")
    elif score >= 40:
        suggestions.insert(0, "⚠️ Moderate match. Focus on gaining the missing key skills.")
    else:
        suggestions.insert(0, "📚 Low match. Consider upskilling before applying for this role.")

    return {
        "score": score,
        "matched": sorted(list(matched)),
        "missing": sorted(list(missing)),
        "suggestions": suggestions
    }
