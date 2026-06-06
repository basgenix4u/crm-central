# 🚀 CRM Central - Render.com Deployment Guide

## What You Need
- A **Render.com** account (free) → [render.com](https://render.com)
- Your **GitHub account** (already connected to the repo)
- **That's it!** No local installs, no terminal, nothing on your PC.

---

## Step-by-Step Deployment

### STEP 1: Create a Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended — it auto-connects your repos)

---

### STEP 2: Create the PostgreSQL Database
1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name:** `crm-central-db`
   - **Database:** `crmcentral`
   - **User:** `crmcentral`
   - **Region:** Pick closest to you (e.g., Oregon for US, Frankfurt for EU)
   - **Plan:** **Free**
3. Click **"Create Database"**
4. ⏳ Wait 1-2 minutes for it to provision
5. Once ready, click on the database → scroll down to **"Connections"**
6. **Copy these values** (you'll need them in Step 3):
   - `Hostname` (e.g., `dpg-xxxxx.oregon-postgres.render.com`)
   - `Port` (usually `5432`)
   - `Database` (`crmcentral`)
   - `Username` (`crmcentral`)
   - `Password` (the generated password)

---

### STEP 3: Deploy the Backend API
1. From Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: **basgenix4u/crm-central**
3. Configure:
   - **Name:** `crm-central-api`
   - **Region:** Same as your database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** **Docker**
   - **Plan:** **Free**
4. Click **"Advanced"** → **"Add Environment Variable"** and add these:

   | Key | Value |
   |-----|-------|
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DB_HOST` | *(paste Hostname from Step 2)* |
   | `DB_PORT` | `5432` |
   | `DB_NAME` | `crmcentral` |
   | `DB_USERNAME` | `crmcentral` |
   | `DB_PASSWORD` | *(paste Password from Step 2)* |
   | `JWT_SECRET` | `dGhpcyBpcyBhIHZlcnkgbG9uZyBzZWNyZXQga2V5IGZvciBjcm0gY2VudHJhbCBhcHBsaWNhdGlvbiB0aGF0IG5lZWRzIHRvIGJlIGF0IGxlYXN0IDI1NiBiaXRz` |
   | `CORS_ORIGINS` | `*` |
   | `REDIS_HOST` | *(leave empty)* |
   | `CACHE_TYPE` | `simple` |

5. Click **"Create Web Service"**
6. ⏳ First build takes **5-10 minutes** (it's compiling Java + downloading dependencies)
7. When done, you'll get a URL like: `https://crm-central-api.onrender.com`
8. Test it: Visit `https://crm-central-api.onrender.com/api/actuator/health`
   - Should return: `{"status":"UP"}`

---

### STEP 4: Deploy the Frontend
1. From Dashboard, click **"New +"** → **"Static Site"**
2. Connect repo: **basgenix4u/crm-central**
3. Configure:
   - **Name:** `crm-central-app`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build -- --configuration production`
   - **Publish Directory:** `dist/crm-central/browser`
4. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `20` |

5. Click **"Create Static Site"**
6. ⏳ Build takes **3-5 minutes**
7. You'll get a URL like: `https://crm-central-app.onrender.com`

---

### STEP 5: Connect Frontend to Backend
The frontend needs to know where the API is. Two options:

**Option A: Update frontend environment file** (recommended)
1. In your GitHub repo, edit `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://crm-central-api.onrender.com/api/v1',  // your actual backend URL
  wsUrl: 'wss://crm-central-api.onrender.com/ws'
};
```
2. Commit & push → Render auto-redeploys

**Option B: Add Redirect Rules in Render**
1. Go to your Static Site → **Redirects/Rewrites**
2. Add a rewrite rule:
   - Source: `/api/*`
   - Destination: `https://crm-central-api.onrender.com/api/*`
   - Action: **Rewrite**

---

### STEP 6: Update CORS on Backend
1. Go to your backend Web Service on Render
2. Update the `CORS_ORIGINS` environment variable:
   ```
   https://crm-central-app.onrender.com
   ```
3. The service auto-restarts

---

## 🎉 You're Live!

### Access Your CRM:
- **Frontend:** `https://crm-central-app.onrender.com`
- **Backend API:** `https://crm-central-api.onrender.com/api`
- **Swagger Docs:** `https://crm-central-api.onrender.com/api/swagger-ui.html`

### Default Login:
```
Email:    admin@crmcentral.com
Password: Admin@123
```

### Other Test Users:
| User | Email | Password | Role |
|------|-------|----------|------|
| John Smith | john.smith@crmcentral.com | Password@123 | Sales Manager |
| Sarah Johnson | sarah.johnson@crmcentral.com | Password@123 | Sales Rep |
| Mike Wilson | mike.wilson@crmcentral.com | Password@123 | Support Agent |
| Emily Davis | emily.davis@crmcentral.com | Password@123 | Marketing Manager |

---

## ⚠️ Important Notes About Free Tier

### Render Free Tier Limitations:
1. **Backend spins down after 15 min of inactivity**
   - First request after sleep takes ~30-60 seconds (cold start)
   - After that it's fast
2. **PostgreSQL free tier expires after 90 days**
   - You can recreate it or upgrade to $7/mo
3. **750 free hours/month** for web services
   - More than enough for testing/demo

### Tips:
- Use [UptimeRobot](https://uptimerobot.com) (free) to ping your backend every 14 minutes to keep it alive
- If build fails, check the logs in Render dashboard → "Events" tab

---

## 🔧 Troubleshooting

### "Build failed" on backend?
- Check if `Root Directory` is set to `backend`
- Check if Docker is selected as runtime

### "API not responding"?
- Wait 30-60 seconds (cold start on free tier)
- Check health: `https://your-api-url.onrender.com/api/actuator/health`

### "Login not working"?
- Make sure backend deployed successfully (check Render logs)
- Check CORS_ORIGINS includes your frontend URL
- The DataSeeder creates users on first startup — check backend logs

### "Frontend shows blank page"?
- Make sure `Publish Directory` is `dist/crm-central/browser`
- Check build logs for errors
- Verify environment.prod.ts has correct API URL
