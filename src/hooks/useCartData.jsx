import { useState, useEffect } from 'react'
import api from '../api'

const useCartData = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const cartCode = localStorage.getItem('cartCode')

  useEffect(() => {
    if (!cartCode) {
      setLoading(false)
      return
    }
    fetchCart()
  }, [cartCode])

  async function fetchCart() {
    try {
      setLoading(true)
      const res = await api.get('/api/cart/', {
        params: { cart_mode: cartCode }
      })
      setItems(res.data.items || [])
    } catch (err) {
      console.error('Error fetching cart:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function increment(item) {
    try {
      await api.post('/api/add_item/', {
        cart_mode: cartCode,
        product_id: item.product.id,
        quantity: 1
      })
      await fetchCart()
    } catch (err) {
      console.error('Error incrementing item:', err)
    }
  }

  async function decrement(item) {
    try {
      if (item.quantity <= 1) {
        await removeItem(item.id)
      } else {
        await api.post('/api/update_item/', {
          cart_mode: cartCode,
          item_id: item.id,
          quantity: item.quantity - 1
        })
        await fetchCart()
      }
    } catch (err) {
      console.error('Error decrementing item:', err)
    }
  }

  async function removeItem(itemId) {
    try {
      await api.post('/api/delete_item/', {
        cart_mode: cartCode,
        item_id: itemId
      })
      await fetchCart()
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  const mapped = items.map((item) => ({
    id: item.id,
    name: item.product.name,
    price: parseFloat(item.product.price),
    quantity: item.quantity,
    image: item.product.image,
    total: parseFloat(item.product.price) * item.quantity,
    raw: item
  }))

  const totalPrice = mapped.reduce((sum, item) => sum + item.total, 0)
  const totalQuantity = mapped.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    mapped,
    totalPrice,
    totalQuantity,
    loading,
    increment,
    decrement,
    removeItem,
    fetchCart
  }
}

export default useCartData
