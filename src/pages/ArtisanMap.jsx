import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Map from '../components/Map'
import { MapPin, User, Package, Star } from 'lucide-react'

const ArtisanMap = () => {
  const [artisans, setArtisans] = useState([])
  const [selectedArtisan, setSelectedArtisan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState([40.7128, -74.0060]) // Default to NYC

  useEffect(() => {
    fetchArtisans()
    getUserLocation()
  }, [])

  const fetchArtisans = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          products(count)
        `)
        .eq('role', 'artisan')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)

      if (error) throw error
      setArtisans(data || [])
    } catch (error) {
      console.error('Error fetching artisans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const artisansWithDistance = artisans.map(artisan => ({
    ...artisan,
    distance: calculateDistance(
      userLocation[0], userLocation[1],
      artisan.latitude, artisan.longitude
    )
  })).sort((a, b) => a.distance - b.distance)

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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Local Artisans</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover talented craftspeople in your area and see their exact locations
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <Map 
            artisans={artisans}
            center={userLocation}
            zoom={12}
            height="500px"
          />
        </div>

        {/* Artisan List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <span>Nearby Artisans</span>
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {artisansWithDistance.map((artisan) => (
              <div 
                key={artisan.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedArtisan?.id === artisan.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedArtisan(artisan)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{artisan.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{artisan.location}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3" />
                        <span>{artisan.products?.[0]?.count || 0} products</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{artisan.distance?.toFixed(1)} mi</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {artisan.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {artisan.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {artisansWithDistance.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No artisans found in your area</p>
              <p className="text-sm text-gray-400 mt-1">
                Try expanding your search radius
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Artisan Details */}
      {selectedArtisan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedArtisan.name}</h2>
              <div className="flex items-center space-x-1 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{selectedArtisan.location}</span>
                <span className="text-gray-400">•</span>
                <span>{selectedArtisan.distance?.toFixed(1)} miles away</span>
              </div>
            </div>
            <Link
              to={`/artisan/${selectedArtisan.id}`}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Profile
            </Link>
          </div>

          {selectedArtisan.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600">{selectedArtisan.description}</p>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>{selectedArtisan.products?.[0]?.count || 0} products available</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Member since {new Date(selectedArtisan.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtisanMap