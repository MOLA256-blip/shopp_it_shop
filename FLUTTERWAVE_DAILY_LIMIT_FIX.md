# Flutterwave "Daily Limit Exceeded" Error - Fix

## 🚨 Problem
You're seeing: **"You have exceeded your daily limit"** when testing payments.

---

## 🔍 What This Means

Flutterwave Test Mode has daily transaction limits:
- **Test Mode Limit:** Usually 10-20 test transactions per day
- **Purpose:** Prevent abuse of test API
- **Resets:** Every 24 hours (midnight UTC)

---

## ✅ Quick Solutions

### Solution 1: Wait for Reset (Recommended)
- **Wait:** 24 hours from first test transaction
- **Resets:** Midnight UTC
- **Cost:** Free
- **Best for:** If you can wait

### Solution 2: Use Different Test Account
1. Create new Flutterwave account with different email
2. Get new test API keys
3. Update your `.env` file
4. Continue testing

### Solution 3: Contact Flutterwave Support
1. Email: support@flutterwave.com
2. Request: Increase test mode limit
3. Explain: You're actively developing/testing
4. Usually approved within 24-48 hours

### Solution 4: Use Live Mode (Careful!)
⚠️ **Only if urgent and you understand the risks**
1. Complete KYC verification
2. Get live API keys
3. Test with **very small amounts** (like ₦10)
4. You'll be charged real fees

---

## 🎯 Best Practices to Avoid This

### 1. Limit Test Transactions
- Don't spam test payments
- Plan your tests carefully
- Test only what's necessary
- Use multiple test accounts if needed

### 2. Test Locally First
- Verify code logic without API calls
- Mock payment responses
- Only test real API when code is ready

### 3. Use Webhook Testing
- Test webhooks with Flutterwave's webhook tester
- Doesn't count toward daily limit
- Available in dashboard

### 4. Keep Multiple Test Accounts
- Create 2-3 test accounts
- Rotate between them
- Each has separate daily limit

---

## 🔄 Workaround: Mock Payments for Development

### Frontend Mock (Temporary Testing)

**File:** `src/components/PaymentSection.jsx`

Add a development mode bypass:

```javascript
const handleFlutterwavePayment = async () => {
  // DEVELOPMENT MODE ONLY - Remove before production!
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK_PAYMENTS === 'true') {
    console.log('🧪 MOCK PAYMENT MODE');
    // Simulate successful payment
    setTimeout(() => {
      navigate('/payment/status?status=successful&tx_ref=MOCK-TX-123&transaction_id=MOCK-123');
    }, 2000);
    return;
  }

  // Real payment flow
  setIsLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/payment/flutterwave/initiate/`,
      { cart_code: cartCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.payment_link) {
      window.location.href = response.data.payment_link;
    }
  } catch (error) {
    console.error('Payment error:', error);
    setError('Payment initiation failed');
  } finally {
    setIsLoading(false);
  }
};
```

**Add to `.env.local`:**
```env
VITE_MOCK_PAYMENTS=true
```

**Remember:** Remove this before production!

---

## 📊 Check Your Usage

### View Test Transaction Count
1. Login to https://dashboard.flutterwave.com
2. Go to **Transactions** (Test Mode)
3. Filter by **Today**
4. Count transactions
5. Check if near limit

### Reset Time Calculator
If you made first test at 10:00 AM UTC:
- Limit resets at 12:00 AM UTC next day
- That's approximately 14 hours from now

---

## 🆘 Emergency: Need to Test Now?

### Option A: Create New Test Account (5 minutes)
1. Go to https://dashboard.flutterwave.com/signup
2. Use different email (e.g., yourname+test2@gmail.com)
3. Verify email
4. Get test API keys
5. Update `.env`:
   ```env
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-new-key-here
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-new-key-here
   ```
6. Restart backend
7. Continue testing

### Option B: Test Without Payment API
Focus on testing other features:
- Cart functionality
- Product browsing
- User authentication
- Order history
- Profile management

Test payment integration tomorrow when limit resets.

---

## 🎓 Long-term Solution

### For Serious Development

1. **Request Limit Increase**
   - Email Flutterwave support
   - Explain you're actively developing
   - Request higher test limit
   - Usually approved quickly

2. **Use Staging Environment**
   - Create separate staging account
   - Use for integration testing
   - Keep production account clean

3. **Implement Payment Mocking**
   - Mock payments in development
   - Only use real API for final testing
   - Saves API calls

---

## 📝 Test Card (When Limit Resets)

**Nigeria Test Card:**
```
Card: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

---

## ⏰ When Will Limit Reset?

### Check Reset Time
1. Note when you made first test today
2. Add 24 hours
3. That's your reset time (UTC)

### Example:
- First test: Oct 25, 2025 at 10:00 AM UTC
- Reset time: Oct 26, 2025 at 12:00 AM UTC
- Hours to wait: ~14 hours

---

## 🔧 Alternative: Test Backend Logic Only

### Test Without Flutterwave API

**Create a test endpoint:**

```python
# core/views.py

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_payment_flow(request):
    """Test payment flow without calling Flutterwave API"""
    try:
        cart_code = request.data.get('cart_code')
        cart = Cart.objects.get(code=cart_code, user=request.user)
        
        # Simulate successful payment
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total=total,
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
            "order_id": order.id,
            "message": "Test payment successful"
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)
```

This lets you test order creation without hitting Flutterwave API.

---

## 📞 Contact Flutterwave

### Request Limit Increase

**Email Template:**

```
To: support@flutterwave.com
Subject: Request to Increase Test Mode Daily Limit

Hi Flutterwave Team,

I'm actively developing an e-commerce application and need to test 
payment integration thoroughly. I've reached the daily test transaction 
limit.

Could you please increase my test mode daily limit? I need to complete 
integration testing before going live.

Account Email: your-email@example.com
Use Case: E-commerce payment integration testing

Thank you!
```

---

## ✅ Summary

**Immediate Actions:**
1. ✅ Wait 24 hours for limit reset (easiest)
2. ✅ Create new test account (5 minutes)
3. ✅ Test other features meanwhile
4. ✅ Contact Flutterwave for limit increase

**Long-term:**
1. ✅ Request higher test limit
2. ✅ Implement payment mocking
3. ✅ Keep multiple test accounts
4. ✅ Plan tests carefully

---

**Created:** Oct 25, 2025  
**Issue:** Daily test limit exceeded  
**Status:** Solutions provided  
**Next:** Choose solution above
