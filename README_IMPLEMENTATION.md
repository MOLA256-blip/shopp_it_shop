# E-Commerce Application - Implementation Guide

## Overview

This is a full-stack e-commerce application with:
- **Frontend**: React + Vite + Bootstrap
- **Backend**: Django + Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Flutterwave & PayPal integration

## Project Structure

```
---shoppit_app/               # Frontend (React)
├── src/
│   ├── api.js                # Axios instance with JWT interceptors
│   ├── FormatDate.jsx        # Date formatting utility
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartPage.jsx  # Shopping cart page
│   │   ├── checkout/
│   │   │   ├── CheckoutPage.jsx      # Checkout page (protected)
│   │   │   ├── OrderItem.jsx         # Order item with delete popup
│   │   │   ├── OrderSummary.jsx      # Order summary with totals
│   │   │   ├── PaymentSection.jsx    # Payment method selection
│   │   │   └── PaymentStatusPage.jsx # Payment verification
│   │   ├── user/
│   │   │   ├── LoginPage.jsx              # Login page
│   │   │   ├── ProfilePage.jsx            # User profile page
│   │   │   ├── UserInfo.jsx               # User info display
│   │   │   ├── OrderHistoryItem.jsx       # Single order item
│   │   │   └── OrderHistoryItemContainer.jsx # Order list
│   │   └── ui/
│   │       ├── ProtectedRoute.jsx    # Route protection HOC
│   │       └── NavBarLink.jsx        # Navigation with auth state
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication context
│   │   └── CartContext.jsx   # Cart context
│   └── hooks/
│       └── useCartData.jsx   # Custom cart data hook

shopp_it/                     # Backend (Django)
├── core/
│   ├── models.py             # CustomUser, Transaction, Order, OrderItem
│   ├── Serializers.py        # DRF serializers
│   ├── views.py              # API endpoints
│   ├── urls.py               # URL routing
│   └── admin.py              # Admin configuration
├── cart_app/
│   └── models.py             # Cart, CartItem models
└── shopp_it/
    ├── settings.py           # Django settings with JWT config
    └── urls.py               # Main URL configuration
```

## Key Features Implemented

### 1. Custom Cart Hook (`useCartData.jsx`)

Centralized cart logic to avoid code duplication:
- Fetches cart items from API
- Handles increment/decrement quantities
- Manages item deletion with confirmation
- Calculates totals and quantities
- Returns mapped data for easy rendering

**Usage:**
```javascript
const { mapped, totalPrice, totalQuantity, loading, increment, decrement, removeItem } = useCartData()
```

### 2. Checkout Components

#### OrderItem.jsx
- Displays product with image, name, price
- Quantity controls (+/-)
- Delete button with confirmation popup
- Responsive design

#### OrderSummary.jsx
- Shows items count
- Displays shipping ($5.00)
- Calculates tax (10%)
- Shows grand total
- Styled with OrderSummary.css

#### PaymentSection.jsx
- Flutterwave payment button
- PayPal payment button
- Loading states
- Error handling
- Styled with PaymentSection.module.css

### 3. JWT Authentication

#### Frontend (api.js)
- Automatic token attachment to requests
- Token expiry checking
- Auto-refresh expired tokens
- Request retry on 401 errors
- Token queue management

#### Backend (settings.py)
- `ACCESS_TOKEN_LIFETIME`: 7 days
- `REFRESH_TOKEN_LIFETIME`: 30 days
- JWT authentication as default

### 4. Protected Routes

**ProtectedRoute.jsx**:
- Checks for valid access token
- Attempts token refresh if expired
- Shows loading spinner during check
- Redirects to login if unauthorized
- Preserves intended destination

**Protected Pages**:
- `/checkout` - Checkout page
- `/profile` - User profile page

### 5. Authentication Context

**AuthContext.jsx**:
- Global authentication state
- `isAuthenticated` - boolean flag
- `username` - current user's username
- `login(username, password)` - login function
- `logout()` - logout function
- `fetchUsername()` - fetch user profile

### 6. Login Flow

1. User clicks "Checkout" without auth → redirected to `/login`
2. User enters credentials
3. Frontend sends POST to `/api/token/`
4. Backend returns access & refresh tokens
5. Tokens stored in localStorage
6. User redirected to checkout (or original destination)

### 7. User Profile

**ProfilePage.jsx**:
- Displays user information
- Shows order history
- Protected route (requires auth)

**UserInfo.jsx**:
- Avatar display
- Username, email
- Country, age (if available)
- Loading state

**OrderHistoryItemContainer.jsx**:
- Fetches orders from `/api/orders/history/`
- Displays list of orders
- Shows loading/error states

**OrderHistoryItem.jsx**:
- Order ID and date (formatted)
- Total amount
- Order status badge
- List of items in order

### 8. Payment Integration

#### Flutterwave
1. User clicks "Pay with Flutterwave"
2. Frontend sends POST to `/api/payments/flutterwave/initiate/`
3. Backend creates Transaction record
4. Backend calls Flutterwave API
5. User redirected to Flutterwave payment page
6. After payment, redirected to `/payment/status?status=...&tx_ref=...`
7. Frontend verifies payment via `/api/payments/flutterwave/callback/`
8. Backend verifies with Flutterwave
9. Creates Order and OrderItems
10. Marks cart as paid

#### PayPal
1. User clicks "Pay with PayPal"
2. Frontend sends POST to `/api/payments/paypal/initiate/`
3. Backend creates PayPal payment
4. User redirected to PayPal approval page
5. After approval, redirected to `/payment/status?paymentId=...&PayerID=...`
6. Frontend executes payment via `/api/payments/paypal/execute/`
7. Backend executes PayPal payment
8. Creates Order and OrderItems
9. Marks cart as paid

### 9. Payment Status Page

**PaymentStatusPage.jsx**:
- Detects payment method from URL params
- Verifies payment with backend
- Shows success/failure message
- Clears cart on success
- Provides navigation buttons

### 10. Navigation Updates

**NavBarLink.jsx**:
- Shows "Login" & "Register" when not authenticated
- Shows username & "Logout" when authenticated
- Profile link for authenticated users
- Logout redirects to homepage

## Backend Models

### CustomUser
- Extends Django's AbstractUser
- Additional fields: city, state, address, phone, country, age, avatar

### Transaction
- Tracks all payment transactions
- Fields: user, cart, transaction_id, amount, currency, status, payment_method, response_data
- Statuses: pending, successful, failed
- Methods: flutterwave, paypal

### Order
- Created after successful payment
- Fields: user, transaction, total, status
- Statuses: pending, processing, completed, cancelled
- Related: OrderItems

### OrderItem
- Individual items in an order
- Fields: order, product_name, product_image, quantity, unit_price

## API Endpoints

### Authentication
```
POST /api/token/
Body: { username, password }
Response: { access, refresh }

POST /api/token/refresh/
Body: { refresh }
Response: { access }
```

### User Profile
```
GET /api/user/profile/
Headers: Authorization: Bearer <token>
Response: { id, username, email, first_name, last_name, city, state, address, phone, country, age, avatar }

PUT /api/user/profile/
Headers: Authorization: Bearer <token>
Body: { first_name, last_name, city, ... }
Response: Updated user data
```

### Orders
```
GET /api/orders/history/
Headers: Authorization: Bearer <token>
Response: [{ id, total, status, created_at, items: [...] }]
```

### Payments
```
POST /api/payments/flutterwave/initiate/
Headers: Authorization: Bearer <token>
Body: { cart_code }
Response: { payment_link }

POST /api/payments/flutterwave/callback/
Body: { status, tx_ref, transaction_id }
Response: { success, message }

POST /api/payments/paypal/initiate/
Headers: Authorization: Bearer <token>
Body: { cart_code }
Response: { approval_url }

POST /api/payments/paypal/execute/
Body: { paymentId, PayerID }
Response: { success, message }
```

## Environment Variables

### Backend (.env)
```
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_public_key
FRONTEND_BASE_URL=http://localhost:5173
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
```

### Frontend (.env)
```
VITE_BASE_URL=http://127.0.0.1:8000
```

## Testing

### Create Test User
```bash
cd shopp_it
python manage.py createsuperuser
```

### Test Payment Flow
1. Add items to cart
2. Go to checkout (login required)
3. Select payment method
4. Use test credentials:
   - **Flutterwave**: Card 4187427415564246, CVV 828, PIN 3310, OTP 12345
   - **PayPal**: Use sandbox account

### View Orders
1. Login to frontend
2. Click on username in navbar
3. Go to Profile
4. View order history

## Common Issues & Solutions

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Ensure frontend URL is included

### Token Expired
- Tokens auto-refresh via interceptor
- If issues persist, clear localStorage and re-login

### Payment Not Processing
- Verify API keys in .env
- Check payment gateway mode (sandbox/live)
- Review transaction in Django admin

### Cart Not Updating
- Check cart_code in localStorage
- Verify API endpoints are accessible
- Check browser console for errors

## Next Steps

1. **User Registration**: Add signup page and endpoint
2. **Password Reset**: Implement forgot password flow
3. **Email Notifications**: Send order confirmations
4. **Product Search**: Add search functionality
5. **Reviews & Ratings**: Allow product reviews
6. **Wishlist**: Add wishlist feature
7. **Admin Dashboard**: Create admin analytics
8. **Deployment**: Deploy to production

## Resources

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Flutterwave Docs](https://developer.flutterwave.com/)
- [PayPal REST API](https://developer.paypal.com/docs/api/overview/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
