# Azure App Service configuration

To fix **HTTP 500.30 - ASP.NET Core app failed to start**, set these in Azure:

## 1. Application settings

In **Azure Portal** → your App Service (**ecn-members-api-...**) → **Configuration** → **Application settings** → **New application setting**:

| Name | Value |
|------|--------|
| **ConnectionStrings__ECNMembersConnection** | Your Azure SQL connection string (see below) |
| **TokenKey** | A secret string at least 32 characters long (for JWT signing) |

Use **Save** at the top after adding or editing.

### Connection string format (Azure SQL)

```
Server=tcp:YOUR_SERVER.database.windows.net,1433;Initial Catalog=YOUR_DATABASE;Persist Security Info=False;User ID=YOUR_USER;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

- Get **Server**, **Database**, **User ID**, **Password** from: Azure Portal → your **SQL server** → **SQL databases** → your database (e.g. **ecn-members-db**) → **Connection strings**.
- Replace `YOUR_PASSWORD` with the actual admin password.
- In Azure App Service config, the name must be exactly **ConnectionStrings__ECNMembersConnection** (double underscore).

## 2. Allow Azure services to reach SQL (firewall)

Azure Portal → your **SQL server** (e.g. ecn-members-server-3177) → **Networking** (or **Firewalls and virtual networks**):

- Enable **Allow Azure services and resources to access this server** (or add the App Service outbound IP if needed).

## 3. See the real startup error (optional)

To see the exact exception instead of the generic 500.30 page:

- App Service → **App Service logs** (under Monitoring): set **Application Logging** to **File System** or **Log Stream**, **Level** = **Information**, Save.
- Then open **Log stream** (under Monitoring) and restart the app; the exception will appear there.

After setting **ConnectionStrings__ECNMembersConnection** and **TokenKey**, use **Restart** on the App Service Overview so the new config is applied.
