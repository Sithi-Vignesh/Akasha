from dotenv import load_dotenv
import os

load_dotenv()
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY") 
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")