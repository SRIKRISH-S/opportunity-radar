from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import signals, chat, portfolio, alerts

app = FastAPI(title="Opportunity Radar API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signals.router, prefix="/api/signals", tags=["Signals"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Opportunity Radar Backend is running."}
