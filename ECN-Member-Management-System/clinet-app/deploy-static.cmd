@echo off
REM Deploy React app to Azure Static Web Apps (Option 1 - SWA CLI).
REM Set SWA_CLI_DEPLOYMENT_TOKEN to your token from Azure (Manage deployment token),
REM or pass it as the first argument: deploy-static.cmd YOUR_TOKEN

setlocal
set "TOKEN=%1"
if "%TOKEN%"=="" set "TOKEN=%SWA_CLI_DEPLOYMENT_TOKEN%"
if "%TOKEN%"=="" (
  echo ERROR: Deployment token required.
  echo Set SWA_CLI_DEPLOYMENT_TOKEN or run: deploy-static.cmd YOUR_TOKEN
  echo Get the token from Azure: Static Web App -^> Overview -^> Manage deployment token
  exit /b 1
)

echo Building...
call npm run build
if errorlevel 1 exit /b 1

set SWA_CLI_DEPLOY_ENV=production
echo Deploying to production...
call swa deploy ./dist --deployment-token "%TOKEN%" --env production
if errorlevel 1 exit /b 1

echo Done. Open your Static Web App URL to verify.
endlocal
