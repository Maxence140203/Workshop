import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';  // Ajoute un package de sélection de date
import 'react-datepicker/dist/react-datepicker.css'; // Style du date picker

const GOOGLE_MAPS_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc';

type Service = {
  id: number;
  nom: string;
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
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  // Nouvelle gestion de date
  const [clickedLocation, setClickedLocation] = useState<{ latitude: number, longitude: number } | null>(null); // Gestion des clics sur la carte

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Charger les données utilisateur
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
            setUser(data.user);
          }
        })
        .catch(err => console.error('Erreur lors de la récupération du profil:', err));
    }
  }, []);

  // Charger les services
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

  // Fonction pour créer une réservation
  const handleCreateReservation = async () => {
    if (clickedLocation && user && user.medecin && selectedDate) {
      console.log('Début de la création de réservation...');
      console.log('Données utilisateur:', user);
      console.log('Données de localisation:', clickedLocation);
      console.log('Date sélectionnée:', selectedDate.toISOString().split('T')[0]);
  
      try {
        const token = localStorage.getItem('token');
        console.log('Token d\'authentification:', token);
  
        const response = await fetch('http://localhost:3001/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_soignant: user.id,
            latitude: clickedLocation.latitude,
            longitude: clickedLocation.longitude,
            date: selectedDate.toISOString().split('T')[0],  // Formatage de la date
          }),
        });
  
        console.log('Réponse du serveur reçue:', response);
  
        const data = await response.json();
        console.log('Données renvoyées par le serveur:', data);
  
        if (data.success) {
          alert('Réservation créée avec succès');
          console.log('Réservation créée avec succès');
        } else {
          console.error('Erreur lors de la création de la réservation:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la requête de réservation:', error);
      }
    } else {
      console.log('Conditions non remplies pour créer une réservation.');
      console.log('clickedLocation:', clickedLocation);
      console.log('user:', user);
      console.log('user.medecin:', user.medecin);
      console.log('selectedDate:', selectedDate);
    }
  };
  

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Carte des Services</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        onClick={handleMapClick} // Capturer les clics sur la carte
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
              <p>{selectedMarker.type === 'medical' ? 'Service Médical' : 'Service Administratif'}</p>
              {user && user.medecin && clickedLocation && (
                <div>
                  <p>Localisation : {clickedLocation.latitude}, {clickedLocation.longitude}</p>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <button
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
        onClick={handleCreateReservation}
      >
        Créer une réservation
      </button>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null, event?: React.SyntheticEvent<any>) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="mt-2"
        placeholderText="Choisissez une date"
      />
    </div>
  );
};

export default MapView;
