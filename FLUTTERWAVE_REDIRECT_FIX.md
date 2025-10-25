# Flutterwave Redirect Not Working - Fix Guide

## Problem
After completing payment on Flutterwave, the page doesn't redirect back to your payment status page.

---

## Root Causes & Solutions

### ✅ Solution 1: Verify Backend Redirect URL

**File:** `c:\Users\junior\Desktop\shopp_it\.env`

Make sure this line exists:
```env
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- NO trailing slash
- Use `localhost` not `127.0.0.1` (Flutterwave may block IP addresses)
- Port must match your Vite dev server (default: 5173)

---

### ✅ Solution 2: Check Backend Implementation

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py`

In the `initiate_flutterwave_payment` function, verify the redirect URL:

```python
payment_data = {
    "tx_ref": f"TX-{cart_code}-{int(time.time())}",
    "amount": str(total),
    "currency": "NGN",  # or USD
    "redirect_url": f"{settings.FRONTEND_URL}/payment/status",  # ← This line is critical
    "customer": {
        "email": request.user.email,
        "name": f"{request.user.first_name} {request.user.last_name}",
    },
    "customizations": {
        "title": "Shoppit Payment",
        "description": f"Payment for cart {cart_code}",
    }
}
```

**Key Points:**
- `redirect_url` must be the full URL: `http://localhost:5173/payment/status`
- NO query parameters in the redirect URL
- Flutterwave will add `?status=...&tx_ref=...&transaction_id=...` automatically

---

### ✅ Solution 3: Verify Settings.py Loads FRONTEND_URL

**File:** `c:\Users\junior\Desktop\shopp_it\shopp_it\settings.py`

Add this near the top (after imports):

```python
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ... other settings ...

# Frontend URL for payment redirects
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
```

---

### ✅ Solution 4: Test Redirect URL Manually

**Step 1:** Check what URL the backend is sending to Flutterwave

Add a print statement in `views.py`:

```python
def initiate_flutterwave_payment(request):
    # ... your code ...
    
    payment_data = {
        # ... payment data ...
        "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
    }
    
    # ADD THIS LINE TO DEBUG
    print(f"🔍 Redirect URL being sent: {payment_data['redirect_url']}")
    
    # ... rest of code ...
```

**Step 2:** Try payment and check Django console output

You should see:
```
🔍 Redirect URL being sent: http://localhost:5173/payment/status
```

---

### ✅ Solution 5: Check Flutterwave Dashboard Settings

1. Go to https://dashboard.flutterwave.com
2. Navigate to **Settings** → **Webhooks**
3. Make sure your redirect URL is whitelisted (if required)

**Note:** In test mode, Flutterwave usually allows any localhost URL.

---

### ✅ Solution 6: Verify Frontend Route

Your frontend route is already correct:

**File:** `src/App.jsx` (Line 33)
```javascript
<Route path="payment/status" element={<PaymentStatusPage />} />
```

This matches the redirect URL: `/payment/status` ✅

---

### ✅ Solution 7: Check Payment Status Page Query Params

**File:** `src/components/checkout/PaymentStatusPage.jsx`

The page expects these query parameters:
- `status` - Payment status (successful, failed, cancelled)
- `tx_ref` - Transaction reference
- `transaction_id` - Flutterwave transaction ID

**Flutterwave automatically adds these** when redirecting back.

Example redirect URL:
```
http://localhost:5173/payment/status?status=successful&tx_ref=TX-cart123-1234567890&transaction_id=1234567
```

---

## Testing the Fix

### Step 1: Restart Backend
```bash
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

### Step 2: Check Django Console
Look for the debug print statement showing the redirect URL.

### Step 3: Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Click "Pay with Flutterwave"
4. Complete payment with test card:
   - Card: `5531 8866 5214 2950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`

### Step 4: Verify Redirect
After clicking "Complete Payment" on Flutterwave:
- Should redirect to: `http://localhost:5173/payment/status?status=successful&...`
- Should show "Payment Successful!" page

---

## Common Issues

### Issue: "Redirect URL not allowed"
**Solution:** 
- Use `localhost` instead of `127.0.0.1`
- Make sure no trailing slash in FRONTEND_URL
- Check Flutterwave dashboard settings

### Issue: Redirects but shows "Invalid payment parameters"
**Solution:**
- Flutterwave is not sending the query parameters
- Check if payment was actually successful
- Verify transaction ID in Flutterwave dashboard

### Issue: Stays on Flutterwave page after payment
**Solution:**
- Backend redirect URL is wrong or missing
- Check Django logs for errors
- Verify FRONTEND_URL in .env

### Issue: Redirects to wrong URL
**Solution:**
- Check FRONTEND_URL value
- Make sure settings.py loads it correctly
- Restart Django server after changing .env

---

## Verification Checklist

Before testing, verify:

- [ ] `.env` file has `FRONTEND_URL=http://localhost:5173`
- [ ] `settings.py` loads FRONTEND_URL from environment
- [ ] Backend uses `{settings.FRONTEND_URL}/payment/status` as redirect URL
- [ ] Frontend route `/payment/status` exists
- [ ] Django server restarted after .env changes
- [ ] Using test mode API keys
- [ ] Browser console shows no errors

---

## Expected Flow

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Backend creates payment with redirect_url
   ↓
3. User redirected to Flutterwave checkout
   ↓
4. User completes payment
   ↓
5. Flutterwave redirects to: http://localhost:5173/payment/status?status=successful&tx_ref=...&transaction_id=...
   ↓
6. PaymentStatusPage verifies payment with backend
   ↓
7. Shows success/failure message
```

---

## Still Not Working?

### Debug Steps:

1. **Check Django logs** when initiating payment
2. **Check browser Network tab** - look for redirect URL in response
3. **Check Flutterwave dashboard** - view transaction details
4. **Try different browser** - clear cache and cookies
5. **Check if popup blockers** are preventing redirect

### Get Help:

1. Share Django console output
2. Share browser console errors
3. Share Flutterwave transaction ID
4. Check Flutterwave status page: https://status.flutterwave.com

---

## Quick Fix Command

If you need to quickly verify the redirect URL:

```bash
# In Django shell
cd c:\Users\junior\Desktop\shopp_it
python manage.py shell

# Then run:
from django.conf import settings
print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
```

Should output: `FRONTEND_URL: http://localhost:5173`

---

## Production Deployment

When deploying to production:

```env
# Production .env
FRONTEND_URL=https://yourdomain.com
```

**Important:** Update this before going live!

---

**Last Updated:** Oct 25, 2025
