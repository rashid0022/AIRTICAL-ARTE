import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, ShoppingBag, Package, Plus } from 'lucide-react'

const Navbar = () => {
  const { user, userProfile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">ArtisanHub</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/marketplace" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Marketplace
            </Link>
            
            {user ? (
              <>
                {userProfile?.role === 'artisan' && (
                  <Link 
                    to="/my-products" 
                    className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>My Products</span>
                  </Link>
                )}
                <Link 
                  to="/orders" 
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar