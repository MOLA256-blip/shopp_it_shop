# Flutterwave Not Working in Production - Fix Guide

## Problem
Flutterwave payment doesn't show up or doesn't redirect back after payment on your production site.

---

## Root Cause

Your **backend** needs to know your **frontend URL** to redirect users back after payment, but the environment variable isn't set on Render.

---

## ✅ Solution: Set Environment Variables on Render

### Backend Environment Variables

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click your BACKEND service:** `my-shop-app-c1kx`
3. **Go to Environment tab**
4. **Add these environment variables:**

```env
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
```

5. **Click "Save Changes"**
6. **Render will automatically redeploy** (wait 5-10 minutes)

### Frontend Environment Variables

1. **Click your FRONTEND service:** `new-shop-zvmq`
2. **Go to Environment tab**
3. **Add this environment variable:**

```env
VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com
```

4. **Click "Save Changes"**
5. **Render will automatically redeploy**

---

## 🔍 How Flutterwave Works

### Payment Flow:

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Frontend calls: POST /api/payments/flutterwave/initiate/
   ↓
3. Backend creates payment with redirect_url:
   redirect_url: "https://new-shop-zvmq.onrender.com/payment/status"
   ↓
4. Backend returns Flutterwave payment link
   ↓
5. User redirected to Flutterwave checkout
   ↓
6. User completes payment
   ↓
7. Flutterwave redirects to: 
   https://new-shop-zvmq.onrender.com/payment/status?status=successful&tx_ref=...&transaction_id=...
   ↓
8. Frontend calls: POST /api/payments/flutterwave/callback/
   ↓
9. Backend verifies payment with Flutterwave API
   ↓
10. Backend creates order and returns success
   ↓
11. Frontend shows success page
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Payment button doesn't work"

**Cause:** Backend can't create payment link

**Check:**
1. Open browser console (F12)
2. Click "Pay with Flutterwave"
3. Look for error messages

**Possible errors:**
- `401 Unauthorized` → User not logged in
- `Network Error` → Backend not running or CORS issue
- `Invalid API key` → Flutterwave keys not set

**Fix:**
- Make sure user is logged in
- Set `FLUTTERWAVE_SECRET_KEY` on Render backend
- Set `FLUTTERWAVE_PUBLIC_KEY` on Render backend

### Issue 2: "Redirects but shows error page"

**Cause:** `FRONTEND_BASE_URL` not set correctly

**Fix:**
- Set `FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com` on Render backend
- Make sure NO trailing slash
- Redeploy backend

### Issue 3: "Payment completes but doesn't redirect"

**Cause:** Flutterwave can't redirect to your site

**Check:**
1. In Flutterwave dashboard
2. Go to Settings → Webhooks
3. Make sure your domain is whitelisted

**Fix:**
- Use test mode for now (no whitelist needed)
- For production, add domain to Flutterwave whitelist

### Issue 4: "Redirects but payment not verified"

**Cause:** Backend callback endpoint not working

**Check:**
1. Browser console after redirect
2. Network tab → Look for `/api/payments/flutterwave/callback/`
3. Check response

**Possible errors:**
- `Transaction not found` → tx_ref mismatch
- `Verification failed` → Flutterwave API issue
- `CORS error` → CORS not configured

**Fix:**
- Make sure CORS is fixed (previous guide)
- Check Flutterwave API keys are correct
- Check backend logs on Render

---

## 📋 Environment Variables Checklist

### Backend (my-shop-app-c1kx.onrender.com):

```env
# Required for Flutterwave
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-key-here
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here

# Other settings
SECRET_KEY=your-django-secret-key
DEBUG=False
RENDER=true
```

### Frontend (new-shop-zvmq.onrender.com):

```env
# Required for API calls
VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com
```

---

## 🧪 Testing After Fix

### Step 1: Wait for Deployments

Both backend and frontend will redeploy after adding environment variables. Wait for both to complete.

### Step 2: Test Payment Flow

1. **Visit:** https://new-shop-zvmq.onrender.com
2. **Login** to your account
3. **Add items** to cart
4. **Go to checkout**
5. **Click "Pay with Flutterwave"**

**Expected behavior:**
- ✅ Should redirect to Flutterwave checkout page
- ✅ URL should be: `https://checkout.flutterwave.com/v3/hosted/pay/...`

6. **Enter test card details:**
   - Card: `5531 8866 5214 2950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`

7. **Click "Pay"**

**Expected behavior:**
- ✅ Should redirect to: `https://new-shop-zvmq.onrender.com/payment/status?status=successful&...`
- ✅ Should show "Payment Successful!" page
- ✅ Should display order details

### Step 3: Check Browser Console

Open DevTools (F12) and check:
- ✅ No CORS errors
- ✅ No network errors
- ✅ API calls succeed (200 status)

---

## 🔧 Debug Commands

### Check Backend Environment Variables

On Render:
1. Go to backend service
2. Click "Shell" tab
3. Run:
```bash
echo $FRONTEND_BASE_URL
echo $FLUTTERWAVE_SECRET_KEY
```

Should output your values (not empty).

### Check Backend Logs

On Render:
1. Go to backend service
2. Click "Logs" tab
3. Look for errors when initiating payment

### Test Backend Directly

```bash
curl -X POST https://my-shop-app-c1kx.onrender.com/api/payments/flutterwave/initiate/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"cart_code":"test123"}'
```

Should return payment link.

---

## 🎯 Quick Fix Steps

1. **Set Backend Environment Variables:**
   - `FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com`
   - `FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...`
   - `FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...`

2. **Set Frontend Environment Variable:**
   - `VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com`

3. **Wait for both to redeploy** (5-10 minutes each)

4. **Test payment flow** end-to-end

5. **Check browser console** for errors

---

## 📞 Still Not Working?

### Check These:

1. **Backend is running:**
   - Visit: https://my-shop-app-c1kx.onrender.com/api/products/
   - Should return JSON

2. **Frontend is running:**
   - Visit: https://new-shop-zvmq.onrender.com
   - Should show homepage

3. **CORS is fixed:**
   - No CORS errors in browser console
   - See `CORS_FIX_PRODUCTION.md`

4. **User is logged in:**
   - Payment requires authentication
   - Login before testing

5. **Flutterwave keys are valid:**
   - Test mode keys start with `FLWSECK_TEST-` and `FLWPUBK_TEST-`
   - Get from: https://dashboard.flutterwave.com/dashboard/settings/apis

---

## 🚀 Production Deployment Checklist

Before going live with real payments:

- [ ] Backend environment variables set
- [ ] Frontend environment variable set
- [ ] Both services deployed successfully
- [ ] CORS configured correctly
- [ ] Test payment flow works end-to-end
- [ ] No errors in browser console
- [ ] No errors in backend logs
- [ ] Order created successfully after payment
- [ ] Cart cleared after successful payment
- [ ] Email confirmation sent (if configured)

---

## 📚 Related Guides

- `CORS_FIX_PRODUCTION.md` - Fix CORS errors
- `FLUTTERWAVE_FIX_APPLIED.md` - Local Flutterwave setup
- `FLUTTERWAVE_SETUP.md` - Complete Flutterwave guide

---

## ✅ Summary

**Problem:** Flutterwave doesn't work in production

**Root Cause:** Missing environment variables on Render

**Solution:**
1. Set `FRONTEND_BASE_URL` on backend
2. Set `VITE_BASE_URL` on frontend
3. Set Flutterwave API keys on backend
4. Wait for redeployment
5. Test payment flow

**Expected Result:** Payment works end-to-end with proper redirect

---

**Created:** Oct 25, 2025
**Action Required:** Set environment variables on Render and redeploy
