import { useEffect, useState } from 'react'
import api from '../../api'
import OrderHistoryItem from './OrderHistoryItem'

const OrderHistoryItemContainer = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const res = await api.get('/api/orders/history/')
        if (!active) return
        const orderData = Array.isArray(res.data) ? res.data : []
        setOrders(orderData)
        setFilteredOrders(orderData)
        setError('')
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.detail || 'Failed to load orders')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  useEffect(() => {
    let result = [...orders]

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date))
    } else if (sortBy === 'highest') {
      result.sort((a, b) => Number(b.total || 0) - Number(a.total || 0))
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => Number(a.total || 0) - Number(b.total || 0))
    }

    setFilteredOrders(result)
  }, [orders, statusFilter, sortBy])

  if (loading) return <div className="alert alert-info">Loading orders...</div>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (orders.length === 0) return (
    <div className="alert alert-info">
      <h5>No orders yet</h5>
      <p className="mb-0">Your order history will appear here after you make your first purchase.</p>
    </div>
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <label className="text-muted small mb-0">Filter:</label>
          <select 
            className="form-select form-select-sm" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="text-muted small mb-0">Sort:</label>
          <select 
            className="form-select form-select-sm" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="mb-2 text-muted small">
        Showing {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-warning">
          No orders match the selected filter.
        </div>
      ) : (
        <div>
          {filteredOrders.map((o) => (
            <OrderHistoryItem key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistoryItemContainer
