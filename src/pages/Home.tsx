import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { MapPin, Bell } from 'lucide-react';

const Home: React.FC = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [necessaryCookies, setNecessaryCookies] = useState(true); // Necessary cookies are always enabled
  const [optionalCookies, setOptionalCookies] = useState(false); // User can opt into optional cookies

  // Check if cookie consent has been given
  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }
  }, []);

  // Handle cookie consent approval
  const handleAcceptCookies = () => {
    // Necessary cookies are always accepted
    Cookies.set('cookieConsent', 'true', { expires: 365 });

    if (optionalCookies) {
      // Set optional cookies only if user has accepted them
      Cookies.set('optionalCookies', 'true', { expires: 365 });
    } else {
      Cookies.remove('optionalCookies'); // Ensure optional cookies are removed if not accepted
    }

    setShowCookieConsent(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Medic Mobile</h1>
      <p className="text-xl mb-8">Gérez et accédez aux services médicaux mobiles en temps réel</p>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col justify-between items-center">
          <p className="mb-4">Nous utilisons des cookies pour améliorer votre expérience.</p>
          <div className="flex flex-col space-y-2 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={necessaryCookies}
                onChange={() => setNecessaryCookies(true)}
                disabled
              />
              <span>Cookies nécessaires (Toujours activés)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={optionalCookies}
                onChange={() => setOptionalCookies(!optionalCookies)}
              />
              <span>Cookies facultatifs</span>
            </label>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            onClick={handleAcceptCookies}
          >
            Accepter les cookies sélectionnés
          </button>
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<MapPin size={48} />}
            title="Localiser les services"
            description="Trouvez les services médicaux et administratifs à proximité"
            link="/map"
          />
          <FeatureCard
            icon={<Bell size={48} />}
            title="Notifications"
            description="Recevez des alertes lorsque des services sont dans votre zone"
            link="/profile"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default Home;
