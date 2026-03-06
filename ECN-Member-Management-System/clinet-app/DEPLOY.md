# Deploying the React app (Static Web App alternatives)

If the GitHub Actions workflow for Azure Static Web Apps fails with "No matching Static Web App was found or the api key was invalid", use one of the options below.

---

## Option 1: Deploy with SWA CLI (recommended short-term)

Deploy from your machine without fixing the GitHub secret. Use this to get the site live quickly.

### Prerequisites

- [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/docs/cli/install/): `npm install -g @azure/static-web-apps-cli`
- Deployment token from Azure: **ecn-members-web-prod** → Overview → **Manage deployment token** (copy or regenerate)

### Steps

1. **Build the app**
   ```cmd
   cd ECN-Member-Management-System\clinet-app
   npm run build
   ```

2. **Deploy to production**
   - **Windows (CMD):**
     ```cmd
     set SWA_CLI_DEPLOY_ENV=production
     swa deploy ./dist --deployment-token "YOUR_TOKEN"
     ```
   - **Script (Windows):** set `SWA_CLI_DEPLOYMENT_TOKEN` to your token, then run `deploy-static.cmd`. Or pass the token: `deploy-static.cmd YOUR_TOKEN`.
   - **Script (Mac/Linux):** `export SWA_CLI_DEPLOYMENT_TOKEN=YOUR_TOKEN` then `./deploy-static.sh`, or `./deploy-static.sh YOUR_TOKEN`.
   - **npm:** set `SWA_CLI_DEPLOYMENT_TOKEN`, then run `npm run deploy:swa` (requires `swa` CLI installed globally).

3. Open your Static Web App URL (e.g. `https://jolly-plant-050774f10.6.azurestaticapps.net`).

**Pros:** No GitHub token fix; works with your existing Azure Static Web App.  
**Cons:** Manual deploy on each update.

---

## Option 2: New Static Web App with GitHub in the wizard

Use when you want CI/CD from GitHub and are okay creating a new Azure resource.

1. Azure Portal → **Create a resource** → **Static Web App**.
2. **Deployment details:** Source = **GitHub**, Organization = **ethiopiancommunity2000-sys**, Repository = **ecn-members-web**, Branch = **main**.
3. **Build details:** App location = `ECN-Member-Management-System/clinet-app`, Output location = `dist`. Api location = leave empty.
4. After creation, copy the **deployment token** (Overview → Manage deployment token).
5. GitHub → **ecn-members-web** → Settings → Secrets and variables → Actions → set **AZURE_STATIC_WEB_APPS_API_TOKEN** to that token.
6. Push to `main` or re-run the "Azure Static Web Apps CI/CD" workflow. Use the **new** Static Web App URL.

**Pros:** Automatic deploy on push; token is correct for the new app.  
**Cons:** New resource and URL; update `public/config.js` or docs if the URL changes.

---

## Option 3: Host the frontend elsewhere

Use when you want to avoid Azure Static Web Apps and token issues.

- **Vercel / Netlify:** Connect the GitHub repo, set app root to `ECN-Member-Management-System/clinet-app`, build command `npm run build`, output `dist`. Set the API URL (e.g. `https://ecn-members-api.azurewebsites.net/api`) in the app config or environment.
- **Azure App Service or Storage:** Build with `npm run build`, then deploy the `dist` folder to an App Service static site or a Storage account static website.

**Pros:** No SWA deployment token; simple CI/CD.  
**Cons:** Different URL or service to manage.
