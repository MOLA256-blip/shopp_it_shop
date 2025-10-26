# Test Flutterwave Redirect - Quick Guide

## ✅ Backend is Ready!

All backend tests passed successfully. The redirect should now work properly.

---

## 🚀 Start Testing (3 Steps)

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

**Keep this terminal open!** You should see:
```
Starting development server at http://127.0.0.1:8000/
```

---

### Step 2: Start Frontend Server

Open a **NEW** terminal and run:

```bash
cd c:\Users\junior\Desktop\---shoppit_app
npm run dev
```

**Keep this terminal open too!** You should see:
```
Local: http://localhost:5173/
```

---

### Step 3: Test Payment Flow

1. **Open browser:** http://localhost:5173

2. **Add items to cart:**
   - Browse products
   - Click "Add to Cart"
   - Go to cart page

3. **Proceed to checkout:**
   - Click "Checkout"
   - Login if needed
   - Fill in shipping details

4. **Click "Pay with Flutterwave"**

5. **Watch the backend console** - You should see:
   ```
   🔍 Flutterwave Payment Initiation:
      - Cart Code: abc123
      - Amount: $105.50
      - Redirect URL: http://localhost:5173/payment/status
      - Transaction ID: 550e8400-e29b-41d4-a716-446655440000
      - Flutterwave Response Status: 200
   ```

6. **On Flutterwave page, use test card:**
   ```
   Card Number: 5531 8866 5214 2950
   CVV: 564
   Expiry: 09/32
   PIN: 3310
   OTP: 12345
   ```

7. **After completing payment:**
   - ✅ You should be redirected back to: `http://localhost:5173/payment/status`
   - ✅ Page should show "Payment Successful!"
   - ✅ Backend console should show callback received

---

## 🔍 What to Watch For

### In Backend Console (Django):

**When you click "Pay with Flutterwave":**
```
🔍 Flutterwave Payment Initiation:
   - Cart Code: your-cart-code
   - Amount: $XX.XX
   - Redirect URL: http://localhost:5173/payment/status
   - Transaction ID: xxx-xxx-xxx
   - Flutterwave Response Status: 200
```

**After completing payment on Flutterwave:**
```
🔍 Flutterwave Callback Received:
   - Status: successful
   - TX Ref: xxx-xxx-xxx
   - Transaction ID: 1234567
✅ Payment verified successfully! Order ID: 1
```

### In Browser:

1. **Before payment:** You're on your checkout page
2. **During payment:** Redirected to Flutterwave
3. **After payment:** ✅ **REDIRECTED BACK** to `http://localhost:5173/payment/status`
4. **Success page shows:** Payment successful message with order details

---

## ❌ If Redirect Doesn't Work

### Check Backend Console

If you don't see the debug output, the backend isn't processing the request properly.

**Fix:**
1. Make sure backend is running
2. Check for errors in Django console
3. Restart backend server

### Check Redirect URL

The backend console should show:
```
Redirect URL: http://localhost:5173/payment/status
```

If it shows something different:
1. Check `.env` file: `FRONTEND_URL=http://localhost:5173`
2. Restart backend server
3. Try again

### Check Browser Console

Press F12 and look for errors:
- **Network errors:** Backend not running
- **CORS errors:** Backend CORS settings issue
- **404 errors:** Route not found

---

## 🎯 Expected Complete Flow

```
1. User on checkout page
   ↓
2. Clicks "Pay with Flutterwave"
   ↓
3. Backend creates payment link with redirect URL
   ↓
4. User redirected to Flutterwave payment page
   ↓
5. User enters test card details
   ↓
6. User completes payment
   ↓
7. ✅ Flutterwave redirects to: http://localhost:5173/payment/status?status=successful&...
   ↓
8. Frontend shows success page
   ↓
9. Backend verifies payment
   ↓
10. Order created, cart cleared
```

---

## 💡 Quick Troubleshooting

### Problem: "Payment link not generated"
**Solution:** Check backend console for errors

### Problem: "Stays on Flutterwave after payment"
**Solution:** 
1. Check backend console shows correct redirect URL
2. Restart backend server
3. Clear browser cache

### Problem: "Redirects but shows error"
**Solution:** Check frontend route exists at `/payment/status`

### Problem: "Order not created"
**Solution:** Check backend callback logs for verification errors

---

## 📋 Pre-Flight Checklist

Before testing, ensure:

- [ ] Backend server is running (port 8000)
- [ ] Frontend server is running (port 5173)
- [ ] Both terminals are open and showing no errors
- [ ] `.env` file has `FRONTEND_URL=http://localhost:5173`
- [ ] Browser is open to http://localhost:5173
- [ ] You have test card details ready

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Backend console shows redirect URL: `http://localhost:5173/payment/status`
2. ✅ After payment, browser URL changes to: `http://localhost:5173/payment/status?status=successful&...`
3. ✅ Success page loads with "Payment Successful!" message
4. ✅ Backend console shows: "Payment verified successfully! Order ID: X"
5. ✅ Cart is empty
6. ✅ Order appears in your profile/orders

---

## 🔄 Test Again

If first test fails:

1. **Check both consoles** for errors
2. **Restart both servers**
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. **Try in incognito mode**
5. **Use different browser**

---

## 📞 Still Not Working?

Share these details:

1. **Backend console output** when clicking "Pay with Flutterwave"
2. **Browser URL** after completing payment
3. **Frontend console errors** (F12 → Console tab)
4. **Backend callback logs** (if any)

---

**Created:** Oct 25, 2025  
**Status:** Backend repaired and tested  
**Next:** Start both servers and test payment flow!

---

## 🎬 Ready to Test!

Run these commands in order:

**Terminal 1 (Backend):**
```bash
cd c:\Users\junior\Desktop\shopp_it
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd c:\Users\junior\Desktop\---shoppit_app
npm run dev
```

**Browser:**
```
http://localhost:5173
```

Then follow the test steps above! 🚀
