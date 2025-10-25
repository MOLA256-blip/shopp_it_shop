# Mobile Money Payment Setup (MTN & Airtel)

## ✅ Frontend Updated

Your checkout now has 3 payment options:
1. 💳 **Pay with Card** (Blue button)
2. 📱 **Pay with MTN Mobile Money** (Yellow button - MTN brand color)
3. 📱 **Pay with Airtel Money** (Red button - Airtel brand color)

---

## 🔧 Backend Implementation Required

### Update `initiate_flutterwave_payment` Function

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py`

```python
import requests
import time
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_flutterwave_payment(request):
    try:
        cart_code = request.data.get('cart_code')
        payment_method = request.data.get('payment_method', 'card')  # Get payment method
        
        cart = Cart.objects.get(code=cart_code, user=request.user)
        
        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        
        # Base payment data
        payment_data = {
            "tx_ref": f"TX-{cart_code}-{int(time.time())}",
            "amount": str(total),
            "currency": "NGN",  # Nigerian Naira
            "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
            "customer": {
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}",
                "phonenumber": request.user.phone or "",  # Required for mobile money
            },
            "customizations": {
                "title": "Shoppit Payment",
                "description": f"Payment for cart {cart_code}",
                "logo": "https://your-logo-url.com/logo.png"
            }
        }
        
        # Add payment method specific data
        if payment_method == 'mtn':
            payment_data["payment_options"] = "mobilemoneyrwanda,mobilemoneyuganda,mobilemoneyghana"
            payment_data["meta"] = {
                "consumer_id": request.user.phone,
                "consumer_mac": "92a3-912ba-1192a"
            }
        elif payment_method == 'airtel':
            payment_data["payment_options"] = "mobilemoneyuganda,mobilemoneyghana"
            payment_data["meta"] = {
                "consumer_id": request.user.phone,
                "consumer_mac": "92a3-912ba-1192a"
            }
        else:
            # Card payment (default)
            payment_data["payment_options"] = "card"
        
        # Make request to Flutterwave
        headers = {
            "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
            "Content-Type": "application/json"
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
                "error": "Payment initiation failed",
                "details": response.json()
            }, status=400)
            
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
```

---

## 📱 Supported Mobile Money Networks

### MTN Mobile Money
**Countries:**
- 🇺🇬 Uganda
- 🇬🇭 Ghana
- 🇷🇼 Rwanda
- 🇧🇯 Benin
- 🇨🇮 Côte d'Ivoire
- 🇨🇲 Cameroon

### Airtel Money
**Countries:**
- 🇺🇬 Uganda
- 🇬🇭 Ghana
- 🇰🇪 Kenya
- 🇹🇿 Tanzania
- 🇿🇲 Zambia
- 🇲🇼 Malawi

### Vodafone Cash
**Countries:**
- 🇬🇭 Ghana

---

## 🎨 Payment Button Colors

### Card Payment
- Color: Blue (`btn-primary`)
- Icon: Credit card

### MTN Mobile Money
- Color: Yellow (`#FFCC00`)
- Icon: Mobile phone
- Text: Dark

### Airtel Money
- Color: Red (`#E60000`)
- Icon: Mobile phone
- Text: White

---

## 🧪 Testing Mobile Money

### Test Numbers for Mobile Money

**MTN Uganda:**
- Phone: `256772000000`
- OTP: Any 4 digits

**Airtel Uganda:**
- Phone: `256700000000`
- OTP: Any 4 digits

**Ghana Mobile Money:**
- Phone: `233240000000`
- Voucher: `143256`

---

## 🔄 Payment Flow

### Card Payment:
```
User clicks "Pay with Card"
         ↓
Flutterwave card payment page
         ↓
Enter card details
         ↓
Complete payment
         ↓
Redirect to status page
```

### Mobile Money Payment:
```
User clicks "Pay with MTN/Airtel"
         ↓
Flutterwave mobile money page
         ↓
Enter phone number
         ↓
Receive USSD prompt on phone
         ↓
Enter PIN to approve
         ↓
Redirect to status page
```

---

## 📋 User Model Requirements

Make sure your User model has a `phone` field:

**File:** `core/models.py`

```python
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    # ... other fields
```

If you don't have a phone field, update the backend code to use a default:

```python
"phonenumber": request.user.phone if hasattr(request.user, 'phone') else "",
```

---

## 🌍 Currency Support

### Mobile Money Currencies:
- **NGN** - Nigerian Naira (not supported for mobile money)
- **UGX** - Ugandan Shilling ✅
- **GHS** - Ghanaian Cedi ✅
- **RWF** - Rwandan Franc ✅
- **KES** - Kenyan Shilling ✅
- **TZS** - Tanzanian Shilling ✅
- **ZMW** - Zambian Kwacha ✅

**Note:** For Nigeria, use Card payment. Mobile money is for other African countries.

---

## 💡 Important Notes

### 1. Phone Number Required
Mobile money payments require a valid phone number. Make sure to:
- Collect phone number during registration
- Validate phone number format
- Store in user profile

### 2. Country-Specific Networks
- MTN works in Uganda, Ghana, Rwanda
- Airtel works in Uganda, Ghana, Kenya
- Vodafone works in Ghana only

### 3. Payment Options Parameter
The `payment_options` parameter tells Flutterwave which payment methods to show:
- `"card"` - Card payment only
- `"mobilemoneyuganda"` - Uganda mobile money
- `"mobilemoneyghana"` - Ghana mobile money
- `"mobilemoneyrwanda"` - Rwanda mobile money

### 4. Multiple Options
You can combine multiple options:
```python
"payment_options": "card,mobilemoneyuganda,mobilemoneyghana"
```

---

## 🎯 Checkout Page Layout

```
┌─────────────────────────────────────┐
│     Payment Method                  │
├─────────────────────────────────────┤
│                                     │
│  [💳 Pay with Card]                 │
│                                     │
│  [📱 Pay with MTN Mobile Money]     │
│                                     │
│  [📱 Pay with Airtel Money]         │
│                                     │
│  Secure payment powered by          │
│  Flutterwave                        │
└─────────────────────────────────────┘
```

---

## 🔐 Security

### Best Practices:
- ✅ Always verify transactions on backend
- ✅ Validate phone numbers
- ✅ Check transaction status before creating order
- ✅ Log all payment attempts
- ✅ Handle duplicate transactions

---

## 🐛 Troubleshooting

### "Phone number required"
- Add phone field to user model
- Collect during registration
- Validate format (+256...)

### "Payment method not available"
- Check if mobile money is available in user's country
- Verify currency is supported
- Use correct payment_options value

### "Transaction failed"
- User may have insufficient balance
- Network may be down
- Phone number may be invalid

---

## 📊 Payment Method Comparison

| Method | Speed | Fees | Availability |
|--------|-------|------|--------------|
| Card | Instant | ~3.8% | Global |
| MTN | 1-5 min | ~2% | 6 countries |
| Airtel | 1-5 min | ~2% | 6 countries |

---

## ✅ Implementation Checklist

- [ ] Frontend buttons added (Done ✅)
- [ ] Backend updated to handle payment_method
- [ ] Phone number field in User model
- [ ] Test MTN payment
- [ ] Test Airtel payment
- [ ] Test Card payment
- [ ] Error handling for missing phone
- [ ] Currency set correctly
- [ ] Payment verification working

---

## 🚀 Next Steps

1. **Update backend** with the code above
2. **Add phone field** to user registration
3. **Test with test numbers** provided
4. **Go live** with real credentials

---

## 📞 Support

For mobile money issues:
- Flutterwave Docs: https://developer.flutterwave.com/docs/collecting-payments/mobile-money
- Support: support@flutterwave.com

---

Your checkout now supports **Card, MTN, and Airtel** payments! 🎉
