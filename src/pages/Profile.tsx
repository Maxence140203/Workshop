import React, { useState } from 'react'
import { User, Bell, MapPin, Calendar } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

// Mock reservations data (in a real app, this would come from an API)
const mockReservations = [
  { id: 1, serviceName: 'Mobile Clinic', date: '2023-05-15', time: '10:00' },
  { id: 2, serviceName: 'Admin Vehicle', date: '2023-05-20', time: '14:00' },
]

const Profile: React.FC = () => {
  const user = useAuthStore(state => state.user)
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const handleNotificationChange = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
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
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p className="flex items-center">
            <MapPin className="mr-2 text-blue-600" />
            {user.address}
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
        {mockReservations.length > 0 ? (
          <ul className="space-y-4">
            {mockReservations.map(reservation => (
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