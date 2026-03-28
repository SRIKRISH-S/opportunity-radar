from fastapi import APIRouter

router = APIRouter()

@router.get("/analyze")
def analyze_portfolio():
    return {
        "holdings": [
            {"symbol": "RELIANCE", "weight": 40.0, "risk_score": 3.2},
            {"symbol": "HDFCBANK", "weight": 35.0, "risk_score": 2.1},
            {"symbol": "TCS", "weight": 25.0, "risk_score": 1.5}
        ],
        "overall_health": "Strong",
        "warnings": ["RELIANCE has high volatility this week according to Sentiment AI."]
    }
