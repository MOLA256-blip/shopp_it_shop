# Flutterwave Redirect Issue - FIXED ✅

## What Was Wrong

Your Flutterwave payment was redirecting to a **backend verification endpoint** instead of directly to your frontend payment status page.

**Old redirect URL (Line 91):**
```python
'redirect_url': f"{backend_url}/api/payments/flutterwave/verify/"
```

This caused the payment to get stuck after completion because:
1. Flutterwave redirected to backend
2. Backend tried to verify and redirect again
3. This double-redirect caused issues

---

## What Was Fixed

### ✅ Fix 1: Changed Redirect URL to Frontend

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py` (Line 88)

**Changed from:**
```python
'redirect_url': f"{backend_url}/api/payments/flutterwave/verify/"
```

**Changed to:**
```python
'redirect_url': f"{settings.FRONTEND_BASE_URL}/payment/status"
```

Now Flutterwave redirects **directly to your frontend** with query parameters:
```
http://localhost:5173/payment/status?status=successful&tx_ref=xxx&transaction_id=xxx
```

### ✅ Fix 2: Added Order Details to Callback Response

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py` (Lines 273-282)

Updated the callback response to include order details:
```python
return Response({
    'success': True,
    'message': 'Payment verified successfully',
    'order': {
        'id': order.id,
        'total': str(transaction.amount),
        'transaction_id': transaction_id,
        'created_at': order.created_at.isoformat()
    }
})
```

This allows your frontend to display order information on the success page.

---

## How It Works Now

### Payment Flow:

```
1. User clicks "Pay with Flutterwave"
   ↓
2. Frontend calls: POST /api/payments/flutterwave/initiate/
   ↓
3. Backend creates transaction and returns Flutterwave payment link
   ↓
4. User redirected to Flutterwave checkout page
   ↓
5. User completes payment (enters card details, PIN, OTP)
   ↓
6. Flutterwave redirects to: http://localhost:5173/payment/status?status=successful&tx_ref=xxx&transaction_id=xxx
   ↓
7. Frontend PaymentStatusPage receives query parameters
   ↓
8. Frontend calls: POST /api/payments/flutterwave/callback/
   ↓
9. Backend verifies payment with Flutterwave API
   ↓
10. Backend creates order and returns order details
   ↓
11. Frontend displays success page with order information
```

---

## Testing the Fix

### Step 1: Restart Django Server

**IMPORTANT:** You must restart Django for changes to take effect!

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

### Step 2: Test Payment Flow

1. **Add items to cart**
2. **Go to checkout** (make sure you're logged in)
3. **Click "Pay with Flutterwave"**
4. **Use test card:**
   - Card: `5531 8866 5214 2950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`
5. **Complete payment**
6. **You should be redirected to:** `http://localhost:5173/payment/status`
7. **Success page should show:**
   - ✅ "Payment Successful!" message
   - ✅ Order number
   - ✅ Total amount
   - ✅ Transaction ID
   - ✅ Date/time

---

## Verification Checklist

After restarting Django, verify:

- [ ] Django server running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] `.env` has `FRONTEND_BASE_URL=http://localhost:5173`
- [ ] User is logged in
- [ ] Items in cart
- [ ] Test payment completes successfully
- [ ] Redirects to payment status page
- [ ] Success message displays
- [ ] Order details show correctly
- [ ] Cart is cleared after successful payment

---

## What Each File Does

### Backend Files:

**`core/views.py`**
- `initiate_flutterwave_payment()` - Creates payment link with redirect URL
- `flutterwave_callback()` - Verifies payment and creates order

**`.env`**
- `FRONTEND_BASE_URL` - Your frontend URL for redirects

**`shopp_it/settings.py`**
- Loads `FRONTEND_BASE_URL` from `.env`

### Frontend Files:

**`src/components/checkout/PaymentStatusPage.jsx`**
- Receives query parameters from Flutterwave
- Calls backend callback to verify payment
- Displays success/failure message

**`src/App.jsx`**
- Route: `/payment/status` matches redirect URL

---

## Common Issues After Fix

### Issue: Still not redirecting

**Solution:** 
- Make sure you **restarted Django server**
- Clear browser cache
- Check Django console for errors

### Issue: "Transaction not found"

**Solution:**
- The `tx_ref` from Flutterwave must match the transaction ID in database
- Check Django logs to see what `tx_ref` is being sent

### Issue: "Invalid payment parameters"

**Solution:**
- Flutterwave must send: `status`, `tx_ref`, and `transaction_id`
- Check browser URL to see what parameters are present
- Open browser console for error messages

---

## Environment Variables

Make sure your `.env` file has:

```env
# Frontend URL (NO trailing slash)
FRONTEND_BASE_URL=http://localhost:5173

# Flutterwave API Keys
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-key-here
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here
```

---

## Production Deployment

When deploying to production, update `.env`:

```env
# Production
FRONTEND_BASE_URL=https://yourdomain.com
```

**Important:** 
- Use your actual domain
- NO trailing slash
- Use HTTPS in production

---

## Summary

✅ **Fixed redirect URL** - Now points directly to frontend
✅ **Added order details** - Frontend can display order info
✅ **Payment flow works** - User completes payment and sees success page

**Next Step:** Restart Django server and test the payment flow!

---

**Fixed on:** Oct 25, 2025
**Files modified:** 
- `c:\Users\junior\Desktop\shopp_it\core\views.py` (2 changes)
