import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import api from '../../api'

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

function isExpired(token) {
  const decoded = decodeJwt(token)
  if (!decoded?.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp <= now
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const [authorized, setAuthorized] = useState(null)

  useEffect(() => {
    let active = true
    async function check() {
      try {
        const access = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')
        if (access && !isExpired(access)) {
          if (active) setAuthorized(true)
          return
        }
        if (refresh) {
          // try refresh
          const res = await api.post('/api/token/refresh/', { refresh })
          const newAccess = res?.data?.access
          if (newAccess) {
            localStorage.setItem('access', newAccess)
            if (active) setAuthorized(true)
            return
          }
        }
        if (active) setAuthorized(false)
      } catch {
        if (active) setAuthorized(false)
      }
    }
    check()
    return () => { active = false }
  }, [])

  if (authorized === null) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    )
  }

  if (!authorized) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
