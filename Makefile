.PHONY: backend frontend dev test demo

backend:
	cd backend && uvicorn main:app --reload --port 8000

frontend:
	cd frontend && python -m http.server 80

dev:
	docker-compose up --build

test:
	pytest tests/

demo:
	python demo.py
