# CORS Error Fix - Production Deployment

## Error
```
Access to XMLHttpRequest at 'https://my-shop-app-c1kx.onrender.com/api/...' 
from origin 'https://new-shop-zvmq.onrender.com' has been blocked by CORS policy
```

---

## What's Wrong

Your **frontend** (`new-shop-zvmq.onrender.com`) can't access your **backend** (`my-shop-app-c1kx.onrender.com`) because of CORS restrictions.

---

## ✅ Backend Fix Applied

**File:** `c:\Users\junior\Desktop\shopp_it\shopp_it\settings.py`

### Changes Made:

1. **Fixed CORS setting name:**
   - Changed `CORS_ORIGIN_ALLOW_ALL` → `CORS_ALLOW_ALL_ORIGINS`

2. **Added explicit CORS headers:**
   ```python
   CORS_ALLOW_HEADERS = [
       'accept',
       'accept-encoding',
       'authorization',
       'content-type',
       'dnt',
       'origin',
       'user-agent',
       'x-csrftoken',
       'x-requested-with',
   ]
   ```

3. **Added explicit CORS methods:**
   ```python
   CORS_ALLOW_METHODS = [
       'DELETE',
       'GET',
       'OPTIONS',
       'PATCH',
       'POST',
       'PUT',
   ]
   ```

---

## 🚀 Deploy Backend to Render

### Step 1: Commit Changes

```bash
cd c:\Users\junior\Desktop\shopp_it
git add .
git commit -m "Fix CORS configuration for production"
git push origin main
```

### Step 2: Render Will Auto-Deploy

Render will automatically detect the push and redeploy your backend.

**Check deployment:**
1. Go to https://dashboard.render.com
2. Click on your backend service (`my-shop-app-c1kx`)
3. Wait for "Deploy succeeded" message
4. Check logs for any errors

---

## 🌐 Frontend Configuration

### Environment Variable Setup

Your frontend needs to know the backend URL.

**For Render Deployment:**

1. Go to https://dashboard.render.com
2. Click on your frontend service (`new-shop-zvmq`)
3. Go to **Environment** tab
4. Add environment variable:
   ```
   Key: VITE_BASE_URL
   Value: https://my-shop-app-c1kx.onrender.com
   ```
5. Click **Save Changes**
6. Render will automatically redeploy

---

## 📋 Complete Deployment Checklist

### Backend (Django):

- [x] ✅ CORS settings fixed in `settings.py`
- [ ] Commit and push to GitHub
- [ ] Wait for Render auto-deploy
- [ ] Check backend is running: https://my-shop-app-c1kx.onrender.com/api/products/
- [ ] Verify CORS headers in browser DevTools

### Frontend (React):

- [ ] Set `VITE_BASE_URL` environment variable on Render
- [ ] Redeploy frontend (automatic after env var change)
- [ ] Test frontend: https://new-shop-zvmq.onrender.com
- [ ] Verify API calls work in browser console

---

## 🧪 Testing After Deployment

### 1. Test Backend Directly

Open in browser:
```
https://my-shop-app-c1kx.onrender.com/api/products/
```

Should return JSON with products.

### 2. Check CORS Headers

Open browser DevTools (F12) → Network tab:
1. Visit: https://new-shop-zvmq.onrender.com
2. Look for API requests
3. Click on a request
4. Check **Response Headers** for:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Credentials: true
   ```

### 3. Test Frontend

Visit: https://new-shop-zvmq.onrender.com

Should see:
- ✅ Products loading
- ✅ Cart working
- ✅ Login/Register working
- ✅ No CORS errors in console

---

## 🔧 Alternative: Quick Fix (If Still Not Working)

If CORS errors persist after deployment, try this temporary fix:

### Backend `settings.py`:

```python
# At the top of MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    # ... rest of middleware
]

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# If above doesn't work, also add:
CORS_ORIGIN_WHITELIST = [
    'https://new-shop-zvmq.onrender.com',
]

CSRF_TRUSTED_ORIGINS = [
    'https://new-shop-zvmq.onrender.com',
]
```

---

## 🐛 Debugging CORS Issues

### Check 1: Verify corsheaders is installed

```bash
cd c:\Users\junior\Desktop\shopp_it
pip list | grep django-cors-headers
```

Should show: `django-cors-headers x.x.x`

If not installed:
```bash
pip install django-cors-headers
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add django-cors-headers"
git push
```

### Check 2: Verify INSTALLED_APPS

In `settings.py`, make sure:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',  # Must be here
    # ...
]
```

### Check 3: Verify MIDDLEWARE Order

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ...
]
```

### Check 4: Check Render Logs

1. Go to Render dashboard
2. Click backend service
3. Click **Logs** tab
4. Look for errors during startup

---

## 📝 Environment Variables Summary

### Backend (.env or Render):
```env
SECRET_KEY=your-secret-key
DEBUG=False
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
FLUTTERWAVE_SECRET_KEY=your-key
FLUTTERWAVE_PUBLIC_KEY=your-key
```

### Frontend (Render Environment):
```env
VITE_BASE_URL=https://my-shop-app-c1kx.onrender.com
```

---

## 🚨 Common Issues

### Issue: "CORS_ORIGIN_ALLOW_ALL not recognized"
**Solution:** Use `CORS_ALLOW_ALL_ORIGINS = True` (updated in fix)

### Issue: "Still getting CORS errors"
**Solution:** 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check Render logs for deployment errors
4. Verify environment variables are set

### Issue: "Backend not responding"
**Solution:**
1. Check backend is running on Render
2. Test backend URL directly in browser
3. Check Render logs for errors

### Issue: "Frontend shows blank page"
**Solution:**
1. Check browser console for errors
2. Verify `VITE_BASE_URL` is set correctly
3. Check Network tab for failed requests

---

## 📞 Quick Commands

### Redeploy Backend:
```bash
cd c:\Users\junior\Desktop\shopp_it
git add .
git commit -m "Update CORS settings"
git push origin main
```

### Check Backend Status:
```bash
curl https://my-shop-app-c1kx.onrender.com/api/products/
```

### Check CORS Headers:
```bash
curl -I https://my-shop-app-c1kx.onrender.com/api/products/
```

---

## ✅ Success Indicators

After fixing, you should see:

1. **No CORS errors** in browser console
2. **Products loading** on homepage
3. **Cart count** showing in navbar
4. **Login/Register** working
5. **API calls succeeding** in Network tab

---

## 🎯 Next Steps

1. **Commit backend changes** to GitHub
2. **Wait for Render** to auto-deploy backend
3. **Add VITE_BASE_URL** environment variable to frontend on Render
4. **Test the site** after both deployments complete
5. **Check browser console** for any remaining errors

---

## 📚 Resources

- Django CORS Headers: https://github.com/adamchainz/django-cors-headers
- Render Docs: https://render.com/docs
- CORS Explained: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Fixed on:** Oct 25, 2025
**Backend file modified:** `shopp_it/settings.py`
**Action required:** Commit and push to GitHub, then verify on Render
