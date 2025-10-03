import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store'
import { restoreAuthState } from './store/slices/authSlice' 

// Components
import React from "react";
import "./Hero.css";

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
