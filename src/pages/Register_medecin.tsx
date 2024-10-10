import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, UserPlus, User, Mail, Lock, MapPin, Stethoscope } from 'lucide-react'; // Ajout de l'icône pour médecin
import { useAuthStore } from '../stores/authStore';

const RegisterMedecin: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    medecin: true, // Champ supplémentaire pour identifier l'utilisateur en tant que médecin
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/register_medecin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid JSON response');
      }

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        navigate('/profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Server error, please try again later');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Créer un compte Médecin</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
            Nom complet
          </label>
          <div className="relative">
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
            <User className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="prenom" className="block text-gray-700 text-sm font-bold mb-2">
            Prénom
          </label>
          <div className="relative">
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">
            Âge
          </label>
          <div className="relative">
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
            <Mail className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
            <Lock className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">
            Téléphone
          </label>
          <div className="relative">
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
            <Phone className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="adresse" className="block text-gray-700 text-sm font-bold mb-2">
            Vehicule
          </label>
          <div className="relative">
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
              required
            />
            <MapPin className="absolute left-3 top-2 text-gray-500" />
          </div>
        </div>

        {/* Identification du médecin */}
        <div className="mb-4">
          <label htmlFor="medecin" className="block text-gray-700 text-sm font-bold mb-2">
            Êtes-vous médecin ?
          </label>
          <div className="relative">
            <input
              type="checkbox"
              id="medecin"
              name="medecin"
              checked={formData.medecin}
              onChange={(e) => setFormData({ ...formData, medecin: e.target.checked })}
              className="mr-2"
              disabled
            />
            <Stethoscope className="text-gray-500 inline-block" />
            <span className="ml-2">Oui, je suis médecin</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <UserPlus className="mr-2" />
            S'inscrire
          </button>
          <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
            Vous avez déjà un compte ?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterMedecin;
