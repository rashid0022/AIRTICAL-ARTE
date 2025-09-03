import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import MyProducts from './pages/MyProducts'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import ArtisanMap from './pages/ArtisanMap'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="map" element={<ArtisanMap />} />
            <Route 
              path="my-products" 
              element={
                <ProtectedRoute requiredRole="artisan">
                  <MyProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App