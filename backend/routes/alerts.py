from fastapi import APIRouter

router = APIRouter()

@router.get("/active")
def get_alerts():
    return [
        {"id": 1, "severity": "high", "message": "Promoter pledge detected in ADANIENT"},
        {"id": 2, "severity": "medium", "message": "Golden Cross forming on INFY"}
    ]
