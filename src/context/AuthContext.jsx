import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const access = localStorage.getItem('access')
    if (access) {
      setIsAuthenticated(true)
      await fetchUserProfile()
    }
  }

  async function fetchUserProfile() {
    try {
      const res = await api.get('/api/user/profile/')
      setUser(res.data)
      setUsername(res.data.username || '')
    } catch (err) {
      console.error('Error fetching user profile:', err)
      // If token is invalid, clear auth state
      if (err.response?.status === 401) {
        logout()
      }
    }
  }

  // Keep fetchUsername for backward compatibility
  async function fetchUsername() {
    await fetchUserProfile()
  }

  async function login(user, pass) {
    try {
      setLoading(true)
      const res = await api.post('/api/token/', {
        username: user,
        password: pass
      })
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      setIsAuthenticated(true)
      setUsername(user)
      // Fetch full user profile after login
      await fetchUserProfile()
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.response?.data?.detail || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsAuthenticated(false)
    setUsername('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      user, 
      loading, 
      login, 
      logout, 
      fetchUsername,
      fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
