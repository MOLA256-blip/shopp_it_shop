import { useState } from 'react'
import './orderhistoryitemmodule.css'
import formatDate, { formatDateOnly, formatTimeOnly, formatRelativeTime } from '../../FormatDate'

const OrderHistoryItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false)

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-success'
      case 'pending':
        return 'bg-warning'
      case 'processing':
        return 'bg-info'
      case 'cancelled':
      case 'failed':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <div className={`order-history-item card mb-3 shadow-sm`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="mb-1">Order #{order.id}</h6>
            <div className="text-muted small mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formatDateOnly(order.created_at || order.date)}
            </div>
            <div className="text-muted small mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {formatTimeOnly(order.created_at || order.date)}
            </div>
            <div className="text-muted small">
              <span className="badge bg-light text-dark">{formatRelativeTime(order.created_at || order.date)}</span>
            </div>
            {order.transaction?.transaction_id && (
              <div className="text-muted small mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                {order.transaction.transaction_id}
              </div>
            )}
          </div>
          <div className="text-end">
            <div className="mb-2">
              <span className="text-muted small">Total: </span>
              <strong className="fs-5">${Number(order.total || 0).toFixed(2)}</strong>
            </div>
            <span className={`badge ${getStatusBadgeClass(order.status)} text-uppercase`}>
              {order.status || 'pending'}
            </span>
          </div>
        </div>

        {Array.isArray(order.items) && order.items.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
              <button 
                className="btn btn-sm btn-link text-decoration-none p-0" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {expanded && (
              <div className="border-top pt-2">
                {order.items.map((it, index) => (
                  <div key={it.id || index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                      {it.product_image && (
                        <img 
                          src={it.product_image} 
                          alt={it.name || it.product_name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <div>
                        <div className="fw-semibold">{it.name || it.product_name}</div>
                        <div className="text-muted small">Quantity: {it.quantity}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">${Number(it.price || it.unit_price || 0).toFixed(2)}</div>
                      <div className="text-muted small">
                        ${(Number(it.price || it.unit_price || 0) * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistoryItem
