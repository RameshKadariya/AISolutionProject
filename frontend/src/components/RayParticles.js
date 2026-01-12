import React, { useEffect, useState } from 'react';

const RayParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticle = () => {
      const navbar = document.querySelector('.floating-navbar');
      if (!navbar) return;

      const rect = navbar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const particle = {
        id: Math.random(),
        x: centerX + (Math.random() - 0.5) * rect.width,
        y: centerY,
        color: ['#ff9900', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 6)],
        angle: Math.random() * 360,
        speed: 2 + Math.random() * 3,
        life: 100
      };

      setParticles(prev => [...prev.slice(-20), particle]); // Keep max 20 particles
    };

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle * Math.PI / 180) * particle.speed,
          y: particle.y + Math.sin(particle.angle * Math.PI / 180) * particle.speed,
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
      );
    };

    const animationFrame = setInterval(updateParticles, 50);
    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="navbar-rays-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="ray-particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life / 100,
            transform: `scale(${particle.life / 100})`,
            boxShadow: `0 0 6px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
};

export default RayParticles;