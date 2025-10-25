import { Link } from 'react-router-dom'
import useCartData from '../../hooks/useCartData'
import OrderItem from '../checkout/OrderItem'

const CartPage = () => {
  const { mapped, items, totalPrice, totalQuantity, loading, increment, decrement, removeItem } = useCartData()

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Your Cart</h2>
          <Link to="/" className="btn btn-outline-secondary">Continue Shopping</Link>
        </div>

        {loading && <div className="alert alert-info">Loading cart...</div>}

        {items.length === 0 && !loading && (
          <div className="alert alert-warning">Your cart is empty.</div>
        )}

        {items.length > 0 && (
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <ul className="list-group">
                {mapped.map((it) => (
                  <OrderItem key={it.id} item={it} onInc={() => increment(it.raw)} onDec={() => decrement(it.raw)} onDelete={() => removeItem(it.id)} />
                ))}
              </ul>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Summary</h5>
                  <div className="d-flex justify-content-between">
                    <span>Items</span>
                    <span>{totalQuantity}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <strong>Total</strong>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                  <Link to="/checkout" className="btn btn-dark w-100 mt-3" aria-disabled={items.length === 0}>Checkout</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CartPage
