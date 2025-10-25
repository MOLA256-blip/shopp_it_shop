import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

const OrderItem = ({ item, onInc, onDec, onDelete }) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const handleDelete = () => {
    onDelete()
    setShowDeletePopup(false)
  }

  return (
    <>
      <li className="list-group-item">
        <div className="row align-items-center g-3">
          <div className="col-3 col-md-2">
            <img src={item.image} alt={item.name} className="img-fluid rounded" />
          </div>
          <div className="col-9 col-md-4">
            <h6 className="mb-0">{item.name}</h6>
            <small className="text-muted">${item.price.toFixed(2)}</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="btn-group" role="group">
              <button className="btn btn-sm btn-outline-secondary" onClick={onDec}>-</button>
              <button className="btn btn-sm btn-outline-secondary" disabled>{item.quantity}</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={onInc}>+</button>
            </div>
          </div>
          <div className="col-4 col-md-2 text-end">
            <strong>${item.total.toFixed(2)}</strong>
          </div>
          <div className="col-2 col-md-1 text-end">
            <button className="btn btn-sm btn-outline-danger" onClick={() => setShowDeletePopup(true)}>
              <FaTrash />
            </button>
          </div>
        </div>
      </li>

      {showDeletePopup && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeletePopup(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to remove this item from your cart?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderItem
