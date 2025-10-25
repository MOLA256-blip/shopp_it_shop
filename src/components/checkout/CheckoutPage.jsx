import { Link } from 'react-router-dom'
import useCartData from '../../hooks/useCartData'
import OrderItem from './OrderItem'
import OrderSummary from './OrderSummary'
import PaymentSection from './PaymentSection'

const CheckoutPage = () => {
  const { mapped, items, totalPrice, totalQuantity, loading, increment, decrement, removeItem } = useCartData()
  const cartCode = localStorage.getItem('cartCode')

  const shipping = 5.00
  const tax = totalPrice * 0.1
  const grandTotal = totalPrice + shipping + tax

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Checkout</h2>
          <Link to="/cart" className="btn btn-outline-secondary">Back to Cart</Link>
        </div>

        {loading && <div className="alert alert-info">Loading...</div>}

        {items.length === 0 && !loading && (
          <div className="alert alert-warning">
            Your cart is empty. <Link to="/">Continue shopping</Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="mb-4">
                <h5 className="mb-3">Order Items</h5>
                <ul className="list-group">
                  {mapped.map((it) => (
                    <OrderItem 
                      key={it.id} 
                      item={it} 
                      onInc={() => increment(it.raw)} 
                      onDec={() => decrement(it.raw)} 
                      onDelete={() => removeItem(it.id)} 
                    />
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="mb-3">
                <OrderSummary totalPrice={totalPrice} totalQuantity={totalQuantity} />
              </div>
              <PaymentSection cartCode={cartCode} totalAmount={grandTotal} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CheckoutPage
