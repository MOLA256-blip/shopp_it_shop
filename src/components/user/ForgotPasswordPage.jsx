import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'
import { toast } from 'react-toastify'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending reset email
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.info('Password reset functionality coming soon!')
    }, 1000)
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Forgot Password</h4>
                
                {!submitted ? (
                  <>
                    <p className="text-muted mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                          placeholder="Enter your email"
                        />
                      </div>
                      <button className="btn btn-dark w-100 mb-3" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                      <div className="text-center">
                        <Link to="/login" className="text-decoration-none">Back to Login</Link>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-success">
                      <strong>Check your email!</strong>
                      <p className="mb-0 mt-2">
                        If an account exists with {email}, you will receive a password reset link shortly.
                      </p>
                    </div>
                    <Link to="/login" className="btn btn-dark">Back to Login</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgotPasswordPage
