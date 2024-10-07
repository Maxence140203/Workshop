import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Map from './pages/Map'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuthStore } from './stores/authStore'

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App