import time
import os

def run_demo():
    print("🚀 Launching Opportunity Radar Demo...")
    time.sleep(1)
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  Warning: OPENAI_API_KEY is not set. AI Synthesis and Sentiment agents will run in mock mode.")
    time.sleep(1)
    
    print("✅ Configuration checked.")
    print("Starting backend and frontend... (Note: in a real environment, run 'docker-compose up --build')")
    print("Or to run locally, use 'make dev'")

if __name__ == "__main__":
    run_demo()
