import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, MapPin, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError("Aucun token d'authentification trouvé. Veuillez vous connecter.");
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du profil utilisateur : ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setReservations(data.user.reservations);
      } else {
        setError(data.message || 'Utilisateur non trouvé');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleNotificationChange = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Veuillez vous connecter pour voir votre profil.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profil Utilisateur</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <User size={64} className="text-blue-600 mr-4" />
          <div>
            <h2 className="text-2xl font-semibold">{user.nom || 'Nom non disponible'}</h2>
            <p className="text-gray-600">{user.email || 'Email non disponible'}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Adresse</h3>
          <p className="flex items-center">
            <MapPin className="mr-2 text-blue-600" />
            {user.adresse || 'Adresse non disponible'}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Préférences de Notification</h3>
        <div className="space-y-4">
          {Object.entries(notificationPreferences).map(([type, enabled]) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={type}
                checked={enabled}
                onChange={() => handleNotificationChange(type as keyof typeof notificationPreferences)}
                className="mr-2"
              />
              <label htmlFor={type} className="flex items-center">
                <Bell className="mr-2 text-blue-600" />
                {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Vos Notifications</h3>
        {reservations.length > 0 ? (
          <ul className="space-y-4">
            {reservations.map(reservation => (
              <li key={reservation.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-blue-600" />
                  <span>{reservation.serviceName}</span>
                </div>
                <div className="text-gray-600">
                  {reservation.date} à {reservation.time}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n'avez aucune notifications à venir.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
