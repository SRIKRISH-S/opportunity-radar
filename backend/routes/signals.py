from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from backend.agents import run_pipeline

router = APIRouter()

class SignalResponse(BaseModel):
    symbol: str
    score: float
    conviction: str
    direction: str
    agents_triggered: List[str]
    confluence_boost: bool
    summary: str

@router.get("/scan", response_model=List[SignalResponse])
async def scan_market():
    # Run the 6-stage agent pipeline
    results = await run_pipeline()
    return results
