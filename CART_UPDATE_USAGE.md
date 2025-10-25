# Cart Update Functions - Usage Guide

## Overview
The `CartContext` now provides comprehensive cart management functions that you can use anywhere in your app.

## Available Functions

### 1. **addItem(productId, quantity)**
Add a new item or increase quantity of existing item in cart.

```javascript
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addItem } = useCart()
  
  const handleAddToCart = () => {
    addItem(product.id, 1) // Add 1 item
  }
  
  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  )
}
```

### 2. **updateItem(itemId, quantity)**
Set a specific quantity for a cart item.

```javascript
const { updateItem } = useCart()

// Set item quantity to 5
updateItem(itemId, 5)
```

### 3. **incrementItem(productId)**
Increase item quantity by 1.

```javascript
const { incrementItem } = useCart()

// Add 1 more of this product
incrementItem(product.id)
```

### 4. **decrementItem(itemId, currentQuantity)**
Decrease item quantity by 1. If quantity becomes 0, item is removed.

```javascript
const { decrementItem } = useCart()

// Decrease by 1
decrementItem(item.id, item.quantity)
```

### 5. **removeItem(itemId)**
Remove an item completely from cart.

```javascript
const { removeItem } = useCart()

// Remove item
removeItem(item.id)
```

### 6. **fetchCart()**
Get full cart details including all items.

```javascript
const { fetchCart } = useCart()

useEffect(() => {
  const loadCart = async () => {
    const cartData = await fetchCart()
    console.log(cartData)
  }
  loadCart()
}, [])
```

### 7. **fetchCartCount()**
Update the cart count badge (automatically called after cart operations).

```javascript
const { fetchCartCount } = useCart()

useEffect(() => {
  fetchCartCount()
}, [])
```

### 8. **clearCart()**
Clear the entire cart (removes cart code from localStorage).

```javascript
const { clearCart } = useCart()

const handleClearCart = () => {
  if (confirm('Clear entire cart?')) {
    clearCart()
  }
}
```

### 9. **getCartCode()**
Get the current cart code.

```javascript
const { getCartCode } = useCart()

const cartCode = getCartCode()
console.log('Cart code:', cartCode)
```

## State Values

### **cart**
Full cart object with all details.

```javascript
const { cart } = useCart()

console.log(cart?.items) // Array of cart items
console.log(cart?.total) // Cart total
```

### **cartCount**
Total number of items in cart (displayed in navbar badge).

```javascript
const { cartCount } = useCart()

return <span>Cart ({cartCount})</span>
```

## Complete Example: Cart Item Component

```javascript
import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { incrementItem, decrementItem, removeItem } = useCart()
  
  return (
    <div className="cart-item">
      <img src={item.product.image} alt={item.product.name} />
      <h3>{item.product.name}</h3>
      <p>${item.product.price}</p>
      
      <div className="quantity-controls">
        <button onClick={() => decrementItem(item.id, item.quantity)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => incrementItem(item.product.id)}>+</button>
      </div>
      
      <button onClick={() => removeItem(item.id)}>Remove</button>
      
      <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
    </div>
  )
}
```

## Complete Example: Product Page with Quantity Selector

```javascript
import { useState } from 'react'
import { useCart } from '../../context/CartContext'

function ProductPage({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  
  const handleAddToCart = () => {
    addItem(product.id, quantity)
  }
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      
      <div className="quantity-selector">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
        />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}
```

## Toast Notifications

All cart operations show toast notifications:
- ✅ **Success**: "Item added to cart!", "Cart updated!", "Item removed from cart"
- ❌ **Error**: "Failed to add item to cart", "Failed to update cart", "Failed to remove item"
- ℹ️ **Info**: "Cart cleared"

## Notes

- All functions are async and handle errors automatically
- Cart count updates automatically after each operation
- Cart code is stored in localStorage as 'cartCode'
- Backend auto-creates cart if it doesn't exist
- All operations use the `/api/add_item/`, `/api/update_item/`, `/api/delete_item/` endpoints
