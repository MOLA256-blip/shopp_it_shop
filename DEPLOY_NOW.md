# 🚀 Deploy to Render - Quick Guide

## ✅ What I Fixed

1. **Created `.npmrc`** - Tells npm to use `--legacy-peer-deps`
2. **Created `render.yaml`** - Automated Render configuration
3. **Committed changes** - Ready to push

---

## 📋 Steps to Deploy (Do This Now)

### Step 1: Push to GitHub

Open Git Bash or Command Prompt and run:

```bash
cd C:\Users\junior\Desktop\---shoppit_app
git push origin master
```

**If it asks for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

**Don't have a token?**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select: `repo` scope
4. Copy the token and use it as password

---

### Step 2: Configure Render (If Not Using render.yaml)

**Only if Render doesn't auto-detect render.yaml:**

1. Go to: https://dashboard.render.com
2. Select your frontend service
3. Go to **Settings**
4. Update **Build Command** to:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
5. Click **Save Changes**

---

### Step 3: Set Environment Variables

In Render Dashboard → Your Frontend Service → Environment:

**Add these:**
```
VITE_FLUTTERWAVE_PUBLIC_KEY = FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X
VITE_BASE_URL = https://my-shop-app-c1kx.onrender.com
```

Click **Save**

---

### Step 4: Deploy

**Option A - Auto Deploy (if enabled):**
- Just push to GitHub
- Render will automatically deploy

**Option B - Manual Deploy:**
1. Go to your service on Render
2. Click **Manual Deploy**
3. Select **Deploy latest commit**
4. Monitor the logs

---

## ✅ Expected Result

The build should now succeed with output like:
```
==> Installing dependencies with npm...
npm install --legacy-peer-deps
...
added 309 packages
==> Building with npm run build...
✓ built in 15s
```

---

## 🧪 Test After Deployment

1. Visit your Render URL
2. Go to checkout page
3. Click "Pay with Flutterwave"
4. **Check console** - No "API key required" error! ✅
5. Flutterwave modal should open

---

## 🆘 If Build Still Fails

Let me know and I can switch to an alternative approach using Flutterwave's inline script instead of the React package.

---

## 📝 Summary of Changes

**Files Added:**
- `.npmrc` - Forces legacy peer deps
- `render.yaml` - Render configuration
- `RENDER_DEPLOYMENT_FIX.md` - Documentation

**Files Modified:**
- `PaymentSection.jsx` - Uses Flutterwave SDK directly
- `package.json` - Has flutterwave-react-v3

**Already Committed:** ✅
**Ready to Push:** ✅

---

## 🎯 Next Action

**Run this command now:**
```bash
git push origin master
```

Then watch Render deploy automatically! 🚀
