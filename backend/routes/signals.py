from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from backend.agents import run_pipeline

router = APIRouter()

class SignalResponse(BaseModel):
    symbol: str
    company_name: str
    sector: str
    market_cap: str
    pe_ratio: float
    current_price: str
    week_high: str
    week_low: str
    promoter_holding: str
    fii_holding: str
    description: str
    score: float
    conviction: str
    direction: str
    agents_triggered: List[str]
    confluence_boost: bool
    raw_signals: List[str]
    ai_brief: str
    timestamp: str

@router.get("/scan", response_model=List[SignalResponse])
async def scan_market():
    results = await run_pipeline()
    return results
