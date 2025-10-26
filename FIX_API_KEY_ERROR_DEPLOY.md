# Fix "API Key Required" Error - Deploy Updated Code

## 🚨 Current Issue
"API key required" error on Flutterwave checkout page means the backend isn't properly configured.

## ✅ I've Updated the Backend Code

I've made changes to improve error logging and payment configuration in `core/views.py`.

---

## 🚀 Deploy the Fix

### Step 1: Commit and Push Changes

Open terminal in backend directory:

```bash
cd c:\Users\junior\Desktop\shopp_it

# Check what changed
git status

# Add changes
git add core/views.py

# Commit
git commit -m "Fix Flutterwave API key error - add better logging"

# Push to GitHub
git push origin main
```

### Step 2: Wait for Render to Deploy

1. Go to: https://dashboard.render.com
2. Click: **my-shop-app-c1kx** (backend)
3. Render will automatically detect the push and start deploying
4. Wait for status to show **"Live"** (5-10 minutes)

---

## 🔍 Check Render Logs for Actual Error

After deployment completes:

### Step 1: Open Logs

1. On Render backend service
2. Click **"Logs"** tab
3. Keep it open

### Step 2: Try Payment

1. Go to: https://new-shop-zvmq.onrender.com
2. Login
3. Add items to cart
4. Go to checkout
5. Click "Pay with Flutterwave"

### Step 3: Read the Logs

You should now see detailed output like:

**If keys are missing:**
```
🔍 Flutterwave Payment Initiation:
   - Cart Code: abc123
   - Amount: $105.50
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Transaction ID: xxx-xxx-xxx
   - Flutterwave Response Status: 401
   ❌ Flutterwave HTTP Error: Invalid authorization key
   ❌ Response: {'status': 'error', 'message': 'Invalid authorization key'}
```

**If keys are correct:**
```
🔍 Flutterwave Payment Initiation:
   - Cart Code: abc123
   - Amount: $105.50
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Transaction ID: xxx-xxx-xxx
   - Flutterwave Response Status: 200
   - Flutterwave Response Data: {'status': 'success', 'data': {...}}
   - Payment Link: https://checkout.flutterwave.com/v3/hosted/pay/...
```

---

## 🔧 Based on Logs, Fix the Issue

### If logs show "Invalid authorization key":

**Problem:** `FLUTTERWAVE_SECRET_KEY` is wrong or missing

**Fix:**
1. Go to: https://dashboard.flutterwave.com
2. Settings → API Keys
3. Make sure **Test Mode** is ON
4. Copy **Secret Key** (starts with `FLWSECK_TEST-`)
5. Go to Render → Environment tab
6. Update `FLUTTERWAVE_SECRET_KEY` with the correct key
7. Save and wait for redeployment

### If logs show "Public key required":

**Problem:** `FLUTTERWAVE_PUBLIC_KEY` is wrong or missing

**Fix:**
1. Go to Flutterwave dashboard
2. Copy **Public Key** (starts with `FLWPUBK_TEST-`)
3. Go to Render → Environment tab
4. Update `FLUTTERWAVE_PUBLIC_KEY` with the correct key
5. Save and wait for redeployment

### If logs show correct payment link:

**Problem:** Frontend might not be redirecting properly

**Fix:**
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify frontend can access the payment link

---

## 📋 Verify Environment Variables on Render

Make sure these are ALL set correctly:

```env
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X
FRONTEND_URL=https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
```

**Common mistakes:**
- ❌ Keys have spaces or line breaks
- ❌ Using live keys instead of test keys
- ❌ Keys are expired or from wrong account
- ❌ Copied only part of the key

---

## 🧪 Test After Fix

1. **Check deployment status** - Should be "Live"
2. **Check logs** - Should show successful Flutterwave response
3. **Try payment** - Should redirect to Flutterwave without error
4. **Complete payment** - Use test card
5. **Check redirect** - Should come back to your site

---

## 🎯 Quick Action Steps

1. **Push code changes:**
   ```bash
   cd c:\Users\junior\Desktop\shopp_it
   git add .
   git commit -m "Fix Flutterwave payment"
   git push
   ```

2. **Wait for Render deployment** (5-10 minutes)

3. **Check Render logs** when testing payment

4. **Based on logs, update environment variables** if needed

5. **Test again** after any changes

---

## 📞 Share Logs

After you try a payment, share the logs from Render. They will tell us exactly what's wrong:

1. Go to Render backend
2. Click Logs tab
3. Try payment
4. Copy the output starting with "🔍 Flutterwave Payment Initiation:"
5. Share it so I can see the exact error

---

## ✅ Expected Success Output

When everything works, logs should show:

```
🔍 Flutterwave Payment Initiation:
   - Cart Code: abc123
   - Amount: $105.50
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Transaction ID: 550e8400-e29b-41d4-a716-446655440000
   - Flutterwave Response Status: 200
   - Flutterwave Response Data: {'status': 'success', 'message': 'Hosted Link', 'data': {...}}
   - Payment Link: https://checkout.flutterwave.com/v3/hosted/pay/abc123xyz
```

And browser should redirect to Flutterwave without "API key required" error.

---

**Created:** Oct 25, 2025  
**Action Required:** Push code changes and check Render logs  
**Next:** Share logs output to diagnose exact issue
