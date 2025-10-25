# Flutterwave Payment Setup Guide

## ✅ PayPal Removed - Flutterwave Only

Your payment system now uses **Flutterwave only**. PayPal has been disabled.

---

## 🔑 Get Flutterwave API Keys

### Step 1: Create Flutterwave Account
1. Go to https://dashboard.flutterwave.com/signup
2. Sign up with your email
3. Verify your email address
4. Complete your profile

### Step 2: Get Test API Keys
1. Login to https://dashboard.flutterwave.com
2. Go to **Settings** → **API Keys**
3. Switch to **Test Mode** (toggle at top)
4. Copy your keys:
   - **Public Key** (starts with `FLWPUBK_TEST-`)
   - **Secret Key** (starts with `FLWSECK_TEST-`)

### Step 3: Add Keys to Backend

**File:** `c:\Users\junior\Desktop\shopp_it\.env`

```env
# Flutterwave API Keys (Test Mode)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

**Important:** Never commit `.env` file to Git!

---

## 🎯 What Changed

### Frontend Changes:

1. **PaymentSection.jsx**
   - ✅ PayPal button removed
   - ✅ Only Flutterwave button shown
   - ✅ Added "Secure payment powered by Flutterwave" message

2. **PaymentStatusPage.jsx**
   - ✅ PayPal verification removed
   - ✅ Only Flutterwave callback handling

### Payment Flow:

```
User clicks "Pay with Flutterwave"
         ↓
Backend creates payment link
         ↓
User redirected to Flutterwave
         ↓
User completes payment
         ↓
Redirected back to your site
         ↓
Payment verified
         ↓
Order created
```

---

## 🧪 Test Payment

### Test Cards (Nigeria)

**Successful Payment:**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345`

**Failed Payment:**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `54321` (wrong OTP)

### Test Other Countries:

**Ghana (GHS):**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: `09/32`

**Kenya (KES):**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: `09/32`

**South Africa (ZAR):**
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: `09/32`

---

## 💰 Currency Setup

### Change to Nigerian Naira (NGN)

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py`

Find the `initiate_flutterwave_payment` function and change:

```python
payment_data = {
    "tx_ref": f"TX-{cart_code}-{int(time.time())}",
    "amount": str(total),
    "currency": "NGN",  # ← Change to NGN for Naira
    "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
    # ... rest of code
}
```

### Supported Currencies:
- `NGN` - Nigerian Naira ₦
- `USD` - US Dollar $
- `GBP` - British Pound £
- `EUR` - Euro €
- `KES` - Kenyan Shilling
- `GHS` - Ghanaian Cedi
- `ZAR` - South African Rand

---

## 🔧 Backend Implementation

### Required Django Packages:

```bash
pip install requests
```

### Example Implementation:

**File:** `core/views.py`

```python
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
            "currency": "NGN",
            "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
            "customer": {
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}",
            },
            "customizations": {
                "title": "Shoppit Payment",
                "description": f"Payment for cart {cart_code}",
                "logo": "https://your-logo-url.com/logo.png"
            }
        }
        
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
            
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
```

---

## 🔄 Payment Callback

**File:** `core/views.py`

```python
@api_view(['POST'])
def flutterwave_callback(request):
    try:
        status = request.data.get('status')
        tx_ref = request.data.get('tx_ref')
        transaction_id = request.data.get('transaction_id')
        
        if status == 'successful':
            # Verify transaction with Flutterwave
            headers = {
                "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"
            }
            
            verify_response = requests.get(
                f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify",
                headers=headers
            )
            
            if verify_response.status_code == 200:
                data = verify_response.json()
                
                if data['data']['status'] == 'successful':
                    # Create order
                    cart_code = tx_ref.split('-')[1]
                    cart = Cart.objects.get(code=cart_code)
                    
                    order = Order.objects.create(
                        user=cart.user,
                        total=data['data']['amount'],
                        status='completed'
                    )
                    
                    # Create order items
                    for item in cart.items.all():
                        OrderItem.objects.create(
                            order=order,
                            product=item.product,
                            quantity=item.quantity,
                            price=item.product.price
                        )
                    
                    # Clear cart
                    cart.items.all().delete()
                    
                    return Response({
                        "success": True,
                        "message": "Payment verified successfully",
                        "order": {
                            "id": order.id,
                            "total": order.total,
                            "transaction_id": transaction_id,
                            "created_at": order.created_at.isoformat()
                        }
                    })
        
        return Response({
            "success": False,
            "message": "Payment verification failed"
        })
        
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=500)
```

---

## 📋 Checklist

Before going live:

- [ ] Flutterwave account created
- [ ] Test API keys obtained
- [ ] Keys added to `.env` file
- [ ] Backend endpoints implemented
- [ ] Test payment successful
- [ ] Currency set to NGN (if needed)
- [ ] PayPal code removed/disabled
- [ ] Error handling tested
- [ ] Order creation working
- [ ] Cart clearing working

---

## 🚀 Going Live

### Step 1: Get Live API Keys
1. Complete KYC verification on Flutterwave
2. Switch to **Live Mode** in dashboard
3. Get your live API keys
4. Update `.env` with live keys

### Step 2: Update Settings
```env
# Production .env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FRONTEND_URL=https://yourdomain.com
```

### Step 3: Test Live Payment
- Use real card for small amount
- Verify order creation
- Check email notifications
- Test refund process

---

## 💡 Tips

### Security:
- ✅ Always verify transactions on backend
- ✅ Never trust frontend data
- ✅ Use HTTPS in production
- ✅ Keep secret keys secure
- ✅ Add rate limiting

### User Experience:
- ✅ Show loading states
- ✅ Handle errors gracefully
- ✅ Send confirmation emails
- ✅ Provide order tracking
- ✅ Clear error messages

### Testing:
- ✅ Test successful payments
- ✅ Test failed payments
- ✅ Test network errors
- ✅ Test duplicate transactions
- ✅ Test refunds

---

## 📞 Support

### Flutterwave Support:
- Email: support@flutterwave.com
- Docs: https://developer.flutterwave.com
- Status: https://status.flutterwave.com

### Common Issues:
1. **"Invalid API key"** → Check keys in `.env`
2. **"Payment failed"** → Use test cards
3. **"Callback not working"** → Check redirect URL
4. **"Order not created"** → Check backend logs

---

## 🎉 You're All Set!

Your payment system now uses **Flutterwave only**:
- ✅ PayPal removed
- ✅ Flutterwave as sole payment method
- ✅ Cleaner checkout experience
- ✅ Supports Nigerian Naira
- ✅ Test cards available

**Next Steps:**
1. Get Flutterwave test API keys
2. Add to `.env` file
3. Test payment flow
4. Go live when ready!
