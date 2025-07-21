#!/bin/bash
set -e  # Hata olursa scripti durdur

APP=$1    # web veya ssr
ENV=$2    # dev, uat, prod

if [[ -z "$APP" || -z "$ENV" ]]; then
  echo "Usage: ./deploy.sh [web|ssr] [dev|uat|prod]"
  exit 1
fi

echo "Deploying app: $APP to environment: $ENV"

# .env dosyasını uygun ortam dosyasıyla değiştir
if [[ -f "apps/$APP/.env.$ENV" ]]; then
  cp "apps/$APP/.env.$ENV" "apps/$APP/.env"
  echo ".env file set for $ENV environment"
else
  echo "Warning: .env.$ENV file not found for $APP"
fi

# Dependencies yükle
pnpm install

# Build işlemi
pnpm build --prefix "apps/$APP"

# pm2 process name

# Port belirle
case "${APP}-${ENV}" in
  web-dev) PORT=1000 ;;
  web-uat) PORT=1002 ;;
  web-prod) PORT=1001 ;;
  ssr-dev) PORT=2000 ;;
  ssr-uat) PORT=2002 ;;
  ssr-prod) PORT=2001 ;;
  *)
    echo "Unknown app-env combination: $APP-$ENV"
    exit 1
    ;;
esac

PM2_NAME="${PORT}-${APP}-${ENV}"
# pm2 process kontrol et, varsa reload et yoksa start et
pm2 describe "$PM2_NAME" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Reloading existing pm2 process: $PM2_NAME"
  pm2 reload "$PM2_NAME"
else
  echo "Starting new pm2 process: $PM2_NAME"
  pm2 start pnpm --name "$PM2_NAME" -- run --prefix "apps/$APP" start -- --port "$PORT"
fi

echo "Deployment completed: $APP on $ENV environment at port $PORT"
