import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Package, Clock, CheckCircle, XCircle, DollarSign, User, MapPin } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, userProfile])

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select(`
        *,
        product:products(*),
        customer:users!orders_customer_id_fkey(name, location),
        artisan:users!orders_artisan_id_fkey(name, location)
      `)

      // Filter based on user role
      if (userProfile?.role === 'customer') {
        query = query.eq('customer_id', user.id)
      } else if (userProfile?.role === 'artisan') {
        query = query.eq('artisan_id', user.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userProfile?.role === 'artisan' ? 'Incoming Orders' : 'My Orders'}
        </h1>
        <p className="text-gray-600">
          {userProfile?.role === 'artisan' 
            ? 'Manage orders from customers' 
            : 'Track your order history and status'
          }
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {order.product?.name}
                </h3>
                <p className="text-gray-600 mb-3">{order.product?.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${order.product?.price}</span>
                  </div>
                  {userProfile?.role === 'artisan' ? (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Customer: {order.customer?.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Artisan: {order.artisan?.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile?.role === 'artisan' ? order.customer?.location : order.artisan?.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Artisans */}
              {userProfile?.role === 'artisan' && order.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'accepted')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}

              {userProfile?.role === 'artisan' && order.status === 'accepted' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {userProfile?.role === 'artisan' ? 'No orders received yet' : 'No orders placed yet'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Orders