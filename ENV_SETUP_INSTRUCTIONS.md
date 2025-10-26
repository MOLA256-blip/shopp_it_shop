# Frontend Environment Setup

## Create .env File

Since `.env` files are gitignored, you need to create one manually.

### Steps:

1. **Navigate to your frontend folder:**
   ```
   C:\Users\junior\Desktop\---shoppit_app
   ```

2. **Create a new file named `.env`**
   - Right-click → New → Text Document
   - Name it `.env` (remove the .txt extension)
   - If Windows won't let you, use Command Prompt:
     ```
     cd C:\Users\junior\Desktop\---shoppit_app
     type nul > .env
     ```

3. **Open `.env` in Notepad and paste this:**

```env
# Flutterwave Public Key
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X

# Backend API URL (change based on environment)
# For local development:
VITE_BASE_URL=http://127.0.0.1:8000

# For production (when deployed):
# VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com
```

4. **Save the file**

5. **Restart your dev server:**
   ```
   npm run dev
   ```

## For Render Deployment (Frontend)

Add these environment variables in your Render dashboard:

1. Go to your frontend service on Render
2. Click "Environment" tab
3. Add these variables:
   - **VITE_FLUTTERWAVE_PUBLIC_KEY** = `FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X`
   - **VITE_BASE_URL** = `https://my-shop-app-c1kx.onrender.com`
4. Click "Save Changes"
5. Redeploy

## What Changed?

✅ **Installed** `flutterwave-react-v3` package
✅ **Updated** PaymentSection to use Flutterwave SDK directly
✅ **Removed** backend API call for payment initiation
✅ **Added** direct Flutterwave integration

## Benefits:

- ✅ No more "API key required" console error
- ✅ Faster payment flow (no backend roundtrip)
- ✅ Better user experience with Flutterwave modal
- ✅ Automatic payment verification
- ✅ Support for multiple payment methods (card, mobile money, bank transfer)

## Test the Payment:

1. Go to checkout page
2. Click "Pay with Flutterwave"
3. Flutterwave modal should open
4. Complete payment
5. You'll be redirected to success page

The payment will still be verified with your backend for security!
