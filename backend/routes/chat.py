from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import os

try:
    from anthropic import AsyncAnthropic
except ImportError:
    AsyncAnthropic = None

router = APIRouter()

async def mock_sse_generator(message: str):
    words = message.split()
    for word in words:
        yield {"data": word + " "}
        await asyncio.sleep(0.05)

@router.get("/stream")
async def chat_stream(request: Request, query: str = ""):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or not AsyncAnthropic:
        return EventSourceResponse(mock_sse_generator(f"Mock AI Analyst: I see your query '{query}'. Since no Anthropic API key is provided, this is a simulated streaming response pointing out the Golden Cross on HDFCBANK and the recent insider buying."))
    
    # Real Claude implementation
    client = AsyncAnthropic(api_key=api_key)
    async def claude_generator():
        try:
            prompt = f"You are a hedge fund AI analyst. The user asks: {query}. Keep it brief, professional, and highlight technical/fundamental convergence."
            stream = await client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}],
                stream=True,
            )
            async for event in stream:
                if event.type == "content_block_delta" and hasattr(event.delta, "text"):
                    yield {"data": event.delta.text}
        except Exception as e:
            yield {"data": f"Error calling Anthropic API: {str(e)}"}
            
    return EventSourceResponse(claude_generator())
