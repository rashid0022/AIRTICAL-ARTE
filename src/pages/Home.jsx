import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingBag, Users, Star, ArrowRight } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Local <span className="text-primary-600">Artisans</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover unique handcrafted products and services from talented artisans in your community. 
            Support local craftsmanship and find one-of-a-kind treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/marketplace" 
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explore Marketplace
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            {!user && (
              <Link 
                to="/signup" 
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Artisan
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ArtisanHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Community</h3>
              <p className="text-gray-600">
                Connect directly with skilled artisans in your area and support local businesses.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                Every artisan is verified and committed to delivering exceptional handmade products.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Ordering</h3>
              <p className="text-gray-600">
                Simple and secure ordering process with real-time updates on your purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 rounded-3xl text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're looking to buy unique products or showcase your craft, 
            ArtisanHub is the perfect place to start.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup?role=customer" 
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Join as Customer
              </Link>
              <Link 
                to="/signup?role=artisan" 
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Join as Artisan
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home