import React from 'react'
import { FaCartShopping } from "react-icons/fa6";
import { Link} from 'react-router-dom'
import styles from "./Navbar.module.css"
import NavBarLink from "./NavBarLink"
import { useCart } from "../../context/CartContext"

const Navbar = () => {
  const { cartCount, fetchCartCount } = useCart()
  
  // Fetch cart count on component mount
  React.useEffect(() => {
    fetchCartCount()
  }, [fetchCartCount])

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 ${styles.stickyNavbar}`}>
    <div className= "container">
        <Link className="navbar-brand fw-bold text-uppercase" to="/">SHOPPIT</Link>
        <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
            <NavBarLink />
            <Link  to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}>
            <FaCartShopping />
            <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary text-white"
                style={{fontSize: '0.75rem', padding: '0.35em 0.5em'}}
                >
            {cartCount > 0 ? cartCount : null}
            </span>
            </Link>
        </div>
        </div>
    </nav>
  )
}

export default Navbar


















