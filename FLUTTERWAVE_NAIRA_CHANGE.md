# Change Flutterwave Currency to Naira (NGN)

## Backend Changes Required

### File: `shopp_it/core/views.py`

Find the `initiate_flutterwave_payment` function and change the currency from USD to NGN.

**BEFORE:**
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
            "currency": "USD",  # ← CHANGE THIS
            "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
            "customer": {
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}",
            },
            "customizations": {
                "title": "Shoppit Payment",
                "description": f"Payment for cart {cart_code}",
            }
        }
        
        # ... rest of code
```

**AFTER:**
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
            "currency": "NGN",  # ← CHANGED TO NAIRA
            "redirect_url": f"{settings.FRONTEND_URL}/payment/status",
            "customer": {
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}",
            },
            "customizations": {
                "title": "Shoppit Payment",
                "description": f"Payment for cart {cart_code}",
            }
        }
        
        # ... rest of code
```

---

## Frontend Changes (Optional - Display)

If you want to display prices in Naira on the frontend as well, you'll need to update the currency symbol.

### Option 1: Change All Prices to ₦ (Naira Symbol)

Find all instances of `$` in your components and replace with `₦`:

**Files to update:**
- `src/components/cart/CartPage.jsx`
- `src/components/checkout/CheckoutPage.jsx`
- `src/components/product/ProductPage.jsx`
- `src/components/home/ProductCard.jsx`
- `src/components/user/OrderHistoryItem.jsx`
- `src/components/checkout/PaymentStatusPage.jsx`

**Example Change:**
```javascript
// BEFORE
<div>${price.toFixed(2)}</div>

// AFTER
<div>₦{price.toFixed(2)}</div>
```

### Option 2: Create a Currency Formatter Utility

Create a utility file for consistent currency formatting:

**File: `src/utils/currency.js`**
```javascript
export const formatCurrency = (amount) => {
  return `₦${Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

// Usage:
// import { formatCurrency } from '../utils/currency'
// <div>{formatCurrency(149.99)}</div>
// Output: ₦149.99
```

---

## Important Notes

### 1. **Price Conversion**
If your product prices are currently in USD, you may need to:
- Convert prices to Naira equivalent
- Update your database prices
- Or multiply by exchange rate at payment time

**Example:**
```python
# If prices are in USD, convert to NGN
USD_TO_NGN_RATE = 1600  # Update with current rate
total_ngn = total * USD_TO_NGN_RATE
```

### 2. **Flutterwave Test Mode**
Make sure you're using Flutterwave test keys for testing:
- Test Public Key
- Test Secret Key

### 3. **Payment Button Label**
The button already says "Pay with Flutterwave" so no change needed there.

---

## Quick Implementation Steps

### Step 1: Update Backend (Required)
```bash
# Navigate to backend directory
cd c:\Users\junior\Desktop\shopp_it

# Open the file
# File: core/views.py
# Find: "currency": "USD"
# Change to: "currency": "NGN"
```

### Step 2: Restart Django Server
```bash
python manage.py runserver
```

### Step 3: Test Payment
1. Add items to cart
2. Go to checkout
3. Click "Pay with Flutterwave"
4. Verify payment page shows NGN currency

---

## Testing Checklist

- [ ] Backend currency changed to NGN
- [ ] Django server restarted
- [ ] Test payment initiated successfully
- [ ] Flutterwave payment page shows Naira (₦)
- [ ] Payment callback works correctly
- [ ] Order created with correct amount

---

## Flutterwave Supported Currencies

Flutterwave supports multiple currencies including:
- NGN (Nigerian Naira) ✅
- USD (US Dollar)
- GBP (British Pound)
- EUR (Euro)
- KES (Kenyan Shilling)
- GHS (Ghanaian Cedi)
- ZAR (South African Rand)

---

## Need Help?

If you encounter issues:
1. Check Flutterwave dashboard for test transactions
2. Verify API keys are correct
3. Check Django logs for errors
4. Ensure frontend is sending correct cart_code

---

**Summary:** Change `"currency": "USD"` to `"currency": "NGN"` in the `initiate_flutterwave_payment` function in `core/views.py`.
