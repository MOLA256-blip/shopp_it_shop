# Flutterwave Dev Checkout URL Issue

## 🎉 Good News!
Payment link IS being generated successfully:
```
payment_link: "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/ab2e257ebdc29f25def5"
```

## 🚨 Issue
The URL is pointing to **`checkout-v2.dev-flutterwave.com`** (development) instead of **`checkout.flutterwave.com`** (production).

This can cause:
- "API key required" errors
- Checkout page not loading properly
- Payment not processing correctly

---

## 🔍 Why This Happens

Flutterwave returns different checkout URLs based on:
1. **Test Mode vs Live Mode** - You're in test mode (correct for testing)
2. **API version** - Older API might return dev URLs
3. **Account settings** - Some accounts default to dev checkout

---

## ✅ Solution 1: This is Actually Normal for Test Mode

**The dev checkout URL is EXPECTED when using test keys!**

The "API key required" error is NOT because of the dev URL, but because:
1. Public key is not being sent in the payload
2. Keys might be from wrong environment
3. Keys might be expired

### Test the Payment Link Directly

1. **Copy the payment link:**
   ```
   https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/ab2e257ebdc29f25def5
   ```

2. **Open it in a new tab**

3. **What do you see?**
   - ✅ Payment form loads → Keys are working, just need to fix redirect
   - ❌ "API key required" → Keys issue on Flutterwave side

---

## ✅ Solution 2: Verify Your Flutterwave Keys

### Step 1: Check Key Environment

1. Go to: https://dashboard.flutterwave.com
2. Look at top-right corner
3. Make sure it says **"Test Mode"** (toggle should be ON)

### Step 2: Get Fresh Keys

1. Click **Settings** → **API Keys**
2. Make sure **Test Mode** toggle is ON
3. You should see:
   ```
   Public Key: FLWPUBK_TEST-xxxxx
   Secret Key: FLWSECK_TEST-xxxxx
   ```

4. **Copy both keys** (click the copy icon)

### Step 3: Update on Render

1. Go to: https://dashboard.render.com
2. Click: **my-shop-app-c1kx**
3. Click: **Environment** tab
4. Update these variables:
   ```
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-[paste your key]
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-[paste your key]
   ```
5. **Important:** Make sure you copy the ENTIRE key including the `-X` at the end
6. Save changes
7. Wait for redeployment

---

## ✅ Solution 3: Test the Checkout Page

Since you have the payment link, let's test it:

### Step 1: Open Payment Link

Open this in a new tab:
```
https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/ab2e257ebdc29f25def5
```

### Step 2: What Happens?

**Scenario A: Payment form loads properly**
- ✅ Keys are working!
- ✅ Backend is working!
- Problem is just the redirect after payment
- **Fix:** Make sure `FRONTEND_URL` is set on Render

**Scenario B: "API key required" error**
- ❌ Keys are not being sent properly
- Need to update keys on Render
- Or keys are from wrong environment

**Scenario C: "Payment link expired"**
- Payment links expire after a few minutes
- Generate a new one by trying payment again

---

## 🔧 The Real Issue: Redirect After Payment

Even if the payment works, you mentioned it doesn't redirect back. This is because:

### Check These on Render:

1. **FRONTEND_URL** must be set:
   ```
   FRONTEND_URL=https://new-shop-zvmq.onrender.com
   ```

2. **No trailing slash:**
   ```
   ✅ https://new-shop-zvmq.onrender.com
   ❌ https://new-shop-zvmq.onrender.com/
   ```

3. **HTTPS not HTTP:**
   ```
   ✅ https://new-shop-zvmq.onrender.com
   ❌ http://new-shop-zvmq.onrender.com
   ```

---

## 🎯 Complete Fix Checklist

### On Flutterwave Dashboard:
- [ ] In Test Mode
- [ ] Copy Public Key (FLWPUBK_TEST-...)
- [ ] Copy Secret Key (FLWSECK_TEST-...)

### On Render Backend:
- [ ] Set `FLUTTERWAVE_PUBLIC_KEY` with full key
- [ ] Set `FLUTTERWAVE_SECRET_KEY` with full key
- [ ] Set `FRONTEND_URL=https://new-shop-zvmq.onrender.com`
- [ ] Set `FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com`
- [ ] No trailing slashes
- [ ] Save changes
- [ ] Wait for deployment to complete

### Test:
- [ ] Try payment again
- [ ] Check if payment link opens properly
- [ ] Complete payment with test card
- [ ] Check if redirects back to your site

---

## 🧪 Test Card Details

When the checkout page loads, use:
```
Card Number: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

---

## 📊 Expected Flow

1. Click "Pay with Flutterwave"
2. ✅ Backend generates payment link
3. ✅ Redirects to: `https://checkout-v2.dev-flutterwave.com/...` (normal for test mode)
4. ✅ Checkout page loads (no "API key required" error)
5. ✅ Enter test card details
6. ✅ Complete payment
7. ✅ Redirects back to: `https://new-shop-zvmq.onrender.com/payment/status?status=successful&...`
8. ✅ Success page shows

---

## 🔍 Debug: Check Render Logs

After you pushed my code changes:

1. Go to Render backend
2. Click **Logs** tab
3. Try a payment
4. Look for:

```
🔍 Flutterwave Payment Initiation:
   - Cart Code: cart_1761401269775_h7d71rsve
   - Amount: $XX.XX
   - Redirect URL: https://new-shop-zvmq.onrender.com/payment/status
   - Transaction ID: xxx
   - Flutterwave Response Status: 200
   - Payment Link: https://checkout-v2.dev-flutterwave.com/...
```

**Key thing to check:** Does "Redirect URL" show your production URL or localhost?

---

## 🎯 Quick Action Plan

1. **Test the payment link** you already have (open in new tab)
2. **If it loads:** Keys are working, just need to fix redirect URL
3. **If "API key required":** Update keys on Render
4. **Check Render logs** to see what redirect URL is being sent
5. **Make sure FRONTEND_URL is set** on Render
6. **Try payment again** after any changes

---

## ✅ Most Likely Solution

Based on your output, the backend IS working. The issue is probably:

1. **FRONTEND_URL not set on Render** → Redirect goes to localhost
2. **Keys need to be refreshed** → "API key required" on checkout page

**Fix both:**
1. Set `FRONTEND_URL=https://new-shop-zvmq.onrender.com` on Render
2. Get fresh keys from Flutterwave and update on Render
3. Wait for deployment
4. Test again

---

**Created:** Oct 25, 2025  
**Status:** Payment link generated successfully!  
**Next:** Test the link and verify redirect URL is set correctly
