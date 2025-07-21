#!/bin/bash
set -ex

APP=$1
ENV=$2

if [[ -z "$APP" || -z "$ENV" ]]; then
  echo "Usage: $0 [web|ssr] [dev|uat|prod]"
  exit 1
fi

if [[ "$APP" != "web" && "$APP" != "ssr" ]]; then
  echo "Invalid app: $APP. Must be 'web' or 'ssr'."
  exit 1
fi

if [[ "$ENV" != "dev" && "$ENV" != "uat" && "$ENV" != "prod" ]]; then
  echo "Invalid env: $ENV. Must be 'dev', 'uat', or 'prod'."
  exit 1
fi

declare -A PORTS=(
  ["web_dev"]=1000
  ["web_uat"]=1001
  ["web_prod"]=1002
  ["ssr_dev"]=2000
  ["ssr_uat"]=2001
  ["ssr_prod"]=2002
)

PORT=${PORTS["${APP}_${ENV}"]}

echo "Deploying $APP on $ENV environment at port $PORT..."

git fetch origin

# Öncelikle hedef branch varsa geçiş yap
if git show-ref --verify --quiet refs/heads/$ENV; then
  git checkout $ENV
else
  echo "Branch $ENV bulunamadı, main branch’e geçiliyor"
  git checkout main
fi

git pull origin $ENV || git pull origin main

pnpm install
pnpm build

PM2_NAME="${APP}-${ENV}"

if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
  echo "pm2 process $PM2_NAME reload ediliyor..."
  pm2 reload "$PM2_NAME"
else
  echo "pm2 process $PM2_NAME başlatılıyor..."
  pm2 start pnpm --name "$PM2_NAME" -- run --prefix apps/$APP start -- --port $PORT
fi

echo "Deploy tamamlandı."
