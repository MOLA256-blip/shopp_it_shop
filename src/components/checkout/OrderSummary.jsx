import './OrderSummary.css'

const OrderSummary = ({ totalPrice, totalQuantity }) => {
  const shipping = 5.00
  const tax = totalPrice * 0.1
  const grandTotal = totalPrice + shipping + tax

  return (
    <div className="order-summary-card">
      <h5 className="order-summary-title">Order Summary</h5>
      <div className="order-summary-row">
        <span>Items ({totalQuantity})</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className="order-summary-row">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="order-summary-row">
        <span>Tax (10%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <hr />
      <div className="order-summary-total">
        <strong>Total</strong>
        <strong>${grandTotal.toFixed(2)}</strong>
      </div>
    </div>
  )
}

export default OrderSummary
