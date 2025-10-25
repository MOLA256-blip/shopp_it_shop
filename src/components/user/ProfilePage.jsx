import { useEffect } from 'react'
import UserInfo from './UserInfo'
import OrderHistoryItemContainer from './OrderHistoryItemContainer'
import { useAuth } from '../../context/AuthContext'

const ProfilePage = () => {
  const { user, loading, fetchUserProfile } = useAuth()

  useEffect(() => {
    // Refresh user profile when page loads
    if (!user) {
      fetchUserProfile()
    }
  }, [])

  return (
    <section className="py-4">
      <div className="container">
        <h2 className="mb-3">Your Profile</h2>
        <UserInfo user={user} loading={loading} />

        <h3 className="mt-4">Order History</h3>
        <OrderHistoryItemContainer />
      </div>
    </section>
  )
}

export default ProfilePage
