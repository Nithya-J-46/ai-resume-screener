import json
import os
import re

# Load skills dataset
SKILLS_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "skills_dataset.json")

def load_skills():
    with open(SKILLS_PATH, "r") as f:
        data = json.load(f)
    return data["skills"]

ALL_SKILLS = load_skills()

def extract_skills(text: str) -> set:
    """Extract skills from text by matching against skills dataset."""
    text_lower = text.lower()
    found_skills = set()

    for skill in ALL_SKILLS:
        # Use word boundary matching to avoid partial matches
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return found_skills
