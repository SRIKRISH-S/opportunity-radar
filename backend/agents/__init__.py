import asyncio
import os
import random

async def run_pipeline():
    # 1. Ingestion Agent
    symbols = ["HDFCBANK", "RELIANCE", "INFY", "TCS", "ITC", "ADANIENT"]
    
    # 2. FilingSignal Agent
    # 3. TechnicalPattern Agent
    # 4. SentimentShift Agent
    # 5. Scoring Agent
    # 6. AISynthesis Agent
    
    # Mocking the pipeline execution for the demo
    await asyncio.sleep(1.5)  # Simulate processing time
    
    results = []
    directions = ["BULLISH", "BEARISH", "NEUTRAL"]
    for sym in symbols:
        score = round(random.uniform(40, 85), 1)
        direction = random.choice(directions)
        if score > 80: conviction = "HIGH"
        elif score > 60: conviction = "MEDIUM"
        else: conviction = "LOW"
        
        agents = ["Ingestion", "Filing", "Technical"]
        if random.random() > 0.5: agents.append("Sentiment")
        
        confluence = len(agents) >= 3 and score > 70
        
        results.append({
            "symbol": sym,
            "score": round(score if not confluence else min(100.0, score * 1.35), 1),
            "conviction": conviction,
            "direction": direction,
            "agents_triggered": agents,
            "confluence_boost": confluence,
            "summary": f"AI Synthesis: {sym} shows {direction} signals with {conviction} conviction."
        })
        
    # Sort by score highest to lowest
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
