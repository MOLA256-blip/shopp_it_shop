const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    
    return date.toLocaleDateString('en-US', options)
  } catch {
    return dateString
  }
}

// Format date only (no time)
export const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    
    return date.toLocaleDateString('en-US', options)
  } catch {
    return dateString
  }
}

// Format time only
export const formatTimeOnly = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    
    return date.toLocaleTimeString('en-US', options)
  } catch {
    return dateString
  }
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const now = new Date()
    const diffMs = now - date
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    
    return formatDateOnly(dateString)
  } catch {
    return dateString
  }
}

export default formatDate
