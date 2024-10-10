import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';  // Remplace par ta clé API Google Maps

type Service = {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Valeur de centre par défaut en France si la géolocalisation échoue
const defaultCenter = {
  lat: 46.603354,
  lng: 1.888334,
};

const MapView: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(defaultCenter); // Utilise une valeur par défaut

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Demander la localisation de l'utilisateur au chargement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Erreur lors de la récupération de la localisation :', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }, []);

  // Chargement des données utilisateur pour vérifier s'il est médecin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);  // Stockage des informations utilisateur
          }
        })
        .catch(err => console.error('Erreur lors de la récupération du profil:', err));
    }
  }, []);

  // Chargement des services
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

  const handleMarkerClick = (service: Service) => {
    setSelectedMarker(service);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickedLocation({ latitude: lat, longitude: lng });
    }
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const handleCreateReservation = async () => {
    if (user && user.medecin && selectedDate) {
      if (!clickedLocation) {
        alert('Veuillez sélectionner une localisation sur la carte avant de créer une réservation.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_user: user.id,
            latitude: clickedLocation.latitude,
            longitude: clickedLocation.longitude,
            date: selectedDate.toISOString().split('T')[0],
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert('Réservation créée avec succès');
          window.location.reload();  // Recharge la page après la fermeture de l'alerte
        } else {
          console.error('Erreur lors de la création de la réservation:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la requête de réservation:', error);
      }
    } else {
      console.log('Conditions non remplies pour créer une réservation.');
    }
  };

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Carte des Services</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}  // Utilise la localisation de l'utilisateur ou une valeur par défaut
        zoom={10}
        onClick={handleMapClick} // Capture des clics sur la carte
        options={{
          streetViewControl: false,
        }}
      >
        {services.map(service => (
          <Marker
            key={service.id}
            position={{ lat: service.latitude, lng: service.longitude }}
            onClick={() => handleMarkerClick(service)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div>
              <h3 className="font-bold">{selectedMarker.nom}</h3>
              <p>Localisation : {selectedMarker.latitude}, {selectedMarker.longitude}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Affichage conditionnel des boutons pour les médecins */}
      {user && user.medecin && (
        <div className="mt-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-2"
            placeholderText="Choisissez une date"
          />
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleCreateReservation}
          >
            Créer une réservation
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;
