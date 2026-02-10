# Azure Deployment Guide for ECN Member Management System

This guide will help you deploy your full-stack application to Azure.

## Prerequisites

1. **Azure Account** - Sign up at [azure.com](https://azure.com)
2. **Azure CLI** - Install from [docs.microsoft.com](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **.NET SDK 9.0** - Already installed
4. **Node.js** - Already installed

## Architecture Overview

- **Backend**: Azure App Service (ASP.NET Core API)
- **Frontend**: Azure Static Web Apps or Azure App Service
- **Database**: Azure SQL Database
- **Storage**: Azure Blob Storage (for file uploads - optional)

## Step 1: Create Azure Resources

### Option A: Using Azure Portal (Recommended for beginners)

1. **Create Resource Group**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Click "Create a resource" → "Resource group"
   - Name: `ecn-members-rg`
   - Region: Choose closest to you
   - Click "Create"

2. **Create Azure SQL Database**
   - In your resource group, click "Create"
   - Search for "SQL Database"
   - Click "Create"
   - **Basics**:
     - Database name: `ecn-members-db`
     - Server: Create new
       - Server name: `ecn-members-server-[your-unique-id]`
       - Location: Same as resource group
       - Authentication: SQL authentication
       - Admin login: `sqladmin` (or your choice)
       - Password: Create strong password (save it!)
     - Want to use SQL elastic pool: No
     - Compute + storage: Basic (5 DTU) for testing, or S2 (50 DTU) for production
   - **Networking**:
     - Connectivity method: Public endpoint
     - Firewall rules: Allow Azure services: Yes
     - Add current client IP address: Yes
   - Click "Review + create" → "Create"
   - **IMPORTANT**: Note down the connection string from the database overview page

3. **Create App Service Plan**
   - In resource group, click "Create"
   - Search for "App Service Plan"
   - Click "Create"
   - **Basics**:
     - Name: `ecn-members-plan`
     - OS: Linux (or Windows)
     - Region: Same as resource group
     - Pricing tier: Basic B1 (for testing) or Standard S1 (for production)
   - Click "Review + create" → "Create"

4. **Create Web App (Backend API)**
   - In resource group, click "Create"
   - Search for "Web App"
   - Click "Create"
   - **Basics**:
     - Name: `ecn-members-api-[your-unique-id]`
     - Publish: Code
     - Runtime stack: .NET 9
     - Operating System: Linux (or Windows)
     - Region: Same as resource group
     - App Service Plan: Select the plan created above
   - Click "Review + create" → "Create"

5. **Create Static Web App (Frontend)**
   - In resource group, click "Create"
   - Search for "Static Web App"
   - Click "Create"
   - **Basics**:
     - Name: `ecn-members-web-[your-unique-id]`
     - Hosting plan: Free (or Standard for production)
     - Region: Same as resource group
     - Source: Other
   - Click "Review + create" → "Create"

### Option B: Using Azure CLI (Faster)

Run these commands in PowerShell or Azure Cloud Shell:

```powershell
# Login to Azure
az login

# Set variables
$resourceGroup = "ecn-members-rg"
$location = "eastus"  # Change to your preferred region
$sqlServerName = "ecn-members-server-$(Get-Random)"
$sqlAdminUser = "sqladmin"
$sqlAdminPassword = "YourStrongPassword123!"  # Change this!
$databaseName = "ecn-members-db"
$appServicePlan = "ecn-members-plan"
$apiAppName = "ecn-members-api-$(Get-Random)"
$webAppName = "ecn-members-web-$(Get-Random)"

# Create resource group
az group create --name $resourceGroup --location $location

# Create SQL Server
az sql server create `
  --name $sqlServerName `
  --resource-group $resourceGroup `
  --location $location `
  --admin-user $sqlAdminUser `
  --admin-password $sqlAdminPassword

# Configure SQL Server firewall
az sql server firewall-rule create `
  --resource-group $resourceGroup `
  --server $sqlServerName `
  --name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

az sql server firewall-rule create `
  --resource-group $resourceGroup `
  --server $sqlServerName `
  --name AllowMyIP `
  --start-ip-address $(Invoke-RestMethod -Uri "https://api.ipify.org").Content `
  --end-ip-address $(Invoke-RestMethod -Uri "https://api.ipify.org").Content

# Create SQL Database
az sql db create `
  --resource-group $resourceGroup `
  --server $sqlServerName `
  --name $databaseName `
  --service-objective Basic

# Create App Service Plan
az appservice plan create `
  --name $appServicePlan `
  --resource-group $resourceGroup `
  --location $location `
  --sku B1 `
  --is-linux

# Create Web App for API
az webapp create `
  --name $apiAppName `
  --resource-group $resourceGroup `
  --plan $appServicePlan `
  --runtime "DOTNET|9.0"

# Create Static Web App
az staticwebapp create `
  --name $webAppName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Free

# Output connection details
Write-Host "SQL Server: $sqlServerName.database.windows.net"
Write-Host "Database: $databaseName"
Write-Host "API App: https://$apiAppName.azurewebsites.net"
Write-Host "Web App: https://$webAppName.azurestaticapps.net"
```

## Step 2: Configure Backend (API)

### 2.1 Update Connection String

1. In Azure Portal, go to your Web App (API)
2. Go to **Configuration** → **Application settings**
3. Click **+ New application setting**
4. Add:
   - **Name**: `ConnectionStrings__ECNMembersConnection`
   - **Value**: `Server=tcp:YOUR_SERVER_NAME.database.windows.net,1433;Initial Catalog=ecn-members-db;Persist Security Info=False;User ID=sqladmin;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`
   - Replace `YOUR_SERVER_NAME` and `YOUR_PASSWORD` with your actual values
5. Click **Save**

### 2.2 Add Other Settings

Add these application settings:

- **Name**: `TokenKey`
  - **Value**: Generate a strong random key (at least 32 characters)
  - Example: `MySuperSecretKeyForJWTTokenGeneration123456789`

- **Name**: `ASPNETCORE_ENVIRONMENT`
  - **Value**: `Production`

- **Name**: `ASPNETCORE_URLS`
  - **Value**: (leave empty, Azure will set this)

### 2.3 Update CORS

You'll need to update the CORS policy in `Program.cs` to allow your frontend URL.

## Step 3: Deploy Backend

### Option A: Using Visual Studio

1. Right-click on the **API** project
2. Select **Publish**
3. Choose **Azure** → **Azure App Service (Linux)**
4. Select your subscription and the Web App you created
5. Click **Publish**

### Option B: Using Azure CLI

```powershell
# Navigate to API project
cd ECN-Member-Management-System/API

# Publish
dotnet publish -c Release -o ./publish

# Create deployment package
Compress-Archive -Path ./publish/* -DestinationPath ./deploy.zip -Force

# Deploy to Azure
az webapp deployment source config-zip `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --src ./deploy.zip
```

### Option C: Using GitHub Actions (Recommended for CI/CD)

See the `.github/workflows` folder for GitHub Actions workflows.

## Step 4: Configure Frontend

### 4.1 Update API URL

Create a `.env.production` file in `clinet-app`:

```env
VITE_API_URL=https://YOUR_API_APP_NAME.azurewebsites.net/api
```

Replace `YOUR_API_APP_NAME` with your actual API app name.

### 4.2 Update CORS in Backend

Update `Program.cs` to include your frontend URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
        policy.WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "https://YOUR_WEB_APP_NAME.azurestaticapps.net"  // Add this
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});
```

## Step 5: Deploy Frontend

### Option A: Using Azure Static Web Apps CLI

```powershell
# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Navigate to frontend
cd ECN-Member-Management-System/clinet-app

# Build
npm run build

# Deploy
swa deploy ./dist --deployment-token YOUR_DEPLOYMENT_TOKEN --env production
```

Get the deployment token from:
- Azure Portal → Your Static Web App → **Manage deployment token**

### Option B: Using GitHub Actions

1. Push your code to GitHub
2. In Azure Portal, go to your Static Web App
3. Click **GitHub** → **Authorize**
4. Select your repository and branch
5. Azure will automatically create a GitHub Actions workflow

### Option C: Manual Deployment

1. Build the frontend:
   ```powershell
   cd ECN-Member-Management-System/clinet-app
   npm install
   npm run build
   ```

2. Upload the `dist` folder contents to your Static Web App using Azure Portal or Azure Storage Explorer

## Step 6: Run Database Migrations

The migrations should run automatically on startup (see `Program.cs`), but you can also run them manually:

```powershell
# From the API project directory
dotnet ef database update --project ../Persistence --startup-project .
```

Or use Azure Cloud Shell:
```bash
# Install .NET in Cloud Shell
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin

# Run migrations (you'll need to upload your project or use Azure DevOps)
```

## Step 7: Verify Deployment

1. **Test API**: Visit `https://YOUR_API_APP_NAME.azurewebsites.net/api/members`
2. **Test Frontend**: Visit `https://YOUR_WEB_APP_NAME.azurestaticapps.net`
3. **Check Logs**:
   - API: Azure Portal → Your Web App → **Log stream**
   - Frontend: Azure Portal → Your Static Web App → **Logs**

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is in CORS policy
   - Check that `AllowCredentials()` is set if using cookies

2. **Database Connection Errors**
   - Verify connection string is correct
   - Check firewall rules allow Azure services
   - Ensure SQL Server firewall allows your IP

3. **404 Errors on Frontend Routes**
   - Configure fallback routes in Static Web App
   - Add `routes.json` to handle SPA routing

4. **Environment Variables Not Working**
   - Restart the App Service after adding settings
   - Verify variable names match exactly (case-sensitive)

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use Azure Key Vault** for sensitive data
3. **Enable HTTPS only** in App Service settings
4. **Use managed identity** for database connections (advanced)
5. **Enable Application Insights** for monitoring
6. **Set up backup** for SQL Database

## Cost Optimization

- Use **Free tier** for Static Web Apps (testing)
- Use **Basic B1** for App Service (testing)
- Use **Basic** tier for SQL Database (testing)
- Consider **Azure Dev/Test pricing** if eligible
- Monitor usage in Azure Cost Management

## Next Steps

1. Set up **Application Insights** for monitoring
2. Configure **custom domain** names
3. Set up **SSL certificates**
4. Implement **CI/CD pipelines**
5. Configure **backup and disaster recovery**

## Support

- [Azure Documentation](https://docs.microsoft.com/azure)
- [Azure Support](https://azure.microsoft.com/support)
- [Stack Overflow - Azure](https://stackoverflow.com/questions/tagged/azure)

