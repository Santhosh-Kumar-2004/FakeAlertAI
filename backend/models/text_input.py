from pydantic import BaseModel

# Request model
class TextInput(BaseModel):
    text: str

# Response model
class TextOutput(BaseModel):
    verdict: str
    risk_score: int
    scam_type: str
    explanation: str
    advice: str
    error: str | None = None  # Optional error message if classification fails