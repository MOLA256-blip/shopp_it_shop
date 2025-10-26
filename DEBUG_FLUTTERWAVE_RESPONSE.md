# Debug Flutterwave Response

## 🔍 You're Seeing This in Console

```
Initiating Flutterwave payment with cart: cart_1761401269775_h7d71rsve method: card
Flutterwave response: Object
```

This means the backend IS responding! Now we need to see what's in that Object.

---

## 🎯 Check What's in the Response

### In Browser Console:

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Click on "Object"** - it should expand to show:

**If successful:**
```javascript
{
  payment_link: "https://checkout.flutterwave.com/v3/hosted/pay/abc123xyz"
}
```

**If error:**
```javascript
{
  error: "Invalid API key"
}
// or
{
  error: "Cart not found"
}
// or
{
  error: "Failed to initiate payment"
}
```

---

## 🔧 Based on Response

### Response 1: Has `payment_link`

**Good!** Backend is working. The issue is the redirect.

**Check:**
- Does the page redirect to Flutterwave?
- Or does it stay on your site?
- Any errors after the response?

**If it redirects to Flutterwave:**
- Does Flutterwave page load?
- Do you see "API key required" error?
- Or does payment form load properly?

### Response 2: Has `error: "Invalid API key"`

**Problem:** Flutterwave keys are wrong on Render

**Fix:**
1. Go to Flutterwave dashboard
2. Get fresh test keys
3. Update on Render
4. Redeploy

### Response 3: Has `error: "Cart not found"`

**Problem:** Cart doesn't exist or expired

**Fix:**
1. Add items to cart again
2. Make sure you're logged in
3. Try checkout again

### Response 4: Has `error: "Failed to initiate payment"`

**Problem:** Generic error from backend

**Fix:**
1. Check Render backend logs
2. Look for detailed error message
3. Fix based on specific error

---

## 🔍 Also Check Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Click "Pay with Flutterwave"**
4. **Find request:** `/api/payments/flutterwave/initiate/`
5. **Click on it**
6. **Check Response tab**

You'll see the full response from backend.

---

## 📋 About the 404 Cart Error

```
my-shop-app-c1kx.onrender.com/api/cart/?cart_mode=cart_1761401269775_h7d71rsve:1 
Failed to load resource: the server responded with a status of 404 ()
```

**This is a separate issue.** The cart endpoint might be:
- `/api/cart/` (without query params)
- `/api/carts/` (plural)
- `/api/cart-items/`

**But this doesn't affect payment initiation.** The payment is using the cart code directly.

---

## 🎯 Next Steps

### Step 1: Expand the Response Object

In console, click on "Object" to see what's inside.

### Step 2: Share What You See

Tell me if you see:
- `payment_link: "https://..."`
- `error: "..."`
- Something else

### Step 3: Check What Happens Next

After the response:
- Does page redirect to Flutterwave?
- Does it stay on your site?
- Any other errors?

---

## 🔍 Quick Test

Try this in the console after you see the response:

```javascript
// This will show you the full response
console.log(JSON.stringify(response, null, 2))
```

Or just click on the "Object" text to expand it.

---

## ✅ What We're Looking For

**Success case:**
```
Flutterwave response: {
  payment_link: "https://checkout.flutterwave.com/v3/hosted/pay/abc123"
}
```
Then page redirects to that link.

**Error case:**
```
Flutterwave response: {
  error: "Some error message"
}
```
Then we fix based on the error message.

---

## 📞 Share These Details

1. **What's in the response object?** (Click to expand it)
2. **Does page redirect after response?** (Yes/No)
3. **If yes, where does it redirect to?** (URL)
4. **If no, any error messages?** (What errors)

---

**Created:** Oct 25, 2025  
**Status:** Payment is being initiated - need to see response details  
**Next:** Click on "Object" in console to see what's inside
