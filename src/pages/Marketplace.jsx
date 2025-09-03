import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Search, MapPin, DollarSign, User, ShoppingCart } from 'lucide-react'

const Marketplace = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const { user, userProfile } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artisan:users(name, location)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      setError('Failed to load products')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async (productId) => {
    if (!user) {
      alert('Please login to place an order')
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            product_id: productId,
            customer_id: user.id,
            status: 'pending'
          }
        ])

      if (error) throw error
      alert('Order placed successfully!')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Marketplace</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover unique handcrafted products and services from talented local artisans
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products and services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <img 
              src={product.photo_url || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-primary-600 font-bold text-lg">
                  <DollarSign className="w-5 h-5" />
                  <span>{product.price}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <User className="w-4 h-4" />
                  <span>{product.artisan?.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{product.artisan?.location}</span>
              </div>

              {user && userProfile?.role === 'customer' && (
                <button
                  onClick={() => handleOrder(product.id)}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Place Order</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          {searchTerm && (
            <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Marketplace