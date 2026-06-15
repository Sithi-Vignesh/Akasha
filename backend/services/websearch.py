from tavily import TavilyClient
from core.config import TAVILY_API_KEY

client = TavilyClient(api_key=TAVILY_API_KEY)

async def research(company_name):
    output = client.search("give me the relevent details about the company " + company_name)
    return output