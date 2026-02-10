# PowerShell script to deploy frontend to Azure Static Web Apps
# Usage: .\deploy-frontend.ps1 -ResourceGroup "ecn-members-rg" -AppName "ecn-members-web-xxxxx" -ApiUrl "https://ecn-members-api-xxxxx.azurewebsites.net/api"

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl,
    
    [string]$ProjectPath = "ECN-Member-Management-System\clinet-app"
)

Write-Host "Starting frontend deployment to Azure Static Web Apps..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install it from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Navigate to project directory
$originalPath = Get-Location
$frontendPath = Join-Path $originalPath $ProjectPath

if (-not (Test-Path $frontendPath)) {
    Write-Host "Frontend project not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

Set-Location $frontendPath

try {
    # Create .env.production file
    Write-Host "Creating production environment file..." -ForegroundColor Yellow
    $envContent = "VITE_API_URL=$ApiUrl"
    $envFile = Join-Path $frontendPath ".env.production"
    Set-Content -Path $envFile -Value $envContent -Force
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Check if SWA CLI is installed
    if (-not (Get-Command swa -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Azure Static Web Apps CLI..." -ForegroundColor Yellow
        npm install -g @azure/static-web-apps-cli
    }
    
    # Get deployment token
    Write-Host "Retrieving deployment token..." -ForegroundColor Yellow
    $token = az staticwebapp secrets list `
        --name $AppName `
        --resource-group $ResourceGroup `
        --query "properties.apiKey" `
        --output tsv
    
    if (-not $token) {
        Write-Host "Failed to retrieve deployment token. Please get it manually from Azure Portal." -ForegroundColor Red
        Write-Host "Azure Portal → Static Web App → Manage deployment token" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Deploying to Azure..." -ForegroundColor Yellow
    swa deploy ./dist `
        --deployment-token $token `
        --env production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "Frontend URL: https://$AppName.azurestaticapps.net" -ForegroundColor Cyan
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
} finally {
    Set-Location $originalPath
}

