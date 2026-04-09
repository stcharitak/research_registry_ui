.PHONY: up down restart logs clean

up:
	docker compose up -d --build --force-recreate

dev:
	docker compose -f docker-compose.dev.yml build --no-cache
	docker compose -f docker-compose.dev.yml up --watch

down:
	docker compose down --remove-orphans
	docker rm -f research_registry_ui_dev 2>/dev/null || true
	docker image ls | grep research_registry_ui

restart:
	docker compose down
	docker compose up -d --build

clean:
	docker compose down -v --remove-orphans
	docker system prune -f

logs:
	docker compose logs -f