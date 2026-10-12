.PHONY: run front-build

all: run

front-build:
	cd frontend && npm run build

front-dev:
	cd frontend && npm run dev

run: front-build
	cd backend && cargo run