# Direct Mobile Money Payment Setup

## ✅ How It Works Now

When users click MTN or Airtel, they see instructions to send money directly to YOUR mobile money number, then verify the payment.

### Payment Flow:

```
User clicks "Pay with MTN/Airtel"
         ↓
Shows payment instructions
         ↓
User sends money to your number
         ↓
User receives SMS with Transaction ID
         ↓
User enters phone & Transaction ID
         ↓
Backend verifies payment
         ↓
Order created
```

---

## 📱 Payment Form

When user clicks MTN or Airtel, they see:

```
┌─────────────────────────────────────────┐
│  MTN Mobile Money Payment               │
├─────────────────────────────────────────┤
│  Payment Instructions:                  │
│  1. Send ₦15,000 to: 0803-XXX-XXXX    │
│  2. You will receive SMS with ID        │
│  3. Enter details below                 │
│                                         │
│  Your Phone Number                      │
│  [0803XXXXXXX]                         │
│                                         │
│  Transaction ID                         │
│  [Enter ID from SMS]                   │
│                                         │
│  [Verify Payment]  [Cancel]            │
└─────────────────────────────────────────┘
```

---

## 🔧 Backend Implementation

### Step 1: Update Payment Numbers

**File:** `PaymentSection.jsx` (Line 106)

Change the phone numbers to YOUR actual numbers:

```javascript
<li>Send <strong>₦{Number(totalAmount).toLocaleString()}</strong> to: <strong>{selectedProvider === 'mtn' ? '0803-123-4567' : '0802-987-6543'}</strong></li>
```

Replace:
- `0803-123-4567` with your MTN number
- `0802-987-6543` with your Airtel number

### Step 2: Create Backend Endpoint

**File:** `c:\Users\junior\Desktop\shopp_it\core\views.py`

Add this new function:

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_mobile_money_payment(request):
    """
    Verify mobile money payment manually
    User sends money to your number, then submits transaction details
    """
    try:
        cart_code = request.data.get('cart_code')
        provider = request.data.get('provider')  # 'mtn' or 'airtel'
        phone_number = request.data.get('phone_number')
        transaction_id = request.data.get('transaction_id')
        
        # Validate inputs
        if not all([cart_code, provider, phone_number, transaction_id]):
            return Response({
                'error': 'All fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get cart
        cart = Cart.objects.get(code=cart_code, user=request.user)
        
        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        
        # Create pending payment record
        payment = MobileMoneyPayment.objects.create(
            user=request.user,
            cart_code=cart_code,
            provider=provider,
            phone_number=phone_number,
            transaction_id=transaction_id,
            amount=total,
            status='pending'  # Admin will verify manually
        )
        
        # Create order with pending status
        order = Order.objects.create(
            user=request.user,
            total=total,
            status='pending',  # Will be confirmed after admin verification
            payment_method=f'{provider.upper()} Mobile Money'
        )
        
        # Create order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        
        # Link payment to order
        payment.order = order
        payment.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response({
            'success': True,
            'message': 'Payment submitted for verification. You will be notified once confirmed.',
            'order': {
                'id': order.id,
                'total': str(total),
                'transaction_id': transaction_id,
                'status': 'pending'
            }
        })
        
    except Cart.DoesNotExist:
        return Response({
            'error': 'Cart not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### Step 3: Create Mobile Money Payment Model

**File:** `c:\Users\junior\Desktop\shopp_it\core\models.py`

Add this model:

```python
class MobileMoneyPayment(models.Model):
    PROVIDER_CHOICES = [
        ('mtn', 'MTN Mobile Money'),
        ('airtel', 'Airtel Money'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    order = models.ForeignKey('Order', on_delete=models.SET_NULL, null=True, blank=True)
    cart_code = models.CharField(max_length=100)
    provider = models.CharField(max_length=10, choices=PROVIDER_CHOICES)
    phone_number = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.provider.upper()} - {self.transaction_id} - {self.status}"
```

### Step 4: Add URL Pattern

**File:** `c:\Users\junior\Desktop\shopp_it\core\urls.py`

```python
urlpatterns = [
    # ... existing patterns
    path('api/payments/mobile-money/verify/', views.verify_mobile_money_payment, name='mobile_money_verify'),
]
```

### Step 5: Run Migrations

```bash
cd c:\Users\junior\Desktop\shopp_it
python manage.py makemigrations
python manage.py migrate
```

### Step 6: Register in Admin

**File:** `c:\Users\junior\Desktop\shopp_it\core\admin.py`

```python
from .models import MobileMoneyPayment

@admin.register(MobileMoneyPayment)
class MobileMoneyPaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'provider', 'phone_number', 'amount', 'status', 'created_at']
    list_filter = ['status', 'provider', 'created_at']
    search_fields = ['transaction_id', 'phone_number', 'user__username']
    readonly_fields = ['created_at']
    
    actions = ['verify_payments', 'reject_payments']
    
    def verify_payments(self, request, queryset):
        for payment in queryset:
            payment.status = 'verified'
            payment.verified_at = timezone.now()
            payment.save()
            
            # Update order status
            if payment.order:
                payment.order.status = 'completed'
                payment.order.save()
        
        self.message_user(request, f'{queryset.count()} payments verified')
    verify_payments.short_description = 'Verify selected payments'
    
    def reject_payments(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, f'{queryset.count()} payments rejected')
    reject_payments.short_description = 'Reject selected payments'
```

---

## 🎯 Admin Workflow

### Verifying Payments:

1. **User submits payment** with Transaction ID
2. **Order created** with status "Pending"
3. **Admin checks mobile money account** for the transaction
4. **Admin goes to Django Admin** → Mobile Money Payments
5. **Admin verifies** the transaction ID matches
6. **Admin clicks "Verify"** action
7. **Order status** changes to "Completed"
8. **User notified** (optional: send email)

---

## 📱 Your Mobile Money Numbers

Update these in `PaymentSection.jsx`:

```javascript
// Line 106
{selectedProvider === 'mtn' ? 'YOUR-MTN-NUMBER' : 'YOUR-AIRTEL-NUMBER'}
```

**Example:**
```javascript
{selectedProvider === 'mtn' ? '0803-555-1234' : '0802-666-5678'}
```

---

## ⚠️ Important Notes

### 1. Manual Verification Required
- Payments are NOT automatically verified
- Admin must check mobile money account
- Admin must manually verify in Django admin

### 2. Order Status
- Initially: `pending`
- After verification: `completed`
- If rejected: `rejected`

### 3. User Experience
- User sees "Payment submitted for verification"
- User receives notification when verified
- Order appears in order history immediately (as pending)

### 4. Security
- Always verify transaction ID in your mobile money account
- Check amount matches
- Check phone number matches
- Reject suspicious transactions

---

## 📧 Optional: Email Notifications

Add email notification when payment is verified:

```python
from django.core.mail import send_mail

def verify_payments(self, request, queryset):
    for payment in queryset:
        payment.status = 'verified'
        payment.verified_at = timezone.now()
        payment.save()
        
        if payment.order:
            payment.order.status = 'completed'
            payment.order.save()
            
            # Send email
            send_mail(
                'Payment Confirmed',
                f'Your payment of ₦{payment.amount} has been confirmed. Order #{payment.order.id}',
                'noreply@shoppit.com',
                [payment.user.email],
                fail_silently=True,
            )
```

---

## 🎨 Payment Status Messages

### After Submission:
```
✅ Payment Submitted
Your payment is being verified. 
You will be notified once confirmed.
Order #12345 - Status: Pending
```

### After Verification:
```
✅ Payment Confirmed
Your order has been confirmed!
Order #12345 - Status: Completed
```

---

## 🔍 Testing

### Test Flow:

1. Add items to cart
2. Go to checkout
3. Click "Pay with MTN Mobile Money"
4. See your MTN number displayed
5. Enter test phone: `0803-111-2222`
6. Enter test transaction ID: `TEST123456`
7. Click "Verify Payment"
8. Check Django admin for pending payment
9. Verify the payment
10. Check order status changes to completed

---

## 📊 Advantages

✅ **No API fees** - Direct to your account
✅ **Instant receipt** - Money goes directly to you
✅ **Simple** - No complex API integration
✅ **Flexible** - Works with any mobile money provider
✅ **Control** - You verify each transaction

## ⚠️ Disadvantages

❌ **Manual work** - Must verify each payment
❌ **Slower** - Not instant confirmation
❌ **Scalability** - Hard to manage many transactions
❌ **User wait time** - Users must wait for verification

---

## 🚀 Going Live

1. ✅ Update phone numbers in frontend
2. ✅ Create MobileMoneyPayment model
3. ✅ Run migrations
4. ✅ Add to admin
5. ✅ Test with real transaction
6. ✅ Set up notification system
7. ✅ Train admin staff on verification

---

Your mobile money payments now go directly to YOUR account! 💰
