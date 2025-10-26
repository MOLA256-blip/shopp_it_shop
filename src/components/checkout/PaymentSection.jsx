import { useState } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import api from '../../api'
import './PaymentSection.module.css'

const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X'

const PaymentSection = ({ cartCode, totalAmount }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMobileMoneyForm, setShowMobileMoneyForm] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return {
          email: user.email || 'customer@example.com',
          name: user.username || 'Customer',
          phone: user.phone_number || ''
        }
      }
    } catch (e) {
      console.error('Error parsing user info:', e)
    }
    return {
      email: 'customer@example.com',
      name: 'Customer',
      phone: ''
    }
  }

  const userInfo = getUserInfo()

  // Flutterwave configuration
  const config = {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `${cartCode}-${Date.now()}`,
    amount: totalAmount,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: {
      email: userInfo.email,
      phone_number: userInfo.phone,
      name: userInfo.name,
    },
    customizations: {
      title: 'Shoppit Payment',
      description: `Payment for cart ${cartCode}`,
      logo: 'https://your-logo-url.com/logo.png',
    },
  }

  const handleFlutterwave = useFlutterwave(config)

  async function handleFlutterwavePayment() {
    setLoading(true)
    setError('')
    
    handleFlutterwave({
      callback: async (response) => {
        console.log('Flutterwave payment response:', response)
        closePaymentModal()
        
        if (response.status === 'successful') {
          // Verify payment with backend
          try {
            const res = await api.post('/api/payments/flutterwave/callback/', {
              status: 'successful',
              tx_ref: response.tx_ref,
              transaction_id: response.transaction_id
            })
            
            if (res.data.success) {
              window.location.href = `/payment/status?status=success&tx_ref=${response.tx_ref}&transaction_id=${response.transaction_id}`
            } else {
              setError('Payment verification failed. Please contact support.')
            }
          } catch (err) {
            console.error('Verification error:', err)
            setError('Payment verification failed. Please contact support.')
          }
        } else {
          setError('Payment was not completed. Please try again.')
        }
        setLoading(false)
      },
      onClose: () => {
        console.log('Payment modal closed')
        setLoading(false)
      },
    })
  }

  function handleMobileMoneyClick(provider) {
    setSelectedProvider(provider)
    setShowMobileMoneyForm(true)
    setError('')
  }

  async function handleMobileMoneySubmit(e) {
    e.preventDefault()
    
    if (!phoneNumber || !transactionId) {
      setError('Please enter both phone number and transaction ID')
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await api.post('/api/payments/mobile-money/verify/', {
        cart_code: cartCode,
        provider: selectedProvider,
        phone_number: phoneNumber,
        transaction_id: transactionId
      })

      if (res.data.success) {
        // Redirect to success page
        window.location.href = `/payment/status?status=success&tx_ref=${cartCode}&transaction_id=${transactionId}`
      } else {
        setError(res.data.message || 'Payment verification failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Mobile money payment failed')
    } finally {
      setLoading(false)
    }
  }

  function cancelMobileMoneyForm() {
    setShowMobileMoneyForm(false)
    setSelectedProvider('')
    setPhoneNumber('')
    setTransactionId('')
    setError('')
  }

  if (showMobileMoneyForm) {
    return (
      <div className="payment-section">
        <h5 className="mb-3">
          {selectedProvider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'} Payment
        </h5>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="alert alert-info">
          <strong>Payment Instructions:</strong>
          <ol className="mb-0 mt-2 ps-3">
            <li>Send <strong>UGX {Number(totalAmount).toLocaleString()}</strong> to: <strong>0701126433</strong></li>
            <li>You will receive a confirmation SMS with Transaction ID</li>
            <li>Enter your phone number and Transaction ID below</li>
          </ol>
        </div>

        <form onSubmit={handleMobileMoneySubmit}>
          <div className="mb-3">
            <label className="form-label">Your Phone Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="e.g., 0803XXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Transaction ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Transaction ID from SMS"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
            <small className="text-muted">
              You'll receive this in the confirmation SMS after sending money
            </small>
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-success btn-lg"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={cancelMobileMoneyForm}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="payment-section">
      <h5 className="mb-3">Payment Method</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="d-grid gap-3">
        {/* Flutterwave Payment */}
        <button 
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2" 
          onClick={handleFlutterwavePayment}
          disabled={loading}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          {loading ? 'Processing...' : 'Pay with Flutterwave'}
        </button>

        {/* MTN Mobile Money */}
        <button 
          className="btn btn-warning btn-lg d-flex align-items-center justify-content-center gap-2 text-dark" 
          onClick={() => handleMobileMoneyClick('mtn')}
          disabled={loading}
          style={{ backgroundColor: '#FFCC00', borderColor: '#FFCC00' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          Pay with MTN Mobile Money
        </button>

        {/* Airtel Money */}
        <button 
          className="btn btn-lg d-flex align-items-center justify-content-center gap-2 text-white" 
          onClick={() => handleMobileMoneyClick('airtel')}
          disabled={loading}
          style={{ backgroundColor: '#E60000', borderColor: '#E60000' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          Pay with Airtel Money
        </button>
      </div>

      <div className="mt-3 text-center">
        <small className="text-muted">
          Secure payment powered by Flutterwave
        </small>
      </div>
    </div>
  )
}

export default PaymentSection
