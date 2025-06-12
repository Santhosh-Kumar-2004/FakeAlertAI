# ai/scam_classifier.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

def classify_text(text: str) -> dict:
    prompt = f"""
You are a scam and fake news detection expert.

Analyze the following message and return:
- Verdict (Scam, Fake News, or Real)
- Risk Score (from 0 to 100)
- Scam Type (if scam: e.g., Lottery Scam, Phishing, Job Scam, etc.)
- Explanation (why it’s fake or scam)
- Advice (what the user should do to stay safe)

Message:
\"\"\"{text}\"\"\"

Return your response **strictly in this format**:
Verdict: <Scam / Fake News / Real>
Risk Score: <0–100>
Scam Type: <e.g., Phishing / Lottery Scam / N/A>
Explanation: <Brief, clear explanation>
Advice: <Helpful advice>
"""

    data = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }

    response = requests.post(GROQ_API_URL, headers=HEADERS, json=data)

    if response.status_code != 200:
        return {
            "verdict": "Error",
            "risk_score": 0,
            "scam_type": "Unknown",
            "explanation": "",
            "advice": "",
            "error": f"Failed with status {response.status_code}"
        }

    try:
        content = response.json()["choices"][0]["message"]["content"]
        lines = content.strip().split("\n")

        def extract(field):
            return next((line.split(":", 1)[1].strip() for line in lines if line.lower().startswith(field.lower())), "")

        return {
            "verdict": extract("Verdict"),
            "risk_score": int(extract("Risk Score") or 0),
            "scam_type": extract("Scam Type"),
            "explanation": extract("Explanation"),
            "advice": extract("Advice"),
            "error": None
        }

    except Exception as e:
        return {
            "verdict": "Error",
            "risk_score": 0,
            "scam_type": "Unknown",
            "explanation": "",
            "advice": "",
            "error": str(e)
        }

