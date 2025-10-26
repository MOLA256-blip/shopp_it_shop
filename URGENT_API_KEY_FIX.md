# URGENT: API Key Required Error - Backend Fix Needed

## The Problem

The "API key required" error means Flutterwave's checkout page is not receiving the **public key** in the payment initialization request.

This is a **BACKEND CODE ISSUE**, not an environment variable issue.

---

## Root Cause

When creating a Flutterwave payment link, the backend must include the **public key** in the request payload. Currently, it's likely only sending the secret key in the Authorization header, but Flutterwave also needs the public key in the request body.

---

## The Fix Required

The backend payment initialization code needs to look like this:

### ❌ Current (Wrong) - Missing public_key in payload:
```python
payload = {
    "tx_ref": transaction_id,
    "amount": str(amount),
    "currency": "NGN",
    "redirect_url": redirect_url,
    "customer": {...},
    "customizations": {...}
}

headers = {
    "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"
}
```

### ✅ Correct - Includes public_key:
```python
payload = {
    "tx_ref": transaction_id,
    "amount": str(amount),
    "currency": "NGN",
    "redirect_url": redirect_url,
    "customer": {...},
    "customizations": {...},
    "public_key": settings.FLUTTERWAVE_PUBLIC_KEY  # ← THIS IS REQUIRED
}

headers = {
    "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"
}
```

---

## How to Check Backend Code

### Option 1: Check Render Logs

1. **Go to Render:**
   - https://dashboard.render.com
   - Click **my-shop-app-c1kx**
   - Click **Logs** tab

2. **Try payment and look for:**
   ```
   Payload sent to Flutterwave: {...}
   ```

3. **Check if payload includes:**
   ```json
   {
     "tx_ref": "...",
     "amount": "...",
     "public_key": "FLWPUBK_TEST-..."  ← Should be here
   }
   ```

### Option 2: Access Backend Code

The backend code is at:
```
c:\Users\junior\Desktop\shopp_it
```

Look for the file that handles Flutterwave payment (likely `core/views.py` or similar).

Find the function that creates the payment and check if it includes `"public_key"` in the payload.

---

## Quick Fix Steps

### Step 1: Locate Backend Payment Code

```bash
cd c:\Users\junior\Desktop\shopp_it
```

Find the file with Flutterwave payment initialization (search for "flutterwave" or "payment_link").

### Step 2: Add Public Key to Payload

In the payment initialization function, add this line to the payload:

```python
"public_key": settings.FLUTTERWAVE_PUBLIC_KEY
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add public_key to Flutterwave payment payload"
git push origin main
```

### Step 4: Wait for Render Deployment

- Render will auto-deploy (5-10 minutes)
- Check logs to confirm deployment succeeded

### Step 5: Test Payment

- Try payment again
- Should now work without "API key required" error

---

## Alternative: Flutterwave Standard Payment Flow

If the hosted payment link continues to have issues, you can use Flutterwave's inline payment (modal) instead:

### Frontend Change:

Instead of redirecting to a hosted link, use Flutterwave's inline JavaScript:

```javascript
// Add Flutterwave script to index.html
<script src="https://checkout.flutterwave.com/v3.js"></script>

// In PaymentSection.jsx
function handleFlutterwavePayment() {
  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-your-key",
    tx_ref: cartCode,
    amount: totalAmount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "customer@email.com",
      name: "Customer Name"
    },
    callback: function (data) {
      // Handle successful payment
      window.location.href = `/payment/status?status=successful&tx_ref=${data.tx_ref}`
    },
    onclose: function() {
      // Handle modal close
    }
  });
}
```

This approach keeps the payment on your site and doesn't require a redirect.

---

## Immediate Action Required

**You need to check the backend code** to see if `public_key` is being sent in the Flutterwave payment payload.

### Two Options:

1. **Share the backend payment code** - I can review it and tell you exactly what to fix

2. **Check Render logs** - Share the log output when you try payment, specifically the payload being sent to Flutterwave

---

## Why This Happens

Flutterwave's hosted payment page (the checkout URL) needs the public key to:
1. Identify your account
2. Load your payment settings
3. Process the payment correctly

Without the public key in the initial request, the checkout page loads but can't function, resulting in "API key required" error.

---

## Expected Flutterwave API Request

The correct request to Flutterwave should look like:

```
POST https://api.flutterwave.com/v3/payments
Headers:
  Authorization: Bearer FLWSECK_TEST-your-secret-key
  Content-Type: application/json

Body:
{
  "tx_ref": "unique-transaction-reference",
  "amount": "100",
  "currency": "NGN",
  "redirect_url": "https://your-site.com/payment/status",
  "public_key": "FLWPUBK_TEST-your-public-key",  ← REQUIRED
  "customer": {
    "email": "customer@example.com",
    "name": "Customer Name"
  },
  "customizations": {
    "title": "Your Shop",
    "description": "Payment for items"
  }
}
```

---

**Created:** Oct 25, 2025  
**Priority:** URGENT - Payment broken  
**Action:** Check backend code and add public_key to payload  
**Next:** Share backend payment code or Render logs
