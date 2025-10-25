import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import { useCart } from '../../context/CartContext'

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [orderDetails, setOrderDetails] = useState(null)
  const navigate = useNavigate()
  const { clearCart, fetchCartCount } = useCart()

  useEffect(() => {
    verifyPayment()
  }, [])

  async function verifyPayment() {
    try {
      // Flutterwave parameters
      const fwStatus = searchParams.get('status')
      const txRef = searchParams.get('tx_ref')
      const transactionId = searchParams.get('transaction_id')

      if (fwStatus && txRef && transactionId) {
        // Flutterwave verification
        const res = await api.post('/api/payments/flutterwave/callback/', {
          status: fwStatus,
          tx_ref: txRef,
          transaction_id: transactionId
        })
        
        if (res.data.success) {
          setStatus('success')
          setMessage(res.data.message || 'Payment successful!')
          setOrderDetails(res.data.order || null)
          clearCart()
          await fetchCartCount()
        } else {
          setStatus('failed')
          setMessage(res.data.message || 'Payment verification failed')
        }
      } else {
        setStatus('failed')
        setMessage('Invalid payment parameters. Please try again.')
      }
    } catch (err) {
      setStatus('failed')
      setMessage(err.response?.data?.error || 'Payment verification failed')
    }
  }

  if (status === 'loading') {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 text-center">
              <div className="card shadow-lg border-0">
                <div className="card-body py-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="mb-2">Verifying Payment</h4>
                  <p className="text-muted">Please wait while we confirm your transaction...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className={`card-header text-center py-4 ${status === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                <div className="mb-3">
                  {status === 'success' ? (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ) : (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </div>
                <h2 className="mb-0">
                  {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                </h2>
              </div>

              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <p className="lead">{message}</p>
                </div>

                {status === 'success' && orderDetails && (
                  <div className="border rounded p-3 mb-4 bg-light">
                    <h6 className="mb-3">Order Details</h6>
                    <div className="row g-2">
                      {orderDetails.id && (
                        <div className="col-6">
                          <small className="text-muted">Order Number</small>
                          <div className="fw-bold">#{orderDetails.id}</div>
                        </div>
                      )}
                      {orderDetails.total && (
                        <div className="col-6">
                          <small className="text-muted">Total Amount</small>
                          <div className="fw-bold">${Number(orderDetails.total).toFixed(2)}</div>
                        </div>
                      )}
                      {orderDetails.transaction_id && (
                        <div className="col-12 mt-2">
                          <small className="text-muted">Transaction ID</small>
                          <div className="fw-bold small">{orderDetails.transaction_id}</div>
                        </div>
                      )}
                      {orderDetails.created_at && (
                        <div className="col-12 mt-2">
                          <small className="text-muted">Date</small>
                          <div className="fw-bold">{new Date(orderDetails.created_at).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {status === 'success' ? (
                  <div className="alert alert-info mb-4">
                    <strong>What's next?</strong>
                    <ul className="mb-0 mt-2 ps-3">
                      <li>A confirmation email has been sent to your email address</li>
                      <li>You can track your order in your profile</li>
                      <li>Your items will be processed and shipped soon</li>
                    </ul>
                  </div>
                ) : (
                  <div className="alert alert-warning mb-4">
                    <strong>What went wrong?</strong>
                    <p className="mb-2 mt-2">Your payment could not be processed. Common reasons include:</p>
                    <ul className="mb-0 ps-3">
                      <li>Insufficient funds</li>
                      <li>Payment method declined</li>
                      <li>Network timeout</li>
                    </ul>
                  </div>
                )}

                <div className="d-grid gap-2">
                  {status === 'success' ? (
                    <>
                      <Link to="/profile" className="btn btn-success btn-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                        View My Orders
                      </Link>
                      <Link to="/" className="btn btn-outline-success">
                        Continue Shopping
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/checkout" className="btn btn-danger btn-lg">
                        Try Again
                      </Link>
                      <Link to="/cart" className="btn btn-outline-secondary">
                        Back to Cart
                      </Link>
                      <Link to="/" className="btn btn-outline-secondary">
                        Go to Home
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentStatusPage
