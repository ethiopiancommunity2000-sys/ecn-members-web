# Quick Start: Deploy to Azure

## Prerequisites
- Azure account
- Azure CLI installed
- PowerShell (Windows) or Bash (Linux/Mac)

## Quick Deployment Steps

### 1. Login to Azure
```powershell
az login
```

### 2. Set Variables
```powershell
$resourceGroup = "ecn-members-rg"
$location = "eastus"
$sqlServerName = "ecn-members-server-$(Get-Random)"
$sqlAdminPassword = "YourStrongPassword123!"
$apiAppName = "ecn-members-api-$(Get-Random)"
$webAppName = "ecn-members-web-$(Get-Random)"
```

### 3. Create Resources (Run the script from AZURE_DEPLOYMENT_GUIDE.md)

### 4. Deploy Backend
```powershell
.\deploy-backend.ps1 -ResourceGroup $resourceGroup -AppName $apiAppName
```

### 5. Configure Backend Settings in Azure Portal
- Go to your Web App → Configuration → Application settings
- Add:
  - `ConnectionStrings__ECNMembersConnection` = Your SQL connection string
  - `TokenKey` = A strong random key (32+ characters)
  - `Cors__AllowedOrigins__0` = `https://$webAppName.azurestaticapps.net`

### 6. Deploy Frontend
```powershell
.\deploy-frontend.ps1 -ResourceGroup $resourceGroup -AppName $webAppName -ApiUrl "https://$apiAppName.azurewebsites.net/api"
```

### 7. Test
- Frontend: `https://$webAppName.azurestaticapps.net`
- API: `https://$apiAppName.azurewebsites.net/api/members`

## Troubleshooting

**CORS Errors?**
- Make sure frontend URL is in CORS settings
- Restart the App Service after changing settings

**Database Connection Errors?**
- Check firewall rules in SQL Server
- Verify connection string format
- Ensure "Allow Azure services" is enabled

**Frontend Not Loading?**
- Check browser console for errors
- Verify `.env.production` has correct API URL
- Check Static Web App logs in Azure Portal

