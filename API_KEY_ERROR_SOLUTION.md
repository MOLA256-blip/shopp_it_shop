# API Key Required Error - Solution

## Error Details
```
checkout.js:6 Uncaught (in promise) Error: API key required
    at checkout.js:6:20385
    at async checkout.js:6:22837
    at async on (checkout.js:6:22404)
```

## Root Cause
This error occurs when the Flutterwave checkout page loads but cannot find the required API key. This is a **backend issue**, not a frontend issue.

---

## 🎯 Quick Fix (Most Likely Solution)

### The Problem
Your Flutterwave API keys on Render (backend) are either:
1. **Not set** - Missing environment variables
2. **Incorrect** - Wrong keys or from wrong environment
3. **Expired** - Keys need to be refreshed
4. **Incomplete** - Keys were copied without the full suffix (e.g., missing `-X` at the end)

### The Solution

#### Step 1: Get Fresh Flutterwave Keys

1. **Go to Flutterwave Dashboard:**
   - Visit: https://dashboard.flutterwave.com
   - Login to your account

2. **Switch to Test Mode:**
   - Look at the top-right corner
   - Make sure the toggle says **"Test Mode"** (should be ON/yellow)
   - If it says "Live Mode", click to switch to Test Mode

3. **Get Your API Keys:**
   - Click **Settings** (gear icon) → **API Keys**
   - You should see:
     ```
     Public Key: FLWPUBK_TEST-xxxxxxxxxxxxxxxx-X
     Secret Key: FLWSECK_TEST-xxxxxxxxxxxxxxxx-X
     ```
   - Click the **copy icon** next to each key
   - **IMPORTANT:** Make sure you copy the ENTIRE key including the `-X` at the end

#### Step 2: Update Keys on Render Backend

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Login to your account

2. **Select Backend Service:**
   - Click on **my-shop-app-c1kx** (your backend service)

3. **Update Environment Variables:**
   - Click **Environment** tab on the left
   - Find or add these variables:
     ```
     FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-[paste your full public key here]
     FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-[paste your full secret key here]
     ```

4. **Save Changes:**
   - Click **Save Changes** button
   - Render will automatically redeploy your backend
   - Wait 2-5 minutes for deployment to complete

#### Step 3: Verify Other Required Environment Variables

Make sure these are also set on your backend:

```
FRONTEND_URL=https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
```

**Important:** No trailing slashes!

#### Step 4: Test the Payment

1. **Wait for Deployment:**
   - Check that backend service shows **"Live"** status
   - Look at the logs to confirm no errors

2. **Try Payment Again:**
   - Go to your site: https://new-shop-zvmq.onrender.com
   - Add items to cart
   - Go to checkout
   - Click **"Pay with Flutterwave"**

3. **Expected Behavior:**
   - ✅ Redirects to Flutterwave checkout page
   - ✅ Checkout page loads (no "API key required" error)
   - ✅ You can enter test card details
   - ✅ Payment processes
   - ✅ Redirects back to your site

---

## 🧪 Test Card Details

When the checkout page loads successfully, use these test credentials:

```
Card Number: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

---

## 🔍 Additional Debugging

### Check Backend Logs

1. **Go to Render Backend:**
   - Click **my-shop-app-c1kx**
   - Click **Logs** tab

2. **Try a Payment:**
   - Attempt payment on your site
   - Watch the logs in real-time

3. **Look for These Lines:**
   ```
   🔍 Flutterwave Payment Initiation:
      - Cart Code: cart_xxxxx
      - Amount: $XX.XX
      - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
      - Transaction ID: xxx
      - Flutterwave Response Status: 200
      - Payment Link: https://checkout-v2.dev-flutterwave.com/...
   ```

4. **Check for Errors:**
   - If you see `KeyError: 'FLUTTERWAVE_PUBLIC_KEY'` → Keys not set
   - If you see `401 Unauthorized` → Keys are incorrect
   - If you see `400 Bad Request` → Keys are invalid or expired

### Test Payment Link Directly

If a payment link is generated, test it directly:

1. **Copy the payment link from logs:**
   ```
   https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/xxxxx
   ```

2. **Open in new browser tab**

3. **What happens?**
   - ✅ **Checkout form loads** → Keys are working, issue is with redirect
   - ❌ **"API key required"** → Keys are not being sent to Flutterwave
   - ❌ **"Payment link expired"** → Link is old, generate a new one

---

## 🚨 Common Mistakes

### Mistake 1: Incomplete Key Copy
**Problem:** Copied key without the `-X` suffix
```
❌ FLWPUBK_TEST-xxxxxxxxxxxxxxxx
✅ FLWPUBK_TEST-xxxxxxxxxxxxxxxx-X
```

**Fix:** Copy the entire key including the suffix

### Mistake 2: Wrong Environment
**Problem:** Using Live keys in Test mode or vice versa
```
❌ FLWPUBK-xxxxxxxx (Live key)
✅ FLWPUBK_TEST-xxxxxxxx (Test key)
```

**Fix:** Make sure keys match the mode you're in

### Mistake 3: Extra Spaces
**Problem:** Spaces before or after the key
```
❌ " FLWPUBK_TEST-xxxxxxxx "
✅ "FLWPUBK_TEST-xxxxxxxx"
```

**Fix:** Remove any spaces when pasting

### Mistake 4: Wrong Variable Names
**Problem:** Variable names don't match what backend expects
```
❌ FLW_PUBLIC_KEY
❌ FLUTTERWAVE_PUB_KEY
✅ FLUTTERWAVE_PUBLIC_KEY
```

**Fix:** Use exact variable names shown above

---

## 📋 Verification Checklist

Before testing payment, verify:

### On Flutterwave Dashboard:
- [ ] Logged in successfully
- [ ] In **Test Mode** (toggle is ON)
- [ ] Can see test API keys
- [ ] Copied both Public and Secret keys
- [ ] Keys start with `FLWPUBK_TEST-` and `FLWSECK_TEST-`

### On Render Backend:
- [ ] Service is **Live** (not deploying or failed)
- [ ] Environment variables are set:
  - [ ] `FLUTTERWAVE_PUBLIC_KEY`
  - [ ] `FLUTTERWAVE_SECRET_KEY`
  - [ ] `FRONTEND_URL`
  - [ ] `FRONTEND_BASE_URL`
- [ ] No spaces in variable values
- [ ] No trailing slashes in URLs
- [ ] Deployment completed successfully
- [ ] No errors in logs

### Testing:
- [ ] Can access site: https://new-shop-zvmq.onrender.com
- [ ] Can add items to cart
- [ ] Can go to checkout
- [ ] Click "Pay with Flutterwave" works
- [ ] Redirects to Flutterwave checkout
- [ ] Checkout page loads (no "API key required")

---

## 🎯 Expected Flow

When everything is configured correctly:

1. **User clicks "Pay with Flutterwave"**
2. **Frontend sends request to backend:** `/api/payments/flutterwave/initiate/`
3. **Backend uses API keys to create payment with Flutterwave**
4. **Flutterwave returns payment link**
5. **Backend sends link to frontend**
6. **Frontend redirects to:** `https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/xxxxx`
7. **Checkout page loads successfully** (uses the keys backend sent)
8. **User enters test card details**
9. **Payment processes**
10. **Flutterwave redirects back to:** `https://new-shop-zvmq.onrender.com/payment/status?status=successful&...`

---

## 🆘 Still Not Working?

If you've followed all steps and still get "API key required":

### Option 1: Check Backend Code

The backend might not be sending the public key in the payment request. Check if the backend code includes:

```python
# In the Flutterwave payment initiation
payload = {
    "tx_ref": transaction_id,
    "amount": str(amount),
    "currency": "NGN",
    "redirect_url": redirect_url,
    "customer": {...},
    "customizations": {...},
    "payment_options": "card,mobilemoney,ussd",
}

headers = {
    "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
    "Content-Type": "application/json"
}
```

The `Authorization` header must include the secret key.

### Option 2: Regenerate Keys

Sometimes keys get corrupted:

1. Go to Flutterwave Dashboard
2. Settings → API Keys
3. Click **"Regenerate Keys"** (if available)
4. Copy new keys
5. Update on Render
6. Test again

### Option 3: Contact Flutterwave Support

If keys are definitely correct but still not working:

1. Go to Flutterwave Dashboard
2. Click **Support** or **Help**
3. Report: "API key required error on checkout page"
4. Provide:
   - Your account email
   - Test/Live mode you're using
   - Error message
   - When it started happening

---

## 📝 Summary

**The "API key required" error means:**
- Flutterwave checkout page loaded
- But couldn't find the API key it needs
- This is because backend didn't send the key properly

**Most common cause:**
- Keys not set on Render backend
- Keys are incomplete or incorrect

**Quick fix:**
1. Get fresh keys from Flutterwave (Test Mode)
2. Set them on Render backend
3. Wait for deployment
4. Test payment again

---

**Created:** Oct 25, 2025  
**Status:** Troubleshooting API key error  
**Next Step:** Update Flutterwave keys on Render backend
