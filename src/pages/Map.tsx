import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Ambulance, Briefcase } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc';

type Service = {
  id: number;
  nom: string; // Mise à jour pour refléter 'nom' au lieu de 'name'
  type: 'medical' | 'administrative';
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
  const [services, setServices] = useState<Service[]>([]); // Liste des services récupérés de la BDD
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    // Requête vers votre API pour récupérer les points de services
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/services'); // URL de l'API côté backend
        const data = await response.json();
        if (data.success) {
          setServices(data.services); // Stocker les services récupérés
        } else {
          console.error('Erreur lors de la récupération des services:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la requête des services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleMarkerClick = (service: Service) => {
    setSelectedMarker(service);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
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
        options={{
          streetViewControl: false, // Désactiver Street View
        }}
      >
        {services
          .filter(service => !selectedService || service.type === selectedService)
          .map(service => (
            <Marker
              key={service.id}
              position={{ lat: service.latitude, lng: service.longitude }}
              onClick={() => handleMarkerClick(service)}
              icon={{
                url: service.type === 'medical' ? '/ambulance-icon.svg' : '/briefcase-icon.svg',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div>
              <h3 className="font-bold">{selectedMarker.nom}</h3> {/* Mise à jour pour utiliser 'nom' */}
              <p>{selectedMarker.type === 'medical' ? 'Service Médical' : 'Service Administratif'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
