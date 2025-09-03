import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, MapPin, Mail, Edit, Save, X } from 'lucide-react'
import LocationPicker from '../components/LocationPicker'

const Profile = () => {
  const { user, userProfile, fetchUserProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    latitude: null,
    longitude: null
  })
  const [loading, setLoading] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        location: userProfile.location || '',
        description: userProfile.description || '',
        latitude: userProfile.latitude || null,
        longitude: userProfile.longitude || null
      })
    }
  }, [userProfile])

  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      location: locationData.address || formData.location
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      await fetchUserProfile(user.id)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || '',
      location: userProfile?.location || '',
      description: userProfile?.description || '',
      latitude: userProfile?.latitude || null,
      longitude: userProfile?.longitude || null
    })
    setEditing(false)
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-32"></div>
        
        <div className="relative px-6 pb-6">
          <div className="flex items-center justify-between -mt-16 mb-6">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Location on Map
                </label>
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
                >
                  <span className="text-gray-600">
                    {formData.latitude && formData.longitude 
                      ? `Location set (${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)})` 
                      : 'Click to set your location on map'
                    }
                  </span>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </button>
                
                {showLocationPicker && (
                  <div className="mt-3">
                    <LocationPicker 
                      onLocationSelect={handleLocationSelect}
                      initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                    />
                  </div>
                )}
              </div>

              {userProfile.role === 'artisan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell customers about your skills and experience..."
                  />
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userProfile.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userProfile.role === 'artisan' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-secondary-100 text-secondary-800'
                }`}>
                  {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                </span>
              </div>

              {userProfile.role === 'artisan' && userProfile.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{userProfile.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Member since {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile