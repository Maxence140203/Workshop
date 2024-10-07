import React from 'react'
import { Link } from 'react-router-dom'
import { Ambulance, User, LogIn } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Ambulance className="mr-2" />
          MediTrack
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/map" className="hover:text-blue-200">Map</Link></li>
            <li><Link to="/profile" className="hover:text-blue-200"><User /></Link></li>
            <li><Link to="/login" className="hover:text-blue-200"><LogIn /></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header