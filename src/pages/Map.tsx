import React, { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Ambulance, Briefcase, Calendar } from 'lucide-react'
import ReservationModal from '../components/ReservationModal'

const GOOGLE_MAPS_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc'

type Service = {
  id: number
  type: 'medical' | 'administrative'
  name: string
  latitude: number
  longitude: number
  availableSlots: string[]
}

const services: Service[] = [
  { id: 1, type: 'medical', name: 'Mobile Clinic', latitude: 48.8566, longitude: 2.3522, availableSlots: ['09:00', '10:00', '11:00'] },
  { id: 2, type: 'administrative', name: 'Admin Vehicle', latitude: 48.8584, longitude: 2.3540, availableSlots: ['14:00', '15:00', '16:00'] },
  { id: 3, type: 'medical', name: 'Ambulance', latitude: 48.8600, longitude: 2.3500, availableSlots: ['13:00', '14:00', '15:00'] },
]

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 48.8566,
  lng: 2.3522
}

const MapView: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<Service | null>(null)
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const onMapClick = useCallback(() => {
    setSelectedMarker(null)
  }, [])

  const handleReservation = (service: Service) => {
    if (isAuthenticated) {
      setSelectedMarker(service)
      setIsReservationModalOpen(true)
    } else {
      alert('Please log in to make a reservation.')
    }
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Service Map</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${selectedService === 'medical' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedService(selectedService === 'medical' ? null : 'medical')}
        >
          Medical Services
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedService === 'administrative' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedService(selectedService === 'administrative' ? null : 'administrative')}
        >
          Administrative Services
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onClick={onMapClick}
      >
        {services
          .filter(service => !selectedService || service.type === selectedService)
          .map(service => (
            <Marker
              key={service.id}
              position={{ lat: service.latitude, lng: service.longitude }}
              onClick={() => handleReservation(service)}
              icon={{
                url: service.type === 'medical' ? '/ambulance-icon.svg' : '/briefcase-icon.svg',
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3 className="font-bold">{selectedMarker.name}</h3>
              <p>{selectedMarker.type === 'medical' ? 'Medical Service' : 'Administrative Service'}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                onClick={() => setIsReservationModalOpen(true)}
              >
                Reserve
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Nearby Services</h2>
        <ul>
          {services
            .filter(service => !selectedService || service.type === selectedService)
            .map(service => (
              <li key={service.id} className="flex items-center mb-2">
                {service.type === 'medical' ? 
                  <Ambulance className="mr-2 text-red-500" /> : 
                  <Briefcase className="mr-2 text-blue-500" />
                }
                <span>{service.name}</span>
                <button
                  className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center"
                  onClick={() => handleReservation(service)}
                >
                  <Calendar className="mr-1" size={16} />
                  Reserve
                </button>
              </li>
            ))}
        </ul>
      </div>
      {selectedMarker && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          service={selectedMarker}
        />
      )}
    </div>
  )
}

export default MapView
