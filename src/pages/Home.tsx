import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bell } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur MediTrack</h1>
      <p className="text-xl mb-8">Gérez et accédez aux services médicaux mobiles en temps réel</p>
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
