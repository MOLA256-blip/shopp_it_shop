# Production Redirect Still Not Working - Advanced Troubleshooting

## 🚨 Issue
After adding environment variables, Flutterwave still doesn't redirect back on production.

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Verify Deployment Completed

1. Go to: https://dashboard.render.com
2. Click: **my-shop-app-c1kx** (backend)
3. Check status at top:
   - ✅ **"Live"** with green dot = Deployment complete
   - ⏳ **"Deploying..."** = Still deploying (wait)
   - ❌ **"Deploy failed"** = Check logs for errors

**If still deploying:** Wait 5-10 more minutes, then test again.

**If deploy failed:** Check logs tab for error messages.

---

### Step 2: Verify Environment Variables Are Set

On Render backend:

1. Click **Environment** tab
2. Verify these variables exist with correct values:

```
✅ FRONTEND_URL = https://new-shop-zvmq.onrender.com
✅ FRONTEND_BASE_URL = https://new-shop-zvmq.onrender.com
✅ FLUTTERWAVE_PUBLIC_KEY = FLWPUBK_TEST-...
✅ FLUTTERWAVE_SECRET_KEY = FLWSECK_TEST-...
```

**Check for common mistakes:**
- ❌ Trailing slash: `https://new-shop-zvmq.onrender.com/` (WRONG)
- ✅ No trailing slash: `https://new-shop-zvmq.onrender.com` (CORRECT)
- ❌ HTTP instead of HTTPS
- ❌ Typo in domain name
- ❌ Extra spaces in values

---

### Step 3: Check Backend Logs

1. Go to backend service on Render
2. Click **Logs** tab
3. Try initiating a payment on your site
4. Look for this in logs:

**What you SHOULD see:**
```
🔍 Flutterwave Payment Initiation:
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Flutterwave Response Status: 200
```

**What indicates a problem:**
```
Redirect URL: http://localhost:5173/payment/status  ← WRONG (localhost)
Redirect URL: None  ← Variable not loaded
Flutterwave Response Status: 401  ← Invalid API keys
```

---

### Step 4: Test Backend Directly

Check if backend is loading the variable:

1. On Render, click **Shell** tab
2. Run this command:
```bash
echo $FRONTEND_URL
```

**Expected output:**
```
https://new-shop-zvmq.onrender.com
```

**If empty or shows nothing:** Variable not set correctly.

---

### Step 5: Check Browser Console

1. Open your site: https://new-shop-zvmq.onrender.com
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Click "Pay with Flutterwave"
5. Look for errors

**Common errors:**
- `Network Error` → Backend not responding
- `401 Unauthorized` → User not logged in or token expired
- `CORS error` → CORS not configured
- `500 Internal Server Error` → Backend crash

---

### Step 6: Check Network Tab

1. Keep DevTools open (F12)
2. Go to **Network** tab
3. Click "Pay with Flutterwave"
4. Look for request to: `/api/payments/flutterwave/initiate/`
5. Click on it
6. Check **Response** tab

**What you should see:**
```json
{
  "payment_link": "https://checkout.flutterwave.com/v3/hosted/pay/..."
}
```

**If you see an error:**
```json
{
  "error": "Cart not found"
}
```
or
```json
{
  "error": "Invalid API key"
}
```

This tells you what's wrong.

---

## 🔧 Common Issues & Fixes

### Issue 1: Variables Not Loading

**Symptoms:**
- Logs show `localhost:5173` instead of production URL
- Shell shows empty when checking `$FRONTEND_URL`

**Fix:**
1. Delete the variable on Render
2. Add it again (copy-paste carefully)
3. Make sure no extra spaces
4. Click "Save Changes"
5. Wait for redeployment
6. Verify in Shell: `echo $FRONTEND_URL`

---

### Issue 2: Deployment Not Completing

**Symptoms:**
- Status stuck on "Deploying..." for more than 15 minutes
- Deploy fails repeatedly

**Fix:**
1. Check Logs tab for error messages
2. Common errors:
   - Build error → Check code syntax
   - Out of memory → Upgrade plan or optimize
   - Dependency error → Check requirements.txt
3. Try manual redeploy:
   - Click "Manual Deploy" button
   - Select "Clear build cache & deploy"

---

### Issue 3: CORS Blocking Requests

**Symptoms:**
- Browser console shows CORS errors
- Network requests fail with CORS policy error

**Fix:**
Check backend `settings.py` has:
```python
CORS_ALLOWED_ORIGINS = [
    "https://new-shop-zvmq.onrender.com",
]
# Or
CORS_ALLOW_ALL_ORIGINS = True
```

If not, you need to update the code and push to GitHub.

---

### Issue 4: Flutterwave Keys Invalid

**Symptoms:**
- "API key required" error
- 401 response from Flutterwave
- Payment link not generated

**Fix:**
1. Go to Flutterwave dashboard
2. Settings → API Keys
3. Make sure in **Test Mode**
4. Copy fresh keys
5. Update on Render
6. Keys should start with:
   - `FLWPUBK_TEST-` (public)
   - `FLWSECK_TEST-` (secret)

---

### Issue 5: User Not Authenticated

**Symptoms:**
- 401 Unauthorized error
- "Authentication credentials not provided"

**Fix:**
1. Make sure you're logged in
2. Try logging out and back in
3. Check if token expired
4. Clear browser cache and cookies

---

## 🎯 Force Redeploy

If nothing works, force a complete redeploy:

### Option 1: Manual Deploy with Cache Clear

1. Go to backend service on Render
2. Click **"Manual Deploy"** dropdown
3. Select **"Clear build cache & deploy"**
4. Wait for deployment
5. Test again

### Option 2: Trigger from GitHub

1. Make a small change to backend code (add a comment)
2. Commit and push to GitHub
3. Render will auto-deploy
4. Wait for deployment
5. Test again

---

## 🧪 Test Locally First

Before testing production, verify locally:

### Start Backend Locally:

```bash
cd c:\Users\junior\Desktop\shopp_it

# Set environment variable temporarily
set FRONTEND_URL=https://new-shop-zvmq.onrender.com

# Start server
python manage.py runserver
```

### Check Logs:

When you test payment, you should see:
```
🔍 Flutterwave Payment Initiation:
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
```

If this works locally but not on Render, the issue is with Render configuration.

---

## 📋 Complete Verification Checklist

Go through each item:

### Backend Configuration:
- [ ] Deployment status shows "Live"
- [ ] No errors in Logs tab
- [ ] `FRONTEND_URL` set to `https://new-shop-zvmq.onrender.com`
- [ ] `FRONTEND_BASE_URL` set to `https://new-shop-zvmq.onrender.com`
- [ ] `FLUTTERWAVE_PUBLIC_KEY` starts with `FLWPUBK_TEST-`
- [ ] `FLUTTERWAVE_SECRET_KEY` starts with `FLWSECK_TEST-`
- [ ] No trailing slashes in URLs
- [ ] Shell command `echo $FRONTEND_URL` shows correct URL

### Frontend:
- [ ] Site loads: https://new-shop-zvmq.onrender.com
- [ ] Can login successfully
- [ ] Can add items to cart
- [ ] Can reach checkout page
- [ ] No CORS errors in console

### Payment Flow:
- [ ] "Pay with Flutterwave" button works
- [ ] Redirects to Flutterwave checkout
- [ ] No "API key required" error
- [ ] Can enter test card details
- [ ] Payment processes
- [ ] **Redirects back to your site** ← This is the issue

---

## 🔍 Advanced Debug: Check Actual Redirect URL

### Method 1: Check Flutterwave Dashboard

1. Go to: https://dashboard.flutterwave.com
2. Click **Transactions** (Test Mode)
3. Find your recent test transaction
4. Click on it
5. Look for "Redirect URL" field
6. Should show: `https://new-shop-zvmq.onrender.com/payment/status`

**If it shows `http://localhost:5173/payment/status`:**
- Backend is not loading the environment variable
- Need to fix variable configuration

### Method 2: Inspect Network Request

1. Open DevTools (F12)
2. Network tab
3. Click "Pay with Flutterwave"
4. Find request to `/api/payments/flutterwave/initiate/`
5. Check Response
6. Look at the payment_link URL
7. Copy it and inspect the parameters

---

## 🆘 Emergency Fix: Hardcode URL Temporarily

**ONLY FOR TESTING** - Not for permanent use!

If you need to test immediately, you can temporarily hardcode the URL:

### In Backend `views.py`:

Find line 84 and change:
```python
# Temporary fix - REMOVE AFTER TESTING
redirect_url = "https://new-shop-zvmq.onrender.com/payment/status"
# redirect_url = f"{settings.FRONTEND_URL}/payment/status"
```

Then:
1. Commit and push to GitHub
2. Wait for Render to deploy
3. Test payment
4. Should redirect correctly

**Remember to change it back to use the environment variable after testing!**

---

## 📞 Get Help

If still not working, share these details:

1. **Render backend logs** (when initiating payment)
2. **Browser console errors** (F12 → Console)
3. **Network tab response** (for `/api/payments/flutterwave/initiate/`)
4. **Environment variables screenshot** (from Render)
5. **Deployment status** (Live, Deploying, or Failed)
6. **Flutterwave transaction details** (from dashboard)

---

## ✅ Expected Working Flow

When everything is correct:

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Frontend calls: https://my-shop-app-c1kx.onrender.com/api/payments/flutterwave/initiate/
   ↓
3. Backend reads FRONTEND_URL: https://new-shop-zvmq.onrender.com
   ↓
4. Backend creates payment with redirect_url: https://new-shop-zvmq.onrender.com/payment/status
   ↓
5. Backend returns payment_link to frontend
   ↓
6. Frontend redirects to Flutterwave checkout
   ↓
7. User completes payment
   ↓
8. Flutterwave redirects to: https://new-shop-zvmq.onrender.com/payment/status?status=successful&...
   ↓
9. ✅ Success page loads!
```

---

**Created:** Oct 25, 2025  
**Priority:** URGENT  
**Next Step:** Follow diagnosis steps above to find the exact issue
