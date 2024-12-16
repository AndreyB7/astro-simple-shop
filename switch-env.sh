#!/bin/bash

# Script to switch between development and production environments

ENV_TYPE=$1
CURRENT_DIR=$(pwd)

if [ "$ENV_TYPE" = "dev" ] || [ "$ENV_TYPE" = "development" ]; then
    echo "Switching to development environment..."
    cp "$CURRENT_DIR/.env.development" "$CURRENT_DIR/.env"
    echo "Development environment activated"
elif [ "$ENV_TYPE" = "prod" ] || [ "$ENV_TYPE" = "production" ]; then
    if [ -f "$CURRENT_DIR/.env.production" ]; then
        echo "Switching to production environment..."
        cp "$CURRENT_DIR/.env.production" "$CURRENT_DIR/.env"
        echo "Production environment activated"
    else
        echo "Error: Production environment file (.env.production) not found"
        exit 1
    fi
else
    echo "Usage: ./switch-env.sh [dev|prod]"
    echo "  dev  - Switch to development environment"
    echo "  prod - Switch to production environment"
    exit 1
fi
