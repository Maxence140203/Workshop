import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';  // Importation de la bibliothèque de datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Importation du style pour le datepicker
import { Geocoder } from '@react-google-maps/api';
//comment bypass les demandes de permissions de localisation (sans certificat ssl)



const GOOGLE_MAPS_API_KEY = 'AIzaSyCQLhFSq03QDVmUeyIVpTSV2KB93LJgioc';

type Service = {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
};

const mapContainerStyle = {
  width: '100%',
  height: '600px', // Augmentation de la hauteur de la carte
};

const center = {
  lat: 46.603354,
  lng: 1.888334,
};

const MapView: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<any>(null);  // Stockage des données utilisateur
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  // Gestion de la date
  const [clickedLocation, setClickedLocation] = useState<{ latitude: number, longitude: number } | null>(null); // Récupération des clics sur la carte
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({ nom: ''}); // Stockage des données du formulaire});

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
          setServices(data.services.map(service => ({
            ...service,
            date: new Date(service.date).toLocaleDateString(), // Convertir la date pour l'affichage
          })));} else {
          console.error('Erreur lors de la récupération des services:', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la requête des services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleMarkerClick = async (service: Service) => {
    try {
      const address = await reverseGeocode(service.latitude, service.longitude);
      setSelectedMarker({ ...service, address }); // Store the address in the marker state
    } catch (error) {
      console.error('Error fetching address:', error);
    }
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

  const reverseGeocode = (lat: number, lng: number): Promise<string> => {
    const geocoder = new window.google.maps.Geocoder();
  
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          // Loop through the results to find a valid formatted address (excluding Plus Codes)
          for (const result of results) {
            if (!result.plus_code) { // Exclude Plus Codes
              resolve(result.formatted_address); // Return the standard formatted address
              return;
            }
          }
          resolve(results[0].formatted_address); // Fallback to the first result if no others found
        } else {
          reject('Unable to retrieve address');
        }
      });
    });
  };
  
  

  // Fonction pour créer une réservation si l'utilisateur est médecin
  const handleCreateReservation = async () => {
    if (user && user.medecin && selectedDate) {
      if (!clickedLocation) {
        alert('Veuillez sélectionner une localisation sur la carte avant de créer une réservation.');
        return;
      }

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
            id_user: user.id,
            latitude: clickedLocation.latitude,
            longitude: clickedLocation.longitude,
            date: selectedDate.toISOString().split('T')[0],  // Formatage de la date,
            nom: formData.nom,
          }),
        });

        const data = await response.json();
        console.log('Données renvoyées par le serveur:', data);

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
      console.log('clickedLocation:', clickedLocation);
      console.log('user:', user);
      console.log('selectedDate:', selectedDate);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Carte des Services</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={12}
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
                <p>Adresse : {selectedMarker.address || 'Adresse indisponible'}</p> {/* Display the address */}
                <p>Date : {selectedMarker.date}</p>
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
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="mt-2"
            required
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
