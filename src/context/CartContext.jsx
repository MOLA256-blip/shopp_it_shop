import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)
  const [cart, setCart] = useState(null)

  // Get or create cart code
  const getCartCode = () => {
    let cartCode = localStorage.getItem('cartCode')
    if (!cartCode) {
      // Generate a unique cart code
      cartCode = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('cartCode', cartCode)
    }
    return cartCode
  }

  // Fetch full cart details
  const fetchCart = useCallback(async () => {
    try {
      const cartCode = getCartCode()
      const res = await api.get('/api/cart/', {
        params: { cart_mode: cartCode }
      })
      setCart(res.data)
      const items = res.data.items || []
      const count = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
      return res.data
    } catch (err) {
      console.error('Error fetching cart:', err)
      setCart(null)
      setCartCount(0)
      return null
    }
  }, [])

  // Add item to cart
  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      const cartCode = getCartCode()
      await api.post('/api/add_item/', {
        cart_mode: cartCode,
        product_id: productId,
        quantity: quantity
      })
      toast.success('Item added to cart!')
      // Update cart count
      fetchCartCount()
    } catch (err) {
      console.error('Error adding item to cart:', err)
      toast.error('Failed to add item to cart')
    }
  }, [])

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    try {
      const cartCode = getCartCode()
      const res = await api.get('/api/cart/', {
        params: { cart_mode: cartCode }
      })
      const items = res.data.items || []
      const count = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
    } catch (err) {
      console.error('Error fetching cart count:', err)
    }
  }, [])

  // Update item quantity
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      const cartCode = getCartCode()
      await api.post('/api/update_item/', {
        cart_mode: cartCode,
        item_id: itemId,
        quantity: quantity
      })
      toast.success('Cart updated!')
      fetchCartCount()
    } catch (err) {
      console.error('Error updating item:', err)
      toast.error('Failed to update cart')
    }
  }, [])

  // Increment item quantity
  const incrementItem = useCallback(async (productId) => {
    try {
      const cartCode = getCartCode()
      await api.post('/api/add_item/', {
        cart_mode: cartCode,
        product_id: productId,
        quantity: 1
      })
      fetchCartCount()
    } catch (err) {
      console.error('Error incrementing item:', err)
      toast.error('Failed to update cart')
    }
  }, [])

  // Decrement item quantity
  const decrementItem = useCallback(async (itemId, currentQuantity) => {
    try {
      if (currentQuantity <= 1) {
        await removeItem(itemId)
      } else {
        const cartCode = getCartCode()
        await api.post('/api/update_item/', {
          cart_mode: cartCode,
          item_id: itemId,
          quantity: currentQuantity - 1
        })
        fetchCartCount()
      }
    } catch (err) {
      console.error('Error decrementing item:', err)
      toast.error('Failed to update cart')
    }
  }, [])

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      const cartCode = getCartCode()
      await api.post('/api/delete_item/', {
        cart_mode: cartCode,
        item_id: itemId
      })
      toast.success('Item removed from cart')
      fetchCartCount()
    } catch (err) {
      console.error('Error removing item:', err)
      toast.error('Failed to remove item')
    }
  }, [])

  // Clear cart (remove cart code from localStorage)
  const clearCart = useCallback(() => {
    localStorage.removeItem('cartCode')
    setCart(null)
    setCartCount(0)
    toast.info('Cart cleared')
  }, [])

  const value = {
    cart,
    cartCount,
    addItem,
    updateItem,
    incrementItem,
    decrementItem,
    removeItem,
    fetchCart,
    fetchCartCount,
    clearCart,
    getCartCode
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
