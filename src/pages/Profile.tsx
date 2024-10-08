import React, { useEffect, useState } from 'react'
import { User, Bell, MapPin, Calendar } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const Profile: React.FC = () => {
  const userFromStore = useAuthStore(state => state.user)
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([]) // Ajout d'un état pour les réservations
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/profile?email=${user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('User:', user); // Log la réponse
      console.log('Content-Type:', response.headers.get('content-type')); // Vérifier le type de contenu
      console.log('Status:', response.status); // Vérifier le code de statut
  
      // Vérifie si la réponse est de type JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La réponse n\'est pas un JSON valide');
      }
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
  
      const data = await response.json(); // Parse la réponse si elle est bien au format JSON
      if (data.success) {
        setUser(data.user);
        setReservations(data.user.reservations);
      } else {
        setError(data.message || 'User not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }    

  useEffect(() => {
    if (userFromStore?.email) {
      fetchUserProfile(userFromStore.email);
    } else {
      setLoading(false);
      setError('Please log in to view your profile.');
    }
  }, [userFromStore])  

  const handleNotificationChange = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <User size={64} className="text-blue-600 mr-4" />
          <div>
            <h2 className="text-2xl font-semibold">{user.nom || 'No Name'}</h2>
            <p className="text-gray-600">{user.email || 'No Email'}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p className="flex items-center">
            <MapPin className="mr-2 text-blue-600" />
            {user.adresse || 'No Address'}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
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
        <h3 className="text-lg font-semibold mb-4">Your Reservations</h3>
        {reservations.length > 0 ? (
          <ul className="space-y-4">
            {reservations.map(reservation => (
              <li key={reservation.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-blue-600" />
                  <span>{reservation.serviceName}</span>
                </div>
                <div className="text-gray-600">
                  {reservation.date} at {reservation.time}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no upcoming reservations.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
