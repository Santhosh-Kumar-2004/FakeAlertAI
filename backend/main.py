from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ai.scam_classifier_text import classify_text
from fastapi.middleware.cors import CORSMiddleware
from models.text_input import TextInput, TextOutput

app = FastAPI(
    title="FakeAlert API",
    description="Detects scams and fake news in text using AI",
    version="1.0.0"
)

# Allow CORS (for frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class TextInput(BaseModel):
    text: str

# POST endpoint to classify scam text
@app.post("/analyze-text")
def analyze_text(payload: TextInput):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    try:
        result = classify_text(payload.text)
        return TextOutput(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
