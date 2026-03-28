from fastapi import APIRouter

router = APIRouter()

@router.get("/analyze")
def analyze_portfolio():
    return {
        "holdings": [
            {"symbol": "RELIANCE", "name": "Reliance Industries", "weight": 28.0, "risk_score": 3.2, "sector": "Oil & Gas", "return_1y": "+18.4%"},
            {"symbol": "HDFCBANK", "name": "HDFC Bank", "weight": 22.0, "risk_score": 2.1, "sector": "Banking", "return_1y": "+12.8%"},
            {"symbol": "TCS", "name": "TCS", "weight": 18.0, "risk_score": 1.5, "sector": "IT Services", "return_1y": "+8.2%"},
            {"symbol": "INFY", "name": "Infosys", "weight": 15.0, "risk_score": 1.8, "sector": "IT Services", "return_1y": "+14.1%"},
            {"symbol": "ITC", "name": "ITC Limited", "weight": 10.0, "risk_score": 2.4, "sector": "FMCG", "return_1y": "+22.6%"},
            {"symbol": "SBIN", "name": "State Bank of India", "weight": 7.0, "risk_score": 3.8, "sector": "Banking (PSU)", "return_1y": "+31.2%"}
        ],
        "overall_health": "Strong",
        "total_value": "₹24.8L",
        "overall_return": "+16.2%",
        "diversification_score": 82,
        "warnings": [
            "IT sector overweight at 33% — consider diversification into pharma/auto",
            "RELIANCE has elevated volatility — monitor crude oil price movements"
        ],
        "recommendations": [
            "Consider adding SUNPHARMA for defensive pharma exposure",
            "BAJFINANCE dip presents accumulation opportunity at current PE of 32x"
        ]
    }
