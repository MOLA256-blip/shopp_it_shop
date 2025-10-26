# Fix "Duplicate Keys Not Allowed" on Render

## 🚨 Error Message
"Duplicate keys are not allowed"

## 🔍 What This Means
You're trying to add an environment variable that already exists. Render doesn't allow duplicate variable names.

---

## ✅ Solution: Update Existing Variables

### Step 1: Find Existing Variables

1. Go to: https://dashboard.render.com
2. Click: **my-shop-app-c1kx** (backend service)
3. Click: **Environment** tab
4. Look at the list of existing variables

You'll see variables like:
```
FRONTEND_BASE_URL
FLUTTERWAVE_SECRET_KEY
FLUTTERWAVE_PUBLIC_KEY
SECRET_KEY
DEBUG
RENDER
```

### Step 2: Update (Don't Add)

Instead of clicking "Add Environment Variable", you need to **edit** the existing ones:

**For each variable that needs updating:**

1. Find the variable in the list (e.g., `FLUTTERWAVE_PUBLIC_KEY`)
2. Click the **pencil/edit icon** next to it
3. Update the value
4. Click **Save** or checkmark icon

---

## 📋 Variables to Update

### Update These Existing Variables:

**1. FLUTTERWAVE_PUBLIC_KEY**
- Click edit icon
- Replace with: `FLWPUBK_TEST-8abcdf6bba4ab236380f77d70ed88e5f-X` (your actual key)
- Save

**2. FLUTTERWAVE_SECRET_KEY**
- Click edit icon
- Replace with: `FLWSECK_TEST-5e986a546df456ebba3e8121e1b446f5-X` (your actual key)
- Save

**3. FRONTEND_BASE_URL** (if exists)
- Click edit icon
- Make sure it's: `https://new-shop-zvmq.onrender.com`
- Save

### Add This New Variable (Only if it doesn't exist):

**FRONTEND_URL**
- Only click "Add Environment Variable" if `FRONTEND_URL` is NOT in the list
- Key: `FRONTEND_URL`
- Value: `https://new-shop-zvmq.onrender.com`
- Save

---

## 🎯 Step-by-Step Visual Guide

### If Variable EXISTS (Update):

```
Environment Variables

Key                        Value                              Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLUTTERWAVE_PUBLIC_KEY    FLWPUBK_TEST-old-key-here         [✏️ Edit] [🗑️ Delete]
                                                              ↑ Click this!
```

1. Click the **✏️ Edit** icon
2. Update the value
3. Click **Save** or checkmark

### If Variable DOESN'T EXIST (Add):

```
Environment Variables

[No FRONTEND_URL found in list]

[+ Add Environment Variable]  ← Click this
```

1. Click "Add Environment Variable"
2. Enter Key: `FRONTEND_URL`
3. Enter Value: `https://new-shop-zvmq.onrender.com`
4. Click Save

---

## 🔧 Complete Checklist

Go through each variable:

### Check if EXISTS → Update:

- [ ] **FLUTTERWAVE_PUBLIC_KEY** - Update with your test key
- [ ] **FLUTTERWAVE_SECRET_KEY** - Update with your test key
- [ ] **FRONTEND_BASE_URL** - Update to `https://new-shop-zvmq.onrender.com`

### Check if DOESN'T EXIST → Add:

- [ ] **FRONTEND_URL** - Add as `https://new-shop-zvmq.onrender.com`

### After All Updates:

- [ ] Click "Save Changes" at bottom
- [ ] Wait for redeployment (5-10 minutes)
- [ ] Test payment flow

---

## 📸 What You Should See

### Before (Existing Variables):

```
Environment Variables

FRONTEND_BASE_URL         https://new-shop-zvmq.onrender.com    [✏️] [🗑️]
FLUTTERWAVE_PUBLIC_KEY    FLWPUBK_TEST-old-key                  [✏️] [🗑️]
FLUTTERWAVE_SECRET_KEY    FLWSECK_TEST-old-key                  [✏️] [🗑️]
SECRET_KEY                django-insecure-...                   [✏️] [🗑️]
DEBUG                     False                                 [✏️] [🗑️]
RENDER                    true                                  [✏️] [🗑️]

[+ Add Environment Variable]
```

### After (Updated + Added):

```
Environment Variables

FRONTEND_BASE_URL         https://new-shop-zvmq.onrender.com    [✏️] [🗑️]
FRONTEND_URL              https://new-shop-zvmq.onrender.com    [✏️] [🗑️]  ← NEW
FLUTTERWAVE_PUBLIC_KEY    FLWPUBK_TEST-8abcdf6bba4ab236...      [✏️] [🗑️]  ← UPDATED
FLUTTERWAVE_SECRET_KEY    FLWSECK_TEST-5e986a546df456eb...      [✏️] [🗑️]  ← UPDATED
SECRET_KEY                django-insecure-...                   [✏️] [🗑️]
DEBUG                     False                                 [✏️] [🗑️]
RENDER                    true                                  [✏️] [🗑️]

[+ Add Environment Variable]
```

---

## ⚠️ Important Notes

1. **Don't delete and re-add** - Just update the value
2. **Only add FRONTEND_URL if it doesn't exist** - It's probably not there yet
3. **Get fresh keys from Flutterwave** - Don't use old/expired keys
4. **Save after each change** - Or save all at once at the bottom
5. **Wait for deployment** - Changes take 5-10 minutes to apply

---

## 🚀 Quick Action Plan

1. **Open Render Environment tab**
2. **For each existing variable:**
   - Click edit icon (✏️)
   - Update value
   - Save
3. **For FRONTEND_URL (if not in list):**
   - Click "Add Environment Variable"
   - Add: `FRONTEND_URL` = `https://new-shop-zvmq.onrender.com`
   - Save
4. **Click "Save Changes"** at bottom
5. **Wait for redeployment**
6. **Test payment**

---

## 🎯 Final Environment Variables List

After you're done, you should have:

```env
FRONTEND_URL=https://new-shop-zvmq.onrender.com
FRONTEND_BASE_URL=https://new-shop-zvmq.onrender.com
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-key-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-actual-key-X
SECRET_KEY=your-django-secret-key
DEBUG=False
RENDER=true
```

---

## ✅ Success Indicators

You'll know it worked when:

1. ✅ No "duplicate keys" error
2. ✅ All variables saved successfully
3. ✅ Render shows "Deploying..."
4. ✅ After deployment, shows "Live"
5. ✅ Payment works without errors

---

## 📞 Still Getting "Duplicate Keys" Error?

**Check:**
1. Are you clicking "Add" instead of "Edit"?
2. Is the variable already in the list?
3. Try refreshing the page and looking again

**Solution:**
- If variable exists → Edit it (✏️ icon)
- If variable doesn't exist → Add it (+ button)

---

**Created:** Oct 25, 2025  
**Issue:** Duplicate keys error on Render  
**Solution:** Update existing variables instead of adding new ones
