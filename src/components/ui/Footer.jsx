import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className="py-3" style={{ backgroundColor: '#6050DC', color: 'white'}}>
    <div className="container text-center">
        {/* Quick Links Section */}
        <div className="mb-2">
            <a href="#" className="text-white text-decoration-none mx-2">Home</a>
            <a href="#" className="text-white text-decoration-none mx-2">About</a>
            <a href="#" className="text-white text-decoration-none mx-2">Shop</a>
            <a href="#" className="text-white text-decoration-none mx-2">Contact</a>

        </div>

        {/* Social Media Icons Section */}
        <div className="mb-2">
            <a href="#" className="text-white"><FaFacebook /></a>
            <a href="#" className="text-white"><FaTwitter /></a>
            <a href="#" className="text-white"><FaInstagram /></a>
        </div>

        {/* Copyright Section */}
        <p className="small mb-0">$copy: 2024 Shoppit</p>"


    </div>
    </footer>
  )
}

export default Footer
