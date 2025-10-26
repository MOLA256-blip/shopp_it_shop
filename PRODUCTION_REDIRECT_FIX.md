# Production Flutterwave Redirect Fix - URGENT

## 🚨 Problem
After payment on Flutterwave, the page doesn't redirect back to your production site.

**Your Sites:**
- Frontend: https://new-shop-zvmq.onrender.com
- Backend: https://my-shop-app-c1kx.onrender.com

---

## ✅ Solution: Add Missing Environment Variable

The backend code now uses `FRONTEND_URL` but it's not set on Render!

### Step 1: Add FRONTEND_URL to Backend

1. **Go to:** https://dashboard.render.com
2. **Click:** `my-shop-app-c1kx` (your backend service)
3. **Click:** "Environment" tab
4. **Click:** "Add Environment Variable"
5. **Add this:**
   ```
   Key: FRONTEND_URL
   Value: https://new-shop-zvmq.onrender.com
   ```
6. **Click:** "Save Changes"
7. **Wait:** Render will automatically redeploy (5-10 minutes)

---

## 📋 Complete Environment Variables Needed

### Backend (my-shop-app-c1kx.onrender.com)

Make sure you have ALL of these:

```env
# CRITICAL - Add this one!
FRONTEND_URL=https://new-shop-zvmq.onrender.com

# Also needed (should already exist)
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
SECRET_KEY=your-django-secret-key
DEBUG=False
RENDER=true
```

### Frontend (new-shop-zvmq.onrender.com)

Should already have:

```env
VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com
```

---

## 🔍 Why This Fixes It

### The Code Change:

In the backend repair, I updated `views.py` to use:
```python
redirect_url = f"{settings.FRONTEND_URL}/payment/status"
```

But `FRONTEND_URL` doesn't exist on Render yet!

### What Happens Without It:

1. Backend tries to read `settings.FRONTEND_URL`
2. Falls back to default: `http://localhost:5173`
3. Flutterwave redirects to localhost (doesn't work in production!)
4. User stuck on Flutterwave page

### What Happens With It:

1. Backend reads `settings.FRONTEND_URL` = `https://new-shop-zvmq.onrender.com`
2. Sends correct redirect URL to Flutterwave
3. After payment, Flutterwave redirects to your production site
4. ✅ User sees success page!

---

## 🧪 Test After Adding Variable

### Step 1: Wait for Deployment

After adding `FRONTEND_URL`:
1. Render will show "Deploying..."
2. Wait until it shows "Live" (5-10 minutes)
3. Check logs for any errors

### Step 2: Test Payment Flow

1. **Visit:** https://new-shop-zvmq.onrender.com
2. **Login** to your account
3. **Add items** to cart
4. **Go to checkout**
5. **Click "Pay with Flutterwave"**
6. **Use test card:**
   - Card: `5531 8866 5214 2950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`
7. **Complete payment**
8. ✅ **Should redirect to:** `https://new-shop-zvmq.onrender.com/payment/status?status=successful&...`

---

## 🔧 Verify Environment Variable is Set

### On Render Dashboard:

1. Go to backend service: `my-shop-app-c1kx`
2. Click "Environment" tab
3. Look for `FRONTEND_URL`
4. Should show: `https://new-shop-zvmq.onrender.com`

### Using Render Shell:

1. Go to backend service
2. Click "Shell" tab
3. Run:
   ```bash
   echo $FRONTEND_URL
   ```
4. Should output: `https://new-shop-zvmq.onrender.com`

---

## 🐛 Check Backend Logs

After adding the variable and redeploying:

1. Go to backend service on Render
2. Click "Logs" tab
3. Try a payment
4. Look for:
   ```
   🔍 Flutterwave Payment Initiation:
      - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   ```

If you see `http://localhost:5173` instead, the variable isn't set correctly.

---

## ❌ Common Mistakes

### Mistake 1: Trailing Slash

**Wrong:**
```
FRONTEND_URL=https://new-shop-zvmq.onrender.com/
```

**Correct:**
```
FRONTEND_URL=https://new-shop-zvmq.onrender.com
```

### Mistake 2: Wrong URL

**Wrong:**
```
FRONTEND_URL=https://my-shop-app-c1kx.onrender.com
```

**Correct:**
```
FRONTEND_URL=https://new-shop-zvmq.onrender.com
```

### Mistake 3: HTTP Instead of HTTPS

**Wrong:**
```
FRONTEND_URL=http://new-shop-zvmq.onrender.com
```

**Correct:**
```
FRONTEND_URL=https://new-shop-zvmq.onrender.com
```

---

## 📊 Before vs After

### Before (Not Working):

```
Backend reads: FRONTEND_URL (not set)
Falls back to: http://localhost:5173
Sends to Flutterwave: http://localhost:5173/payment/status
After payment: Flutterwave tries to redirect to localhost
Result: ❌ Doesn't work (localhost not accessible)
```

### After (Working):

```
Backend reads: FRONTEND_URL = https://new-shop-zvmq.onrender.com
Sends to Flutterwave: https://new-shop-zvmq.onrender.com/payment/status
After payment: Flutterwave redirects to your production site
Result: ✅ Works perfectly!
```

---

## 🎯 Quick Fix Checklist

- [ ] Go to Render dashboard
- [ ] Open backend service: `my-shop-app-c1kx`
- [ ] Go to Environment tab
- [ ] Add `FRONTEND_URL=https://new-shop-zvmq.onrender.com`
- [ ] Save changes
- [ ] Wait for redeployment (5-10 minutes)
- [ ] Test payment flow
- [ ] Verify redirect works

---

## 🚀 Expected Flow After Fix

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Backend creates payment with:
   redirect_url: "https://new-shop-zvmq.onrender.com/payment/status"
   ↓
3. User redirected to Flutterwave
   ↓
4. User completes payment
   ↓
5. Flutterwave redirects to:
   https://new-shop-zvmq.onrender.com/payment/status?status=successful&...
   ↓
6. ✅ Success page loads!
   ↓
7. Backend verifies payment
   ↓
8. Order created, cart cleared
```

---

## 📞 Still Not Working?

### Check These:

1. **Variable spelling:**
   - Must be exactly: `FRONTEND_URL` (case-sensitive)
   - Not: `FRONTEND_BASE_URL` or `frontend_url`

2. **Variable value:**
   - Must be: `https://new-shop-zvmq.onrender.com`
   - No trailing slash
   - HTTPS not HTTP

3. **Deployment status:**
   - Backend must show "Live" not "Deploying"
   - Check logs for deployment errors

4. **Browser cache:**
   - Clear cache (Ctrl+Shift+Delete)
   - Try incognito mode
   - Try different browser

5. **CORS settings:**
   - Make sure CORS is configured (see CORS_FIX_PRODUCTION.md)
   - Check browser console for CORS errors

---

## 💡 Pro Tip: Check Both Variables

For maximum compatibility, set BOTH:

```env
FRONTEND_URL=https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
```

This ensures both old and new code work.

---

## 🔄 If You Need to Redeploy Manually

If automatic deployment doesn't start:

1. Go to backend service on Render
2. Click "Manual Deploy" button
3. Select "Deploy latest commit"
4. Wait for deployment to complete

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Render logs show: `Redirect URL: https://new-shop-zvmq.onrender.com/payment/status`
2. ✅ After payment, browser URL is: `https://new-shop-zvmq.onrender.com/payment/status?status=...`
3. ✅ Success page loads with order details
4. ✅ No errors in browser console
5. ✅ Order appears in database

---

## 📚 Related Files

- **BACKEND_REPAIRED.md** - What was fixed in backend
- **FLUTTERWAVE_PRODUCTION_FIX.md** - General production setup
- **CORS_FIX_PRODUCTION.md** - CORS configuration

---

## 🎉 Summary

**Problem:** Production redirect doesn't work after Flutterwave payment

**Root Cause:** `FRONTEND_URL` environment variable missing on Render

**Solution:** Add `FRONTEND_URL=https://new-shop-zvmq.onrender.com` to backend on Render

**Time to Fix:** 5-10 minutes (deployment time)

**Expected Result:** Redirect works perfectly after payment

---

**Created:** Oct 25, 2025  
**Priority:** URGENT  
**Action:** Add FRONTEND_URL to Render backend NOW!
