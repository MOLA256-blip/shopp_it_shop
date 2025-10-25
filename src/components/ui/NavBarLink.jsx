import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const NavBarLink = () => {
  const { isAuthenticated, logout, username } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
            <Link className="nav-link active fw-semibold" to="/">Home</Link>
        </li>
        <li className="nav-item">
             <Link to="/shop" className="nav-link active fw-semibold">Shop</Link>
        </li>
         <li className="nav-item">
            <Link className="nav-link active fw-semibold" to="/about">About</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link active fw-semibold" to="/contact">Contact</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/profile">{username ? `Hi, ${username}` : 'Profile'}</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link fw-semibold" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/register">Register</Link>
            </li>
          </>
        )}
    </ul>

  )
}

export default NavBarLink
