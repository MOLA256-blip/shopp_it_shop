import axios from "axios"

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000"

const api = axios.create({
    baseURL: BASE_URL
})

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

api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access')
  if (access && !isExpired(access)) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let isRefreshing = false
let pendingQueue = []

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject })
    })
  }
  isRefreshing = true
  try {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) throw new Error('No refresh token')
    const res = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh })
    const newAccess = res?.data?.access
    if (!newAccess) throw new Error('No access in refresh')
    localStorage.setItem('access', newAccess)
    pendingQueue.forEach(p => p.resolve(newAccess))
    pendingQueue = []
    return newAccess
  } catch (err) {
    pendingQueue.forEach(p => p.reject(err))
    pendingQueue = []
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    throw err
  } finally {
    isRefreshing = false
  }
}

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config
    if (!original || original.__isRetryRequest) {
      return Promise.reject(error)
    }
    if (error.response && error.response.status === 401) {
      // Don't try to refresh if this is already a token endpoint
      if (original.url?.includes('/api/token/')) {
        return Promise.reject(error)
      }
      try {
        const newAccess = await refreshAccessToken()
        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${newAccess}`
        original.__isRetryRequest = true
        return api(original)
      } catch (e) {
        // Silently fail if no refresh token (user not logged in)
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api