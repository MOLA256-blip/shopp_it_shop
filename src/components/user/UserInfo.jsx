import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import './UserInfo.css'

const UserInfo = ({ user, loading }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const { fetchUserProfile } = useAuth()

  function handleEdit() {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      age: user.age || ''
    })
    setAvatarFile(null)
    setAvatarPreview(null)
    setIsEditing(true)
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setAvatarFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      setSaving(true)
      
      // If avatar file is selected, upload it first
      if (avatarFile) {
        const formDataWithFile = new FormData()
        formDataWithFile.append('avatar', avatarFile)
        // Add other fields
        Object.keys(formData).forEach(key => {
          if (formData[key]) {
            formDataWithFile.append(key, formData[key])
          }
        })
        await api.put('/api/user/profile/', formDataWithFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Just update text fields
        await api.put('/api/user/profile/', formData)
      }
      
      await fetchUserProfile()
      setIsEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setIsEditing(false)
    setFormData({})
    setAvatarFile(null)
    setAvatarPreview(null)
  }
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    )
  }

  if (!user) {
    return <div className="alert alert-warning">No user info available.</div>
  }

  if (isEditing) {
    return (
      <div className="user-info card">
        <div className="card-body">
          <h5 className="mb-3">Edit Profile</h5>
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-md-12 mb-4">
                <label className="form-label">Profile Picture</label>
                <div className="d-flex align-items-center gap-3">
                  <img 
                    className="avatar" 
                    src={avatarPreview || user.avatar || '/src/assets/react.svg'} 
                    alt="Profile" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      id="avatar-upload"
                    />
                    <small className="text-muted d-block mt-1">Max size: 5MB. Formats: JPG, PNG, GIF</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">City</label>
                <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">State</label>
                <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Country</label>
                <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Age</label>
                <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Generate initials for default avatar
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    return user.username?.[0]?.toUpperCase() || 'U'
  }

  return (
    <div className="user-info card">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            {user.avatar ? (
              <img 
                className="avatar me-3" 
                src={user.avatar} 
                alt={user.username}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="avatar me-3 d-flex align-items-center justify-content-center bg-dark text-white fw-bold"
                style={{ width: '80px', height: '80px', borderRadius: '50%', fontSize: '32px' }}
              >
                {getInitials()}
              </div>
            )}
            <div>
              <h5 className="mb-1">{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</h5>
              <p className="text-muted mb-0">@{user.username}</p>
            </div>
          </div>
          <button className="btn btn-outline-dark" onClick={handleEdit}>
            Edit Profile
          </button>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="text-muted small">Email</label>
            <div className="fw-semibold">{user.email || 'Not provided'}</div>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="text-muted small">Phone</label>
            <div className="fw-semibold">{user.phone || 'Not provided'}</div>
          </div>
          
          <div className="col-md-12 mb-3">
            <label className="text-muted small">Address</label>
            <div className="fw-semibold">{user.address || 'Not provided'}</div>
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="text-muted small">City</label>
            <div className="fw-semibold">{user.city || 'Not provided'}</div>
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="text-muted small">State</label>
            <div className="fw-semibold">{user.state || 'Not provided'}</div>
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="text-muted small">Country</label>
            <div className="fw-semibold">{user.country || 'Not provided'}</div>
          </div>
          
          {user.age && (
            <div className="col-md-6 mb-3">
              <label className="text-muted small">Age</label>
              <div className="fw-semibold">{user.age}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
