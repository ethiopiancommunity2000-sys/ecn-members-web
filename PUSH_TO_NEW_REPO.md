# Push this project to the new GitHub repo (ecn-members-web)

Your remote is already set to: **https://github.com/ethiopiancommunity2000-sys/ecn-members-web.git**

Rebase has been aborted; you are on `main` with your changes. Follow the steps below.

---

## Step 1: Stage your project (source code)

**Option A – Add only your current changes (recommended):**

```powershell
cd "c:\Users\ghail\OneDrive\Desktop\ECN_Mem"
git add ECN-Member-Management-System/API/Services/TokenService.cs
git add ECN-Member-Management-System/API/appsettings.json
git add ECN-Member-Management-System/Application/
git add ECN-Member-Management-System/Domain/
git add ECN-Member-Management-System/clinet-app/
git add PUSH_TO_NEW_REPO.md
```

**Option B – Add everything in the repo (including bin/obj):**

```powershell
cd "c:\Users\ghail\OneDrive\Desktop\ECN_Mem"
git add -A
```

---

## Step 2: Commit

```powershell
git commit -m "ECN Member Management System - full project for ecn-members-web"
```

---

## Step 3: Push to the new repo

Because the repo was recreated (empty or different history), use **force push** so your local `main` becomes the repo’s `main`:

```powershell
git push -u origin main --force
```

If you prefer not to force push and the new repo is **completely empty**, you can try:

```powershell
git push -u origin main
```

Use `--force` only when you are sure the remote can be overwritten (e.g. new empty repo).

---

## Step 4: Confirm on GitHub

Open: **https://github.com/ethiopiancommunity2000-sys/ecn-members-web**  
You should see your code on the `main` branch.

---

## If the remote URL is different

If your new repo has a different URL (e.g. different org or repo name), set it and push:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/ecn-members-web.git
git push -u origin main --force
```

Replace `YOUR_USERNAME` with your GitHub username or org.
