.PHONY: up down restart logs clean

up:
	docker compose up -d --build --force-recreate

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d --build

clean:
	docker compose down -v --remove-orphans
	docker system prune -f

logs:
	docker compose logs -f