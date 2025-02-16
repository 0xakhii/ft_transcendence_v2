start:
	docker-compose up --build
down:
	docker-compose down
restart:
	docker compose down && docker compose up
build:
	docker compose build
up:
	docker-compose up
stop:
	docker compose stop
rm:
	docker rm $$(docker ps -aq)
rmi:
	docker rmi $$(docker images -aq)
logs:
	docker compose logs
ps:
	docker compose ps