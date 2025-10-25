# Flutterwave "Failed to Fetch" Error - Troubleshooting Guide

## Common Causes & Solutions

### 1. ✅ Backend Server Not Running
**Error:** `Network error: Cannot connect to server`

**Solution:**
```bash
# Check if Django is running on http://127.0.0.1:8000
# If not, start it:
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

### 2. ✅ CORS Issues
**Error:** `Failed to fetch` or CORS policy error

**Solution:** Check `shopp_it/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

### 3. ✅ Missing Flutterwave API Keys
**Error:** `Payment initiation failed` or `Invalid API key`

**Solution:** Check `.env` file in Django project:
```env
FLUTTERWAVE_PUBLIC_KEY=your_public_key_here
FLUTTERWAVE_SECRET_KEY=your_secret_key_here
```

Get test keys from: https://dashboard.flutterwave.com/dashboard/settings/apis

### 4. ✅ Authentication Required
**Error:** `401 Unauthorized` or `Authentication credentials not provided`

**Solution:** Make sure you're logged in before trying to pay:
1. Click "Login" in navbar
2. Enter credentials
3. Then proceed to checkout

### 5. ✅ Cart Code Missing or Invalid
**Error:** `Cart not found` or `Invalid cart code`

**Solution:** 
- Make sure you have items in cart
- Cart code should be passed from CheckoutPage
- Check browser console for cart code value

### 6. ✅ Backend Endpoint Not Found
**Error:** `404 Not Found`

**Solution:** Verify URL pattern in `core/urls.py`:
```python
urlpatterns = [
    path('api/payments/flutterwave/initiate/', views.initiate_flutterwave_payment, name='flutterwave_initiate'),
    # ...
]
```

### 7. ✅ Flutterwave Function Not Implemented
**Error:** `500 Internal Server Error`

**Solution:** Check if `initiate_flutterwave_payment` function exists in `core/views.py`

---

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try payment again
4. Look for error messages

**What to look for:**
- `Initiating Flutterwave payment with cart: CART_CODE`
- `Flutterwave response: {...}`
- Any red error messages

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Try payment again
3. Look for `/api/payments/flutterwave/initiate/` request
4. Check:
   - Status code (should be 200)
   - Response data
   - Request payload

### Step 3: Check Django Logs
Look at the terminal where Django is running:
```
[24/Oct/2025 17:25:50] "POST /api/payments/flutterwave/initiate/ HTTP/1.1" 200 156
```

**Common error codes:**
- `404` - Endpoint not found
- `401` - Not authenticated
- `500` - Server error (check Django traceback)

### Step 4: Test Backend Directly
Use curl or Postman to test the endpoint:

```bash
# Get auth token first
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Test Flutterwave endpoint
curl -X POST http://127.0.0.1:8000/api/payments/flutterwave/initiate/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"cart_code":"YOUR_CART_CODE"}'
```

---

## Quick Checklist

Before testing payment, verify:

- [ ] Django server running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] User is logged in
- [ ] Items in cart
- [ ] CORS configured correctly
- [ ] Flutterwave API keys in `.env`
- [ ] URL patterns configured
- [ ] `initiate_flutterwave_payment` function exists

---

## Expected Flow

### 1. User clicks "Pay with Flutterwave"
```
Frontend → POST /api/payments/flutterwave/initiate/
          with { cart_code: "ABC123" }
```

### 2. Backend processes request
```python
# In views.py
def initiate_flutterwave_payment(request):
    # Get cart
    # Calculate total
    # Create Flutterwave payment
    # Return payment_link
```

### 3. Backend returns payment link
```json
{
  "payment_link": "https://checkout.flutterwave.com/v3/hosted/pay/..."
}
```

### 4. Frontend redirects to Flutterwave
```javascript
window.location.href = res.data.payment_link
```

---

## Test with Mock Data

If Flutterwave keys are not set up, you can test the flow with a mock endpoint:

**Create test endpoint in `core/views.py`:**
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_flutterwave_payment(request):
    return Response({
        'payment_link': 'https://example.com/test-payment',
        'message': 'Test payment link'
    })
```

**Add to `core/urls.py`:**
```python
path('api/payments/flutterwave/test/', views.test_flutterwave_payment),
```

---

## Still Not Working?

### Check these files:

1. **Frontend API config:** `src/api.js`
   - BASE_URL should be `http://127.0.0.1:8000`

2. **Backend settings:** `shopp_it/settings.py`
   - CORS_ALLOWED_ORIGINS
   - INSTALLED_APPS includes 'corsheaders'
   - MIDDLEWARE includes 'corsheaders.middleware.CorsMiddleware'

3. **Environment variables:** `shopp_it/.env`
   - FLUTTERWAVE_PUBLIC_KEY
   - FLUTTERWAVE_SECRET_KEY
   - FRONTEND_URL=http://localhost:5173

4. **URL patterns:** `shopp_it/core/urls.py`
   - Flutterwave endpoints configured

5. **Views:** `shopp_it/core/views.py`
   - `initiate_flutterwave_payment` function exists
   - Proper error handling

---

## Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| `Failed to fetch` | Cannot connect to backend | Check if Django is running |
| `Network error` | Connection refused | Verify backend URL and CORS |
| `401 Unauthorized` | Not logged in | Login first |
| `404 Not Found` | Endpoint doesn't exist | Check URL patterns |
| `500 Internal Server Error` | Backend crashed | Check Django logs |
| `No payment link received` | Backend returned empty response | Check Flutterwave keys |

---

## Contact Support

If still having issues:
1. Check Flutterwave dashboard for API status
2. Verify test mode is enabled
3. Check Flutterwave documentation
4. Review Django error logs

**Flutterwave Test Cards:**
- Card: 5531 8866 5214 2950
- CVV: 564
- Expiry: 09/32
- PIN: 3310
- OTP: 12345

---

**Remember:** Always use test keys during development!
