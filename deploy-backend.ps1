# PowerShell script to deploy backend to Azure App Service
# Usage: .\deploy-backend.ps1 -ResourceGroup "ecn-members-rg" -AppName "ecn-members-api-xxxxx"

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [string]$ProjectPath = "ECN-Member-Management-System\API"
)

Write-Host "Starting deployment to Azure App Service..." -ForegroundColor Green

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "Azure CLI is not installed. Please install it from https://docs.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

# Check if logged in
$account = az account show 2>$null
if (-not $account) {
    Write-Host "Not logged in to Azure. Logging in..." -ForegroundColor Yellow
    az login
}

# Navigate to project directory
$originalPath = Get-Location
$apiPath = Join-Path $originalPath $ProjectPath

if (-not (Test-Path $apiPath)) {
    Write-Host "API project not found at: $apiPath" -ForegroundColor Red
    exit 1
}

Set-Location $apiPath

try {
    Write-Host "Building project..." -ForegroundColor Yellow
    dotnet publish -c Release -o ./publish
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Creating deployment package..." -ForegroundColor Yellow
    $zipPath = Join-Path $apiPath "deploy.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path "./publish/*" -DestinationPath $zipPath -Force
    
    Write-Host "Deploying to Azure..." -ForegroundColor Yellow
    az webapp deployment source config-zip `
        --resource-group $ResourceGroup `
        --name $AppName `
        --src $zipPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "API URL: https://$AppName.azurewebsites.net" -ForegroundColor Cyan
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
} finally {
    Set-Location $originalPath
    # Cleanup
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    if (Test-Path (Join-Path $apiPath "publish")) {
        Remove-Item (Join-Path $apiPath "publish") -Recurse -Force
    }
}

