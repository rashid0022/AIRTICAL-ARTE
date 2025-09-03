import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingBag, User, LogOut, Plus, Package } from 'lucide-react'

const Navbar = () => {
  const { user, profile, signOut, isArtisan } = useAuth()
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
            <ShoppingBag className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ArtisanHub</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/marketplace" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Marketplace
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {isArtisan && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/products/new" 
                      className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{profile?.name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar