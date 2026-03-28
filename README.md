# Opportunity Radar

AI-powered FinTech dashboard that pipelines 6 algorithmic agents. 

## Setup Instructions
1. Navigate into this folder `cd opportunity-radar`
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Launch with Docker: `docker-compose up --build`
   *If you do not have docker, launch backend with `cd backend && uvicorn main:app --port 8000` and frontend with `cd frontend && python -m http.server 80`*
4. Access at `http://localhost` (or the respective port you launched on).

Set `OPENAI_API_KEY` for OpenAI model features.
