import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ambulance, User, LogIn, Truck, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  const [session, setSession] = useState<{ loggedIn: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setSession(token ? { loggedIn: true } : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Ambulance className="mr-2" />
          Medic Mobile
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/map" className="hover:text-black flex items-center">
                <MapPin size={20} className="mr-2" />
                <span>Carte</span>
              </Link>
            </li>

            {session ? (
              <>
                <li><Link to="/profile" className="hover:text-black"><User /></Link></li>
                <li>
                  <button onClick={handleLogout} className="hover:text-black">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" className="hover:text-black"><LogIn /></Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
