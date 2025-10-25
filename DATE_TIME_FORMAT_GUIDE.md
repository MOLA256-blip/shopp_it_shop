# Date & Time Format Guide

## ✅ Updated Order History Date/Time Display

### New Format

Order history now shows date and time in a more detailed and user-friendly format:

```
Order #12345
📅 Jan 15, 2025          ← Date only
🕐 03:45 PM              ← Time only
[2 hours ago]            ← Relative time badge
💲 TXN123456789          ← Transaction ID
```

---

## 📋 Format Functions Available

### 1. `formatDate(dateString)` - Full Date & Time
**Output:** `Jan 15, 2025, 03:45 PM`

**Usage:**
```javascript
import formatDate from '../../FormatDate'
<div>{formatDate(order.created_at)}</div>
```

### 2. `formatDateOnly(dateString)` - Date Only
**Output:** `Jan 15, 2025`

**Usage:**
```javascript
import { formatDateOnly } from '../../FormatDate'
<div>{formatDateOnly(order.created_at)}</div>
```

### 3. `formatTimeOnly(dateString)` - Time Only
**Output:** `03:45 PM`

**Usage:**
```javascript
import { formatTimeOnly } from '../../FormatDate'
<div>{formatTimeOnly(order.created_at)}</div>
```

### 4. `formatRelativeTime(dateString)` - Relative Time
**Output:** 
- `Just now` (< 1 minute)
- `5 minutes ago`
- `2 hours ago`
- `3 days ago`
- `Jan 15, 2025` (> 7 days)

**Usage:**
```javascript
import { formatRelativeTime } from '../../FormatDate'
<div>{formatRelativeTime(order.created_at)}</div>
```

---

## 🎨 Visual Layout in Order History

### Before:
```
Order #12345
📅 January 15, 2025, 03:45 PM
```

### After:
```
Order #12345
📅 Jan 15, 2025
🕐 03:45 PM
[2 hours ago]
💲 TXN123456789
```

---

## 🔧 Features

### Icons
- 📅 **Calendar icon** for date
- 🕐 **Clock icon** for time
- 💲 **Dollar icon** for transaction ID

### Relative Time Badge
- Shows how long ago the order was placed
- Updates dynamically based on current time
- Helpful for quick reference

### 12-Hour Format
- Uses AM/PM notation
- More user-friendly than 24-hour format
- Example: `03:45 PM` instead of `15:45`

### Short Month Names
- Uses abbreviated months (Jan, Feb, Mar)
- Saves space
- Still clear and readable

---

## 📱 Examples

### Recent Order (< 1 hour)
```
Order #12345
📅 Oct 24, 2025
🕐 05:30 PM
[15 minutes ago]
```

### Today's Order
```
Order #12346
📅 Oct 24, 2025
🕐 02:15 PM
[3 hours ago]
```

### Yesterday's Order
```
Order #12347
📅 Oct 23, 2025
🕐 11:20 AM
[1 day ago]
```

### Old Order (> 7 days)
```
Order #12348
📅 Oct 10, 2025
🕐 09:45 AM
[Oct 10, 2025]
```

---

## 🌍 Localization

All formats use `en-US` locale by default. To change:

```javascript
// In FormatDate.jsx
return date.toLocaleDateString('en-NG', options) // Nigerian English
return date.toLocaleDateString('en-GB', options) // British English
```

### Common Locales:
- `en-US` - United States (default)
- `en-GB` - United Kingdom
- `en-NG` - Nigeria
- `en-CA` - Canada
- `en-AU` - Australia

---

## 🎯 Where It's Used

### Order History
- Order list items
- Order details
- Transaction timestamps

### Payment Status
- Order confirmation page
- Payment timestamp

### Profile Page
- Order history section
- Recent activity

---

## 🔄 Time Zones

All times are displayed in the user's local timezone automatically.

**Example:**
- Server time: `2025-10-24T15:30:00Z` (UTC)
- US East Coast: `Oct 24, 2025, 11:30 AM`
- Nigeria: `Oct 24, 2025, 04:30 PM`
- UK: `Oct 24, 2025, 04:30 PM`

---

## 💡 Tips

### For Developers

1. **Always use ISO 8601 format from backend:**
   ```python
   # Django
   order.created_at.isoformat()
   # Output: "2025-10-24T15:30:00Z"
   ```

2. **Import only what you need:**
   ```javascript
   // Good
   import { formatDateOnly, formatTimeOnly } from '../../FormatDate'
   
   // Also works
   import formatDate from '../../FormatDate'
   ```

3. **Handle null/undefined dates:**
   ```javascript
   // All format functions return 'N/A' for invalid dates
   formatDate(null) // "N/A"
   formatDate(undefined) // "N/A"
   formatDate("invalid") // "invalid" (returns original)
   ```

---

## 📊 Format Comparison

| Function | Output Example | Use Case |
|----------|---------------|----------|
| `formatDate` | `Jan 15, 2025, 03:45 PM` | Full timestamp |
| `formatDateOnly` | `Jan 15, 2025` | Date without time |
| `formatTimeOnly` | `03:45 PM` | Time without date |
| `formatRelativeTime` | `2 hours ago` | Quick reference |

---

## 🎨 Customization

### Change Date Format
```javascript
// In FormatDate.jsx, modify options:
const options = {
  year: 'numeric',
  month: 'long',    // 'short' = Jan, 'long' = January, 'numeric' = 1
  day: 'numeric',   // or '2-digit' = 01
}
```

### Change Time Format
```javascript
const options = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,     // false for 24-hour format
}
```

### Change Relative Time Thresholds
```javascript
// In formatRelativeTime function
if (diffSecs < 60) return 'Just now'
if (diffMins < 60) return `${diffMins} minutes ago`
if (diffHours < 24) return `${diffHours} hours ago`
if (diffDays < 7) return `${diffDays} days ago`  // Change 7 to any number
```

---

## ✅ Summary

- ✅ **Date** shown separately with calendar icon
- ✅ **Time** shown separately with clock icon
- ✅ **Relative time** badge for quick reference
- ✅ **12-hour format** with AM/PM
- ✅ **Short month names** for compact display
- ✅ **Transaction ID** with dollar icon
- ✅ **Automatic timezone** conversion
- ✅ **Multiple format options** available

Your order history now has a professional, user-friendly date and time display! 🎉
