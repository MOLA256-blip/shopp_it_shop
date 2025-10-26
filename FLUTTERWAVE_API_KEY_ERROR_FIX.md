# Flutterwave "API Key Required" Error - Fix

## 🚨 Error You're Seeing

```
checkout.js:6 Uncaught (in promise) Error: API key required
ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge?use_polling=1:1 
Failed to load resource: the server responded with a status of 400 ()
```

## 🔍 What This Means

The Flutterwave checkout page is loading, but it's missing the **public API key**. This happens when:
1. The backend doesn't have the Flutterwave public key set
2. The backend isn't sending it to Flutterwave correctly
3. The key is invalid or expired

---

## ✅ Solution: Set Flutterwave Keys on Render

### Step 1: Get Your Flutterwave Keys

1. Go to: https://dashboard.flutterwave.com
2. Login to your account
3. Click **Settings** → **API Keys**
4. Make sure you're in **Test Mode** (toggle at top)
5. Copy both keys:
   - **Public Key:** Starts with `FLWPUBK_TEST-`
   - **Secret Key:** Starts with `FLWSECK_TEST-`

### Step 2: Add Keys to Render Backend

1. Go to: https://dashboard.render.com
2. Click your backend service: **my-shop-app-c1kx**
3. Click **"Environment"** tab
4. Add or update these variables:

```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key-here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-actual-key-here
```

5. Click **"Save Changes"**
6. Wait for redeployment (5-10 minutes)

---

## 🔧 Verify Keys Are Correct

### Check Your Keys:

**Public Key should:**
- Start with `FLWPUBK_TEST-` (for test mode)
- Be about 60-70 characters long
- Have no spaces or line breaks

**Secret Key should:**
- Start with `FLWSECK_TEST-` (for test mode)
- Be about 60-70 characters long
- Have no spaces or line breaks

### Example Format:

```
FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
```

---

## 📋 Complete Environment Variables Needed

On Render backend (**my-shop-app-c1kx**), you need:

```env
# Flutterwave Keys (CRITICAL!)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-key-here

# Frontend URL (for redirect)
FRONTEND_URL=https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com

# Django Settings
SECRET_KEY=your-django-secret-key
DEBUG=False
RENDER=true
```

---

## 🧪 Test After Adding Keys

### Step 1: Wait for Deployment

After adding/updating keys:
1. Render shows "Deploying..."
2. Wait until "Live" status (5-10 minutes)
3. Check logs for errors

### Step 2: Test Payment

1. Go to: https://new-shop-zvmq.onrender.com
2. Login
3. Add items to cart
4. Go to checkout
5. Click "Pay with Flutterwave"
6. **Flutterwave page should load WITHOUT errors**
7. Enter test card:
   - Card: `5531 8866 5214 2950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`
8. Complete payment
9. ✅ Should redirect back to your site

---

## 🐛 Common Issues

### Issue 1: "Still showing API key error"

**Possible causes:**
- Keys not saved correctly on Render
- Deployment didn't complete
- Keys have spaces or line breaks
- Wrong keys copied

**Fix:**
1. Go back to Render Environment tab
2. Delete the old keys
3. Add them again (copy-paste carefully)
4. Make sure no extra spaces
5. Save and wait for redeployment

### Issue 2: "Invalid API key"

**Possible causes:**
- Using live keys instead of test keys
- Keys are expired or revoked
- Wrong account keys

**Fix:**
1. Go to Flutterwave dashboard
2. Make sure you're in **Test Mode**
3. Copy fresh keys
4. Update on Render

### Issue 3: "Keys look correct but still not working"

**Fix:**
1. Check Render logs for errors
2. Look for: "Invalid API key" or "Authentication failed"
3. Try regenerating keys on Flutterwave
4. Update on Render with new keys

---

## 🔍 Debug: Check Backend Logs

On Render:

1. Go to backend service: **my-shop-app-c1kx**
2. Click **"Logs"** tab
3. Try initiating a payment
4. Look for:

**Good log (keys working):**
```
🔍 Flutterwave Payment Initiation:
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Flutterwave Response Status: 200
```

**Bad log (keys not working):**
```
Flutterwave Response Status: 401
Error: Invalid API key
```

---

## 🎯 Quick Fix Checklist

- [ ] Go to Flutterwave dashboard
- [ ] Copy Test Mode public key (FLWPUBK_TEST-...)
- [ ] Copy Test Mode secret key (FLWSECK_TEST-...)
- [ ] Go to Render dashboard
- [ ] Open backend service: my-shop-app-c1kx
- [ ] Go to Environment tab
- [ ] Add/update FLUTTERWAVE_PUBLIC_KEY
- [ ] Add/update FLUTTERWAVE_SECRET_KEY
- [ ] Save changes
- [ ] Wait for redeployment (5-10 minutes)
- [ ] Test payment flow
- [ ] Verify no "API key required" error

---

## 📸 What You Should See

### Flutterwave Dashboard (Test Mode):

```
API Keys

Test Mode [ON]

Public Key
FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
[Copy]

Secret Key
FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
[Copy]
```

### Render Environment Tab:

```
Environment Variables

FLUTTERWAVE_PUBLIC_KEY    FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
FLUTTERWAVE_SECRET_KEY    FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
FRONTEND_URL              https://new-shop-zvmq.onrender.com
```

---

## ⚠️ Important Notes

1. **Use Test Mode keys** - Don't use live keys for testing
2. **No spaces** - Keys should have no spaces or line breaks
3. **Complete keys** - Copy the entire key including the `-X` at the end
4. **Wait for deployment** - Changes take 5-10 minutes to apply
5. **Clear cache** - Clear browser cache after updating keys

---

## 🚀 Expected Behavior After Fix

1. Click "Pay with Flutterwave"
2. ✅ Flutterwave checkout page loads properly
3. ✅ No "API key required" error
4. ✅ Can enter card details
5. ✅ Can complete payment
6. ✅ Redirects back to your site

---

## 📞 Still Getting Error?

### Double-check:

1. **Keys are in Test Mode** - Should start with `FLWPUBK_TEST-` and `FLWSECK_TEST-`
2. **Keys are complete** - No truncation, includes `-X` at end
3. **No typos** - Copy-paste directly, don't type manually
4. **Deployment completed** - Backend shows "Live" status
5. **Browser cache cleared** - Try incognito mode

### Get Fresh Keys:

If nothing works:
1. Go to Flutterwave dashboard
2. Settings → API Keys
3. Click "Regenerate Keys"
4. Copy new keys
5. Update on Render
6. Test again

---

## ✅ Success Indicators

You'll know it's fixed when:

1. ✅ No "API key required" error in browser console
2. ✅ Flutterwave checkout page loads completely
3. ✅ Can see card input fields
4. ✅ Can enter test card details
5. ✅ Payment processes successfully
6. ✅ Redirects back to your site

---

## 🎉 Summary

**Problem:** "API key required" error on Flutterwave checkout

**Root Cause:** Flutterwave public key not set or invalid on Render backend

**Solution:** 
1. Get keys from Flutterwave dashboard (Test Mode)
2. Add to Render backend environment variables
3. Wait for redeployment
4. Test payment flow

**Time to Fix:** 10-15 minutes

**Expected Result:** Payment works without API key error

---

**Created:** Oct 25, 2025  
**Priority:** HIGH  
**Action:** Add Flutterwave keys to Render backend NOW!
