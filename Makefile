DOCKER_BUILD_BASE := docker-compose -f docker-compose.yml

build-frontend-server:
	docker build -t together_frontend:latest -f ./deployments/Dockerfile .
	$(DOCKER_BUILD_BASE) build together_frontend

start-frontend-server:
	$(DOCKER_BUILD_BASE) up -d together_frontend

stop-frontend-server:
	$(DOCKER_BUILD_BASE) down
