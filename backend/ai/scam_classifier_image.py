from PIL import Image
import pytesseract
import io
import numpy as np
import cv2

# Windows Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_image(image_bytes, lang="eng"):
    """
    Extract text from an image using Tesseract OCR.
    Args:
        image_bytes: Bytes of the image (PNG/JPG).
        lang: Tesseract language code ("eng", "fra", "ara").
    Returns:
        Extracted text or error message.
    """
    try:
        # Validate image data
        if not image_bytes:
            return "Error: No image data provided."
        
        # Open image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Convert to OpenCV format for preprocessing
        image_np = np.array(image)
        
        # Preprocess: Grayscale and thresholding
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Convert back to PIL
        processed_image = Image.fromarray(thresh)
        
        # Extract text
        text = pytesseract.image_to_string(processed_image, lang=lang)
        text = text.strip()
        
        return text if text else "Error: No text detected in image."
    except Exception as e:
        return f"Error: Failed to process image - {str(e)}"