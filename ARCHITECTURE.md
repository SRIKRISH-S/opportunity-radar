# Opportunity Radar Architecture

## 6 Python/FastAPI Agents
1. **IngestionAgent** — pulls data points (mocked)
2. **FilingSignalAgent** — scores promoter pledges, insider trades
3. **TechnicalPatternAgent** — detects Golden Cross, RSI, MACD
4. **SentimentShiftAgent** — tracks management commentary shifts via OpenAI (optional)
5. **ScoringAgent** — confluence engine granting 1.35x boost for 3+ matching signals
6. **AISynthesisAgent** — pure-English summaries

## Frontend Components
Zero-dependency HTML/CSS/JS frontend powered by SSE (Server Sent Events) for live chat and polling for signals.
