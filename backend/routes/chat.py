from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import os

try:
    from openai import AsyncOpenAI
except ImportError:
    AsyncOpenAI = None

router = APIRouter()

async def mock_sse_generator(message: str):
    words = message.split()
    for word in words:
        yield {"data": word + " "}
        await asyncio.sleep(0.05)

@router.get("/stream")
async def chat_stream(request: Request, query: str = ""):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not AsyncOpenAI:
        return EventSourceResponse(mock_sse_generator(f"Mock AI Analyst: I see your query '{query}'. Since no OpenAI API key is provided, this is a simulated streaming response pointing out the Golden Cross on HDFCBANK and the recent insider buying."))
    
    # Real OpenAI implementation
    client = AsyncOpenAI(api_key=api_key)
    async def openai_generator():
        try:
            prompt = f"You are a hedge fund AI analyst. The user asks: {query}. Keep it brief, professional, and highlight technical/fundamental convergence."
            stream = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                stream=True,
            )
            async for event in stream:
                if event.choices and event.choices[0].delta.content:
                    yield {"data": event.choices[0].delta.content}
        except Exception as e:
            yield {"data": f"Error calling OpenAI API: {str(e)}"}
            
    return EventSourceResponse(openai_generator())
