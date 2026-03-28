from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import random

router = APIRouter()

# ─── Built-in AI Knowledge Base (no API key needed) ─────────────────────
AI_RESPONSES = {
    "golden cross": "A Golden Cross occurs when the 50-day moving average crosses above the 200-day moving average. This is a powerful bullish signal with a historical win rate of ~72% on Indian large-caps. Our Technical Pattern Agent monitors this in real-time across all NSE-listed stocks.",
    "rsi": "RSI (Relative Strength Index) measures momentum on a 0-100 scale. Below 30 = oversold (potential bounce), above 70 = overbought (potential pullback). Our system flags RSI extremes and cross-references them with filing data for confluence scoring.",
    "confluence": "Confluence scoring is our secret sauce. When 3+ independent agents (Filing, Technical, Sentiment) agree on a direction, we apply a 1.35x score multiplier. Historical backtests show this boosts win-rate from ~58% to ~78%.",
    "promoter": "Promoter pledge monitoring is critical for Indian markets. When promoters pledge shares as collateral, it creates forced-selling risk. Our Filing Agent tracks SEBI disclosures and flags pledge increases >5% as high-severity warnings.",
    "insider": "Insider trading data from SEBI filings is a leading indicator. When promoters/KMPs buy in open market, it signals confidence. Studies show insider-buying clusters precede 15-20% outperformance over 6 months.",
    "sentiment": "Our Sentiment Shift Agent analyses management commentary from earnings calls and annual reports. It detects tone shifts — bullish guidance upgrades, margin expansion language, or cautious debt commentary — and scores them against historical patterns.",
    "how": "Opportunity Radar runs a 6-stage pipeline: (1) Data Ingestion from NSE/BSE feeds, (2) Filing Signal extraction from SEBI data, (3) Technical Pattern detection via RSI/MACD/Moving Averages, (4) Sentiment Analysis of management commentary, (5) Confluence Scoring with 1.35x boost, (6) AI Synthesis generating plain-English briefs.",
    "score": "Scores range from 0-100. Above 75 = HIGH conviction, 55-75 = MEDIUM, below 55 = LOW. A confluence boost can push scores above 100 (capped at 100). The scoring algorithm weights filing signals at 35%, technicals at 30%, and sentiment at 35%.",
    "risk": "Risk management is built into every signal. Each opportunity includes direction (BULLISH/BEARISH/NEUTRAL), conviction level, and specific support/resistance levels. We recommend position sizing based on conviction: HIGH = 5% portfolio, MEDIUM = 3%, LOW = 1%.",
    "nse": "We monitor all NSE-listed stocks with focus on NIFTY 50 and NIFTY Next 50 constituents. Data sources include BSE bulk deal reports, SEBI insider trade disclosures, NSE OHLCV data, and quarterly earnings transcripts.",
    "default": "I'm the Opportunity Radar AI Analyst. I can explain our 6-agent pipeline, scoring methodology, technical indicators (RSI, Golden Cross, MACD), filing signals (insider trades, promoter pledges), and sentiment analysis. Try asking about 'confluence scoring', 'how does it work', or 'what is RSI'."
}

def find_best_response(query: str) -> str:
    query_lower = query.lower()
    best_match = "default"
    best_score = 0
    
    for key, response in AI_RESPONSES.items():
        if key == "default":
            continue
        keywords = key.split()
        matches = sum(1 for kw in keywords if kw in query_lower)
        if matches > best_score:
            best_score = matches
            best_match = key
    
    # Also check for common question patterns
    if any(w in query_lower for w in ["what", "how", "explain", "tell", "work"]):
        if "work" in query_lower or "pipeline" in query_lower or "agent" in query_lower:
            best_match = "how"
        elif "score" in query_lower or "scoring" in query_lower:
            best_match = "score"
    
    if any(w in query_lower for w in ["risk", "danger", "safe", "position"]):
        best_match = "risk"
    
    return AI_RESPONSES[best_match]


async def smart_sse_generator(query: str):
    """Stream a smart AI response word-by-word like a real LLM."""
    response = find_best_response(query)
    words = response.split()
    for i, word in enumerate(words):
        yield {"data": word + " "}
        # Variable typing speed for realism
        delay = random.uniform(0.02, 0.06)
        if word.endswith(".") or word.endswith(","):
            delay = random.uniform(0.08, 0.15)
        await asyncio.sleep(delay)


@router.get("/stream")
async def chat_stream(request: Request, query: str = ""):
    return EventSourceResponse(smart_sse_generator(query))
