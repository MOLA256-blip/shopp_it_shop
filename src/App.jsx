import { BrowserRouter, Routes, Route} from "react-router-dom"
import MainLayout from "./layout/Mainlayout"
import HomePage from "./components/home/HomePage"
import NotFoundPage from "./components/ui/NotFoundPage"
import ProductPage from "./components/product/ProductPage"
import CartPage from "./components/cart/CartPage"
import CheckoutPage from "./components/checkout/CheckoutPage"
import ProtectedRoute from "./components/ui/ProtectedRoute"
import LoginPage from "./components/user/LoginPage"
import RegisterPage from "./components/user/RegisterPage"
import ForgotPasswordPage from "./components/user/ForgotPasswordPage"
import ProfilePage from "./components/user/ProfilePage"
import PaymentStatusPage from "./components/checkout/PaymentStatusPage"
import AboutPage from "./components/pages/AboutPage"
import ContactPage from "./components/pages/ContactPage"
import ShopPage from "./components/pages/ShopPage"

const App = () => {
  return (
    
      <BrowserRouter>
      <Routes>
        <Route path="/" element ={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="payment/status" element={<PaymentStatusPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element ={<NotFoundPage />}> 
        </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    
  )
}

export default App
