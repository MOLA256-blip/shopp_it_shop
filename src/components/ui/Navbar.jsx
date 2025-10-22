import { FaCartShopping } from "react-icons/fa6";
import { Link} from 'react-router-dom'
import styes from "./Navbar.module.css"
import NavBarLink from "./NavBarLink"

const Navbar = () => {
  return (
    <nav className={'navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 ${styles.stickyNavBar}'}>
    <div className= "container">
        <Link className="navbar.brand fw-bold text-uppercase" to="/">SHOPPIT</Link>
        <button
            className="navbar-toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
            <NavBarLink />
            <Link  to="/cart" className={'btn btn-dark ms-3 rounded-pill positon relative ${styles.responsiveCart}'}>
            <FaCartShopping />
            <span
                className="position-abosolute top-0 start-100 translate-middle badge rounded-pill"
                style={{fontSize: '0.85rem', padding: '0.5em 0.6em', backgroungColor: '#6050DC'}}
                >
            

            </span>
            </Link>
        </div>
        </div>
    </nav>
  )
}

export default Navbar


















