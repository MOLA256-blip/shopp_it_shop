# Quick Render Setup - Add FRONTEND_URL

## 🎯 Follow These Exact Steps

### Step 1: Open Render Dashboard
1. Go to: https://dashboard.render.com
2. Login with your account

### Step 2: Open Backend Service
1. Find service named: **my-shop-app-c1kx**
2. Click on it

### Step 3: Go to Environment Tab
1. Click **"Environment"** in the left sidebar
2. You'll see existing environment variables

### Step 4: Add New Variable
1. Click **"Add Environment Variable"** button
2. Fill in:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://new-shop-zvmq.onrender.com`
3. Click **"Save Changes"**

### Step 5: Wait for Deployment
1. Render will show "Deploying..." at the top
2. Wait 5-10 minutes
3. When it shows "Live" with green dot, it's ready

### Step 6: Test Payment
1. Go to: https://new-shop-zvmq.onrender.com
2. Login
3. Add items to cart
4. Checkout
5. Pay with Flutterwave
6. Use test card: `5531 8866 5214 2950`, CVV: `564`, Expiry: `09/32`, PIN: `3310`, OTP: `12345`
7. ✅ Should redirect back to your site!

---

## 📸 Visual Guide

### What You Should See:

**Environment Tab:**
```
Environment Variables

Key                        Value
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND_URL              https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL         https://new-shop-zvmq.onrender.com
FLUTTERWAVE_SECRET_KEY    FLWSECK_TEST-...
FLUTTERWAVE_PUBLIC_KEY    FLWPUBK_TEST-...
SECRET_KEY                django-insecure-...
DEBUG                     False
RENDER                    true

[Add Environment Variable]
```

---

## ⚠️ Important Notes

1. **Exact spelling:** `FRONTEND_URL` (all caps, underscore)
2. **No trailing slash:** `https://new-shop-zvmq.onrender.com` (not `.com/`)
3. **HTTPS not HTTP:** Must start with `https://`
4. **Wait for deployment:** Don't test until "Live" status shows

---

## ✅ Verification

After deployment completes, verify:

1. **Check Environment tab** - Variable should be listed
2. **Check Logs tab** - No errors during deployment
3. **Test payment** - Should redirect back after payment

---

## 🆘 If It Doesn't Work

1. **Check spelling** - Must be exactly `FRONTEND_URL`
2. **Check value** - Must be `https://new-shop-zvmq.onrender.com`
3. **Wait longer** - Deployment can take up to 10 minutes
4. **Check logs** - Look for deployment errors
5. **Clear browser cache** - Try incognito mode

---

**Time Required:** 10-15 minutes (including deployment)  
**Difficulty:** Easy  
**Result:** Flutterwave redirect will work!
