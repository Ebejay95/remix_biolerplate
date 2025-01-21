#------------------------------------------------------------------------------#
#--------------                       PRINT                       -------------#
#------------------------------------------------------------------------------#

BLACK := \033[90m
RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
MAGENTA := \033[35m
CYAN := \033[36m
X := \033[0m

SUCCESS := \n\
████████████████████████████████████████████████████████████████████████████████\n\
$(X)\n\
$(GREEN)██   ██  ███████  ███████  ██    █$(X)\n\
$(GREEN)█ █ █ █  █        █     █  █ █   █$(X)\n\
$(GREEN)█  █  █  ███████  ███████  █  █  █$(X)\n\
$(GREEN)█     █  █        █   █    █   █ █$(X)\n\
$(GREEN)█     █  ███████  █    ██  █    ██$(X)\n\
$(X)\n\
████████████████████████████████████████████████████████████████████████████████\n\

#------------------------------------------------------------------------------#
#--------------                      GENERAL                      -------------#
#------------------------------------------------------------------------------#

FRONTEND_DEV=app-frontend-dev
BACKEND_DEV=app-backend-dev
FRONTEND_PROD=app-frontend-prod
BACKEND_PROD=app-backend-prod
NETWORK_DEV=app-network-dev
NETWORK_PROD=app-network-prod

#------------------------------------------------------------------------------#
#--------------                       RULES                       -------------#
#------------------------------------------------------------------------------#

.PHONY: all clean fclean re development production container-build container-up container prune enter logs

# Default rule (both development and production)
all: development

# Development-specific setup
development: container-build-dev container-up-dev
	@echo "$(GREEN)Development environment is ready!$(X)"
	@echo "$(CYAN)Frontend available at: http://localhost:3000$(X)"
	@echo "$(CYAN)Backend available at: http://localhost:4000$(X)"

# Production-specific setup
production: container-build-prod container-up-prod
	@echo "$(GREEN)Production environment is ready!$(X)"
	@echo "$(CYAN)Frontend available at: http://localhost:3000$(X)"
	@echo "$(CYAN)Backend available at: http://localhost:4000$(X)"

# Build the development container
container-build-dev:
	@echo "$(YELLOW)Building the development container environment$(X)"
	@docker compose -f ./docker-compose.yml build --no-cache

# Build the production container
container-build-prod:
	@echo "$(YELLOW)Building the production container environment$(X)"
	@docker compose -f ./docker-compose.prod.yml build --no-cache

# Start the development container
container-up-dev:
	@echo "$(YELLOW)Starting the development container environment$(X)"
	@docker compose --env-file .env.development up -d

container-up-prod:
	@echo "$(YELLOW)Starting the production container environment$(X)"
	@docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# Stop and remove containers
prune:
	@echo "$(RED)Stopping and removing development containers...$(X)"
	@docker stop $(FRONTEND_DEV) $(BACKEND_DEV) 2>/dev/null || true
	@docker rm $(FRONTEND_DEV) $(BACKEND_DEV) 2>/dev/null || true
	@echo "$(RED)Stopping and removing production containers...$(X)"
	@docker stop $(FRONTEND_PROD) $(BACKEND_PROD) 2>/dev/null || true
	@docker rm $(FRONTEND_PROD) $(BACKEND_PROD) 2>/dev/null || true
	@echo "$(RED)Removing networks...$(X)"
	@docker network rm $(NETWORK_DEV) 2>/dev/null || true
	@docker network rm $(NETWORK_PROD) 2>/dev/null || true
	@echo "$(GREEN)All containers and networks removed!$(X)"

# Show logs for all containers
logs:
	@if docker ps | grep -q $(FRONTEND_DEV); then \
		echo "$(YELLOW)Development Logs:$(X)"; \
		docker logs $(FRONTEND_DEV); \
		docker logs $(BACKEND_DEV); \
	elif docker ps | grep -q $(FRONTEND_PROD); then \
		echo "$(YELLOW)Production Logs:$(X)"; \
		docker logs $(FRONTEND_PROD); \
		docker logs $(BACKEND_PROD); \
	else \
		echo "$(RED)No containers running$(X)"; \
	fi

# Enter container shell
enter-frontend-dev:
	@docker exec -it $(FRONTEND_DEV) /bin/sh

enter-backend-dev:
	@docker exec -it $(BACKEND_DEV) /bin/sh

enter-frontend-prod:
	@docker exec -it $(FRONTEND_PROD) /bin/sh

enter-backend-prod:
	@docker exec -it $(BACKEND_PROD) /bin/sh

# Stop containers
stop:
	@echo "$(YELLOW)Stopping all containers...$(X)"
	@docker compose -f ./docker-compose.yml down 2>/dev/null || true
	@docker compose -f ./docker-compose.prod.yml down 2>/dev/null || true
	@echo "$(GREEN)All containers stopped!$(X)"

# Restart containers
restart: stop
	@if [ -f ./docker-compose.prod.yml ] && docker ps -a | grep -q $(FRONTEND_PROD); then \
		make production; \
	else \
		make development; \
	fi