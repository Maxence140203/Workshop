import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bell, Calendar } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to MediTrack</h1>
      <p className="text-xl mb-8">Track and access mobile medical services in real-time</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<MapPin size={48} />}
          title="Locate Services"
          description="Find nearby medical and administrative services"
          link="/map"
        />
        <FeatureCard
          icon={<Bell size={48} />}
          title="Get Notified"
          description="Receive alerts when services are in your area"
          link="/profile"
        />
        <FeatureCard
          icon={<Calendar size={48} />}
          title="Book Appointments"
          description="Reserve slots for medical services"
          link="/map"
        />
      </div>
    </div>
  )
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}

export default Home