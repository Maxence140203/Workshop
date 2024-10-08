import React from 'react'
import { Link } from 'react-router-dom'
import { Ambulance, User, LogIn, Truck } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const logout = useAuthStore(state => state.logout)

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Ambulance className="mr-2" />
          MediTrack
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/map" className="hover:text-blue-200">Carte</Link></li>
            {isAuthenticated && (
              <li>
                <Link to="/case-selection" className="hover:text-blue-200 flex items-center">
                  <Truck className="mr-1" size={20} />
                  Gestion des cas
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" className="hover:text-blue-200"><User /></Link></li>
                <li>
                  <button onClick={logout} className="hover:text-blue-200">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" className="hover:text-blue-200"><LogIn /></Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header