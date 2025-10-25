# User Information Access Guide

## Overview
The `AuthContext` now provides complete user information that's available throughout your app.

## Available User Data

### From `useAuth()` hook:

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { 
    isAuthenticated,  // boolean - is user logged in?
    username,         // string - username
    user,            // object - full user profile
    loading,         // boolean - is auth loading?
    login,           // function - login user
    logout,          // function - logout user
    fetchUserProfile // function - refresh user data
  } = useAuth()
}
```

## User Object Structure

```javascript
user = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  city: "",
  state: "",
  address: "",
  phone: "",
  country: "",
  age: null,
  avatar: null
}
```

## Usage Examples

### 1. Display User Name in Component

```javascript
import { useAuth } from '../context/AuthContext'

function WelcomeMessage() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <p>Please log in</p>
  }
  
  return (
    <div>
      <h2>Welcome, {user?.first_name || user?.username}!</h2>
      <p>Email: {user?.email}</p>
    </div>
  )
}
```

### 2. Check Authentication Status

```javascript
import { useAuth } from '../context/AuthContext'

function ProtectedContent() {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>User ID: {user?.id}</p>
    </div>
  )
}
```

### 3. Display User Avatar or Initials

```javascript
import { useAuth } from '../context/AuthContext'

function UserAvatar() {
  const { user } = useAuth()
  
  if (!user) return null
  
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase()
  
  return (
    <div className="avatar">
      {user.avatar ? (
        <img src={user.avatar} alt={user.username} />
      ) : (
        <div className="avatar-initials">{initials}</div>
      )}
    </div>
  )
}
```

### 4. Conditional Rendering Based on User

```javascript
import { useAuth } from '../context/AuthContext'

function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth()
  
  return (
    <div className="user-menu">
      {isAuthenticated ? (
        <>
          <span>Hi, {user?.username}!</span>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  )
}
```

### 5. Access User in Checkout

```javascript
import { useAuth } from '../context/AuthContext'

function CheckoutPage() {
  const { user } = useAuth()
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.first_name + ' ' + user?.last_name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || '',
    phone: user?.phone || ''
  })
  
  // ... rest of checkout logic
}
```

### 6. Refresh User Profile

```javascript
import { useAuth } from '../context/AuthContext'

function ProfileEditForm() {
  const { user, fetchUserProfile } = useAuth()
  
  async function handleSave(updatedData) {
    try {
      await api.put('/api/user/profile/', updatedData)
      // Refresh user data in context
      await fetchUserProfile()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }
  
  return (
    <form onSubmit={handleSave}>
      {/* form fields */}
    </form>
  )
}
```

### 7. Check if User Has Complete Profile

```javascript
import { useAuth } from '../context/AuthContext'

function ProfileCompletionBanner() {
  const { user } = useAuth()
  
  const isProfileComplete = user?.first_name && 
                           user?.last_name && 
                           user?.email && 
                           user?.phone && 
                           user?.address
  
  if (isProfileComplete) return null
  
  return (
    <div className="alert alert-warning">
      <strong>Complete your profile</strong>
      <p>Add your contact information for a better experience</p>
      <Link to="/profile">Complete Profile</Link>
    </div>
  )
}
```

## Automatic Updates

The user information is automatically:
- ✅ Loaded when the app starts (if user is logged in)
- ✅ Updated after successful login
- ✅ Updated after successful registration
- ✅ Cleared on logout
- ✅ Available across all components via `useAuth()`

## Best Practices

1. **Always check if user exists before accessing properties:**
   ```javascript
   const fullName = user?.first_name || 'Guest'
   ```

2. **Use isAuthenticated to check login status:**
   ```javascript
   if (isAuthenticated) {
     // User is logged in
   }
   ```

3. **Refresh user data after profile updates:**
   ```javascript
   await fetchUserProfile()
   ```

4. **Handle loading states:**
   ```javascript
   if (loading) return <Spinner />
   ```

## Common Patterns

### Navbar with User Info
```javascript
const { isAuthenticated, user } = useAuth()

{isAuthenticated && (
  <div className="user-info">
    <span>{user?.username}</span>
    <img src={user?.avatar || '/default-avatar.png'} />
  </div>
)}
```

### Protected Route
```javascript
const { isAuthenticated } = useAuth()

if (!isAuthenticated) {
  return <Navigate to="/login" />
}
```

### Personalized Greeting
```javascript
const { user } = useAuth()
const greeting = user?.first_name 
  ? `Welcome back, ${user.first_name}!` 
  : `Welcome, ${user?.username}!`
```

## Troubleshooting

**User is null after login:**
- Check if the `/api/user/profile/` endpoint is working
- Check browser console for errors
- Verify JWT token is stored in localStorage

**User data is outdated:**
- Call `fetchUserProfile()` to refresh
- Check if profile update API call was successful

**Can't access user in component:**
- Make sure component is wrapped in `<AuthProvider>`
- Import and use `useAuth()` hook correctly
