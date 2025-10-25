import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../../api'

const RegisterPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      
      // Register user
      const res = await api.post('/api/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      })

      if (res.status === 201) {
        toast.success('Account created successfully!')
        
        // Auto-login after registration
        const loginRes = await login(formData.username, formData.password)
        if (loginRes.ok) {
          navigate('/')
        } else {
          navigate('/login')
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       'Registration failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3">Create Account</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="first_name"
                        value={formData.first_name} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="last_name"
                        value={formData.last_name} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Username *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="username"
                      value={formData.username} 
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password"
                      value={formData.password} 
                      onChange={handleChange}
                      required 
                      minLength="6"
                    />
                    <small className="text-muted">At least 6 characters</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password2"
                      value={formData.password2} 
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <button className="btn btn-dark w-100 mb-3" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login here</Link></p>
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

export default RegisterPage
