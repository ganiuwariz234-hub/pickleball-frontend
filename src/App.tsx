import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store'
import { restoreAuthState } from './store/slices/authSlice'

// Components
import React from "react";
import "./Hero.css";
.hero {
  position: relative;
  width: 100%;
  min-height: 90vh;
  background-image: url("/images/pickleball-hero.jpg"); /* replace with your image */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* dark overlay */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 2rem;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background-color: #e55555;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #fff;
  color: #000;
}


const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Discover the World of Pickleball</h1>
        <p className="hero-subtitle">
          The fastest growing sport that brings people together. Play, connect,
          and enjoy the game like never before!
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Join Now</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import routes from './routes'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on app load
    if (token && !isAuthenticated) {
      dispatch(restoreAuthState())
    }
  }, [dispatch, token, isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 mt-[60px]">
        <Routes>
          {routes.map(route => {
            // Always render public routes
            if (route.public) {
              return <Route key={route.key} path={route.path} element={route.element} />
            }
            // Only render private routes if authenticated
            if (isAuthenticated) {
              return <Route key={route.key} path={route.path} element={route.element} />
            }
            // Don't render anything for private routes when not authenticated
            return null
          })}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
