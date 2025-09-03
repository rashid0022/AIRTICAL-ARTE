import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const Map = ({ artisans = [], center = [40.7128, -74.0060], zoom = 10, height = '400px' }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {artisans.map((artisan) => (
          artisan.latitude && artisan.longitude && (
            <Marker 
              key={artisan.id} 
              position={[artisan.latitude, artisan.longitude]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-800">{artisan.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{artisan.location}</p>
                  {artisan.description && (
                    <p className="text-sm text-gray-500 mb-2">{artisan.description}</p>
                  )}
                  <div className="flex items-center space-x-1 text-primary-600 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>View Profile</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  )
}

export default Map