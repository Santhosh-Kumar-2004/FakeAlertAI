# for text classification
from ai.scam_classifier_text import classify_text

sample_text = """
Congratulations! You've won a $1,000 Amazon gift card. Click this link to claim your prize now!
"""

result = classify_text(sample_text)

print("Verdict:", result["verdict"])
print("Explanation:", result["explanation"])


# for image classification
from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
img = Image.open("scam_image2.png")  # Use a test image with Arabic/French text
print(pytesseract.image_to_string(img, lang="eng"))  # Change 'eng' to 'fra' or 'ara' for French/Arabic
