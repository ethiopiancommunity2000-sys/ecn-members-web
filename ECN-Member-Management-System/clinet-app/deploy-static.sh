#!/usr/bin/env bash
# Deploy React app to Azure Static Web Apps (Option 1 - SWA CLI).
# Set SWA_CLI_DEPLOYMENT_TOKEN to your token from Azure (Manage deployment token),
# or pass it as the first argument: ./deploy-static.sh YOUR_TOKEN

set -e
TOKEN="${1:-$SWA_CLI_DEPLOYMENT_TOKEN}"
if [ -z "$TOKEN" ]; then
  echo "ERROR: Deployment token required."
  echo "Set SWA_CLI_DEPLOYMENT_TOKEN or run: ./deploy-static.sh YOUR_TOKEN"
  echo "Get the token from Azure: Static Web App -> Overview -> Manage deployment token"
  exit 1
fi

echo "Building..."
npm run build

export SWA_CLI_DEPLOY_ENV=production
echo "Deploying to production..."
swa deploy ./dist --deployment-token "$TOKEN" --env production

echo "Done. Open your Static Web App URL to verify."
