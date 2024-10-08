import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, UserPlus, User, Mail, Lock, MapPin } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Register: React.FC = () => {
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
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Utilise `formData` directement
      });

      const data = await response.json();

      if (response.ok) {
        // Simule la connexion après enregistrement réussi
        login(data.user);
        navigate('/profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error, please try again later');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
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
            First Name
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
            Age
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
            Password
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
            Telephone
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
          <Phone className="absolute left-3 top-2 text-gray-500" />  {/* Ajout de l'icône ici */}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="adresse" className="block text-gray-700 text-sm font-bold mb-2">
            Address
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
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <UserPlus className="mr-2" />
            Register
          </button>
          <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
