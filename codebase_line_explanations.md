# Codebase Line-by-Line Explanations

This file provides detailed explanations for every line in the codebase of the Shoppit app.

## package.json

This file defines the project configuration for a Node.js project using npm.

1: { - Opening brace for the JSON object.
2:   "name": "---shoppit_app", - Sets the name of the project to "---shoppit_app".
3:   "private": true, - Indicates that the package is private and should not be published to npm.
4:   "version": "0.0.0", - Specifies the version of the project.
5:   "type": "module", - Declares the module type as ES module.
6:   "scripts": { - Start of the scripts object, defining npm scripts.
7:     "dev": "vite", - Script to run the development server using Vite.
8:     "build": "vite build", - Script to build the project for production.
9:     "lint": "eslint .", - Script to run ESLint on the project.
10:     "preview": "vite preview", - Script to preview the built project.
11:   }, - End of scripts object.
12:   "dependencies": { - Start of dependencies object, listing runtime dependencies.
13:     "axios": "^1.12.2", - HTTP client library.
14:     "bootstrap": "^5.3.8", - CSS framework.
15:     "flutterwave-react-v3": "^1.3.2", - Payment integration library for Flutterwave.
16:     "react": "^19.1.0", - React library.
17:     "react-dom": "^19.1.0", - React DOM library.
18:     "react-icons": "^5.5.0", - Icon library for React.
19:     "react-router-dom": "^7.7.1", - Routing library for React.
20:     "react-toastify": "^11.0.5", - Toast notification library.
21:   }, - End of dependencies.
22:   "devDependencies": { - Start of devDependencies, listing development dependencies.
23:     "@eslint/js": "^9.30.1", - ESLint configuration.
24:     "@types/react": "^19.1.8", - TypeScript types for React.
25:     "@types/react-dom": "^19.1.6", - TypeScript types for React DOM.
26:     "@vitejs/plugin-react": "^4.6.0", - Vite plugin for React.
27:     "eslint": "^9.30.1", - Linting tool.
28:     "eslint-plugin-react-hooks": "^5.2.0", - ESLint plugin for React hooks.
29:     "eslint-plugin-react-refresh": "^0.4.20", - ESLint plugin for React refresh.
30:     "globals": "^16.3.0", - Global variables for ESLint.
31:     "vite": "^7.0.4" - Build tool.
32:   } - End of devDependencies.
33: } - End of JSON object.
34:  - Empty line.

## src/GenerateSourceCode.jsx

This file contains a utility function for generating random alphanumeric strings.

1: function GenerateRandomAlphaNumeric(length=10) { - Defines a function to generate random alphanumeric string, default length 10.
2:     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; - Defines the character set for generation.
3:     let result = ''; - Initializes an empty result string.
4:     for (let i = 0; i < length; i++) { - Loops for the specified length.
5:         const randomIndex = Math.floor(Math.random() * characters.length); - Generates a random index within the character set length.
6:         result += characters.charAt(randomIndex); - Appends the character at the random index to result.
7:     } - Ends the loop.
8:     return result; - Returns the generated string.
9: } - Ends the function.
10:  - Empty line.
11: export const randomValue = GenerateRandomAlphaNumeric; - Exports a constant with the function.

## src/context/AuthContext.jsx

This file provides authentication context for the React application, managing login, logout, and user state.

1: import { createContext, useContext, useState, useEffect } from 'react' - Imports necessary React hooks and context functions.
2: import api from '../api' - Imports the configured Axios instance for API calls.
3:  - Empty line.
4: const AuthContext = createContext() - Creates a new context for authentication data.
5:  - Empty line.
6: export const useAuth = () => { - Defines a custom hook to access the AuthContext.
7:   const context = useContext(AuthContext) - Retrieves the current context value.
8:   if (!context) { - Checks if the hook is used outside the provider.
9:     throw new Error('useAuth must be used within AuthProvider') - Throws an error if context is undefined.
10:   } - End of if statement.
11:   return context - Returns the context object.
12: } - End of useAuth hook.
13:  - Empty line.
14: export const AuthProvider = ({ children }) => { - Defines the AuthProvider component that wraps the app.
15:   const [isAuthenticated, setIsAuthenticated] = useState(false) - State for whether the user is logged in.
16:   const [username, setUsername] = useState('') - State for the current username.
17:   const [user, setUser] = useState(null) - State for the full user object.
18:   const [loading, setLoading] = useState(false) - State for loading status during auth operations.
19:  - Empty line.
20:   useEffect(() => { - Runs on component mount to check authentication.
21:     checkAuth() - Calls the function to verify existing tokens.
22:   }, []) - Empty dependency array means it runs once.
23:  - Empty line.
24:   async function checkAuth() { - Function to check if the user has valid tokens.
25:     const access = localStorage.getItem('access') - Retrieves the access token from local storage.
26:     if (access) { - If an access token exists.
27:       setIsAuthenticated(true) - Sets authenticated state to true.
28:       await fetchUserProfile() - Fetches the user's profile data.
29:     } - End of if statement.
30:   } - End of checkAuth function.
31:  - Empty line.
32:   async function fetchUserProfile() { - Function to fetch the user's profile from the API.
33:     try { - Try block for the API call.
34:       const res = await api.get('/api/user/profile/') - Makes a GET request to the profile endpoint.
35:       setUser(res.data) - Updates the user state with the response data.
36:       setUsername(res.data.username || '') - Updates the username state.
37:     } catch (err) { - Catch block for errors.
38:       console.error('Error fetching user profile:', err) - Logs the error to the console.
39:       // If token is invalid, clear auth state - Comment explaining the next check.
40:       if (err.response?.status === 401) { - If the response status is 401 (unauthorized).
41:         logout() - Calls the logout function to clear state.
42:       } - End of if statement.
43:     } - End of catch block.
44:   } - End of fetchUserProfile function.
45:  - Empty line.
46:   // Keep fetchUsername for backward compatibility - Comment about maintaining old function.
47:   async function fetchUsername() { - Function for backward compatibility.
48:     await fetchUserProfile() - Calls the newer fetchUserProfile function.
49:   } - End of fetchUsername function.
50:  - Empty line.
51:   async function login(user, pass) { - Function to log in the user.
52:     try { - Try block for login attempt.
53:       setLoading(true) - Sets loading state to true.
54:       const res = await api.post('/api/token/', { - Makes a POST request to the token endpoint.
55:         username: user, - Passes the username.
56:         password: pass - Passes the password.
57:       }) - End of request body.
58:       localStorage.setItem('access', res.data.access) - Stores the access token.
59:       localStorage.setItem('refresh', res.data.refresh) - Stores the refresh token.
60:       setIsAuthenticated(true) - Sets authenticated state.
61:       setUsername(user) - Sets the username state.
62:       // Fetch full user profile after login - Comment.
63:       await fetchUserProfile() - Fetches the user profile.
64:       return { ok: true } - Returns success object.
65:     } catch (err) { - Catch block.
66:       return { ok: false, message: err.response?.data?.detail || 'Login failed' } - Returns error object.
67:     } finally { - Finally block.
68:       setLoading(false) - Resets loading state.
69:     } - End of finally.
70:   } - End of login function.
71:  - Empty line.
72:   function logout() { - Function to log out the user.
73:     localStorage.removeItem('access') - Removes the access token.
74:     localStorage.removeItem('refresh') - Removes the refresh token.
75:     setIsAuthenticated(false) - Sets authenticated to false.
76:     setUsername('') - Clears the username.
77:     setUser(null) - Clears the user object.
78:   } - End of logout function.
79:  - Empty line.
80:   return ( - Returns the JSX.
81:     <AuthContext.Provider value={{  - Provides the context with the following values.
82:       isAuthenticated,  - Current authentication status.
83:       username,  - Current username.
84:       user,  - Full user object.
85:       loading,  - Loading status.
86:       login,  - Login function.
87:       logout,  - Logout function.
88:       fetchUsername, - Fetch username function.
89:       fetchUserProfile  - Fetch user profile function.
90:     }}> - End of value object.
91:       {children} - Renders the child components.
92:     </AuthContext.Provider> - End of provider.
93:   ) - End of return statement.
94: } - End of AuthProvider component.
95:  - Empty line.

## src/context/CartContext.jsx

This file provides cart context for the React application, managing cart state, items, and operations.

1: import { createContext, useContext, useState, useCallback } from 'react' - Imports React hooks for context and state management.
2: import api from '../api' - Imports the Axios instance for API requests.
3: import { toast } from 'react-toastify' - Imports toast for notifications.
4:  - Empty line.
5: const CartContext = createContext() - Creates the CartContext.
6:  - Empty line.
7: export const useCart = () => { - Defines the useCart hook.
8:   const context = useContext(CartContext) - Gets the context.
9:   if (!context) { - Checks if context exists.
10:     throw new Error('useCart must be used within CartProvider') - Throws error if not.
11:   } - End if.
12:   return context - Returns context.
13: } - End hook.
14:  - Empty line.
15: export const CartProvider = ({ children }) => { - Defines CartProvider component.
16:   const [cartCount, setCartCount] = useState(0) - State for cart item count.
17:   const [cart, setCart] = useState(null) - State for cart object.
18:  - Empty line.
19:   // Get or create cart code - Comment.
20:   const getCartCode = () => { - Function to get or create cart code.
21:     let cartCode = localStorage.getItem('cartCode') - Gets cartCode from localStorage.
22:     if (!cartCode) { - If not exists.
23:       // Generate a unique cart code - Comment.
24:       cartCode = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` - Generates unique code.
25:       localStorage.setItem('cartCode', cartCode) - Stores it.
26:     } - End if.
27:     return cartCode - Returns code.
28:   } - End function.
29:  - Empty line.
30:   // Fetch full cart details - Comment.
31:   const fetchCart = useCallback(async () => { - Function to fetch cart.
32:     try { - Try.
33:       const cartCode = getCartCode() - Gets code.
34:       const res = await api.get('/api/cart/', { - API call.
35:         params: { cart_mode: cartCode } - Params.
36:       }) - End call.
37:       setCart(res.data) - Sets cart.
38:       const items = res.data.items || [] - Gets items.
39:       const count = items.reduce((sum, item) => sum + item.quantity, 0) - Calculates count.
40:       setCartCount(count) - Sets count.
41:       return res.data - Returns data.
42:     } catch (err) { - Catch.
43:       console.error('Error fetching cart:', err) - Logs error.
44:       setCart(null) - Resets cart.
45:       setCartCount(0) - Resets count.
46:       return null - Returns null.
47:     } - End catch.
48:   }, []) - End function with dependency.
50:   // Add item to cart - Comment for addItem function.
51:   const addItem = useCallback(async (productId, quantity = 1) => { - Defines addItem function with useCallback.
52:     try { - Try block for adding item.
53:       const cartCode = getCartCode() - Gets cart code.
54:       await api.post('/api/add_item/', { - API call to add item.
55:         cart_mode: cartCode, - Sets cart mode.
56:         product_id: productId, - Product ID.
57:         quantity: quantity - Quantity.
58:       }) - End of request body.
59:       toast.success('Item added to cart!') - Success toast.
60:       // Update cart count - Comment.
61:       fetchCartCount() - Updates cart count.
62:     } catch (err) { - Catch block.
63:       console.error('Error adding item to cart:', err) - Logs error.
64:       toast.error('Failed to add item to cart') - Error toast.
65:     } - End of catch.
66:   }, []) - End of function with dependency array.
67:  - Empty line.
68:   // Fetch cart count - Comment for fetchCartCount.
69:   const fetchCartCount = useCallback(async () => { - Defines fetchCartCount.
70:     try { - Try block.
71:       const cartCode = getCartCode() - Gets cart code.
72:       const res = await api.get('/api/cart/', { - API call to get cart.
73:         params: { cart_mode: cartCode } - Params.
74:       }) - End of call.
75:       const items = res.data.items || [] - Gets items array.
76:       const count = items.reduce((sum, item) => sum + item.quantity, 0) - Calculates total count.
77:       setCartCount(count) - Sets cart count state.
78:     } catch (err) { - Catch block.
79:       console.error('Error fetching cart count:', err) - Logs error.
80:     } - End of catch.
81:   }, []) - End of function.
82:  - Empty line.
83:   // Update item quantity - Comment for updateItem.
84:   const updateItem = useCallback(async (itemId, quantity) => { - Defines updateItem.
85:     try { - Try block.
86:       const cartCode = getCartCode() - Gets cart code.
87:       await api.post('/api/update_item/', { - API call to update item.
88:         cart_mode: cartCode, - Cart mode.
89:         item_id: itemId, - Item ID.
90:         quantity: quantity - New quantity.
91:       }) - End of body.
92:       toast.success('Cart updated!') - Success toast.
93:       fetchCartCount() - Updates count.
94:     } catch (err) { - Catch.
95:       console.error('Error updating item:', err) - Logs error.
96:       toast.error('Failed to update cart') - Error toast.
97:     } - End of catch.
98:   }, []) - End of function.
99:  - Empty line.
100:   // Increment item quantity - Comment for incrementItem.
101:   const incrementItem = useCallback(async (productId) => { - Defines incrementItem.
102:     try { - Try.
103:       const cartCode = getCartCode() - Gets code.
104:       await api.post('/api/add_item/', { - API call to add (increment).
105:         cart_mode: cartCode, - Mode.
106:         product_id: productId, - Product ID.
107:         quantity: 1 - Quantity 1.
108:       }) - End of body.
109:       fetchCartCount() - Updates count.
110:     } catch (err) { - Catch.
111:       console.error('Error incrementing item:', err) - Logs.
112:       toast.error('Failed to update cart') - Error toast.
113:     } - End of catch.
114:   }, []) - End of function.
115:  - Empty line.
116:   // Decrement item quantity - Comment for decrementItem.
117:   const decrementItem = useCallback(async (itemId, currentQuantity) => { - Defines decrementItem.
118:     try { - Try.
119:       if (currentQuantity <= 1) { - If quantity is 1 or less.
120:         await removeItem(itemId) - Removes item.
121:       } else { - Else.
122:         const cartCode = getCartCode() - Gets code.
123:         await api.post('/api/update_item/', { - Updates quantity.
124:           cart_mode: cartCode, - Mode.
125:           item_id: itemId, - Item ID.
126:           quantity: currentQuantity - 1 - Decrements.
127:         }) - End of body.
128:         fetchCartCount() - Updates count.
129:       } - End of if.
130:     } catch (err) { - Catch.
131:       console.error('Error decrementing item:', err) - Logs.
132:       toast.error('Failed to update cart') - Error toast.
133:     } - End of catch.
134:   }, []) - End of function.
135:  - Empty line.
136:   // Remove item from cart - Comment for removeItem.
137:   const removeItem = useCallback(async (itemId) => { - Defines removeItem.
138:     try { - Try.
139:       const cartCode = getCartCode() - Gets code.
140:       await api.post('/api/delete_item/', { - API call to delete.
141:         cart_mode: cartCode, - Mode.
142:         item_id: itemId - Item ID.
143:       }) - End of body.
144:       toast.success('Item removed from cart') - Success toast.
145:       fetchCartCount() - Updates count.
146:     } catch (err) { - Catch.
147:       console.error('Error removing item:', err) - Logs.
148:       toast.error('Failed to remove item') - Error toast.
149:     } - End of catch.
150:   }, []) - End of function.
151:  - Empty line.
152:   // Clear cart (remove cart code from localStorage) - Comment for clearCart.
153:   const clearCart = useCallback(() => { - Defines clearCart.
154:     localStorage.removeItem('cartCode') - Removes cart code from storage.
155:     setCart(null) - Resets cart state.
156:     setCartCount(0) - Resets count.
157:     toast.info('Cart cleared') - Info toast.
158:   }, []) - End of function.
159:  - Empty line.
160:   const value = { - Defines the value object for provider.
161:     cart, - Cart state.
162:     cartCount, - Cart count.
163:     addItem, - Add item function.
164:     updateItem, - Update item.
165:     incrementItem, - Increment.
166:     decrementItem, - Decrement.
167:     removeItem, - Remove.
168:     fetchCart, - Fetch cart.
169:     fetchCartCount, - Fetch count.
170:     clearCart, - Clear cart.
171:     getCartCode - Get code.
172:   } - End of value object.
173:  - Empty line.
174:   return ( - Returns JSX.
175:     <CartContext.Provider value={value}> - CartContext provider.
176:       {children} - Renders children.
177:     </CartContext.Provider> - End of provider.
178:   ) - End of return.
179: } - End of CartProvider component.
180:  - Empty line.

## src/layout/Mainlayout.jsx

This file defines the main layout component for the application, including navbar, footer, and toast notifications.

1: import React from 'react' - Imports React library.
2: import Navbar from '../components/ui/Navbar' - Imports the Navbar component.
3: import Footer from '../components/ui/Footer' - Imports the Footer component.
4: import {Outlet} from 'react-router-dom' - Imports Outlet for rendering child routes.
5: import { ToastContainer } from 'react-toastify' - Imports ToastContainer for notifications.
6:  - Empty line.
7: const Mainlayout = () => { - Defines the Mainlayout functional component.
8:   return ( - Returns the JSX structure.
9:     <> - React Fragment to group elements without extra DOM node.
10:     <Navbar /> - Renders the Navbar component.
11:     <Outlet /> - Renders the current route's component.
12:     <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" /> - Renders ToastContainer with configuration for notifications.
13:     <Footer /> - Renders the Footer component.
14:     
15:     </> - Closes the Fragment.
16:   ) - Closes the return statement.
17: } - Closes the component function.
18: 
## src/hooks/useCartData.jsx

This file provides a custom hook for managing cart data, including fetching items, incrementing, decrementing, and removing items.

1: import { useState, useEffect } from 'react' - Imports React hooks.
2: import api from '../api' - Imports the API instance.
3:  - Empty line.
4: const useCartData = () => { - Defines the useCartData hook.
5:   const [items, setItems] = useState([]) - State for raw cart items.
6:   const [loading, setLoading] = useState(true) - State for loading status.
7:  - Empty line.
8:   const cartCode = localStorage.getItem('cartCode') - Gets cart code from storage.
9:  - Empty line.
10:   useEffect(() => { - Effect to fetch cart on mount or cartCode change.
11:     if (!cartCode) { - If no cart code.
12:       setLoading(false) - Sets loading to false.
13:       return - Returns early.
14:     } - End if.
15:     fetchCart() - Fetches cart.
16:   }, [cartCode]) - Dependency on cartCode.
17:  - Empty line.
18:   async function fetchCart() { - Function to fetch cart items.
19:     try { - Try block.
20:       setLoading(true) - Sets loading.
21:       const res = await api.get('/api/cart/', { - API call.
22:         params: { cart_mode: cartCode } - Params.
23:       }) - End call.
24:       setItems(res.data.items || []) - Sets items.
25:     } catch (err) { - Catch.
26:       console.error('Error fetching cart:', err) - Logs error.
27:       setItems([]) - Resets items.
28:     } finally { - Finally.
29:       setLoading(false) - Resets loading.
30:     } - End finally.
31:   } - End function.
32:  - Empty line.
33:   async function increment(item) { - Function to increment item quantity.
34:     try { - Try.
35:       await api.post('/api/add_item/', { - API call to add.
36:         cart_mode: cartCode, - Mode.
37:         product_id: item.product.id, - Product ID.
38:         quantity: 1 - Quantity 1.
39:       }) - End body.
40:       await fetchCart() - Refetches cart.
41:     } catch (err) { - Catch.
42:       console.error('Error incrementing item:', err) - Logs.
43:     } - End catch.
44:   } - End function.
45:  - Empty line.
46:   async function decrement(item) { - Function to decrement item quantity.
47:     try { - Try.
48:       if (item.quantity <= 1) { - If quantity 1 or less.
49:         await removeItem(item.id) - Removes item.
50:       } else { - Else.
51:         await api.post('/api/update_item/', { - Updates quantity.
52:           cart_mode: cartCode, - Mode.
53:           item_id: item.id, - Item ID.
54:           quantity: item.quantity - 1 - Decrements.
55:         }) - End body.
56:         await fetchCart() - Refetches.
57:       } - End if.
58:     } catch (err) { - Catch.
59:       console.error('Error decrementing item:', err) - Logs.
60:     } - End catch.
61:   } - End function.
62:  - Empty line.
63:   async function removeItem(itemId) { - Function to remove item.
64:    try { - Try.
65:      await api.post('/api/delete_item/', { - API call to delete.
66:        cart_mode: cartCode, - Mode.
67:        item_id: itemId - Item ID.
68:      }) - End body.
69:      await fetchCart() - Refetches.
70:    } catch (err) { - Catch.
71:      console.error('Error removing item:', err) - Logs.
72:    } - End catch.
73:  } - End function.
74:  - Empty line.
75:   const mapped = items.map((item) => ({ - Maps items to formatted objects.
76:    id: item.id, - Item ID.
77:    name: item.product.name, - Product name.
78:    price: parseFloat(item.product.price), - Parsed price.
79:    quantity: item.quantity, - Quantity.
80:    image: item.product.image, - Image.
81:    total: parseFloat(item.product.price) * item.quantity, - Total price.
82:    raw: item - Raw item data.
83:  })) - End map.
84:  - Empty line.
85:   const totalPrice = mapped.reduce((sum, item) => sum + item.total, 0) - Calculates total price.
86:   const totalQuantity = mapped.reduce((sum, item) => sum + item.quantity, 0) - Calculates total quantity.
87:  - Empty line.
88:   return { - Returns object with data and functions.
89:    items, - Raw items.
90:    mapped, - Mapped items.
91:    totalPrice, - Total price.
92:    totalQuantity, - Total quantity.
93:    loading, - Loading state.
94:    increment, - Increment function.
95:    decrement, - Decrement function.
96:    removeItem, - Remove function.
97:    fetchCart - Fetch function.
98:  } - End return.
99: } - End hook.
100:  - Empty line.
101: export default useCartData - Exports the hook.

## src/components/home/HomePage.jsx

This file defines the HomePage component, which fetches and displays products.

1: import Header from "./Header" - Imports Header component.
2: import CardContainer from "./cardcontainer" - Imports CardContainer.
3: import PlaceHolderContainer from "../ui/PlaceHolderContainer" - Imports placeholder.
4: import api from '../../api' - Imports API.
5: import { useEffect, useState } from 'react' - Imports hooks.
6: import Error from "../ui/Error" - Imports Error component (not used).
7:  - Empty line.
8:  - Empty line.
9: const Homepage = () => { - Defines Homepage component.
10:   const [products, setProducts] = useState([]) - State for products.
11:   const [Loading, setLoading] = useState(true) - State for loading.
12:   const [error, setError] =useState("") - State for error.
13:  - Empty line.
14:   useEffect(function(){ - Effect to fetch products.
15:     api.get("/api/products/") - API call.
16:     .then(res => { - Then handler.
17:       setProducts(res.data) - Sets products.
18:       setLoading(false) - Sets loading false.
19:       setError("") - Clears error.
20:     }) - End then.
21:     .catch(err => { - Catch handler.
22:       setLoading(false) - Sets loading false.
23:       setError(err.message) - Sets error.
24:     }) - End catch.
25:   },[]) - End effect.
26:  - Empty line.
27:   return ( - Returns JSX.
28:     <> - Fragment.
29:       <Header /> - Renders Header.
30:       {Loading &&<PlaceHolderContainer />} - Shows placeholder if loading.
31:       {!Loading && !error && <CardContainer products={products} />} - Shows cards if not loading and no error.
32:     </> - End fragment.
33:   ) - End return.
34: } - End component.
35:  - Empty line.
36: export default Homepage - Exports component.

## vite.config.js

This is the Vite configuration file.

1: import { defineConfig } from 'vite' - Imports the defineConfig function from Vite.
2: import react from '@vitejs/plugin-react' - Imports the React plugin for Vite.
3:  - Empty line.
4: export default defineConfig({ - Exports a default configuration object.
5:   plugins: [react()], - Adds the React plugin to the plugins array.
6:   server: { - Configures the development server.
7:     host: true, // Allow access from network (for mobile testing) - Allows access from network.
8:     port: 5173, - Sets the port to 5173.
9:     proxy: { - Sets up proxy for API requests.
10:       '/api': { - Proxy for paths starting with /api.
11:         target: 'http://127.0.0.1:8000', - Target backend server.
12:         changeOrigin: true, - Changes the origin of the host header.
13:         rewrite: (path) => path.replace(/^\/api/, '') - Rewrites the path by removing /api prefix.
14:       } - End of proxy object.
15:     } - End of server config.
16:   } - End of config object.
17: }) - End of defineConfig call.
18:  - Empty line.

## index.html

This is the main HTML file for the application.

1: <!doctype html> - Declares the document type as HTML5.
2: <html lang="en"> - Root element with language set to English.
3:   <head> - Head section containing metadata.
4:     <meta charset="UTF-8" /> - Sets the character encoding to UTF-8.
5:     <link rel="icon" type="image/svg+xml" href="/vite.svg" /> - Links to the favicon.
6:     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" /> - Sets viewport for responsive design.
7:     <meta name="mobile-web-app-capable" content="yes" /> - Indicates the app is mobile web app capable.
8:     <meta name="apple-mobile-web-app-capable" content="yes" /> - For iOS web app.
9:     <meta name="apple-mobile-web-app-status-bar-style" content="default" /> - Status bar style for iOS.
10:     <title>Shoppit - Online Shopping</title> - Sets the page title.
11:   </head> - End of head.
12:   <body> - Body section.
13:     <div id="root"></div> - Root div where React app will mount.
14:     <script type="module" src="/src/main.jsx"></script> - Loads the main JavaScript module.
15:   </body> - End of body.
16: </html> - End of HTML.
17:  - Empty line.

## src/main.jsx

This is the entry point for the React application.

1: import { StrictMode } from 'react' - Imports StrictMode from React for development checks.
2: import { createRoot } from 'react-dom/client' - Imports createRoot for rendering the app.
3: import './index.css' - Imports the global CSS.
4: import App from './App.jsx' - Imports the main App component.
5: import "bootstrap/dist/css/bootstrap.css" - Imports Bootstrap CSS.
6: import "bootstrap/dist/js/bootstrap.bundle.min.js" - Imports Bootstrap JavaScript.
7: import { CartProvider } from './context/CartContext.jsx' - Imports CartProvider for cart state.
8: import 'react-toastify/dist/ReactToastify.css' - Imports Toastify CSS.
9: import { AuthProvider } from './context/AuthContext.jsx' - Imports AuthProvider for authentication.
10:  - Empty line.
11: createRoot(document.getElementById('root')).render( - Creates root and renders the app.
12:   <StrictMode> - Wraps in StrictMode.
13:     <AuthProvider> - Provides authentication context.
14:       <CartProvider> - Provides cart context.
15:         <App /> - Renders the App component.
16:       </CartProvider> - End of CartProvider.
17:     </AuthProvider> - End of AuthProvider.
18:   </StrictMode>, - End of StrictMode.
19: ) - End of render call.
20:  - Empty line.

## src/App.jsx

This defines the main App component with routing.

1: import { BrowserRouter, Routes, Route} from "react-router-dom" - Imports routing components.
2: import MainLayout from "./layout/Mainlayout" - Imports the main layout.
3: import HomePage from "./components/home/HomePage" - Imports HomePage.
4: import NotFoundPage from "./components/ui/NotFoundPage" - Imports 404 page.
5: import ProductPage from "./components/product/ProductPage" - Imports product page.
6: import CartPage from "./components/cart/CartPage" - Imports cart page.
7: import CheckoutPage from "./components/checkout/CheckoutPage" - Imports checkout.
8: import ProtectedRoute from "./components/ui/ProtectedRoute" - Imports protected route.
9: import LoginPage from "./components/user/LoginPage" - Imports login.
10: import RegisterPage from "./components/user/RegisterPage" - Imports register.
11: import ForgotPasswordPage from "./components/user/ForgotPasswordPage" - Imports forgot password.
12: import ProfilePage from "./components/user/ProfilePage" - Imports profile.
13: import PaymentStatusPage from "./components/checkout/PaymentStatusPage" - Imports payment status.
14: import AboutPage from "./components/pages/AboutPage" - Imports about.
15: import ContactPage from "./components/pages/ContactPage" - Imports contact.
16: import ShopPage from "./components/pages/ShopPage" - Imports shop.
17:  - Empty line.
18: const App = () => { - Defines the App functional component.
19:   return ( - Returns the JSX.
20:     - Empty line.
21:       <BrowserRouter> - Wraps with BrowserRouter for routing.
22:       <Routes> - Defines routes.
23:         <Route path="/" element ={<MainLayout />}> - Root route with layout.
24:         <Route index element={<HomePage />} /> - Index route to home.
25:         <Route path="shop" element={<ShopPage />} /> - Shop route.
26:         <Route path="products/:slug" element={<ProductPage />} /> - Product route with slug.
27:         <Route path="cart" element={<CartPage />} /> - Cart route.
28:         <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> - Protected checkout.
29:         <Route path="login" element={<LoginPage />} /> - Login route.
30:         <Route path="register" element={<RegisterPage />} /> - Register route.
31:         <Route path="forgot-password" element={<ForgotPasswordPage />} /> - Forgot password.
32:         <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> - Protected profile.
33:         <Route path="payment/status" element={<PaymentStatusPage />} /> - Payment status.
34:         <Route path="about" element={<AboutPage />} /> - About route.
35:         <Route path="contact" element={<ContactPage />} /> - Contact route.
36:         <Route path="*" element ={<NotFoundPage />}> - Catch-all for 404.
37:         </Route> - End of nested routes.
38:         </Route> - End of root route.
39:       </Routes> - End of Routes.
40:       </BrowserRouter> - End of BrowserRouter.
41:     - Empty line.
42:   ) - End of return.
43: } - End of component.
44:  - Empty line.
45: export default App - Exports the App component.

## src/api.js

This file sets up the Axios instance with authentication and token refresh.

1: import axios from "axios" - Imports Axios.
2:  - Empty line.
3: export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000"; - Sets base URL from env or default.
4:  - Empty line.
5: const api = axios.create({ - Creates Axios instance.
6:     baseURL: BASE_URL - Sets base URL.
7: }) - End of create.
8:  - Empty line.
9: function decodeJwt(token) { - Function to decode JWT.
10:   try { - Try block.
11:     const payload = token.split('.')[1] - Gets payload part.
12:     const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/')) - Decodes base64.
13:     return JSON.parse(decodeURIComponent(escape(json))) - Parses JSON.
14:   } catch { - Catch block.
15:     return null - Returns null on error.
16:   } - End of catch.
17: } - End of function.
18:  - Empty line.
19: function isExpired(token) { - Function to check if token is expired.
20:   const decoded = decodeJwt(token) - Decodes token.
21:   if (!decoded?.exp) return true - If no exp, expired.
22:   const now = Math.floor(Date.now() / 1000) - Current time in seconds.
23:   return decoded.exp <= now - Checks if expired.
24: } - End of function.
25:  - Empty line.
26: api.interceptors.request.use((config) => { - Request interceptor.
27:   const access = localStorage.getItem('access') - Gets access token.
28:   if (access && !isExpired(access)) { - If valid token.
29:     config.headers = config.headers || {} - Ensures headers object.
30:     config.headers.Authorization = `Bearer ${access}` - Sets auth header.
31:   } - End of if.
32:   return config - Returns config.
33: }) - End of interceptor.
34:  - Empty line.
35: let isRefreshing = false - Flag for refreshing.
36: let pendingQueue = [] - Queue for pending requests.
37:  - Empty line.
38: async function refreshAccessToken() { - Function to refresh token.
39:   if (isRefreshing) { - If already refreshing.
40:     return new Promise((resolve, reject) => { - Returns promise.
41:       pendingQueue.push({ resolve, reject }) - Adds to queue.
42:     }) - End of promise.
43:   } - End of if.
44:   isRefreshing = true - Sets flag.
45:   try { - Try block.
46:     const refresh = localStorage.getItem('refresh') - Gets refresh token.
47:     if (!refresh) throw new Error('No refresh token') - Throws if no refresh.
48:     const res = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh }) - Posts to refresh endpoint.
49:     const newAccess = res?.data?.access - Gets new access.
50:     if (!newAccess) throw new Error('No access in refresh') - Throws if no access.
51:     localStorage.setItem('access', newAccess) - Stores new access.
52:     pendingQueue.forEach(p => p.resolve(newAccess)) - Resolves pending.
53:     pendingQueue = [] - Clears queue.
54:     return newAccess - Returns new access.
55:   } catch (err) { - Catch block.
56:     pendingQueue.forEach(p => p.reject(err)) - Rejects pending.
57:     pendingQueue = [] - Clears queue.
58:     localStorage.removeItem('access') - Removes access.
59:     localStorage.removeItem('refresh') - Removes refresh.
60:     throw err - Throws error.
61:   } finally { - Finally block.
62:     isRefreshing = false - Resets flag.
63:   } - End of finally.
64: } - End of function.
65:  - Empty line.
66: api.interceptors.response.use( - Response interceptor.
67:   (resp) => resp, - Success handler.
68:   async (error) => { - Error handler.
69:     const original = error.config - Gets original config.
70:     if (!original || original.__isRetryRequest) { - If no config or retry.
71:       return Promise.reject(error) - Rejects.
72:     } - End of if.
73:     if (error.response && error.response.status === 401) { - If 401 error.
74:       // Don't try to refresh if this is already a token endpoint - Comment.
75:       if (original.url?.includes('/api/token/')) { - If token endpoint.
76:         return Promise.reject(error) - Rejects.
77:       } - End of if.
78:       try { - Try to refresh.
79:         const newAccess = await refreshAccessToken() - Refreshes.
80:         original.headers = original.headers || {} - Ensures headers.
81:         original.headers.Authorization = `Bearer ${newAccess}` - Sets new auth.
82:         original.__isRetryRequest = true - Marks as retry.
83:         return api(original) - Retries request.
84:       } catch (e) { - Catch.
85:         // Silently fail if no refresh token (user not logged in) - Comment.
86:         return Promise.reject(error) - Rejects.
87:       } - End of catch.
88:     } - End of if.
89:     return Promise.reject(error) - Rejects.
90:   } - End of error handler.
91: ) - End of interceptor.
92:  - Empty line.
93: export default api - Exports the api instance.

## src/FormatDate.jsx

This file contains date formatting functions.

1: const formatDate = (dateString) => { - Defines formatDate function.
2:   if (!dateString) return 'N/A' - Returns N/A if no date.
3:   - Empty line.
4:   try { - Try block.
5:     const date = new Date(dateString) - Creates date object.
6:     if (isNaN(date.getTime())) return dateString - Returns original if invalid.
7:     - Empty line.
8:     const options = { - Options for formatting.
9:       year: 'numeric', - Year format.
10:       month: 'short', - Month short.
11:       day: 'numeric', - Day numeric.
12:       hour: '2-digit', - Hour 2-digit.
13:       minute: '2-digit', - Minute 2-digit.
14:       hour12: true - 12-hour format.
15:     } - End of options.
16:     - Empty line.
17:     return date.toLocaleDateString('en-US', options) - Formats and returns.
18:   } catch { - Catch block.
19:     return dateString - Returns original on error.
20:   } - End of catch.
21: } - End of function.
22:  - Empty line.
23: // Format date only (no time) - Comment.
24: export const formatDateOnly = (dateString) => { - Defines formatDateOnly.
25:   if (!dateString) return 'N/A' - Same as above.
26:   - Empty line.
27:   try { - Try.
28:     const date = new Date(dateString) - Date object.
29:     if (isNaN(date.getTime())) return dateString - Invalid check.
30:     - Empty line.
31:     const options = { - Options.
32:       year: 'numeric', - Year.
33:       month: 'short', - Month.
34:       day: 'numeric' - Day.
35:     } - End of options.
36:     - Empty line.
37:     return date.toLocaleDateString('en-US', options) - Formats.
38:   } catch { - Catch.
39:     return dateString - Return original.
40:   } - End of catch.
41: } - End of function.
42:  - Empty line.
43: // Format time only - Comment.
44: export const formatTimeOnly = (dateString) => { - Defines formatTimeOnly.
45:   if (!dateString) return 'N/A' - N/A if none.
46:   - Empty line.
47:   try { - Try.
48:     const date = new Date(dateString) - Date.
49:     if (isNaN(date.getTime())) return dateString - Invalid.
50:     - Empty line.
51:     const options = { - Options.
52:       hour: '2-digit', - Hour.
53:       minute: '2-digit', - Minute.
54:       hour12: true - 12-hour.
55:     } - End of options.
56:     - Empty line.
57:     return date.toLocaleTimeString('en-US', options) - Formats time.
58:   } catch { - Catch.
59:     return dateString - Original.
60:   } - End of catch.
61: } - End of function.
62:  - Empty line.
63: // Format relative time (e.g., "2 hours ago") - Comment.
64: export const formatRelativeTime = (dateString) => { - Defines formatRelativeTime.
65:   if (!dateString) return 'N/A' - N/A.
66:   - Empty line.
67:   try { - Try.
68:     const date = new Date(dateString) - Date.
69:     if (isNaN(date.getTime())) return dateString - Invalid.
70:     - Empty line.
71:     const now = new Date() - Current date.
72:     const diffMs = now - date - Difference in ms.
73:     const diffSecs = Math.floor(diffMs / 1000) - Seconds.
74:     const diffMins = Math.floor(diffSecs / 60) - Minutes.
75:     const diffHours = Math.floor(diffMins / 60) - Hours.
76:     const diffDays = Math.floor(diffHours / 24) - Days.
77:     - Empty line.
78:     if (diffSecs < 60) return 'Just now' - If less than minute.
79:     if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago` - Minutes ago.
80:     if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago` - Hours ago.
81:     if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago` - Days ago.
82:     - Empty line.
83:     return formatDateOnly(dateString) - Else full date.
84:   } catch { - Catch.
85:     return dateString - Original.
86:   } - End of catch.
87: } - End of function.
88:  - Empty line.
89: export default formatDate - Exports default.
