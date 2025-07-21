#!/bin/bash

set -e

APP=$1
ENV=$2

if [[ -z "$APP" || -z "$ENV" ]]; then
  echo "Usage: ./deploy.sh <web|ssr> <dev|uat|prod>"
  exit 1
fi

echo "Deploying app: $APP to environment: $ENV"

### 1. Submodule güncelle
echo "Updating git submodules..."
git submodule update --init --recursive
git submodule foreach git pull origin $(git rev-parse --abbrev-ref HEAD)

### 2. Ortama özel .env dosyasını kopyala
ENV_FILE="./apps/$APP/.env.$ENV"
TARGET_ENV_FILE="./apps/$APP/.env"

if [[ -f "$ENV_FILE" ]]; then
  cp "$ENV_FILE" "$TARGET_ENV_FILE"
  echo ".env file set for $ENV environment"
else
  echo "Warning: $ENV_FILE not found for $APP"
fi

### 3. Bağımlılıkları yükle (lockfile güncelliği zorlanmaz)
pnpm install --no-frozen-lockfile

### 4. Build
pnpm build --filter "apps/$APP"

### 5. Port belirle
case "${APP}-${ENV}" in
  web-dev)   PORT=1000 ;;
  web-uat)   PORT=1001 ;;
  web-prod)  PORT=1002 ;;
  ssr-dev)   PORT=2000 ;;
  ssr-uat)   PORT=2001 ;;
  ssr-prod)  PORT=2002 ;;
  *)         echo "Invalid app/environment combination"; exit 1 ;;
esac

### 6. PM2 ile restart
PROCESS_NAME="${APP}-${ENV}"

echo "Restarting with PM2 as: $PROCESS_NAME on port $PORT"

pm2 delete "$PROCESS_NAME" >/dev/null 2>&1 || true

PORT=$PORT pm2 start "apps/$APP" \
  --name "$PROCESS_NAME" \
  --interpreter bash \
  -- start

### 7. Durumu göster
pm2 save
pm2 status "$PROCESS_NAME"
