import os
from google import genai
from google.genai import types

def test_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found in environment")
        try:
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.environ.get("GEMINI_API_KEY")
        except:
            pass
            
    if not api_key:
        print("Still no API key found.")
        return

    client = genai.Client(api_key=api_key)
    try:
        models = client.models.list()
        print("Available models:")
        for m in models:
            if 'flash' in m.name:
                print(f" - {m.name}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_gemini()
