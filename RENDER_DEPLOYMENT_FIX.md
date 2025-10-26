# Fix Render Deployment - React Version Conflict

## Problem
Render build fails with:
```
npm error peer react@"^15.0.0 || ^18.0.0" from flutterwave-react-v3@1.3.2
```

## Solution Applied

### 1. Created `.npmrc` file
This tells npm to use legacy peer deps during installation.

### 2. Created `render.yaml` 
Configures Render to use the correct build command.

### 3. Updated Build Command
Changed from `npm install` to `npm install --legacy-peer-deps`

---

## Deployment Steps

### Step 1: Commit Changes
```bash
cd C:\Users\junior\Desktop\---shoppit_app
git add .
git commit -m "Fix Render deployment with legacy peer deps"
git push origin main
```

### Step 2: Update Render Build Settings

**Option A - Use render.yaml (Recommended):**
- Render will automatically detect `render.yaml`
- No manual configuration needed
- Just push and deploy

**Option B - Manual Configuration:**
1. Go to Render Dashboard
2. Select your frontend service
3. Go to "Settings"
4. Update **Build Command** to:
   ```
   npm install --legacy-peer-deps && npm run build
   ```
5. Update **Start Command** to:
   ```
   npm run preview
   ```
6. Click "Save Changes"

### Step 3: Set Environment Variables

In Render Dashboard → Your Service → Environment:

Add these variables:
- **VITE_FLUTTERWAVE_PUBLIC_KEY** = `FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X`
- **VITE_BASE_URL** = `https://my-shop-app-c1kx.onrender.com`

### Step 4: Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Or push to trigger auto-deploy
3. Monitor logs for successful build

---

## What Was Fixed

✅ **Added `.npmrc`** - Forces legacy peer deps
✅ **Created `render.yaml`** - Automated Render configuration
✅ **Updated build command** - Uses `--legacy-peer-deps` flag
✅ **Flutterwave SDK** - Now properly installed despite React 19

---

## Verify Deployment

After deployment succeeds:

1. ✅ Visit your Render URL
2. ✅ Go to checkout page
3. ✅ Click "Pay with Flutterwave"
4. ✅ Flutterwave modal should open
5. ✅ No console errors about API key

---

## Alternative: Use Flutterwave Inline Script (If Issues Persist)

If the package still causes issues, we can switch to Flutterwave's inline script instead of the React package. Let me know if you need this alternative approach.

---

## Files Changed

- ✅ `.npmrc` - New file
- ✅ `render.yaml` - New file
- ✅ `package.json` - Already has flutterwave-react-v3
- ✅ `PaymentSection.jsx` - Already updated to use SDK

---

## Next Steps

1. **Commit and push** the new files (`.npmrc` and `render.yaml`)
2. **Redeploy** on Render
3. **Test** the payment flow

The build should now succeed! 🎉
