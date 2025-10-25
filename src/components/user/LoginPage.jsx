import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const { login, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setError('')
  }, [username, password])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const res = await login(username, password)
    if (res.ok) {
      const from = location.state?.from || '/checkout'
      navigate(from, { replace: true })
    } else {
      setError(res.message || 'Invalid credentials')
    }
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Login</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0">Password</label>
                      <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link>
                    </div>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button className="btn btn-dark w-100 mb-3" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <div className="text-center">
                    <p className="mb-0">Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Sign up</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
