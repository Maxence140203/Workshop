import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Ambulance, Briefcase, Calendar } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc';

type Service = {
  id: number;
  type: 'medical' | 'administrative';
  name: string;
  latitude: number;
  longitude: number;
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 46.603354,
  lng: 1.888334,
};

const MapView: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Service | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si un token est présent dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Charger les services à partir de l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/services');
        const data = await response.json();
        if (data.success) {
          setServices(data.services);
        } else {
          console.error('Erreur lors de la récupération des services:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la requête des services:', error);
      }
    };

    fetchServices();
  }, []);

  const onMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleReservation = (service: Service) => {
    if (isAuthenticated) {
      setSelectedMarker(service);
      setIsReservationModalOpen(true);
    } else {
      alert('Veuillez vous connecter pour faire une réservation.');
    }
  };

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Carte des Services</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${selectedService === 'medical' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedService(selectedService === 'medical' ? null : 'medical')}
        >
          Services Médicaux
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedService === 'administrative' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedService(selectedService === 'administrative' ? null : 'administrative')}
        >
          Services Administratifs
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        onClick={onMapClick}
        options={{ streetViewControl: false }}
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
                scaledSize: new window.google.maps.Size(30, 30),
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
              <p>{selectedMarker.type === 'medical' ? 'Service Médical' : 'Service Administratif'}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                onClick={() => setIsReservationModalOpen(true)}
              >
                Notifier
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Services à Proximité</h2>
        <ul>
          {services
            .filter(service => !selectedService || service.type === selectedService)
            .map(service => (
              <li key={service.id} className="flex items-center mb-2">
                {service.type === 'medical' ? (
                  <Ambulance className="mr-2 text-red-500" />
                ) : (
                  <Briefcase className="mr-2 text-blue-500" />
                )}
                <span>{service.name}</span>
                <button
                  className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center"
                  onClick={() => handleReservation(service)}
                >
                  <Calendar className="mr-1" size={16} />
                  Notifier
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
  );
};

export default MapView;
