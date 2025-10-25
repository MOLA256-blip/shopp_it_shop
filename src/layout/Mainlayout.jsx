import React from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import {Outlet} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const Mainlayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    <Footer />
    
    </>
  )
}

export default Mainlayout