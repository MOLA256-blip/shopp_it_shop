# Flutterwave Redirect Not Working - Complete Fix

## 🚨 Problem
After completing payment on Flutterwave, the page doesn't redirect back to your site or doesn't reload/update properly.

---

## 🔍 Root Causes

1. **Backend redirect URL is wrong or missing**
2. **FRONTEND_URL environment variable not set**
3. **Browser blocking redirect**
4. **Payment callback not handling URL parameters**
5. **CORS issues preventing callback**

---

## ✅ Complete Fix (Step-by-Step)

### Step 1: Fix Backend Redirect URL

**File:** `c:\Users\junior\Desktop\shopp_it\.env`

Add or update this line:
```env
FRONTEND_URL=http://localhost:5173
```

**Important:**
- NO trailing slash at the end
- Use `localhost` not `127.0.0.1`
- Port must match your Vite dev server (usually 5173)

---

### Step 2: Verify Backend Settings

**File:** `c:\Users\junior\Desktop\shopp_it\shopp_it\settings.py`

Make sure this is in your settings:

```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Frontend URL for payment redirects
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
```

---

### Step 3: Fix Backend Payment Initiation

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py`

In your `initiate_flutterwave_payment` function, ensure redirect_url is set correctly:

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_flutterwave_payment(request):
    try:
        cart_code = request.data.get('cart_code')
        cart = Cart.objects.get(code=cart_code, user=request.user)
        
        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        
        # Flutterwave payment data
        payment_data = {
            "tx_ref": f"TX-{cart_code}-{int(time.time())}",
            "amount": str(total),
            "currency": "NGN",  # or USD
            "redirect_url": f"{settings.FRONTEND_URL}/payment/status",  # ← CRITICAL LINE
            "customer": {
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}",
            },
            "customizations": {
                "title": "Shoppit Payment",
                "description": f"Payment for cart {cart_code}",
            }
        }
        
        # Debug: Print redirect URL
        print(f"🔍 Redirect URL: {payment_data['redirect_url']}")
        
        # Make request to Flutterwave
        headers = {
            "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"
        }
        
        response = requests.post(
            "https://api.flutterwave.com/v3/payments",
            json=payment_data,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            return Response({
                "payment_link": data['data']['link']
            })
        else:
            return Response({
                "error": "Payment initiation failed"
            }, status=400)
            
    except Exception as e:
        print(f"❌ Payment error: {str(e)}")
        return Response({"error": str(e)}, status=500)
```

---

### Step 4: Restart Backend Server

**CRITICAL:** You must restart the backend after changing `.env` file!

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

---

### Step 5: Verify Frontend Route

Your frontend route is already correct in `App.jsx`:

```javascript
<Route path="payment/status" element={<PaymentStatusPage />} />
```

This matches the redirect URL: `/payment/status` ✅

---

### Step 6: Test Payment Flow

1. **Start backend:**
   ```bash
   cd c:\Users\junior\Desktop\shopp_it
   python manage.py runserver
   ```

2. **Start frontend:**
   ```bash
   cd c:\Users\junior\Desktop\---shoppit_app
   npm run dev
   ```

3. **Test payment:**
   - Add items to cart
   - Go to checkout
   - Click "Pay with Flutterwave"
   - Use test card:
     - Card: `5531 8866 5214 2950`
     - CVV: `564`
     - Expiry: `09/32`
     - PIN: `3310`
     - OTP: `12345`

4. **After payment:**
   - Should redirect to: `http://localhost:5173/payment/status?status=successful&tx_ref=...&transaction_id=...`
   - Should show "Payment Successful!" page

---

## 🔧 Additional Fixes

### Fix 1: If Redirect Happens But Page Doesn't Update

The issue might be in `PaymentStatusPage.jsx`. The current implementation looks good, but ensure the `useEffect` runs:

```javascript
useEffect(() => {
  verifyPayment()
}, []) // Empty dependency array ensures it runs once on mount
```

### Fix 2: If Browser Console Shows Errors

Check browser console (F12) for errors like:
- **CORS errors** → Backend CORS settings need fixing
- **Network errors** → Backend not running or wrong URL
- **404 errors** → Route not found

### Fix 3: If Flutterwave Shows "Invalid Redirect URL"

This means:
1. Backend is sending wrong URL format
2. URL contains invalid characters
3. URL is not accessible

**Solution:**
- Use `localhost` not `127.0.0.1`
- No trailing slash
- No query parameters in redirect_url
- Must be full URL: `http://localhost:5173/payment/status`

---

## 🐛 Debugging Steps

### 1. Check Backend Console

When you click "Pay with Flutterwave", check Django console for:
```
🔍 Redirect URL: http://localhost:5173/payment/status
```

If you don't see this, the print statement isn't there or backend isn't processing the request.

### 2. Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Pay with Flutterwave"
4. Look for the API call to `/api/payments/flutterwave/initiate/`
5. Check the response - should contain `payment_link`

### 3. Check Flutterwave Dashboard

1. Go to https://dashboard.flutterwave.com
2. Navigate to Transactions (Test Mode)
3. Find your transaction
4. Check if redirect URL is correct

### 4. Test Redirect URL Manually

After payment, Flutterwave should redirect to something like:
```
http://localhost:5173/payment/status?status=successful&tx_ref=TX-cart123-1234567890&transaction_id=1234567
```

Try visiting this URL manually (with your actual parameters) to see if the page loads.

---

## 🚨 Common Issues & Solutions

### Issue 1: "Page stays on Flutterwave after payment"

**Cause:** Backend redirect_url is wrong or missing

**Fix:**
1. Check `.env` has `FRONTEND_URL=http://localhost:5173`
2. Restart Django server
3. Check Django console for redirect URL print statement

---

### Issue 2: "Redirects but shows 'Invalid payment parameters'"

**Cause:** Flutterwave not sending query parameters

**Fix:**
1. Check if payment was actually successful in Flutterwave dashboard
2. Verify transaction ID exists
3. Check browser URL - should have `?status=...&tx_ref=...&transaction_id=...`

---

### Issue 3: "Redirects but page is blank"

**Cause:** Frontend route not found or JavaScript error

**Fix:**
1. Check browser console for errors
2. Verify route exists in `App.jsx`
3. Check if `PaymentStatusPage` component has errors

---

### Issue 4: "Redirects to wrong URL"

**Cause:** FRONTEND_URL value is wrong

**Fix:**
1. Check `.env` file value
2. Make sure it matches your Vite dev server URL
3. Restart Django server

---

### Issue 5: "Payment successful but order not created"

**Cause:** Backend callback verification failed

**Fix:**
1. Check backend logs during callback
2. Verify Flutterwave API keys are correct
3. Check if backend callback endpoint exists: `/api/payments/flutterwave/callback/`

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] `.env` file has `FRONTEND_URL=http://localhost:5173` (no trailing slash)
- [ ] `settings.py` loads `FRONTEND_URL` from environment
- [ ] Backend uses `{settings.FRONTEND_URL}/payment/status` as redirect URL
- [ ] Frontend route `/payment/status` exists in `App.jsx`
- [ ] Django server restarted after `.env` changes
- [ ] Frontend dev server is running on port 5173
- [ ] Using test mode API keys
- [ ] Browser console shows no errors
- [ ] Backend console shows redirect URL when initiating payment

---

## 🎯 Expected Flow

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Frontend calls backend: /api/payments/flutterwave/initiate/
   ↓
3. Backend creates payment with redirect_url: http://localhost:5173/payment/status
   ↓
4. Backend returns payment_link to frontend
   ↓
5. Frontend redirects user to Flutterwave: window.location.href = payment_link
   ↓
6. User completes payment on Flutterwave
   ↓
7. Flutterwave redirects to: http://localhost:5173/payment/status?status=successful&tx_ref=...&transaction_id=...
   ↓
8. PaymentStatusPage loads and extracts query parameters
   ↓
9. Frontend calls backend: /api/payments/flutterwave/callback/
   ↓
10. Backend verifies transaction with Flutterwave API
   ↓
11. Backend creates order and clears cart
   ↓
12. Frontend shows success message
```

---

## 🔄 Quick Test Commands

### Verify FRONTEND_URL is loaded:

```bash
cd c:\Users\junior\Desktop\shopp_it
python manage.py shell
```

Then in Python shell:
```python
from django.conf import settings
print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
# Should output: FRONTEND_URL: http://localhost:5173
```

---

## 📱 Production Deployment

When deploying to production, update `.env`:

```env
# Production .env
FRONTEND_URL=https://new-shop-zvmq.onrender.com
```

**Important:** 
- Use your actual production frontend URL
- No trailing slash
- Must be HTTPS in production
- Update both frontend and backend environment variables

---

## 🆘 Still Not Working?

### Try This Emergency Fix:

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Try different browser**
4. **Check if popup blocker is active**
5. **Disable browser extensions**

### Get More Help:

1. **Check Django logs** - Look for errors during payment initiation
2. **Check browser console** - Look for JavaScript errors
3. **Check Flutterwave dashboard** - View transaction details
4. **Check network tab** - See what URLs are being called

### Share These Details:

- Django console output when clicking "Pay with Flutterwave"
- Browser console errors (if any)
- Network tab showing the API calls
- Flutterwave transaction ID
- URL you're redirected to (if any)

---

## 💡 Pro Tips

1. **Always restart Django server** after changing `.env` file
2. **Use print statements** to debug what's being sent to Flutterwave
3. **Check Flutterwave dashboard** to see actual transaction details
4. **Test in incognito mode** to avoid cache issues
5. **Keep browser console open** to catch errors immediately

---

**Created:** Oct 25, 2025  
**Issue:** Flutterwave redirect not working  
**Status:** Complete fix guide  
**Priority:** HIGH
